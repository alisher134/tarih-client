"use client";

import { useMutation } from "@tanstack/react-query";

import { createMaterial, type CreateMaterialInput } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useCreateMaterial(courseId: string, lessonId: string) {
  const invalidate = useInvalidateAdminCourse(courseId, undefined, lessonId);

  return useMutation({
    mutationKey: ["admin", "lessons", lessonId, "materials", "create"],
    mutationFn: (input: CreateMaterialInput) => createMaterial(lessonId, input),
    onSuccess: invalidate,
  });
}
