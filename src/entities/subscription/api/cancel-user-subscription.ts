import { apiClient } from "@/shared/api";

export async function cancelUserSubscription(
  userId: string,
  subscriptionId: string,
): Promise<void> {
  await apiClient.delete(
    `/admin/users/${userId}/subscriptions/${subscriptionId}`,
  );
}
