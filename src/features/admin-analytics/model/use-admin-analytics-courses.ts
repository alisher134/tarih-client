"use client";

import { useQuery } from "@tanstack/react-query";

import {
  adminAnalyticsCoursesQueryKey,
  getAdminAnalyticsCourses,
} from "@/entities/analytics";

export function useAdminAnalyticsCourses() {
  return useQuery({
    queryKey: adminAnalyticsCoursesQueryKey({ page: 1, limit: 10 }),
    queryFn: () => getAdminAnalyticsCourses({ page: 1, limit: 10 }),
    staleTime: 60 * 1000,
  });
}
