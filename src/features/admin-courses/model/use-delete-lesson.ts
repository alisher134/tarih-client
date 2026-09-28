"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteLesson } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useDeleteLesson(courseId: string) {
  const invalidate = useInvalidateAdminCourse(courseId);

  return useMutation({
    mutationKey: ["admin", "courses", courseId, "lessons", "delete"],
    mutationFn: deleteLesson,
    onSuccess: invalidate,
  });
}
