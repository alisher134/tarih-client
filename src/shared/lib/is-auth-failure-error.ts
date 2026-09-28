import { isAxiosError } from "axios";

import { getApiErrorCode } from "./api-error";

export function isTransientRequestError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;

  if (error.response == null) return true;

  const status = error.response.status;

  return status >= 500 || status === 408 || status === 429;
}

export function isAuthFailureError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;

  if (getApiErrorCode(error) === "TOKEN_VERSION_MISMATCH") return true;

  if (error.response == null) return false;

  return error.response.status === 401;
}
