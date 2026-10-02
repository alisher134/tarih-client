"use client";

import { useMemo, useState } from "react";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  SearchIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { PracticeTopicItem } from "@/entities/practice";
import { Button } from "@/shared/ui/button";
import { LinkButton } from "@/shared/ui/link-button";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "cn";

type PracticeTopicSelectorProps = {
  topics: PracticeTopicItem[];
  onStart: (selectedTestIds: string[], questionLimit?: number) => void;
  isLoading?: boolean;
};

const LIMIT_OPTIONS = [5, 10, 15, 20];

export function PracticeTopicSelector({
  topics,
  onStart,
  isLoading = false,
}: PracticeTopicSelectorProps) {
  const t = useTranslations("practice");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    topics.map((item) => item.testId),
  );
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);

  // Filter topics by search query
  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (item) =>
        item.lessonTitle.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q),
    );
  }, [topics, search]);

  // Group topics by course
  const groupedByCourse = useMemo(() => {
    const map = new Map<
      string,
      { courseTitle: string; items: PracticeTopicItem[] }
    >();
    for (const item of filteredTopics) {
      const existing = map.get(item.courseId);
      if (!existing) {
        map.set(item.courseId, {
          courseTitle: item.courseTitle,
          items: [item],
        });
      } else {
        existing.items.push(item);
      }
    }
    return [...map.values()];
  }, [filteredTopics]);

  // Total questions in selected topics
  const totalQuestionsInSelected = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return topics
      .filter((t) => selectedSet.has(t.testId))
      .reduce((sum, t) => sum + t.questionsCount, 0);
  }, [topics, selectedIds]);

  const handleToggle = (testId: string) => {
    setSelectedIds((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId],
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredTopics.map((t) => t.testId));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  if (topics.length === 0) {
    return (
      <Card className="border-dashed py-12 text-center">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpenIcon className="size-7" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight">
              {t("selector.emptyState.title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("selector.emptyState.description")}
            </p>
          </div>
          <LinkButton
            href="/dashboard/courses"
            variant="default"
            className="mt-2"
          >
            {t("selector.emptyState.goToCourses")}
          </LinkButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Control bar: search, select all, deselect all */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("selector.searchPlaceholder")}
            className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="rounded-xl text-xs"
          >
            {t("selector.selectAll")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="rounded-xl text-xs text-muted-foreground"
          >
            {t("selector.clearAll")}
          </Button>
        </div>
      </div>

      {/* Topics list grouped by course */}
      <div className="flex flex-col gap-6">
        {groupedByCourse.map((group) => (
          <div key={group.courseTitle} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpenIcon className="size-3.5" />
              <span>{group.courseTitle}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((topic) => {
                const isSelected = selectedIds.includes(topic.testId);

                return (
                  <button
                    key={topic.testId}
                    type="button"
                    onClick={() => handleToggle(topic.testId)}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/[0.03] shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-muted-foreground">
                          {t("selector.card.questions", {
                            count: topic.questionsCount,
                          })}
                        </span>
                        <h4 className="mt-0.5 font-medium text-sm leading-snug line-clamp-2">
                          {topic.lessonTitle}
                        </h4>
                      </div>

                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 group-hover:border-primary/60",
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2Icon className="size-3.5" />
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t pt-2.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <TrophyIcon className="size-3.5" />
                        <span>
                          {t("selector.card.bestScore", {
                            score: topic.bestScore,
                          })}
                        </span>
                      </div>
                      <span>
                        {t("selector.card.attempts", {
                          count: topic.attemptsCount,
                        })}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-10 mt-4 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-medium text-sm">
              <SparklesIcon className="size-4 text-primary" />
              <span>
                {t("selector.selectedCount", { count: selectedIds.length })}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {t("selector.totalAvailableQuestions", {
                  count: totalQuestionsInSelected,
                })}
              </span>
            </div>

            {/* Questions limit selector */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>{t("selector.questionsLimit")}</span>
              {LIMIT_OPTIONS.filter(
                (limit) => limit < totalQuestionsInSelected,
              ).map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => setQuestionLimit(limit)}
                  className={cn(
                    "rounded-lg px-2 py-0.5 text-xs font-medium transition-colors",
                    questionLimit === limit
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80",
                  )}
                >
                  {limit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setQuestionLimit(null)}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-xs font-medium transition-colors",
                  questionLimit === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80",
                )}
              >
                {t("selector.allQuestions", {
                  count: totalQuestionsInSelected,
                })}
              </button>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            disabled={selectedIds.length === 0 || isLoading}
            onClick={() => onStart(selectedIds, questionLimit ?? undefined)}
            className="w-full sm:w-auto rounded-xl px-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{t("selector.startPractice")}...</span>
              </span>
            ) : (
              t("selector.startPractice")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
