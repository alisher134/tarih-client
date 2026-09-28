"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/entities/session";

import { getCourseLearningSummary } from "../api/get-course-learning-summary";
import { courseLearningSummaryQueryKey } from "./learning-query";

export function useCourseLearningSummary(
  courseId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: courseLearningSummaryQueryKey(courseId ?? ""),
    queryFn: () => getCourseLearningSummary(courseId!),
    enabled: enabled && courseId != null && getAccessToken() != null,
    staleTime: 60 * 1000,
  });
}
