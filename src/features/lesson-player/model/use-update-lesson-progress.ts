"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  lessonProgressQueryKey,
  updateLessonProgress,
  type UpdateLessonProgressInput,
} from "@/entities/course";

import {
  flushLearningProgressInvalidation,
  scheduleLearningProgressInvalidation,
} from "@/entities/learning";

export function useUpdateLessonProgress(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["lessons", lessonId, "progress", "update"],
    mutationFn: (input: UpdateLessonProgressInput) =>
      updateLessonProgress(lessonId, input),
    onSuccess: (progress) => {
      queryClient.setQueryData(lessonProgressQueryKey(lessonId), progress);

      if (progress.completed) {
        flushLearningProgressInvalidation(queryClient);
        return;
      }

      scheduleLearningProgressInvalidation(queryClient);
    },
  });
}
