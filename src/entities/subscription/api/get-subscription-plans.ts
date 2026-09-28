import { apiClient } from "@/shared/api";

import { parseSubscriptionPlans } from "../lib/parse-subscription";
import type { SubscriptionPlan } from "../model/types";

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data } = await apiClient.get("/subscription-plans");

  return parseSubscriptionPlans(data);
}
