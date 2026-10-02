"use client";

import { useIsAdmin } from "@/entities/session";
import { useMySubscription } from "@/entities/subscription";

export function useLearningAccess() {
  const subscriptionQuery = useMySubscription();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const isLoading =
    subscriptionQuery.isLoading ||
    subscriptionQuery.isFetching ||
    isAdminLoading;
  const hasAccess =
    !isLoading &&
    !subscriptionQuery.isError &&
    (subscriptionQuery.data?.isActive === true || isAdmin);
  const isAccessDenied = !isLoading && !subscriptionQuery.isError && !hasAccess;

  return {
    hasAccess,
    isAccessDenied,
    isLoading,
    isError: subscriptionQuery.isError,
    error: subscriptionQuery.error,
    refetchSubscription: subscriptionQuery.refetch,
  };
}
