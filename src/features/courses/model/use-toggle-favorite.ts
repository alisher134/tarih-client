"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addFavorite,
  FAVORITES_QUERY_KEY,
  removeFavorite,
} from "@/entities/course";

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["courses", "favorite"],
    mutationFn: ({
      courseId,
      isFavorite,
    }: {
      courseId: string;
      isFavorite: boolean;
    }) => (isFavorite ? removeFavorite(courseId) : addFavorite(courseId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}
