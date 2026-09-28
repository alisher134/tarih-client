import { getErrorMessage } from "@/shared/api/get-error-message";

import type { ApiErrorCode } from "./api-error";
import { getApiErrorCode } from "./api-error";

export function getLocalizedApiErrorMessage(
  error: unknown,
  translateCode: (code: ApiErrorCode) => string,
  fallback: string,
): string {
  const code = getApiErrorCode(error);

  if (code != null) {
    return translateCode(code);
  }

  return getErrorMessage(error, fallback);
}
