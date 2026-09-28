"use client";

import { useTranslations } from "next-intl";

import type { CourseEnrollmentStatus } from "@/entities/course";
import {
  getCourseNextActionLabelKey,
  getLearningNextActionHref,
  type LearningNextAction,
} from "@/entities/learning";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";

type CourseNextActionCtaProps = {
  courseSlug: string;
  enrollmentStatus: CourseEnrollmentStatus | null | undefined;
  nextAction: LearningNextAction | null | undefined;
  canAccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

export function CourseNextActionCta({
  courseSlug,
  enrollmentStatus,
  nextAction,
  canAccess,
  isLoading,
  isError,
  error,
  onRetry,
}: CourseNextActionCtaProps) {
  const t = useTranslations("courses");
  const tErrors = useTranslations("errors");

  if (isLoading) {
    return (
      <Button type="button" size="sm" disabled>
        …
      </Button>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2 md:items-end">
        <ErrorAlert
          errorMessage={getLocalizedApiErrorMessage(
            error,
            (code) => tErrors(`apiCodes.${code}`),
            t("errors.learningSummaryLoadFailed"),
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start md:self-end"
          onClick={() => {
            onRetry();
          }}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (nextAction === undefined) return null;

  if (nextAction == null) {
    if (enrollmentStatus === "COMPLETED") {
      return (
        <LinkButton href={`/dashboard/courses/${courseSlug}`} size="sm">
          {t("openCourse")}
        </LinkButton>
      );
    }

    return <p className="text-sm font-medium">{t("courseCompleted")}</p>;
  }

  return (
    <LinkButton
      href={
        canAccess
          ? getLearningNextActionHref(courseSlug, nextAction)
          : SUBSCRIPTION_PLANS_HREF
      }
      size="sm"
    >
      {canAccess ? t(getCourseNextActionLabelKey(nextAction)) : t("viewPlans")}
    </LinkButton>
  );
}
