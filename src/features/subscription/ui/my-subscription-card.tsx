"use client";

import { useLocale, useTranslations } from "next-intl";

import { formatPriceKzt } from "@/entities/subscription";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { formatDateTime } from "@/shared/lib/dayjs";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";

import { useMySubscription } from "../model/use-my-subscription";
import { TelegramPurchaseButton } from "./telegram-purchase-button";

export function MySubscriptionCard() {
  const t = useTranslations("subscription");
  const tErrors = useTranslations("errors");
  const locale = useLocale();
  const { data, isLoading, isError, error } = useMySubscription();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading description={t("description")}>
        {t("title")}
      </SectionHeading>

      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        errorSlot={
          <ErrorAlert
            errorMessage={getLocalizedApiErrorMessage(
              error,
              (code) => tErrors(`apiCodes.${code}`),
              t("errors.loadFailed"),
            )}
          />
        }
      >
        {(subscriptionState) => {
          const activeSubscription = subscriptionState.isActive
            ? subscriptionState.subscription
            : null;
          const upcomingSubscription =
            subscriptionState.upcomingSubscription ?? null;

          return (
            <Show
              when={activeSubscription != null}
              data={activeSubscription}
              fallback={
                <Show
                  when={upcomingSubscription != null}
                  data={upcomingSubscription}
                  fallback={
                    <EmptyState
                      title={t("inactiveTitle")}
                      description={t("inactive")}
                      action={
                        <TelegramPurchaseButton variant="outline" size="sm">
                          {t("purchaseInTelegram")}
                        </TelegramPurchaseButton>
                      }
                    />
                  }
                >
                  {(upcoming) => {
                    if (upcoming == null) return null;

                    return (
                      <div className="flex flex-col gap-3 rounded-xl border p-4">
                        <p className="font-medium">
                          {locale === "kz" && upcoming.plan.titleKz
                            ? upcoming.plan.titleKz
                            : upcoming.plan.titleRu}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("upcomingStartsAt", {
                            date: formatDateTime(upcoming.startsAt, locale),
                          })}
                        </p>
                        <LinkButton
                          href={SUBSCRIPTION_PLANS_HREF}
                          variant="outline"
                          size="sm"
                          className="self-start"
                        >
                          {t("viewPlans")}
                        </LinkButton>
                      </div>
                    );
                  }}
                </Show>
              }
            >
              {(subscription) => {
                if (subscription == null) return null;

                return (
                  <div className="flex flex-col gap-3 rounded-xl border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {locale === "kz" && subscription.plan.titleKz
                            ? subscription.plan.titleKz
                            : subscription.plan.titleRu}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("statusActive")}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPriceKzt(subscription.monthlyPriceKzt)} /{" "}
                        {t("month")}
                      </p>
                    </div>

                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">
                          {t("expiresAt")}
                        </dt>
                        <dd>
                          {formatDateTime(subscription.expiresAt, locale)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t("remainingDays")}
                        </dt>
                        <dd>{subscription.remainingDays}</dd>
                      </div>
                    </dl>

                    <Show
                      when={upcomingSubscription != null}
                      data={upcomingSubscription}
                    >
                      {(upcoming) => {
                        if (upcoming == null) return null;

                        return (
                          <p className="text-sm text-muted-foreground">
                            {t("upcomingRenewal", {
                              date: formatDateTime(upcoming.startsAt, locale),
                            })}
                          </p>
                        );
                      }}
                    </Show>

                    <TelegramPurchaseButton
                      variant="link"
                      size="sm"
                      className="h-auto self-start p-0"
                    >
                      {t("renewViaTelegram")}
                    </TelegramPurchaseButton>
                  </div>
                );
              }}
            </Show>
          );
        }}
      </AsyncWrapper>
    </section>
  );
}
