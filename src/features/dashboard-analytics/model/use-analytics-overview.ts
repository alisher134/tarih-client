"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getUserAnalyticsOverview,
  userAnalyticsOverviewQueryKey,
} from "@/entities/analytics";
import { getAccessToken } from "@/entities/session";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: userAnalyticsOverviewQueryKey(),
    queryFn: () => getUserAnalyticsOverview(),
    enabled: getAccessToken() != null,
    staleTime: 60 * 1000,
  });
}
