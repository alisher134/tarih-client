"use client";

import { useCallback, useState, useEffect } from "react";

import { useTranslations } from "next-intl";

import type { StudentLessonTest, TestAttempt } from "@/entities/course";
import { getLocalizedApiErrorMessage, isApiErrorCode } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Show } from "@/shared/ui/show";

import {
  createEmptyAnswers,
  hasUnansweredQuestions,
  toggleAnswer,
  toTestAnswers,
  type AnswerMap,
} from "../lib/answers";
import { useSubmitAttempt } from "../model/use-submit-attempt";
import { useTestAttemptDraft } from "../model/use-test-attempt-draft";
import { TestQuestion } from "./test-question";
import { TestTimer } from "./test-timer";

type TestAttemptFormProps = {
  test: StudentLessonTest;
  attempt: TestAttempt;
  onSubmitted: (attempt: TestAttempt) => void;
  onRetryAttempt: () => void;
  isRetrying?: boolean;
};

export function TestAttemptForm({
  test,
  attempt,
  onSubmitted,
  onRetryAttempt,
  isRetrying = false,
}: TestAttemptFormProps) {
  const t = useTranslations("takeTest");
  const tErrors = useTranslations("errors");
  const { mutate, isPending } = useSubmitAttempt();
  const [answers, setAnswers] = useState<AnswerMap>(() =>
    createEmptyAnswers(test),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const router = useRouter();
  const sortedQuestions = [...test.questions].sort(
    (left, right) => left.order - right.order,
  );

  const handleHydrateDraft = useCallback((draftAnswers: AnswerMap) => {
    setAnswers(draftAnswers);
  }, []);

  useEffect(() => {
    if (isPending || isExpired || hasTimedOut || sortedQuestions.length === 0)
      return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      // Check if it's an internal link
      if (
        anchor &&
        anchor.href &&
        !anchor.target &&
        anchor.href.startsWith(window.location.origin)
      ) {
        event.preventDefault();
        event.stopPropagation();
        setPendingNavHref(anchor.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    // Use capture phase to catch the event before next/link does
    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleClick, true);
    };
  }, [hasTimedOut, isExpired, isPending, sortedQuestions.length, t]);

  const { isDraftUnsupported } = useTestAttemptDraft({
    attemptId: attempt.id,
    enabled: !isExpired && !hasTimedOut,
    answers,
    onHydrate: handleHydrateDraft,
  });

  const submitAnswers = useCallback(
    (nextAnswers: AnswerMap, options?: { force?: boolean }) => {
      if (isPending || isExpired || hasTimedOut) return;

      setSubmitError(null);

      if (!options?.force && hasUnansweredQuestions(test, nextAnswers)) {
        setSubmitError(t("errors.unanswered"));
        return;
      }

      setIsExpired(true);

      mutate(
        { attemptId: attempt.id, answers: toTestAnswers(nextAnswers) },
        {
          onSuccess: onSubmitted,
          onError: (error) => {
            if (isApiErrorCode(error, "TEST_TIME_LIMIT_EXCEEDED")) {
              setHasTimedOut(true);
              setIsExpired(true);
              setSubmitError(tErrors("apiCodes.TEST_TIME_LIMIT_EXCEEDED"));
              return;
            }

            setIsExpired(false);
            setSubmitError(
              getLocalizedApiErrorMessage(
                error,
                (code) => tErrors(`apiCodes.${code}`),
                t("errors.submitFailed"),
              ),
            );
          },
        },
      );
    },
    [
      attempt.id,
      hasTimedOut,
      isExpired,
      isPending,
      mutate,
      onSubmitted,
      t,
      tErrors,
      test,
    ],
  );

  const handleSubmit = useCallback(() => {
    submitAnswers(answers);
  }, [answers, submitAnswers]);

  const handleExpire = useCallback(() => {
    submitAnswers(answers, { force: true });
  }, [answers, submitAnswers]);

  return (
    <div className="flex flex-col gap-6">
      <Show when={test.timeLimit != null && !isExpired && !hasTimedOut}>
        <TestTimer
          startedAt={attempt.startedAt}
          timeLimit={test.timeLimit ?? 0}
          onExpire={handleExpire}
        />
      </Show>

      <Show when={hasTimedOut}>
        <p className="text-sm text-muted-foreground">{t("timeExpiredRetry")}</p>
        <Button
          type="button"
          variant="outline"
          className="self-start"
          disabled={isRetrying}
          onClick={onRetryAttempt}
        >
          {t("startNewAttempt")}
        </Button>
      </Show>

      <Show when={isExpired && isPending && !hasTimedOut}>
        <p className="text-sm text-muted-foreground">{t("timeExpired")}</p>
      </Show>

      <Show when={submitError != null}>
        <ErrorAlert errorMessage={submitError!} />
      </Show>

      <Show when={isDraftUnsupported}>
        <p className="text-sm text-muted-foreground">{t("refreshWarning")}</p>
      </Show>

      <Show
        when={sortedQuestions.length > 0}
        fallback={<EmptyState title={t("empty")} />}
      >
        <div className="flex flex-col gap-4">
          {sortedQuestions.map((question) => (
            <TestQuestion
              key={question.id}
              question={question}
              selectedIds={answers[question.id] ?? []}
              disabled={isExpired || isPending || hasTimedOut}
              onToggle={(optionId) => {
                setAnswers((current) => ({
                  ...current,
                  [question.id]: toggleAnswer(
                    question,
                    optionId,
                    current[question.id] ?? [],
                  ),
                }));
              }}
            />
          ))}
        </div>
      </Show>

      <Show when={!hasTimedOut}>
        <Button
          type="button"
          className="self-end"
          disabled={isPending || isExpired || sortedQuestions.length === 0}
          onClick={handleSubmit}
        >
          {t("submit")}
        </Button>
      </Show>

      <Dialog
        open={pendingNavHref != null}
        onOpenChange={(open) => {
          if (!open) setPendingNavHref(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("confirmLeaveTitle") ?? "Предупреждение"}
            </DialogTitle>
            <DialogDescription>{t("confirmLeave")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3 sm:gap-3">
            <DialogClose render={<Button variant="outline" />}>
              {t("cancelLeave") ?? "Остаться"}
            </DialogClose>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                if (pendingNavHref) {
                  router.push(pendingNavHref);
                }
              }}
            >
              {t("confirmLeaveAction") ?? "Покинуть страницу"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
