"use client";

import {
  BookOpenIcon,
  ClipboardCheckIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { AdminAnalyticsOverview } from "@/entities/analytics";
import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ErrorAlert } from "@/shared/ui/error-alert";

import { formatPercent } from "../lib/format-percent";
import { useAdminAnalyticsOverview } from "../model/use-admin-analytics-overview";
import { AnalyticsStatCard } from "./analytics-stat-card";

export function AdminAnalyticsOverviewSection() {
  const t = useTranslations("adminAnalytics");
  const { data, isLoading, isError, error } = useAdminAnalyticsOverview();

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
        {(overview) => <AdminOverviewContent overview={overview} />}
      </AsyncWrapper>
    </section>
  );
}

type AdminOverviewContentProps = {
  overview: AdminAnalyticsOverview;
};

function AdminOverviewContent({ overview }: AdminOverviewContentProps) {
  const t = useTranslations("adminAnalytics");

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsStatCard
        icon={UserPlusIcon}
        label={t("overview.newUsers")}
        value={String(overview.users.newUsers)}
      />
      <AnalyticsStatCard
        icon={UsersIcon}
        label={t("overview.activeUsers")}
        value={String(overview.users.activeUsers)}
      />
      <AnalyticsStatCard
        icon={BookOpenIcon}
        label={t("overview.enrollments")}
        value={String(overview.learning.enrollmentsStarted)}
        detail={t("overview.enrollmentsCompleted", {
          count: overview.learning.enrollmentsCompleted,
        })}
      />
      <AnalyticsStatCard
        icon={ClipboardCheckIcon}
        label={t("overview.tests")}
        value={String(overview.tests.attempts)}
        detail={t("overview.testsPassRate", {
          passRate: formatPercent(overview.tests.passRate),
        })}
      />
    </div>
  );
}
