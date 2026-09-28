import { apiClient } from "@/shared/api";

import { parseMySubscription } from "../lib/parse-subscription";
import type { MySubscription } from "../model/types";

export async function getMySubscription(): Promise<MySubscription> {
  const { data } = await apiClient.get("/subscriptions/me");

  return parseMySubscription(data);
}
