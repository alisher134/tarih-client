"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/get-me";
import { getAccessToken } from "../lib/token-storage";
import { SESSION_QUERY_KEY } from "./session-query";

function subscribe() {
  return () => {};
}

function useHasHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useSession() {
  const hasHydrated = useHasHydrated();

  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: getMe,
    enabled: hasHydrated && getAccessToken() != null,
    staleTime: 60 * 1000,
    retry: false,
  });

  return {
    ...query,
    isLoading: !hasHydrated || query.isLoading,
  };
}

export function useIsAuth() {
  const { data: user, isLoading } = useSession();

  return !isLoading && user != null;
}

export function useIsAdmin() {
  const { data: user, isLoading } = useSession();

  return {
    isAdmin: user?.isAdmin === true,
    isLoading,
  };
}
