"use client";

import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  HistoryIcon,
  TargetIcon,
  XCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { usePracticeHistory } from "../model/use-practice-history";
import { Card, CardContent } from "@/shared/ui/card";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { cn } from "cn";

export function PracticeHistoryView() {
  const t = useTranslations("practice");
  const { data: history = [], isLoading } = usePracticeHistory();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} с`;
    return `${mins} м ${secs} с`;
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
      {/* Top summary bar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <HistoryIcon className="size-4 text-primary" />
          <span className="text-sm font-semibold">{t("history.title")}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("history.totalCount", { count: history.length })}
        </span>
      </div>

      {/* History List */}
      <LoaderGate isLoading={isLoading}>
        {history.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <CardContent className="flex flex-col items-center justify-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <HistoryIcon className="size-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("history.empty")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => {
              const isPassed = item.score >= 60;
              const duration = formatDuration(item.timeSpentSeconds);

              return (
                <Card
                  key={item.id}
                  className="transition-all hover:border-primary/40 shadow-sm"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl mt-0.5",
                          isPassed
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {isPassed ? (
                          <CheckCircle2Icon className="size-5" />
                        ) : (
                          <XCircleIcon className="size-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="size-3" />
                            {formatDate(item.createdAt)}
                          </span>

                          {duration && (
                            <span className="flex items-center gap-1">
                              <ClockIcon className="size-3" />
                              {duration}
                            </span>
                          )}

                          {item.correctAnswers != null && (
                            <span className="flex items-center gap-1">
                              <TargetIcon className="size-3" />
                              {t("history.correctRatio", {
                                correct: item.correctAnswers,
                                total: item.totalQuestions,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0">
                      <span className="text-xs text-muted-foreground sm:hidden">
                        Балл:
                      </span>
                      <span
                        className={cn(
                          "text-base sm:text-lg font-bold",
                          isPassed
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive",
                        )}
                      >
                        {item.score}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </LoaderGate>
    </div>
  );
}
