"use client";

import { useMutation } from "@tanstack/react-query";

import { updateLesson, type UpdateLessonInput } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useUpdateLesson(courseId: string, lessonId: string) {
  const invalidate = useInvalidateAdminCourse(courseId);

  return useMutation({
    mutationKey: ["admin", "lessons", lessonId, "update"],
    mutationFn: (input: UpdateLessonInput) => updateLesson(lessonId, input),
    onSuccess: invalidate,
  });
}
