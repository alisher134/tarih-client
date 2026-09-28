import { apiClient } from "@/shared/api";

import { parseUserSubscriptions } from "../lib/parse-subscription";
import type { UserSubscription } from "../model/types";

export async function getUserSubscriptions(
  userId: string,
): Promise<UserSubscription[]> {
  const { data } = await apiClient.get(`/admin/users/${userId}/subscriptions`);

  return parseUserSubscriptions(data);
}
