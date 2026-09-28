"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";

import { useAdminAnalyticsSubscriptions } from "../model/use-admin-analytics-subscriptions";

export function AdminAnalyticsSubscriptionsSection() {
  const t = useTranslations("adminAnalytics");
  const { data, isLoading, isError, error } = useAdminAnalyticsSubscriptions();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading description={t("subscriptions.description")}>
        {t("subscriptions.title")}
      </SectionHeading>

      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        errorSlot={
          <ErrorAlert
            errorMessage={getErrorMessage(error, t("errors.loadFailed"))}
          />
        }
      >
        {(subscriptionsAnalytics) => (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <SubscriptionStat
                label={t("subscriptions.active")}
                value={subscriptionsAnalytics.totals.active}
              />
              <SubscriptionStat
                label={t("subscriptions.expiring7Days")}
                value={subscriptionsAnalytics.totals.expiringIn7Days}
              />
              <SubscriptionStat
                label={t("subscriptions.expiring30Days")}
                value={subscriptionsAnalytics.totals.expiringIn30Days}
              />
              <SubscriptionStat
                label={t("subscriptions.grantedInPeriod")}
                value={subscriptionsAnalytics.totals.grantedInPeriod}
              />
              <SubscriptionStat
                label={t("subscriptions.cancelled")}
                value={subscriptionsAnalytics.totals.cancelled}
              />
              <SubscriptionStat
                label={t("subscriptions.expired")}
                value={subscriptionsAnalytics.totals.expired}
              />
            </div>

            <Show when={subscriptionsAnalytics.byPlan.length > 0}>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  {t("subscriptions.byPlan")}
                </p>
                <ul className="flex flex-col divide-y">
                  {subscriptionsAnalytics.byPlan.map((item) => (
                    <li
                      key={item.plan.id}
                      className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0"
                    >
                      <span className="font-medium">
                        {item.plan.title ?? item.plan.slug ?? item.plan.id}
                      </span>
                      <span className="rounded-full bg-muted/50 px-2.5 py-0.5 font-semibold">
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Show>
          </div>
        )}
      </AsyncWrapper>
    </section>
  );
}

type SubscriptionStatProps = {
  label: string;
  value: number;
};

function SubscriptionStat({ label, value }: SubscriptionStatProps) {
  return (
    <div className="group relative flex flex-col justify-center gap-1 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div
        className="absolute -right-4 -top-4 size-20 rounded-full bg-primary/5 transition-transform duration-500 ease-out group-hover:scale-[2.5]"
        aria-hidden
      />

      <p className="relative z-10 text-sm font-medium text-muted-foreground">
        {label}
      </p>
      <p className="relative z-10 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
