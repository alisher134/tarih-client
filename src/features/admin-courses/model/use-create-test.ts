"use client";

import { useMutation } from "@tanstack/react-query";

import { createTest, type CreateTestInput } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useCreateTest(courseId: string, lessonId: string) {
  const invalidate = useInvalidateAdminCourse(courseId);

  return useMutation({
    mutationKey: ["admin", "lessons", lessonId, "test", "create"],
    mutationFn: (input: CreateTestInput) => createTest(lessonId, input),
    onSuccess: invalidate,
  });
}
