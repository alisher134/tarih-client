"use client";

import { useQueryClient } from "@tanstack/react-query";

import {
  invalidateCourseQueries,
  adminCourseDetailQueryKey,
} from "@/entities/course";

export function useInvalidateAdminCourse(
  courseId: string,
  testId?: string,
  lessonId?: string,
) {
  const queryClient = useQueryClient();

  return () => {
    invalidateCourseQueries(queryClient, { courseId, testId, lessonId });
    queryClient.invalidateQueries({
      queryKey: adminCourseDetailQueryKey(courseId),
    });
  };
}
