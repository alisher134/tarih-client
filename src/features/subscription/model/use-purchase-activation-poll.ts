"use client";

import { useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  MY_SUBSCRIPTION_QUERY_KEY,
  useMySubscription,
} from "@/entities/subscription";

import { invalidatePostPurchaseQueries } from "../lib/invalidate-post-purchase-queries";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120_000;

export type PurchaseActivationStatus =
  "idle" | "checking" | "activated" | "timeout";

export function usePurchaseActivationPoll() {
  const queryClient = useQueryClient();
  const { data: subscription } = useMySubscription();
  const [isPolling, setIsPolling] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  const stopPolling = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const startPolling = () => {
    stopPolling();
    setHasTimedOut(false);
    setIsPolling(true);

    intervalRef.current = window.setInterval(() => {
      void queryClient.invalidateQueries({
        queryKey: MY_SUBSCRIPTION_QUERY_KEY,
      });
    }, POLL_INTERVAL_MS);

    timeoutRef.current = window.setTimeout(() => {
      stopPolling();
      setHasTimedOut(true);
    }, POLL_TIMEOUT_MS);
  };

  useEffect(() => () => stopPolling(), []);

  useEffect(() => {
    if (subscription?.isActive !== true || !isPolling) return;

    stopPolling();
    invalidatePostPurchaseQueries(queryClient);
  }, [isPolling, queryClient, subscription?.isActive]);

  const resetStatus = () => {
    stopPolling();
    setIsPolling(false);
    setHasTimedOut(false);
  };

  const status: PurchaseActivationStatus = !isPolling
    ? "idle"
    : subscription?.isActive === true
      ? "activated"
      : hasTimedOut
        ? "timeout"
        : "checking";

  return {
    status,
    startPolling,
    resetStatus,
  };
}
