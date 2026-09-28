"use client";

import { PlayCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useLearningAccess } from "@/features/courses";
import { TelegramPurchaseButton } from "@/features/subscription";
import { getErrorMessage, getLocalizedApiErrorMessage } from "@/shared/api";
import { formatDuration } from "@/shared/lib/format-duration";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { Progress, ProgressLabel, ProgressValue } from "@/shared/ui/progress";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";

import {
  getContinueActionLabelKey,
  getContinueLearningHref,
} from "../lib/continue-learning";
import { useContinueLearning } from "../model/use-continue-learning";

export function ContinueLearningCard() {
  const t = useTranslations("dashboardAnalytics");
  const tErrors = useTranslations("errors");
  const tCourses = useTranslations("courses");
  const access = useLearningAccess();
  const canFetchContinue = access.hasAccess && !access.isLoading;
  const { data, isLoading, isError, isSuccess, error } = useContinueLearning({
    enabled: canFetchContinue,
  });

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading description={t("continue.description")}>
        {t("continue.title")}
      </SectionHeading>

      <Show when={access.isError}>
        <div className="flex flex-col gap-2">
          <ErrorAlert
            errorMessage={getLocalizedApiErrorMessage(
              access.error,
              (code) => tErrors(`apiCodes.${code}`),
              tCourses("errors.subscriptionLoadFailed"),
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
            {tCourses("retry")}
          </Button>
        </div>
      </Show>

      <LoaderGate isLoading={access.isLoading}>
        <Show
          when={access.isAccessDenied}
          fallback={
            <AsyncWrapper
              isLoading={isLoading}
              isError={isError}
              data={isSuccess ? { continueLearning: data } : undefined}
              errorSlot={
                <ErrorAlert
                  errorMessage={getErrorMessage(error, t("errors.loadFailed"))}
                />
              }
            >
              {({ continueLearning }) => (
                <Show
                  when={continueLearning != null}
                  data={continueLearning}
                  fallback={
                    <EmptyState
                      title={t("continue.emptyTitle")}
                      description={t("continue.empty")}
                      action={
                        <LinkButton
                          href="/dashboard/courses"
                          variant="outline"
                          size="sm"
                        >
                          {t("continue.browseCourses")}
                        </LinkButton>
                      }
                    />
                  }
                >
                  {(item) => {
                    if (item == null) return null;

                    return (
                      <div className="flex flex-col gap-4 rounded-xl border p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <PlayCircleIcon
                              className="size-5 text-primary"
                              aria-hidden
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground">
                              {item.course.title}
                            </p>
                            <p className="font-medium">{item.lesson.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {t("continue.watched", {
                                watched: formatDuration(
                                  item.lesson.watchedSeconds,
                                ),
                                total: formatDuration(
                                  item.lesson.videoDuration,
                                ),
                              })}
                            </p>
                          </div>
                        </div>

                        <Progress
                          value={item.course.progress}
                          className="w-full"
                        >
                          <ProgressLabel>
                            {t("continue.progress")}
                          </ProgressLabel>
                          <ProgressValue />
                        </Progress>

                        <LinkButton
                          href={getContinueLearningHref(
                            item.course.slug,
                            item.nextAction,
                          )}
                          className="w-full sm:w-fit"
                        >
                          {t(getContinueActionLabelKey(item.nextAction))}
                        </LinkButton>
                      </div>
                    );
                  }}
                </Show>
              )}
            </AsyncWrapper>
          }
        >
          <EmptyState
            title={t("continue.noAccessTitle")}
            description={t("continue.noAccessDescription")}
            action={
              <TelegramPurchaseButton size="sm" variant="outline">
                {t("continue.renewSubscription")}
              </TelegramPurchaseButton>
            }
          />
        </Show>
      </LoaderGate>
    </section>
  );
}
