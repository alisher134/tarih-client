"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCourse, invalidateCourseQueries } from "@/entities/course";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "courses", "create"],
    mutationFn: createCourse,
    onSuccess: () => {
      invalidateCourseQueries(queryClient);
    },
  });
}
