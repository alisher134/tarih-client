import { isAxiosError } from "axios";

export type ApiErrorCode =
  | "ACTIVE_SUBSCRIPTION_REQUIRED"
  | "LESSON_NOT_COMPLETED"
  | "TEST_TIME_LIMIT_EXCEEDED"
  | "TEST_ATTEMPTS_LIMIT_REACHED"
  | "INVALID_RESET_TOKEN"
  | "TOKEN_VERSION_MISMATCH";

export type ApiError = {
  statusCode: number;
  message: string;
  code?: ApiErrorCode;
};

export function getApiErrorData(error: unknown): ApiError | null {
  if (!isAxiosError(error)) return null;

  const data = error.response?.data;

  if (typeof data !== "object" || data == null) return null;

  const statusCode = error.response?.status;
  const message = "message" in data ? data.message : undefined;
  const code = "code" in data ? data.code : undefined;

  if (typeof statusCode !== "number" || typeof message !== "string") {
    return null;
  }

  return {
    statusCode,
    message,
    code: typeof code === "string" ? (code as ApiErrorCode) : undefined,
  };
}

export function getApiErrorCode(error: unknown): ApiErrorCode | null {
  return getApiErrorData(error)?.code ?? null;
}

export function isApiErrorCode(
  error: unknown,
  code: ApiErrorCode,
): boolean {
  return getApiErrorCode(error) === code;
}
