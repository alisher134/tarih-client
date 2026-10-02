"use client";

import { useMutation } from "@tanstack/react-query";
import {
  startPracticeSession,
  type StartPracticeSessionPayload,
} from "@/entities/practice";

export function useStartPractice() {
  return useMutation({
    mutationFn: (payload: StartPracticeSessionPayload) =>
      startPracticeSession(payload),
  });
}
