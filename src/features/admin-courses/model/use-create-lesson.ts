"use client";

import { useMutation } from "@tanstack/react-query";

import { createLesson, type CreateLessonInput } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useCreateLesson(courseId: string) {
  const invalidate = useInvalidateAdminCourse(courseId);

  return useMutation({
    mutationKey: ["admin", "courses", courseId, "lessons", "create"],
    mutationFn: (input: CreateLessonInput) => createLesson(courseId, input),
    onSuccess: invalidate,
  });
}
