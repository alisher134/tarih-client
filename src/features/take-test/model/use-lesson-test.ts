"use client";

import { useQuery } from "@tanstack/react-query";

import { getLessonTest, lessonTestQueryKey } from "@/entities/course";

export function useLessonTest(lessonId: string, enabled = true) {
  return useQuery({
    queryKey: lessonTestQueryKey(lessonId),
    queryFn: () => getLessonTest(lessonId),
    enabled: enabled && lessonId.length > 0,
  });
}
