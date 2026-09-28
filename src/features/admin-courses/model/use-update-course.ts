"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  invalidateCourseQueries,
  updateCourse,
  type UpdateCourseInput,
} from "@/entities/course";

export function useUpdateCourse(courseId: string, slug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "courses", courseId, "update"],
    mutationFn: (input: UpdateCourseInput) => updateCourse(courseId, input),
    onSuccess: () => {
      invalidateCourseQueries(queryClient, { courseId, slug });
    },
  });
}
