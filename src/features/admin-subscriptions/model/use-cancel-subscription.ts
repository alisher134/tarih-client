"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  cancelUserSubscription,
  MY_SUBSCRIPTION_QUERY_KEY,
  userSubscriptionsQueryKey,
} from "@/entities/subscription";

export function useCancelSubscription(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "users", "subscriptions", "cancel", userId],
    mutationFn: (subscriptionId: string) =>
      cancelUserSubscription(userId, subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userSubscriptionsQueryKey(userId),
      });
      queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
    },
  });
}
