"use client";

import { useTranslations } from "next-intl";

import { ErrorPageElement } from "@/shared/ui/error-page-element";

type AppErrorProps = {
  reset?: () => void;
  retry?: () => void;
};

export function AppError({ reset, retry }: AppErrorProps) {
  const t = useTranslations("errors");
  const handleRetry = reset ?? retry;

  return (
    <ErrorPageElement
      className="min-h-dvh"
      title={t("server.title")}
      description={t("server.description")}
      retryLabel={t("retry")}
      homeLabel={t("home")}
      homeHref="/"
      onRetry={handleRetry}
    />
  );
}
