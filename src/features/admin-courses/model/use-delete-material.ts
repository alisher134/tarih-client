"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteMaterial } from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

export function useDeleteMaterial(courseId: string) {
  const invalidate = useInvalidateAdminCourse(courseId);

  return useMutation({
    mutationKey: ["admin", "courses", courseId, "materials", "delete"],
    mutationFn: deleteMaterial,
    onSuccess: invalidate,
  });
}
