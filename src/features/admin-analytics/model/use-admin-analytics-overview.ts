"use client";

import { useQuery } from "@tanstack/react-query";

import {
  adminAnalyticsOverviewQueryKey,
  getAdminAnalyticsOverview,
} from "@/entities/analytics";

export function useAdminAnalyticsOverview() {
  return useQuery({
    queryKey: adminAnalyticsOverviewQueryKey(),
    queryFn: () => getAdminAnalyticsOverview(),
    staleTime: 60 * 1000,
  });
}
