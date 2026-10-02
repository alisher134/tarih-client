"use client";

import {
  CheckCircle2Icon,
  CheckIcon,
  ClockIcon,
  HistoryIcon,
  RotateCcwIcon,
  TargetIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { PracticeSubmitResult } from "@/entities/practice";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "cn";

type PracticeResultViewProps = {
  result: PracticeSubmitResult;
  onTryAgain: () => void;
  onChooseOther: () => void;
  onViewHistory: () => void;
};

export function PracticeResultView({
  result,
  onTryAgain,
  onChooseOther,
  onViewHistory,
}: PracticeResultViewProps) {
  const t = useTranslations("practice");
  const isGood = result.score >= 70;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} сек`;
    return `${mins} мин ${secs} сек`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Top Result Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6 flex flex-col items-center text-center gap-6">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-2xl",
              isGood
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {isGood ? (
              <CheckCircle2Icon className="size-10" />
            ) : (
              <XCircleIcon className="size-10" />
            )}
          </div>

          <div className="space-y-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                isGood
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {isGood ? t("result.passedBadge") : t("result.failedBadge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {result.score}%
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("result.correctAnswers", {
                correct: result.correctAnswers,
                total: result.totalQuestions,
              })}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm border-y py-3">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">
                {t("result.scoreLabel")}
              </span>
              <span className="font-semibold text-sm">
                {result.earnedPoints} / {result.totalPoints} б.
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ClockIcon className="size-3" />
                Время
              </span>
              <span className="font-semibold text-sm">
                {formatTime(result.session.timeSpentSeconds)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <Button
              type="button"
              onClick={onTryAgain}
              className="rounded-xl px-5"
            >
              <RotateCcwIcon className="size-4 mr-2" />
              {t("result.tryAgain")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onChooseOther}
              className="rounded-xl px-5"
            >
              <TargetIcon className="size-4 mr-2" />
              {t("result.chooseOther")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onViewHistory}
              className="rounded-xl px-4 text-muted-foreground"
            >
              <HistoryIcon className="size-4 mr-1.5" />
              {t("result.viewHistory")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Breakdown / Detailed Review */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold tracking-tight">
          {t("result.reviewTitle")}
        </h3>

        <div className="flex flex-col gap-4">
          {result.questionResults.map((q, idx) => {
            const isCorrect = q.isCorrect;

            return (
              <Card
                key={q.questionId}
                className={cn(
                  "border-l-4 shadow-sm",
                  isCorrect ? "border-l-emerald-500" : "border-l-destructive",
                )}
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold mt-0.5",
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {isCorrect ? (
                          <CheckIcon className="size-3.5 stroke-[3]" />
                        ) : (
                          <XIcon className="size-3.5 stroke-[3]" />
                        )}
                      </span>

                      <div>
                        <span className="text-xs text-muted-foreground font-medium">
                          Сұрақ {idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-semibold text-foreground mt-0.5">
                          {q.questionText}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "text-xs font-medium shrink-0 rounded-md px-2 py-0.5",
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {isCorrect ? t("result.correct") : t("result.incorrect")}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2 pl-8">
                    {q.options.map((opt) => {
                      const isSelected = q.selectedOptionIds.includes(opt.id);
                      const isRightOption = opt.isCorrect;

                      let optStateClass =
                        "border-border bg-card text-muted-foreground";

                      if (isRightOption) {
                        optStateClass =
                          "border-emerald-500/40 bg-emerald-500/10 text-foreground font-medium";
                      } else if (isSelected && !isRightOption) {
                        optStateClass =
                          "border-destructive/40 bg-destructive/10 text-destructive";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-3 text-xs sm:text-sm",
                            optStateClass,
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {isSelected && (
                              <span className="size-1.5 rounded-full bg-current" />
                            )}
                            <span>{opt.text}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            {isRightOption && (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {t("result.correctAnswer")}
                              </span>
                            )}
                            {isSelected && !isRightOption && (
                              <span className="text-destructive">
                                {t("result.yourAnswer")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
