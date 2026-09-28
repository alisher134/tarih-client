"use client";

import { useSyncExternalStore, type PropsWithChildren } from "react";

import { useTranslations } from "next-intl";

import { ErrorPageElement } from "@/shared/ui/error-page-element";
import { Show } from "@/shared/ui/show";

export function OfflineGate({ children }: PropsWithChildren) {
  const t = useTranslations("errors");
  const isOnline = useIsOnline();

  return (
    <Show when={!isOnline} fallback={children}>
      <ErrorPageElement
        className="min-h-dvh"
        title={t("offline.title")}
        description={t("offline.description")}
        retryLabel={t("retry")}
        onRetry={reloadPage}
      />
    </Show>
  );
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);

  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

function useIsOnline() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function reloadPage() {
  window.location.reload();
}
