"use client";

import { useQuery } from "@tanstack/react-query";

import {
  adminAnalyticsSubscriptionsQueryKey,
  getAdminAnalyticsSubscriptions,
} from "@/entities/analytics";

export function useAdminAnalyticsSubscriptions() {
  return useQuery({
    queryKey: adminAnalyticsSubscriptionsQueryKey(),
    queryFn: () => getAdminAnalyticsSubscriptions(),
    staleTime: 60 * 1000,
  });
}
