"use client";

import { useMutation } from "@tanstack/react-query";

import { startTestAttempt } from "@/entities/course";

export function useStartAttempt(testId: string) {
  return useMutation({
    mutationKey: ["tests", testId, "start-attempt"],
    mutationFn: () => startTestAttempt(testId),
  });
}
