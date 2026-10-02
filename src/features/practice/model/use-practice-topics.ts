"use client";

import { useQuery } from "@tanstack/react-query";
import { getPracticeTopics, practiceTopicsQueryKey } from "@/entities/practice";

export function usePracticeTopics() {
  return useQuery({
    queryKey: practiceTopicsQueryKey(),
    queryFn: getPracticeTopics,
    staleTime: 60 * 1000,
  });
}
