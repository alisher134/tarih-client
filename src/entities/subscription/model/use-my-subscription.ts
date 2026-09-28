"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/entities/session";

import { getMySubscription } from "../api/get-my-subscription";
import { MY_SUBSCRIPTION_QUERY_KEY } from "./subscription-query";

export function useMySubscription() {
  return useQuery({
    queryKey: MY_SUBSCRIPTION_QUERY_KEY,
    queryFn: getMySubscription,
    enabled: getAccessToken() != null,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
