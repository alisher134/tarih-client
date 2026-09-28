"use client";

import { useMutation } from "@tanstack/react-query";

import { updateTest, type UpdateTestInput } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useUpdateTest(courseId: string, testId: string) {
  const invalidate = useInvalidateAdminCourse(courseId, testId);

  return useMutation({
    mutationKey: ["admin", "tests", testId, "update"],
    mutationFn: (input: UpdateTestInput) => updateTest(testId, input),
    onSuccess: invalidate,
  });
}
