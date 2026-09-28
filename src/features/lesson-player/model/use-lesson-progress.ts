"use client";

import { useQuery } from "@tanstack/react-query";

import { getLessonProgress, lessonProgressQueryKey } from "@/entities/course";

export function useLessonProgress(lessonId: string, enabled: boolean) {
  return useQuery({
    queryKey: lessonProgressQueryKey(lessonId),
    queryFn: () => getLessonProgress(lessonId),
    enabled: enabled && lessonId.length > 0,
  });
}
