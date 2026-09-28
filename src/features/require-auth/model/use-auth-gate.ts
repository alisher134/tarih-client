"use client";

import { getAccessToken, useSession } from "@/entities/session";
import {
  isAuthFailureError,
  isTransientRequestError,
} from "@/shared/lib/is-auth-failure-error";

export function useAuthGate() {
  const { data: user, isLoading, isError, error, refetch } = useSession();
  const hasToken = getAccessToken() != null;
  const isAuthenticated = user != null && hasToken;
  const isSessionError = isError && hasToken;
  const isAuthSessionError =
    isSessionError && error != null && isAuthFailureError(error);
  const isTransientSessionError =
    isSessionError && error != null && isTransientRequestError(error);
  const isUnclassifiedSessionError =
    isSessionError && !isAuthSessionError && !isTransientSessionError;
  const isAdmin = user?.isAdmin === true;

  return {
    isLoading,
    isAuthenticated,
    isAdmin,
    isSessionError,
    isAuthSessionError,
    isTransientSessionError,
    isUnclassifiedSessionError,
    refetch,
  };
}
