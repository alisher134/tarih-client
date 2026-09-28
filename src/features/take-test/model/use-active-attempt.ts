"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getActiveTestAttempt,
  testActiveAttemptQueryKey,
} from "@/entities/course";

export function useActiveAttempt(testId: string, enabled: boolean) {
  return useQuery({
    queryKey: testActiveAttemptQueryKey(testId),
    queryFn: () => getActiveTestAttempt(testId),
    enabled: enabled && testId.length > 0,
  });
}
