"use client";

import { useMutation } from "@tanstack/react-query";

import { getDownloadUrl } from "@/entities/course";

export function useDownloadMaterial() {
  return useMutation({
    mutationKey: ["materials", "download"],
    mutationFn: getDownloadUrl,
  });
}
