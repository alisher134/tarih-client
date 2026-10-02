"use client";

import { useMutation } from "@tanstack/react-query";

import { generatePlan } from "@/shared/api";

export function useGeneratePlan() {
  return useMutation({
    mutationKey: ["generate-plan"],
    mutationFn: generatePlan,
  });
}
