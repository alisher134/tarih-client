"use client";

import { useQuery } from "@tanstack/react-query";

import { FAVORITES_QUERY_KEY, getFavorites } from "@/entities/course";

export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
  });
}
