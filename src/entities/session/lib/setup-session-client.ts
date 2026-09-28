import type { QueryClient } from "@tanstack/react-query";
import { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import { apiClient } from "@/shared/api";
import { getApiErrorCode } from "@/shared/lib/api-error";
import { buildSignInLocationFromBrowser } from "@/shared/lib/build-sign-in-location";

import { refreshSession } from "../api/refresh-session";
import { resetSession } from "./apply-session";
import { getAccessToken, getRefreshToken } from "./token-storage";

const PUBLIC_AUTH_PATHS = [
  "/auth/refresh",
  "/auth/sign-in",
  "/auth/sign-up",
] as const;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshRequest: Promise<string> | null = null;
let isSessionClientReady = false;

export function setupSessionClient(queryClient: QueryClient) {
  if (isSessionClientReady) {
    return;
  }

  isSessionClientReady = true;

  apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!isAxiosError(error) || error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (getApiErrorCode(error) === "TOKEN_VERSION_MISMATCH") {
        resetSession(queryClient);
        redirectToSignIn();
        return Promise.reject(error);
      }

      const originalRequest = error.config as
        RetryableRequestConfig | undefined;

      if (!originalRequest || isPublicAuthRequest(originalRequest)) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        resetSession(queryClient);
        redirectToSignIn();
        return Promise.reject(error);
      }

      if (getRefreshToken() == null) {
        resetSession(queryClient);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken(queryClient);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        resetSession(queryClient);
        redirectToSignIn();
        return Promise.reject(refreshError);
      }
    },
  );
}

function redirectToSignIn() {
  if (typeof window === "undefined") return;

  const signInPath = "/sign-in";
  if (window.location.pathname.endsWith(signInPath)) return;

  window.location.assign(buildSignInLocationFromBrowser());
}

function isPublicAuthRequest(config: InternalAxiosRequestConfig) {
  const url = config.url ?? "";
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

function refreshAccessToken(queryClient: QueryClient) {
  if (!refreshRequest) {
    refreshRequest = refreshSession()
      .catch((refreshError: unknown) => {
        resetSession(queryClient);
        throw refreshError;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}
