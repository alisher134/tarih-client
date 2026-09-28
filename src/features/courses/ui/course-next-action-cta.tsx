"use client";

import { cn } from "cn";
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
  className?: string;
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
  className,
}: CourseNextActionCtaProps) {
  const t = useTranslations("courses");
  const tErrors = useTranslations("errors");

  if (isLoading) {
    return (
      <Button
        type="button"
        size="default"
        disabled
        className={cn("w-full", className)}
      >
        …
      </Button>
    );
  }

  if (isError) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
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
          className="self-start"
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
        <LinkButton
          href={`/dashboard/courses/${courseSlug}`}
          size="default"
          className={cn("w-full", className)}
        >
          {t("openCourse")}
        </LinkButton>
      );
    }

    return (
      <p className="text-center text-sm font-medium">{t("courseCompleted")}</p>
    );
  }

  return (
    <LinkButton
      href={
        canAccess
          ? getLearningNextActionHref(courseSlug, nextAction)
          : SUBSCRIPTION_PLANS_HREF
      }
      size="default"
      className={cn("w-full", className)}
    >
      {canAccess ? t(getCourseNextActionLabelKey(nextAction)) : t("viewPlans")}
    </LinkButton>
  );
}
