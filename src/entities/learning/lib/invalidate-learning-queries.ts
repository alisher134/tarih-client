import type { QueryClient } from "@tanstack/react-query";

import { USER_ANALYTICS_OVERVIEW_QUERY_KEY } from "@/entities/analytics";
import { MY_ENROLLMENTS_QUERY_KEY } from "@/entities/course";

import {
  CONTINUE_LEARNING_QUERY_KEY,
  COURSE_LEARNING_SUMMARY_QUERY_KEY,
} from "../model/learning-query";

const DEBOUNCE_MS = 2000;

let debounceTimer: number | undefined;

export function invalidateLearningProgressQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({
    queryKey: MY_ENROLLMENTS_QUERY_KEY,
  });
  void queryClient.invalidateQueries({
    queryKey: CONTINUE_LEARNING_QUERY_KEY,
  });
  void queryClient.invalidateQueries({
    queryKey: COURSE_LEARNING_SUMMARY_QUERY_KEY,
  });
  void queryClient.invalidateQueries({
    queryKey: USER_ANALYTICS_OVERVIEW_QUERY_KEY,
  });
}

export function scheduleLearningProgressInvalidation(queryClient: QueryClient) {
  if (typeof window === "undefined") {
    invalidateLearningProgressQueries(queryClient);
    return;
  }

  if (debounceTimer != null) {
    window.clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(() => {
    debounceTimer = undefined;
    invalidateLearningProgressQueries(queryClient);
  }, DEBOUNCE_MS);
}

export function flushLearningProgressInvalidation(queryClient: QueryClient) {
  if (debounceTimer != null) {
    window.clearTimeout(debounceTimer);
    debounceTimer = undefined;
  }

  invalidateLearningProgressQueries(queryClient);
}
