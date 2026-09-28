"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useCourseAccess } from "@/features/courses";
import { LearningAccessNotice } from "@/features/courses/ui/learning-access-notice";
import type { StudentLessonTest, TestAttempt } from "@/entities/course";
import { SubscriptionRequiredNotice } from "@/features/subscription";
import {
  getErrorMessage,
  getLocalizedApiErrorMessage,
  isApiErrorCode,
} from "@/shared/api";
import { isSubscriptionRequiredError } from "@/shared/lib/is-subscription-required-error";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { ErrorPageElement } from "@/shared/ui/error-page-element";
import {
  PageBreadcrumbs,
  type PageBreadcrumbItem,
} from "@/shared/ui/page-breadcrumbs";
import { PageTitle } from "@/shared/ui/page-title";
import { Show } from "@/shared/ui/show";

import { useActiveAttempt } from "../model/use-active-attempt";
import { useLessonTest } from "../model/use-lesson-test";
import { useStartAttempt } from "../model/use-start-attempt";
import { TestAttemptForm } from "./test-attempt-form";
import { TestIntro } from "./test-intro";
import { TestResult } from "./test-result";

type TakeTestProps = {
  slug: string;
  lessonId: string;
};

type TestScreen = "checking" | "intro" | "form" | "result";

function getTestScreen(
  activeAttempt: TestAttempt | null | undefined,
  isChecking: boolean,
  startedAttempt: TestAttempt | null,
  result: TestAttempt | null,
): TestScreen {
  if (result != null) return "result";
  if (startedAttempt != null) {
    return startedAttempt.completedAt != null ? "result" : "form";
  }

  if (isChecking) return "checking";

  if (activeAttempt == null) return "intro";

  return activeAttempt.completedAt != null ? "result" : "form";
}

export function TakeTest({ slug, lessonId }: TakeTestProps) {
  const t = useTranslations("takeTest");
  const tErrors = useTranslations("errors");
  const tSidebar = useTranslations("dashboardSidebar");
  const tCourses = useTranslations("courses");
  const access = useCourseAccess(slug);
  const testQuery = useLessonTest(lessonId, access.canAccess);
  const testId = testQuery.data?.id ?? "";
  const activeAttemptQuery = useActiveAttempt(
    testId,
    access.canAccess && testId.length > 0,
  );
  const startAttempt = useStartAttempt(testId);
  const [startedAttempt, setStartedAttempt] = useState<TestAttempt | null>(
    null,
  );
  const [result, setResult] = useState<TestAttempt | null>(null);
  const currentAttempt =
    result ??
    startedAttempt ??
    (activeAttemptQuery.data === undefined ? null : activeAttemptQuery.data);
  const screen = getTestScreen(
    activeAttemptQuery.data,
    activeAttemptQuery.isLoading,
    startedAttempt,
    result,
  );
  const lesson = access.course?.lessons.find((item) => item.id === lessonId);
  const lessonHref = `/dashboard/courses/${slug}/lessons/${lessonId}`;

  const breadcrumbItems: PageBreadcrumbItem[] = [
    { label: tSidebar("allCourses"), href: "/dashboard/courses" },
    {
      label: access.course?.title ?? t("courseFallback"),
      href: `/dashboard/courses/${slug}`,
    },
  ];

  if (lesson != null) {
    breadcrumbItems.push({
      label: lesson.title,
      href: lessonHref,
    });
  }

  breadcrumbItems.push({
    label: testQuery.data?.title ?? t("testFallback"),
  });

  const handleStartAttempt = () => {
    startAttempt.mutate(undefined, {
      onSuccess: (attempt) => {
        setStartedAttempt(attempt);
        setResult(null);
      },
    });
  };

  const handleRetryStart = () => {
    setStartedAttempt(null);
    setResult(null);
    handleStartAttempt();
  };

  const testLoadErrorSlot = isSubscriptionRequiredError(testQuery.error) ? (
    <SubscriptionRequiredNotice />
  ) : isApiErrorCode(testQuery.error, "LESSON_NOT_COMPLETED") ? (
    <ErrorPageElement
      layout="inline"
      title={tErrors("apiCodes.LESSON_NOT_COMPLETED")}
      description={t("lessonNotCompletedDescription")}
      homeLabel={t("backToLesson")}
      homeHref={lessonHref}
    />
  ) : (
    <ErrorPageElement
      layout="inline"
      title={t("errors.loadFailed")}
      description={getLocalizedApiErrorMessage(
        testQuery.error,
        (code) => tErrors(`apiCodes.${code}`),
        t("errors.loadFailed"),
      )}
      retryLabel={tCourses("retry")}
      onRetry={() => {
        void testQuery.refetch();
      }}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <AsyncWrapper
        isLoading={access.isLoading}
        isError={access.isError}
        data={access.course}
        errorSlot={
          <ErrorPageElement
            layout="inline"
            title={tCourses("errors.courseLoadFailed")}
            description={getErrorMessage(
              access.error,
              tCourses("errors.courseLoadFailed"),
            )}
            retryLabel={tCourses("retry")}
            onRetry={() => {
              void access.refetchCourse();
              void access.refetchSubscription();
            }}
          />
        }
      >
        {(course) => (
          <LearningAccessNotice
            isLoading={access.isAccessLoading}
            isError={access.isAccessError}
            isAccessDenied={access.isAccessDenied}
            error={access.accessError}
            onRetry={() => {
              void access.refetchSubscription();
            }}
          >
            <AsyncWrapper
              isLoading={testQuery.isLoading}
              isError={testQuery.isError}
              data={testQuery.data}
              errorSlot={testLoadErrorSlot}
            >
              {(test: StudentLessonTest) => (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <PageTitle>{test.title}</PageTitle>
                    <Show
                      when={
                        test.description != null && test.description.length > 0
                      }
                    >
                      <p className="text-sm text-muted-foreground">
                        {test.description}
                      </p>
                    </Show>
                  </div>

                  <Show when={activeAttemptQuery.isError}>
                    <ErrorAlert
                      errorMessage={getLocalizedApiErrorMessage(
                        activeAttemptQuery.error,
                        (code) => tErrors(`apiCodes.${code}`),
                        t("errors.loadAttemptFailed"),
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="self-start"
                      onClick={() => {
                        void activeAttemptQuery.refetch();
                      }}
                    >
                      {tCourses("retry")}
                    </Button>
                  </Show>

                  <Show when={screen === "checking"}>
                    <p className="text-sm text-muted-foreground">
                      {t("checkingAttempt")}
                    </p>
                  </Show>

                  <Show when={screen === "intro"}>
                    <TestIntro
                      test={test}
                      onStart={handleStartAttempt}
                      isStarting={startAttempt.isPending}
                    />
                  </Show>

                  <Show when={startAttempt.isError}>
                    {isSubscriptionRequiredError(startAttempt.error) ? (
                      <SubscriptionRequiredNotice />
                    ) : isApiErrorCode(
                        startAttempt.error,
                        "LESSON_NOT_COMPLETED",
                      ) ? (
                      <ErrorPageElement
                        layout="inline"
                        title={tErrors("apiCodes.LESSON_NOT_COMPLETED")}
                        description={t("lessonNotCompletedDescription")}
                        homeLabel={t("backToLesson")}
                        homeHref={lessonHref}
                      />
                    ) : (
                      <div className="flex flex-col gap-3">
                        <ErrorAlert
                          errorMessage={getLocalizedApiErrorMessage(
                            startAttempt.error,
                            (code) => tErrors(`apiCodes.${code}`),
                            t("errors.startFailed"),
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="self-start"
                          onClick={handleRetryStart}
                          disabled={startAttempt.isPending}
                        >
                          {tCourses("retry")}
                        </Button>
                      </div>
                    )}
                  </Show>

                  <Show when={screen === "form" && currentAttempt != null}>
                    <TestAttemptForm
                      test={test}
                      attempt={currentAttempt!}
                      onSubmitted={setResult}
                      onRetryAttempt={handleRetryStart}
                      isRetrying={startAttempt.isPending}
                    />
                  </Show>

                  <Show when={screen === "result" && currentAttempt != null}>
                    <TestResult
                      attempt={currentAttempt!}
                      courseId={course.id}
                      courseSlug={slug}
                      courseHref={`/dashboard/courses/${slug}`}
                      passingScore={test.passingScore}
                    />
                  </Show>
                </div>
              )}
            </AsyncWrapper>
          </LearningAccessNotice>
        )}
      </AsyncWrapper>
    </div>
  );
}
