"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "@/shared/config/i18n/navigation";

import { resetSession } from "../lib/apply-session";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    resetSession(queryClient);
    router.replace("/sign-in");
  };
}
