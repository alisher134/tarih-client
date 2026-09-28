"use client";

import {
  BookOpenIcon,
  FlameIcon,
  GraduationCapIcon,
  TimerIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { UserAnalyticsOverview } from "@/entities/analytics";
import { useMySubscription } from "@/entities/subscription";
import { formatPriceKzt } from "@/entities/subscription";
import { getErrorMessage } from "@/shared/api";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { formatDuration } from "@/shared/lib/format-duration";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";

import { useAnalyticsOverview } from "../model/use-analytics-overview";
import { AnalyticsStatCard } from "./analytics-stat-card";

function formatPercent(value: number | null) {
  if (value == null) return "—";
  return `${value}%`;
}

export function AnalyticsOverview() {
  const t = useTranslations("dashboardAnalytics");
  const { data, isLoading, isError, error } = useAnalyticsOverview();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading description={t("overview.description")}>
        {t("overview.title")}
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
        {(overview) => <AnalyticsOverviewContent overview={overview} />}
      </AsyncWrapper>
    </section>
  );
}

type AnalyticsOverviewContentProps = {
  overview: UserAnalyticsOverview;
};

function AnalyticsOverviewContent({ overview }: AnalyticsOverviewContentProps) {
  const t = useTranslations("dashboardAnalytics");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          icon={BookOpenIcon}
          label={t("overview.courses")}
          value={String(overview.courses.active)}
          detail={t("overview.coursesTotal", { total: overview.courses.total })}
        />
        <AnalyticsStatCard
          icon={GraduationCapIcon}
          label={t("overview.lessonsCompleted")}
          value={String(overview.lessons.completed)}
        />
        <AnalyticsStatCard
          icon={TimerIcon}
          label={t("overview.watchTime")}
          value={formatDuration(overview.lessons.watchedSecondsTotal)}
        />
        <AnalyticsStatCard
          icon={FlameIcon}
          label={t("overview.streak")}
          value={String(overview.streakDays)}
          detail={t("overview.streakDays")}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">{t("overview.tests")}</p>
          <p className="mt-1 text-2xl font-semibold">
            {overview.tests.attempts}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("overview.testsDetails", {
              passed: overview.tests.passed,
              passRate: formatPercent(overview.tests.passRate),
              averageScore: formatPercent(overview.tests.averageScore),
            })}
          </p>
        </div>

        <SubscriptionOverviewCard />
      </div>
    </div>
  );
}

function SubscriptionOverviewCard() {
  const t = useTranslations("dashboardAnalytics");
  const tSubscription = useTranslations("subscription");
  const tCourses = useTranslations("courses");
  const { data, isLoading, isError, error, refetch } = useMySubscription();
  const activeSubscription = data?.isActive === true ? data.subscription : null;

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">
        {t("overview.subscription")}
      </p>

      <LoaderGate isLoading={isLoading}>
        <Show
          when={isError}
          fallback={
            <Show
              when={activeSubscription != null}
              data={activeSubscription}
              fallback={
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {t("overview.subscriptionInactive")}
                  </p>
                  <LinkButton
                    href={SUBSCRIPTION_PLANS_HREF}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    {t("overview.viewPlans")}
                  </LinkButton>
                </div>
              }
            >
              {(subscription) => {
                if (subscription == null) return null;

                return (
                  <div className="mt-2 flex flex-col gap-1">
                    <p className="font-medium">{subscription.plan.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("overview.subscriptionDetails", {
                        days: subscription.remainingDays,
                        price: formatPriceKzt(subscription.monthlyPriceKzt),
                      })}
                    </p>
                  </div>
                );
              }}
            </Show>
          }
        >
          <div className="mt-2 flex flex-col gap-2">
            <ErrorAlert
              errorMessage={getErrorMessage(
                error,
                tSubscription("errors.loadFailed"),
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => {
                void refetch();
              }}
            >
              {tCourses("retry")}
            </Button>
          </div>
        </Show>
      </LoaderGate>
    </div>
  );
}
