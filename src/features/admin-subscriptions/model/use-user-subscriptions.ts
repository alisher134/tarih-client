"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getUserSubscriptions,
  userSubscriptionsQueryKey,
} from "@/entities/subscription";

export function useUserSubscriptions(userId: string) {
  return useQuery({
    queryKey: userSubscriptionsQueryKey(userId),
    queryFn: () => getUserSubscriptions(userId),
    enabled: userId.length > 0,
  });
}
