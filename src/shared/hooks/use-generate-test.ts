"use client";

import { useMutation } from "@tanstack/react-query";

import { generateTest } from "@/shared/api";

export function useGenerateTest() {
  return useMutation({
    mutationKey: ["generate-test"],
    mutationFn: generateTest,
  });
}
