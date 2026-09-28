"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteCourse,
  invalidateCourseQueries,
} from "@/entities/course";

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "courses", "delete"],
    mutationFn: deleteCourse,
    onSuccess: () => {
      invalidateCourseQueries(queryClient);
    },
  });
}
