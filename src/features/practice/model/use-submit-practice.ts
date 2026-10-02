"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  practiceHistoryQueryKey,
  submitPracticeSession,
  unifiedHistoryQueryKey,
  type SubmitPracticeSessionPayload,
} from "@/entities/practice";

export function useSubmitPractice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitPracticeSessionPayload) =>
      submitPracticeSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceHistoryQueryKey() });
      queryClient.invalidateQueries({ queryKey: unifiedHistoryQueryKey() });
    },
  });
}
