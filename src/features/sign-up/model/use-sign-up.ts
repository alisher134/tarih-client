"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { applySession } from "@/entities/session";

import { signUp } from "../api/sign-up";

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: signUp,
    onSuccess: (session) => {
      applySession(queryClient, session);
    },
  });
}
