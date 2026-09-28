"use client";

import { useTranslations } from "next-intl";

import { TelegramPurchaseButton } from "@/features/subscription";
import { useLearningAccess } from "@/features/courses";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { Show } from "@/shared/ui/show";

import { useMyEnrollments } from "../model/use-my-enrollments";
import { CourseCard } from "./course-card";

export function MyCoursesList() {
  const t = useTranslations("courses");
  const tErrors = useTranslations("errors");
  const enrollmentsQuery = useMyEnrollments();
  const access = useLearningAccess();

  return (
    <div className="flex flex-col gap-4">
      <Show when={access.isError}>
        <div className="flex flex-col gap-2">
          <ErrorAlert
            errorMessage={getLocalizedApiErrorMessage(
              access.error,
              (code) => tErrors(`apiCodes.${code}`),
              t("errors.subscriptionLoadFailed"),
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => {
              void access.refetchSubscription();
            }}
          >
            {t("retry")}
          </Button>
        </div>
      </Show>

      <LoaderGate isLoading={access.isLoading}>
        <AsyncWrapper
          isLoading={enrollmentsQuery.isLoading}
          isError={enrollmentsQuery.isError}
          data={enrollmentsQuery.data}
          errorSlot={
            <ErrorAlert
              errorMessage={getLocalizedApiErrorMessage(
                enrollmentsQuery.error,
                (code) => tErrors(`apiCodes.${code}`),
                t("errors.loadFailed"),
              )}
            />
          }
        >
          {(items) => (
            <Show
              when={items.length > 0}
              fallback={
                <EmptyState
                  title={
                    access.hasAccess
                      ? t("emptyEnrolledTitle")
                      : t("emptyNoSubscriptionTitle")
                  }
                  description={
                    access.hasAccess
                      ? t("emptyEnrolled")
                      : t("emptyNoSubscription")
                  }
                  action={
                    access.hasAccess ? (
                      <LinkButton
                        href="/dashboard/courses"
                        variant="outline"
                        size="sm"
                      >
                        {t("browseCourses")}
                      </LinkButton>
                    ) : (
                      <TelegramPurchaseButton size="sm" variant="outline">
                        {t("subscribe")}
                      </TelegramPurchaseButton>
                    )
                  }
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                  const course = item.course;
                  const progress = item.isStarted ? item.progress : 0;
                  const meta = item.isStarted
                    ? item.status === "COMPLETED"
                      ? t("completedBadge")
                      : undefined
                    : t("notStarted");
                  const href = access.hasAccess
                    ? `/dashboard/courses/${course.slug}`
                    : SUBSCRIPTION_PLANS_HREF;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      href={href}
                      meta={meta}
                      progress={progress}
                    />
                  );
                })}
              </div>
            </Show>
          )}
        </AsyncWrapper>
      </LoaderGate>
    </div>
  );
}
