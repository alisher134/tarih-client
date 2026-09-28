"use client";

import { useMutation } from "@tanstack/react-query";

import { generateCopy } from "@/shared/api";

export function useGenerateCopy() {
  return useMutation({
    mutationKey: ["generate-copy"],
    mutationFn: generateCopy,
  });
}
