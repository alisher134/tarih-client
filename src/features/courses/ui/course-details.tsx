"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { ErrorPageElement } from "@/shared/ui/error-page-element";
import { LinkButton } from "@/shared/ui/link-button";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";
import { PageTitle } from "@/shared/ui/page-title";
import { Show } from "@/shared/ui/show";
import { BookOpenIcon, CheckCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

import { useCoursePage } from "../model/use-course-page";
import { CourseLessons } from "./course-lessons";
import { CourseNextActionCta } from "./course-next-action-cta";
import { Progress } from "@/shared/ui/progress";
import { FavoriteCourseButton } from "./favorite-course-button";
import {
  LearningAccessAction,
  LearningAccessNotice,
} from "./learning-access-notice";

type CourseDetailsProps = {
  slug: string;
};

export function CourseDetails({ slug }: CourseDetailsProps) {
  const t = useTranslations("courses");
  const tSidebar = useTranslations("dashboardSidebar");
  const coursePage = useCoursePage(slug);

  return (
    <AsyncWrapper
      isLoading={coursePage.isLoading}
      isError={coursePage.isError}
      data={coursePage.course}
      errorSlot={
        <ErrorPageElement
          layout="inline"
          title={t("errors.courseLoadFailed")}
          description={getErrorMessage(
            coursePage.error,
            t("errors.courseLoadFailed"),
          )}
          retryLabel={t("retry")}
          onRetry={() => {
            void coursePage.refetch();
          }}
        />
      }
    >
      {(course) => {
        const testsCount = course.lessons.filter(
          (lesson) => lesson.hasTest === true,
        ).length;

        return (
          <div className="flex flex-col gap-6">
            <PageBreadcrumbs
              items={[
                {
                  label: tSidebar("allCourses"),
                  href: "/dashboard/courses",
                },
                { label: course.title },
              ]}
            />

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-1 flex-col gap-2">
                <PageTitle>{course.title}</PageTitle>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpenIcon className="size-4 text-primary" aria-hidden />
                    <span>
                      {t("lessonsCount", { count: course.lessons.length })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircleIcon
                      className="size-4 text-primary"
                      aria-hidden
                    />
                    <span>{t("testsCount", { count: testsCount })}</span>
                  </div>
                </div>

                <Show when={course.description != null}>
                  <p className="max-w-2xl text-base text-muted-foreground mt-4 leading-relaxed">
                    {course.description}
                  </p>
                </Show>
              </div>

              <Card className="w-full sm:max-w-xs md:w-80 md:shrink-0 shadow-sm">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-2">
                    <LearningAccessAction
                      isLoading={coursePage.isAccessLoading}
                      isError={coursePage.isAccessError}
                      isAccessDenied={coursePage.isAccessDenied}
                      hasAccess={coursePage.canAccess}
                      error={coursePage.accessError}
                      onRetry={() => {
                        void coursePage.refetchSubscription();
                      }}
                      grantedSlot={
                        <CourseNextActionCta
                          courseSlug={course.slug}
                          enrollmentStatus={
                            coursePage.enrollmentProgress?.status
                          }
                          nextAction={coursePage.nextAction}
                          canAccess={coursePage.canAccess}
                          isLoading={coursePage.isLearningSummaryLoading}
                          isError={coursePage.isLearningSummaryError}
                          error={coursePage.learningSummaryError}
                          onRetry={() => {
                            void coursePage.refetchLearningSummary();
                          }}
                          className="w-full"
                        />
                      }
                      deniedSlot={
                        <LinkButton
                          href={SUBSCRIPTION_PLANS_HREF}
                          size="default"
                          className="w-full"
                        >
                          {t("viewPlans")}
                        </LinkButton>
                      }
                    />

                    <FavoriteCourseButton
                      courseId={course.id}
                      isFavorite={coursePage.isFavorite}
                      className="w-full"
                    />
                  </div>

                  <Show
                    when={coursePage.enrollmentProgress != null}
                    data={coursePage.enrollmentProgress}
                  >
                    {(enrollment) => {
                      if (enrollment == null) return null;

                      const progressValue = enrollment.isStarted
                        ? enrollment.progress
                        : 0;

                      return (
                        <div className="flex flex-col gap-2 border-t border-border/60 pt-3">
                          <Progress
                            value={progressValue}
                            className="w-full gap-1.5"
                          >
                            <div className="flex w-full items-center justify-between text-xs">
                              <span className="font-medium text-muted-foreground">
                                {t("progress")}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Show when={enrollment.status === "COMPLETED"}>
                                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                                    {t("completedBadge")}
                                  </span>
                                </Show>
                                <Show when={!enrollment.isStarted}>
                                  <span className="text-xs text-muted-foreground">
                                    {t("notStarted")}
                                  </span>
                                </Show>
                                <span className="font-semibold text-foreground tabular-nums">
                                  {progressValue}%
                                </span>
                              </div>
                            </div>
                          </Progress>
                        </div>
                      );
                    }}
                  </Show>
                </CardContent>
              </Card>
            </div>

            <LearningAccessNotice
              isLoading={coursePage.isAccessLoading}
              isError={coursePage.isAccessError}
              isAccessDenied={coursePage.isAccessDenied}
              error={coursePage.accessError}
              onRetry={() => {
                void coursePage.refetchSubscription();
              }}
            >
              <CourseLessons
                slug={course.slug}
                lessons={course.lessons}
                canAccess={coursePage.canAccess}
                isAccessLoading={coursePage.isAccessLoading}
              />
            </LearningAccessNotice>
          </div>
        );
      }}
    </AsyncWrapper>
  );
}
