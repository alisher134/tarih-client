"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FlagIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  PracticeAnswerInput,
  PracticeQuestion,
} from "@/entities/practice";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@/shared/config/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { updatePracticeDraftAnswers } from "../model/practice-session-storage";
import { Progress } from "@/shared/ui/progress";
import { cn } from "cn";

type PracticeQuizRunnerProps = {
  questions: PracticeQuestion[];
  initialAnswers?: Record<string, string[]>;
  initialElapsedSeconds?: number;
  onFinish: (answers: PracticeAnswerInput[], timeSpentSeconds: number) => void;
  onQuit?: () => void;
  isSubmitting?: boolean;
};

export function PracticeQuizRunner({
  questions,
  initialAnswers,
  initialElapsedSeconds,
  onFinish,
  onQuit,
  isSubmitting = false,
}: PracticeQuizRunnerProps) {
  const t = useTranslations("practice");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive current question index directly from searchParams (1-indexed: ?question=1 => 0)
  const questionParam = Number(searchParams.get("question"));
  const currentIndex =
    !isNaN(questionParam) &&
    questionParam >= 1 &&
    questionParam <= questions.length
      ? questionParam - 1
      : 0;

  const [answersMap, setAnswersMap] = useState<Map<string, string[]>>(() => {
    const map = new Map<string, string[]>();
    if (initialAnswers) {
      for (const [qId, opts] of Object.entries(initialAnswers)) {
        if (Array.isArray(opts)) {
          map.set(qId, opts);
        }
      }
    }
    return map;
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(
    initialElapsedSeconds ?? 0,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);

  // Enforce valid ?question param in URL
  useEffect(() => {
    const qParam = Number(searchParams.get("question"));
    if (isNaN(qParam) || qParam < 1 || qParam > questions.length) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("question", "1");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [searchParams, questions.length, pathname, router]);

  // Leave / Navigation Guard: prevent accidental navigation or tab closure
  useEffect(() => {
    if (isSubmitting || questions.length === 0) return;

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
  }, [isSubmitting, questions.length]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((sec) => {
        const next = sec + 1;
        if (next % 5 === 0) {
          updatePracticeDraftAnswers(answersMap, next);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [answersMap]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex];
  const selectedOptionIds = answersMap.get(currentQuestion?.id ?? "") ?? [];

  // Count answered questions
  const answeredCount = useMemo(() => {
    let count = 0;
    for (const q of questions) {
      const opts = answersMap.get(q.id);
      if (opts && opts.length > 0) {
        count++;
      }
    }
    return count;
  }, [questions, answersMap]);

  const unansweredCount = questions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    setAnswersMap((prev) => {
      const next = new Map(prev);
      const currentSelected = next.get(currentQuestion.id) ?? [];

      if (currentQuestion.type === "MULTIPLE_CHOICE") {
        if (currentSelected.includes(optionId)) {
          next.set(
            currentQuestion.id,
            currentSelected.filter((id) => id !== optionId),
          );
        } else {
          next.set(currentQuestion.id, [...currentSelected, optionId]);
        }
      } else {
        // Single choice or true/false
        next.set(currentQuestion.id, [optionId]);
      }

      updatePracticeDraftAnswers(next, elapsedSeconds);
      return next;
    });
  };

  const goToQuestion = (nextIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(questions.length - 1, nextIndex));
    const params = new URLSearchParams(searchParams.toString());
    params.set("question", String(clampedIndex + 1));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    } else {
      handleRequestFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const handleRequestFinish = () => {
    if (unansweredCount > 0) {
      setIsConfirmOpen(true);
    } else {
      executeFinish();
    }
  };

  const executeFinish = () => {
    setIsConfirmOpen(false);
    const answers: PracticeAnswerInput[] = questions.map((q) => ({
      questionId: q.id,
      optionIds: answersMap.get(q.id) ?? [],
    }));
    onFinish(answers, elapsedSeconds);
  };

  if (!currentQuestion) return null;

  const isMultiple = currentQuestion.type === "MULTIPLE_CHOICE";

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Quiz Top bar: Progress, Timer, and Finish button */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {t("quiz.questionOf", {
                current: currentIndex + 1,
                total: questions.length,
              })}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {currentQuestion.lessonTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPendingNavHref("QUIT_PRACTICE")}
              className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
            >
              {t("quiz.confirmLeaveAction")}
            </Button>

            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
              <ClockIcon className="size-3.5" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRequestFinish}
              className="rounded-xl text-xs"
            >
              <FlagIcon className="size-3.5 mr-1" />
              {t("quiz.finish")}
            </Button>
          </div>
        </div>

        {/* Linear progress bar */}
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Main Question Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-primary">
              {isMultiple ? t("quiz.multipleChoice") : t("quiz.singleChoice")}
            </span>
            <h3 className="text-lg sm:text-xl font-semibold leading-relaxed">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOptionIds.includes(option.id);
              const letter = String.fromCharCode(65 + optIdx); // A, B, C, D...

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center font-medium text-xs transition-colors",
                      isMultiple ? "rounded-md" : "rounded-full",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border border-muted-foreground/30 text-muted-foreground",
                    )}
                  >
                    {isSelected ? (
                      <CheckIcon className="size-3.5 stroke-[3]" />
                    ) : (
                      letter
                    )}
                  </div>

                  <span className="flex-1 leading-snug">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between border-t pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="rounded-xl"
            >
              <ArrowLeftIcon className="size-4 mr-1.5" />
              {t("quiz.prev")}
            </Button>

            <div className="text-xs text-muted-foreground font-medium hidden sm:block">
              {answeredCount} / {questions.length}{" "}
              {t("result.correct").toLowerCase()}
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              disabled={isSubmitting}
              className="rounded-xl px-5"
            >
              {currentIndex === questions.length - 1 ? (
                t("quiz.finish")
              ) : (
                <>
                  {t("quiz.next")}
                  <ArrowRightIcon className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Jump Map (Question dots) */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col gap-2.5">
        <span className="text-xs font-medium text-muted-foreground">
          Навигация по вопросам:
        </span>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = (answersMap.get(q.id) ?? []).length > 0;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goToQuestion(idx)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-all",
                  isCurrent
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground"
                    : isAnswered
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog on Finish with Unanswered Questions */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex size-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mb-2">
              <AlertTriangleIcon className="size-6" />
            </div>
            <DialogTitle>{t("quiz.confirmFinish")}</DialogTitle>
            <DialogDescription>
              {unansweredCount > 0
                ? t("quiz.unansweredWarning", { count: unansweredCount })
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
            >
              {t("quiz.cancel")}
            </Button>
            <Button
              type="button"
              onClick={executeFinish}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("quiz.submitting") : t("quiz.finish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Confirmation Dialog */}
      <Dialog
        open={pendingNavHref != null}
        onOpenChange={(open) => {
          if (!open) setPendingNavHref(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("quiz.confirmLeaveTitle")}</DialogTitle>
            <DialogDescription>{t("quiz.confirmLeave")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingNavHref(null)}
            >
              {t("quiz.cancelLeave")}
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                const target = pendingNavHref;
                setPendingNavHref(null);
                if (target === "QUIT_PRACTICE") {
                  onQuit?.();
                } else if (target) {
                  router.push(target);
                }
              }}
            >
              {t("quiz.confirmLeaveAction")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
