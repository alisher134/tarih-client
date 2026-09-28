"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { submitTestAttempt, type TestAnswerInput } from "@/entities/course";

import { flushLearningProgressInvalidation } from "@/entities/learning";

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["tests", "attempt", "submit"],
    mutationFn: ({
      attemptId,
      answers,
    }: {
      attemptId: string;
      answers: TestAnswerInput[];
    }) => submitTestAttempt(attemptId, answers),
    onSuccess: () => {
      flushLearningProgressInvalidation(queryClient);
    },
  });
}
