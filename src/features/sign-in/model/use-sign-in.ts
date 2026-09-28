"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { applySession } from "@/entities/session";

import { signIn } from "../api/sign-in";

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: signIn,
    onSuccess: (session) => {
      applySession(queryClient, session);
    },
  });
}
