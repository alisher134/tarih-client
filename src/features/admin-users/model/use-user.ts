"use client";

import { useQuery } from "@tanstack/react-query";

import { getUser, userDetailQueryKey } from "@/entities/user";

export function useUser(id: string) {
  return useQuery({
    queryKey: userDetailQueryKey(id),
    queryFn: () => getUser(id),
  });
}
