"use client";

import { useQuery } from "@tanstack/react-query";

import { getLessonMaterials, lessonMaterialsQueryKey } from "@/entities/course";

type UseLessonMaterialsOptions = {
  enabled?: boolean;
};

export function useLessonMaterials(
  lessonId: string,
  { enabled = true }: UseLessonMaterialsOptions = {},
) {
  return useQuery({
    queryKey: lessonMaterialsQueryKey(lessonId),
    queryFn: () => getLessonMaterials(lessonId),
    enabled: enabled && lessonId.length > 0,
  });
}
