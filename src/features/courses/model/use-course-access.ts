"use client";

import { useCourseBySlug } from "@/entities/course";

import { useLearningAccess } from "./use-learning-access";

export function useCourseAccess(slug: string) {
  const courseQuery = useCourseBySlug(slug);
  const access = useLearningAccess();

  return {
    course: courseQuery.data,
    canAccess: access.hasAccess,
    isAccessDenied: access.isAccessDenied,
    isAccessLoading: access.isLoading,
    isAccessError: access.isError,
    accessError: access.error,
    isLoading: courseQuery.isLoading || access.isLoading,
    isError: courseQuery.isError,
    error: courseQuery.error,
    refetchCourse: courseQuery.refetch,
    refetchSubscription: access.refetchSubscription,
  };
}
