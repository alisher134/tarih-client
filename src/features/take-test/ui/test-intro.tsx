"use client";

import {
  AlertCircleIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
  FileQuestionIcon,
  PlayIcon,
  TargetIcon,
  TimerIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { StudentLessonTest } from "@/entities/course";
import { formatDuration } from "@/shared/lib/format-duration";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";
import { cn } from "cn";

type TestIntroProps = {
  test: StudentLessonTest;
  onStart: () => void;
  isStarting: boolean;
  isCompleted?: boolean;
  courseHref?: string;
};

export function TestIntro({
  test,
  onStart,
  isStarting,
  isCompleted = false,
  courseHref,
}: TestIntroProps) {
  const t = useTranslations("takeTest");
  const questionsCount = test.questions.length;

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6">
        {/* Header: Title and Description */}
        <div className="flex items-start gap-3.5 border-b pb-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheckIcon className="size-6" aria-hidden />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {t("rulesTitle")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("rulesDescription")}
            </p>
          </div>
        </div>

        {/* Test Parameters Grid */}
        <div
          className={cn(
            "grid gap-3 sm:grid-cols-2",
            test.timeLimit != null && "lg:grid-cols-3",
          )}
        >
          {/* Passing Score */}
          <div className="flex flex-col justify-between gap-2 rounded-xl border p-4 bg-card">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TargetIcon className="size-4" aria-hidden />
              <span className="text-sm">{t("passingScore")}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {test.passingScore}%
            </p>
          </div>

          {/* Questions Count */}
          <div className="flex flex-col justify-between gap-2 rounded-xl border p-4 bg-card">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileQuestionIcon className="size-4" aria-hidden />
              <span className="text-sm">{t("questionsCount")}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {questionsCount}
            </p>
          </div>

          {/* Time Limit */}
          <Show when={test.timeLimit != null}>
            <div className="flex flex-col justify-between gap-2 rounded-xl border p-4 bg-card">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TimerIcon className="size-4" aria-hidden />
                <span className="text-sm">{t("timeLimit")}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {formatDuration(test.timeLimit ?? 0)}
              </p>
            </div>
          </Show>
        </div>

        {/* Warning / Notice */}
        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
          <AlertCircleIcon
            className="size-5 shrink-0 text-muted-foreground mt-0.5"
            aria-hidden
          />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("refreshWarning")}
          </p>
        </div>

        {/* Actions */}
        <Show
          when={!isCompleted && test.latestAttempt?.completedAt == null}
          fallback={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ClipboardCheckIcon className="size-4" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {t("testAlreadyCompleted")}
                  </p>
                </div>
              </div>

              {courseHref && (
                <LinkButton href={courseHref} variant="outline">
                  {t("backToCourse")}
                </LinkButton>
              )}
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={isStarting || questionsCount === 0}
              onClick={onStart}
            >
              <PlayIcon className="size-4 mr-1.5" aria-hidden />
              {t("startAttempt")}
            </Button>

            {courseHref && (
              <LinkButton href={courseHref} variant="outline">
                <BookOpenIcon className="size-4 mr-1.5" aria-hidden />
                {t("backToCourse")}
              </LinkButton>
            )}
          </div>
        </Show>
      </CardContent>
    </Card>
  );
}
