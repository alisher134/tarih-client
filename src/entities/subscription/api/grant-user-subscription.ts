import { apiClient } from "@/shared/api";

import { parseUserSubscription } from "../lib/parse-subscription";
import type { GrantSubscriptionInput, UserSubscription } from "../model/types";

export async function grantUserSubscription(
  userId: string,
  input: GrantSubscriptionInput,
): Promise<UserSubscription> {
  const { data } = await apiClient.post(
    `/admin/users/${userId}/subscriptions`,
    input,
  );

  return parseUserSubscription(data);
}
