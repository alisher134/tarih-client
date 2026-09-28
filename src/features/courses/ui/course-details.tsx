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

import { useCoursePage } from "../model/use-course-page";
import { CourseLessons } from "./course-lessons";
import { CourseNextActionCta } from "./course-next-action-cta";
import { CourseProgress } from "./course-progress";
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

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <PageTitle>{course.title}</PageTitle>
                <p className="text-sm text-muted-foreground">
                  {t("lessonsCount", { count: course.lessons.length })}
                  {" · "}
                  {t("testsCount", { count: testsCount })}
                </p>
                <Show when={course.description != null}>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </Show>
                <Show
                  when={coursePage.enrollmentProgress != null}
                  data={coursePage.enrollmentProgress}
                >
                  {(enrollment) => {
                    if (enrollment == null) return null;

                    return (
                      <div className="mt-1 flex w-full max-w-sm flex-col gap-2">
                        <Show when={enrollment.status === "COMPLETED"}>
                          <p className="text-sm font-medium">
                            {t("completedBadge")}
                          </p>
                        </Show>
                        <Show when={!enrollment.isStarted}>
                          <p className="text-sm text-muted-foreground">
                            {t("notStarted")}
                          </p>
                        </Show>
                        <CourseProgress
                          value={enrollment.isStarted ? enrollment.progress : 0}
                        />
                      </div>
                    );
                  }}
                </Show>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <FavoriteCourseButton
                  courseId={course.id}
                  isFavorite={coursePage.isFavorite}
                />
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
                      enrollmentStatus={coursePage.enrollmentProgress?.status}
                      nextAction={coursePage.nextAction}
                      canAccess={coursePage.canAccess}
                      isLoading={coursePage.isLearningSummaryLoading}
                      isError={coursePage.isLearningSummaryError}
                      error={coursePage.learningSummaryError}
                      onRetry={() => {
                        void coursePage.refetchLearningSummary();
                      }}
                    />
                  }
                  deniedSlot={
                    <LinkButton href={SUBSCRIPTION_PLANS_HREF} size="sm">
                      {t("viewPlans")}
                    </LinkButton>
                  }
                />
              </div>
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
