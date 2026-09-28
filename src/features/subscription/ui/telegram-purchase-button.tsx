"use client";

import { useEffect, type ComponentProps } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getPurchaseLink } from "@/entities/subscription";
import { useIsAuth } from "@/entities/session";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { getSubscriptionBotUrl } from "@/shared/lib/subscription-bot-url";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";

import { invalidatePostPurchaseQueries } from "../lib/invalidate-post-purchase-queries";
import { usePurchaseActivationPoll } from "../model/use-purchase-activation-poll";

type TelegramPurchaseButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick" | "className"
> & {
  className?: string;
  showInstructions?: boolean;
  signInHref?: string;
  planId?: string;
  planSlug?: string;
};

export function TelegramPurchaseButton({
  children,
  showInstructions = false,
  signInHref = "/sign-in?next=%2F%23pricing",
  planId,
  planSlug,
  className,
  ...buttonProps
}: TelegramPurchaseButtonProps) {
  const t = useTranslations("subscription");
  const tErrors = useTranslations("errors");
  const isAuth = useIsAuth();
  const queryClient = useQueryClient();
  const { status, startPolling, resetStatus } = usePurchaseActivationPoll();
  const hasPlanBotUrl = planSlug != null && planSlug.length > 0;

  const purchaseLinkQuery = useQuery({
    queryKey: ["subscriptions", "purchase-link", planId ?? "default"],
    queryFn: () => getPurchaseLink(planId != null ? { planId } : {}),
    enabled: isAuth && !hasPlanBotUrl,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isAuth) return;

    const handleFocus = () => {
      invalidatePostPurchaseQueries(queryClient);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuth, queryClient]);

  const purchaseUrl = hasPlanBotUrl
    ? getSubscriptionBotUrl(planSlug)
    : purchaseLinkQuery.data?.url;

  const handlePurchase = () => {
    if (purchaseUrl == null) return;

    window.open(purchaseUrl, "_blank", "noopener,noreferrer");

    if (isAuth) {
      startPolling();
    }
  };

  const isPurchaseDisabled =
    !hasPlanBotUrl &&
    (purchaseLinkQuery.isLoading ||
      purchaseLinkQuery.isError ||
      purchaseUrl == null);

  if (!isAuth && !hasPlanBotUrl) {
    return (
      <LinkButton
        href={signInHref}
        variant={buttonProps.variant}
        size={buttonProps.size}
        className={className}
      >
        {children ?? t("purchaseInTelegram")}
      </LinkButton>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Show when={isAuth && !hasPlanBotUrl && purchaseLinkQuery.isError}>
        <ErrorAlert
          errorMessage={getLocalizedApiErrorMessage(
            purchaseLinkQuery.error,
            (code) => tErrors(`apiCodes.${code}`),
            t("errors.purchaseLinkFailed"),
          )}
        />
      </Show>

      <Show when={isAuth && status === "checking"}>
        <p className="text-sm text-muted-foreground">{t("checkingPayment")}</p>
      </Show>

      <Show when={isAuth && status === "activated"}>
        <p className="text-sm font-medium text-primary">
          {t("paymentActivated")}
        </p>
      </Show>

      <Show when={isAuth && status === "timeout"}>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{t("paymentPending")}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => {
              resetStatus();
              invalidatePostPurchaseQueries(queryClient);
            }}
          >
            {t("checkPaymentAgain")}
          </Button>
        </div>
      </Show>

      <Button
        {...buttonProps}
        className={className}
        type="button"
        disabled={isPurchaseDisabled}
        onClick={handlePurchase}
      >
        {children ?? t("purchaseInTelegram")}
      </Button>

      <Show when={showInstructions}>
        <p className="text-sm text-muted-foreground">
          {t("purchaseInstructions")}
        </p>
      </Show>
    </div>
  );
}
