"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser, USERS_QUERY_KEY } from "@/entities/user";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "users", "create"],
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
