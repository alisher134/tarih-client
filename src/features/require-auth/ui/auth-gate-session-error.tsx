"use client";

import { useTranslations } from "next-intl";

import { ErrorPageElement } from "@/shared/ui/error-page-element";

type AuthGateSessionErrorProps = {
  onRetry: () => void;
};

export function AuthGateSessionError({ onRetry }: AuthGateSessionErrorProps) {
  const t = useTranslations("requireAuth");

  return (
    <ErrorPageElement
      className="min-h-[50vh]"
      title={t("sessionError")}
      description={t("sessionErrorDescription")}
      retryLabel={t("retry")}
      onRetry={onRetry}
    />
  );
}
