"use client";

import { useTranslations } from "next-intl";

import { LearningAccessNotice } from "@/features/courses/ui/learning-access-notice";
import {
  SubscriptionRequiredNotice,
  TelegramPurchaseButton,
} from "@/features/subscription";
import { getErrorMessage } from "@/shared/api";
import { isSubscriptionRequiredError } from "@/shared/lib/is-subscription-required-error";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { ErrorPageElement } from "@/shared/ui/error-page-element";
import { LinkButton } from "@/shared/ui/link-button";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";
import { PageTitle } from "@/shared/ui/page-title";
import { Show } from "@/shared/ui/show";

import { useLessonMaterials } from "../model/use-lesson-materials";
import { useLessonPage } from "../model/use-lesson-page";
import { useLessonProgress } from "../model/use-lesson-progress";
import { useSerializedLessonProgress } from "../model/use-serialized-lesson-progress";
import { LessonMaterials } from "./lesson-materials";
import { LessonPlayback } from "./lesson-playback";
import { LessonPlayerActions } from "./lesson-player-actions";

type LessonPlayerProps = {
  slug: string;
  lessonId: string;
};

export function LessonPlayer({ slug, lessonId }: LessonPlayerProps) {
  const t = useTranslations("lessonPlayer");
  const tCourses = useTranslations("courses");
  const tSidebar = useTranslations("dashboardSidebar");
  const lessonPage = useLessonPage(slug, lessonId);
  const progressQuery = useLessonProgress(lessonId, lessonPage.canAccess);
  const { saveProgress, flushProgress, saveError, retryLastSave } =
    useSerializedLessonProgress(lessonId);
  const materialsQuery = useLessonMaterials(lessonId, {
    enabled: lessonPage.canAccess,
  });
  const lessonProgress =
    progressQuery.isError || progressQuery.isLoading
      ? null
      : (progressQuery.data ?? null);

  return (
    <LearningAccessNotice
      isLoading={lessonPage.isAccessLoading}
      isError={lessonPage.isAccessError}
      isAccessDenied={lessonPage.isAccessDenied}
      error={lessonPage.accessError}
      onRetry={() => {
        lessonPage.refetchSubscription();
      }}
      deniedSlot={
        <EmptyState
          title={t("noSubscriptionTitle")}
          description={t("noSubscriptionDescription")}
          action={
            <TelegramPurchaseButton>
              {t("getSubscription")}
            </TelegramPurchaseButton>
          }
        />
      }
    >
      <AsyncWrapper
        isLoading={lessonPage.isLoading}
        isError={lessonPage.isError}
        data={lessonPage.lesson}
        errorSlot={
          <ErrorPageElement
            layout="inline"
            title={t("errors.loadFailed")}
            description={getErrorMessage(
              lessonPage.error,
              t("errors.loadFailed"),
            )}
            retryLabel={tCourses("retry")}
            onRetry={() => {
              lessonPage.refetchCourse();
              lessonPage.refetchSubscription();
            }}
          />
        }
      >
        {(currentLesson) => (
          <div className="flex flex-col gap-6">
            <PageBreadcrumbs
              items={[
                {
                  label: tSidebar("allCourses"),
                  href: "/dashboard/courses",
                },
                {
                  label: lessonPage.course?.title ?? t("courseFallback"),
                  href: `/dashboard/courses/${slug}`,
                },
                { label: currentLesson.title },
              ]}
            />

            <div className="flex flex-col gap-2">
              <PageTitle>{currentLesson.title}</PageTitle>
              <Show when={lessonProgress?.completed === true}>
                <p className="text-sm text-muted-foreground">
                  {t("completed")}
                </p>
              </Show>
              <Show when={progressQuery.isError}>
                <div className="flex flex-col gap-2">
                  <ErrorAlert
                    errorMessage={getErrorMessage(
                      progressQuery.error,
                      t("errors.progressFailed"),
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={() => {
                      void progressQuery.refetch();
                    }}
                  >
                    {tCourses("retry")}
                  </Button>
                </div>
              </Show>
              <Show when={saveError != null}>
                <div className="flex flex-col gap-2">
                  <ErrorAlert errorMessage={saveError!} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={() => {
                      retryLastSave();
                    }}
                  >
                    {tCourses("retry")}
                  </Button>
                </div>
              </Show>
            </div>

            <Show
              when={!currentLesson.isLocked}
              fallback={
                <div className="flex flex-col gap-2">
                  <ErrorAlert errorMessage={t("errors.lessonLocked")} />
                  <LinkButton
                    href={`/dashboard/courses/${slug}`}
                    variant="outline"
                    size="sm"
                    className="self-start"
                  >
                    {tCourses("backToCourse")}
                  </LinkButton>
                </div>
              }
            >
              <LessonPlayback
                lessonId={lessonId}
                canAccess={lessonPage.canAccess}
                progress={lessonProgress}
                saveProgress={saveProgress}
                flushProgress={flushProgress}
              />

              <Show
                when={
                  currentLesson.description != null &&
                  currentLesson.description.length > 0
                }
              >
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {currentLesson.description}
                </p>
              </Show>

              <AsyncWrapper
                isLoading={materialsQuery.isLoading}
                isError={materialsQuery.isError}
                data={materialsQuery.data}
                errorSlot={
                  isSubscriptionRequiredError(materialsQuery.error) ? (
                    <SubscriptionRequiredNotice />
                  ) : (
                    <ErrorAlert
                      errorMessage={getErrorMessage(
                        materialsQuery.error,
                        t("errors.materialsLoadFailed"),
                      )}
                    />
                  )
                }
              >
                {(materials) => <LessonMaterials materials={materials} />}
              </AsyncWrapper>
            </Show>

            <LessonPlayerActions
              slug={slug}
              currentLesson={currentLesson}
              nextLesson={lessonPage.nextLesson}
              isVideoCompleted={lessonProgress?.completed === true}
            />
          </div>
        )}
      </AsyncWrapper>
    </LearningAccessNotice>
  );
}
