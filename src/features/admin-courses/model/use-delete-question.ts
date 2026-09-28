"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteQuestion } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useDeleteQuestion(courseId: string, testId?: string) {
  const invalidate = useInvalidateAdminCourse(courseId, testId);

  return useMutation({
    mutationKey: ["admin", "courses", courseId, "questions", "delete"],
    mutationFn: deleteQuestion,
    onSuccess: invalidate,
  });
}
