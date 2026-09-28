"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  grantUserSubscription,
  MY_SUBSCRIPTION_QUERY_KEY,
  type GrantSubscriptionInput,
  userSubscriptionsQueryKey,
} from "@/entities/subscription";

export function useGrantSubscription(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "users", "subscriptions", "grant", userId],
    mutationFn: (input: GrantSubscriptionInput) =>
      grantUserSubscription(userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userSubscriptionsQueryKey(userId),
      });
      queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
    },
  });
}
