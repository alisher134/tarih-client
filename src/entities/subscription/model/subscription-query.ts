export const SUBSCRIPTION_PLANS_QUERY_KEY = ["subscription-plans"] as const;

export const MY_SUBSCRIPTION_QUERY_KEY = ["subscriptions", "me"] as const;

export const USER_SUBSCRIPTIONS_QUERY_KEY = [
  "admin",
  "users",
  "subscriptions",
] as const;

export function userSubscriptionsQueryKey(userId: string) {
  return [...USER_SUBSCRIPTIONS_QUERY_KEY, userId] as const;
}
