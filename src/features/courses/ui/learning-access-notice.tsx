"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { SubscriptionRequiredNotice } from "@/features/subscription";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { Show } from "@/shared/ui/show";

type LearningAccessNoticeProps = {
  isLoading: boolean;
  isError: boolean;
  isAccessDenied: boolean;
  error: unknown;
  onRetry: () => void;
  layout?: "inline" | "page";
  children: ReactNode;
};

export function LearningAccessNotice({
  isLoading,
  isError,
  isAccessDenied,
  error,
  onRetry,
  layout = "inline",
  children,
}: LearningAccessNoticeProps) {
  const t = useTranslations("courses");
  const tErrors = useTranslations("errors");

  return (
    <LoaderGate isLoading={isLoading}>
      <Show
        when={isError}
        fallback={
          <Show when={isAccessDenied} fallback={children}>
            <SubscriptionRequiredNotice layout={layout} />
          </Show>
        }
      >
        <div className="flex flex-col gap-3">
          <ErrorAlert
            errorMessage={getLocalizedApiErrorMessage(
              error,
              (code) => tErrors(`apiCodes.${code}`),
              t("errors.subscriptionLoadFailed"),
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => {
              onRetry();
            }}
          >
            {t("retry")}
          </Button>
        </div>
      </Show>
    </LoaderGate>
  );
}

type LearningAccessActionProps = {
  isLoading: boolean;
  isError: boolean;
  isAccessDenied: boolean;
  hasAccess: boolean;
  onRetry: () => void;
  error: unknown;
  grantedSlot: ReactNode;
  deniedSlot: ReactNode;
};

export function LearningAccessAction({
  isLoading,
  isError,
  isAccessDenied,
  hasAccess,
  error,
  onRetry,
  grantedSlot,
  deniedSlot,
}: LearningAccessActionProps) {
  const t = useTranslations("courses");
  const tErrors = useTranslations("errors");

  if (isLoading) return null;

  if (isError) {
    return (
      <div className="flex flex-col gap-2 md:items-end">
        <ErrorAlert
          errorMessage={getLocalizedApiErrorMessage(
            error,
            (code) => tErrors(`apiCodes.${code}`),
            t("errors.subscriptionLoadFailed"),
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start md:self-end"
          onClick={() => {
            onRetry();
          }}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (hasAccess) return grantedSlot;

  if (isAccessDenied) return deniedSlot;

  return null;
}

export { SUBSCRIPTION_PLANS_HREF };
