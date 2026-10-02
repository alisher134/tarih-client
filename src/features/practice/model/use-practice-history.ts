"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPracticeHistory,
  practiceHistoryQueryKey,
} from "@/entities/practice";

export function usePracticeHistory() {
  return useQuery({
    queryKey: practiceHistoryQueryKey(),
    queryFn: getPracticeHistory,
  });
}
