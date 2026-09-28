import { isAxiosError } from "axios";

import { isApiErrorCode } from "./api-error";

const SUBSCRIPTION_REQUIRED_MESSAGE = "Active subscription required";

function messageRequiresSubscription(message: string) {
  return message.includes(SUBSCRIPTION_REQUIRED_MESSAGE);
}

export function isSubscriptionRequiredError(error: unknown): boolean {
  if (isApiErrorCode(error, "ACTIVE_SUBSCRIPTION_REQUIRED")) {
    return true;
  }

  if (!isAxiosError(error)) return false;
  if (error.response?.status !== 403) return false;

  const data = error.response.data;

  if (typeof data === "object" && data !== null && "message" in data) {
    const message = data.message;

    if (typeof message === "string") {
      return messageRequiresSubscription(message);
    }

    if (Array.isArray(message) && typeof message[0] === "string") {
      return messageRequiresSubscription(message[0]);
    }
  }

  return false;
}
