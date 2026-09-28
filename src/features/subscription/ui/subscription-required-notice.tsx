"use client";

import { useTranslations } from "next-intl";

import { getLocalizedApiErrorMessage } from "@/shared/api";
import { ErrorPageElement } from "@/shared/ui/error-page-element";

import { TelegramPurchaseButton } from "./telegram-purchase-button";

type SubscriptionRequiredNoticeProps = {
  layout?: "page" | "inline";
};

export function SubscriptionRequiredNotice({
  layout = "inline",
}: SubscriptionRequiredNoticeProps) {
  const t = useTranslations("courses");
  const tSubscription = useTranslations("subscription");

  return (
    <div className="flex flex-col gap-4">
      <ErrorPageElement
        layout={layout}
        title={t("subscriptionRequiredTitle")}
        description={t("subscriptionRequiredDescription")}
      />

      <TelegramPurchaseButton className="self-start" showInstructions>
        {tSubscription("purchaseInTelegram")}
      </TelegramPurchaseButton>
    </div>
  );
}
