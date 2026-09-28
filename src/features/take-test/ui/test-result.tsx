"use client";

import { useTranslations } from "next-intl";

import type { TestAttempt } from "@/entities/course";
import {
  getCourseNextActionLabelKey,
  getLearningNextActionHref,
  useCourseLearningSummary,
} from "@/entities/learning";
import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { Card, CardContent } from "@/shared/ui/card";

type TestResultProps = {
  attempt: TestAttempt;
  courseId: string;
  courseSlug: string;
  courseHref: string;
  passingScore: number;
};

export function TestResult({
  attempt,
  courseId,
  courseSlug,
  courseHref,
  passingScore,
}: TestResultProps) {
  const t = useTranslations("takeTest");
  const tCourses = useTranslations("courses");
  const learningSummaryQuery = useCourseLearningSummary(
    courseId,
    attempt.passed === true,
  );

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="flex flex-col items-start gap-5 p-6">
        <SectionHeading>{t("resultTitle")}</SectionHeading>
        <p className="text-2xl font-semibold">
          {t("score", { score: attempt.score ?? 0 })}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("passingScoreResult", { score: passingScore })}
        </p>
        <p className="text-sm text-muted-foreground">
          {attempt.passed ? t("passed") : t("failed")}
        </p>

        <Show
          when={attempt.passed === true}
          fallback={
            <LinkButton href={courseHref}>{t("backToCourse")}</LinkButton>
          }
        >
          <AsyncWrapper
            isLoading={learningSummaryQuery.isLoading}
            isError={learningSummaryQuery.isError}
            data={learningSummaryQuery.data}
            errorSlot={
              <div className="flex flex-col gap-3">
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
            }
          >
            {(summary) => (
              <Show
                when={summary.nextAction != null}
                data={summary.nextAction!}
                fallback={
                  <p className="text-sm font-medium">
                    {tCourses("courseCompleted")}
                  </p>
                }
              >
                {(nextAction) => (
                  <LinkButton
                    href={getLearningNextActionHref(courseSlug, nextAction)}
                  >
                    {tCourses(getCourseNextActionLabelKey(nextAction))}
                  </LinkButton>
                )}
              </Show>
            )}
          </AsyncWrapper>
        </Show>
      </CardContent>
    </Card>
  );
}
