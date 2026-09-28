"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { SectionHeading } from "@/shared/ui/section-heading";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { formatPercent } from "../lib/format-percent";
import { useAdminAnalyticsCourses } from "../model/use-admin-analytics-courses";

export function AdminAnalyticsCoursesSection() {
  const t = useTranslations("adminAnalytics");
  const { data, isLoading, isError, error } = useAdminAnalyticsCourses();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading description={t("courses.description")}>
        {t("courses.title")}
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
        {(coursesAnalytics) => (
          <Show
            when={coursesAnalytics.data.length > 0}
            fallback={
              <EmptyState title={t("courses.empty")} />
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("courses.course")}</TableHead>
                  <TableHead>{t("courses.completed")}</TableHead>
                  <TableHead>{t("courses.progress")}</TableHead>
                  <TableHead>{t("courses.testPassRate")}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {coursesAnalytics.data.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.completed}</TableCell>
                    <TableCell>{course.averageProgress}%</TableCell>
                    <TableCell>{formatPercent(course.testPassRate)}</TableCell>
                    <TableCell>
                      <LinkButton
                        href={`/admin/courses/${course.id}`}
                        variant="outline"
                        size="sm"
                      >
                        {t("courses.open")}
                      </LinkButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Show>
        )}
      </AsyncWrapper>
    </section>
  );
}
