"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteTest } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useDeleteTest(courseId: string, testId: string) {
  const invalidate = useInvalidateAdminCourse(courseId, testId);

  return useMutation({
    mutationKey: ["admin", "courses", courseId, "tests", "delete"],
    mutationFn: deleteTest,
    onSuccess: invalidate,
  });
}
