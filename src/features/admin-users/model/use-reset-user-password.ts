"use client";

import { useMutation } from "@tanstack/react-query";

import { updateUserPassword } from "@/entities/user";

export function useResetUserPassword(id: string) {
  return useMutation({
    mutationKey: ["admin", "users", "password", id],
    mutationFn: (newPassword: string) => updateUserPassword(id, newPassword),
  });
}
