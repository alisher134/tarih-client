"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  SESSION_QUERY_KEY,
  setSessionUser,
  type SessionUser,
} from "@/entities/session";
import {
  updateUser,
  USERS_QUERY_KEY,
  userDetailQueryKey,
  type UpdateUserInput,
} from "@/entities/user";

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "users", "update", id],
    mutationFn: (input: UpdateUserInput) => updateUser(id, input),
    onSuccess: (user) => {
      queryClient.setQueryData(userDetailQueryKey(user.id), user);
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

      const sessionUser =
        queryClient.getQueryData<SessionUser>(SESSION_QUERY_KEY);

      if (sessionUser?.id !== user.id) return;

      setSessionUser(queryClient, {
        ...sessionUser,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      });
    },
  });
}
