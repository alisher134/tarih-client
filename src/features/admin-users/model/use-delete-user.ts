"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUser, USERS_QUERY_KEY } from "@/entities/user";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "users", "delete"],
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
