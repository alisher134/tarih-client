"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSubscriptionPlans,
  SUBSCRIPTION_PLANS_QUERY_KEY,
} from "@/entities/subscription";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEY,
    queryFn: getSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
}
