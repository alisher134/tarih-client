"use client";

import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  LayoutGridIcon,
  RotateCcwIcon,
  TargetIcon,
  XCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { TestAttempt } from "@/entities/course";
import { useCourseLearningSummary } from "@/entities/learning";
import { getErrorMessage } from "@/shared/api";
import { Card, CardContent } from "@/shared/ui/card";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";
import { cn } from "cn";

type TestResultProps = {
  attempt: TestAttempt;
  courseId: string;
  courseHref: string;
  passingScore: number;
  totalQuestions?: number;
};

export function TestResult({
  attempt,
  courseId,
  courseHref,
  passingScore,
  totalQuestions,
}: TestResultProps) {
  const t = useTranslations("takeTest");
  const tCourses = useTranslations("courses");
  const passed = attempt.passed === true;

  const learningSummaryQuery = useCourseLearningSummary(courseId, passed);
  const summary = learningSummaryQuery.data;

  const score = attempt.score ?? 0;
  const scoreDiff = score - passingScore;

  const isCourseCompleted =
    passed &&
    summary != null &&
    (summary.nextAction == null || summary.enrollment?.status === "COMPLETED");

  const courseProgress = isCourseCompleted
    ? 100
    : (summary?.enrollment?.progress ?? (passed ? 100 : 0));

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6">
        {/* Header: Status & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                passed
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {passed ? (
                <CheckCircle2Icon className="size-6" aria-hidden />
              ) : (
                <XCircleIcon className="size-6" aria-hidden />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-semibold tracking-tight">
                  {isCourseCompleted
                    ? t("courseCompletedTitle")
                    : passed
                      ? t("testPassedTitle")
                      : t("testFailedTitle")}
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    passed
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {passed ? t("passed") : t("failed")}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {isCourseCompleted
                  ? t("courseCompletedDescription")
                  : passed
                    ? t("testPassedDescription")
                    : t("testFailedDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Your Score */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AwardIcon className="size-4" aria-hidden />
                <span className="text-sm">{t("yourScore")}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  passed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive",
                )}
              >
                {passed ? t("passed") : t("failed")}
              </span>
            </div>

            <div>
              <p
                className={cn(
                  "text-3xl font-bold tracking-tight",
                  passed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive",
                )}
              >
                {score}%
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    passed
                      ? "bg-emerald-600 dark:bg-emerald-400"
                      : "bg-destructive",
                  )}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Passing Score */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TargetIcon className="size-4" aria-hidden />
                <span className="text-sm">{t("minPassingScore")}</span>
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {passingScore}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {scoreDiff >= 0
                  ? t("abovePassing", { diff: scoreDiff })
                  : t("belowPassing", { diff: Math.abs(scoreDiff) })}
              </p>
            </div>
          </div>

          {/* Card 3: Course Progress */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border p-4 bg-card sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCapIcon className="size-4" aria-hidden />
                <span className="text-sm">{t("courseProgressTitle")}</span>
              </div>
              {isCourseCompleted && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                  {tCourses("completedBadge")}
                </span>
              )}
            </div>

            <div>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {courseProgress}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {summary
                  ? t("lessonsCompleted", {
                      completed: summary.lessonsCompleted,
                      total: summary.lessonsTotal,
                    })
                  : totalQuestions != null
                    ? `${totalQuestions} ${t("questionsCount").toLowerCase()}`
                    : tCourses("progress")}
              </p>
            </div>
          </div>
        </div>

        {/* Action / Next Step */}
        <Show
          when={passed}
          fallback={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <RotateCcwIcon className="size-4" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {t("failed")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("failedHint")}
                  </p>
                </div>
              </div>

              <LinkButton
                href={courseHref}
                variant="outline"
                className="self-start sm:self-auto"
              >
                {t("backToCourse")}
              </LinkButton>
            </div>
          }
        >
          {learningSummaryQuery.isLoading ? (
            <div className="h-16 w-full animate-pulse rounded-xl border bg-muted/40" />
          ) : learningSummaryQuery.isError ? (
            <div className="flex flex-col items-start gap-3">
              <ErrorAlert
                errorMessage={getErrorMessage(
                  learningSummaryQuery.error,
                  tCourses("errors.courseLoadFailed"),
                )}
              />
              <LinkButton href={courseHref} variant="outline">
                {t("backToCourse")}
              </LinkButton>
            </div>
          ) : isCourseCompleted ? (
            /* Course completed action */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2Icon className="size-4" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {tCourses("courseCompleted")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("courseCompletedDescription")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <LinkButton href="/dashboard/courses" variant="default">
                  <LayoutGridIcon className="size-4 mr-1.5" aria-hidden />
                  {tCourses("backToCourses")}
                </LinkButton>
                <LinkButton href={courseHref} variant="outline">
                  <BookOpenIcon className="size-4 mr-1.5" aria-hidden />
                  {t("backToCourse")}
                </LinkButton>
              </div>
            </div>
          ) : (
            /* Back to course */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ArrowRightIcon className="size-4" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {t("nextStep")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("nextStepDescription")}
                  </p>
                </div>
              </div>

              <LinkButton
                href={courseHref}
                variant="default"
                className="sm:shrink-0"
              >
                {t("backToCourse")}
              </LinkButton>
            </div>
          )}
        </Show>
      </CardContent>
    </Card>
  );
}
