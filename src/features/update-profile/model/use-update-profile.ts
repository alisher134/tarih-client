"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setSessionUser } from "@/entities/session";

import { updateProfile } from "../api/update-profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "update-profile"],
    mutationFn: updateProfile,
    onSuccess: (user) => {
      setSessionUser(queryClient, user);
    },
  });
}
