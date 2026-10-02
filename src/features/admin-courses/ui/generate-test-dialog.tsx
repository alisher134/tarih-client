"use client";

import { useState } from "react";
import { Check, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { createQuestion } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { useGenerateTest } from "@/shared/hooks/use-generate-test";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import type {
  GeneratedTestQuestion,
  GenerateTestRequest,
} from "@/shared/lib/generate-test";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Show } from "@/shared/ui/show";
import { Spinner } from "@/shared/ui/spinner";
import { showErrorToast, showSuccessToast } from "@/shared/utils";

import { useInvalidateAdminCourse } from "../model/use-invalidate-admin-course";

type GenerateTestDialogProps = {
  courseId: string;
  testId: string;
  nextOrder: number;
  existingQuestions?: string[];
  copyParent?: GenerateCopyParent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SelectableQuestion = GeneratedTestQuestion & {
  selected: boolean;
};

const COUNT_OPTIONS = [3, 5, 8, 10] as const;

export function GenerateTestDialog({
  courseId,
  testId,
  nextOrder,
  existingQuestions = [],
  copyParent,
  open,
  onOpenChange,
}: GenerateTestDialogProps) {
  const t = useTranslations("adminCourses");
  const locale = useLocale();
  const invalidate = useInvalidateAdminCourse(courseId, testId);

  const [count, setCount] = useState<number>(5);
  const [questionType, setQuestionType] =
    useState<GenerateTestRequest["questionType"]>("MIXED");
  const [topicHint, setTopicHint] = useState("");
  const [questions, setQuestions] = useState<SelectableQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { mutate: runGenerateTest, isPending } = useGenerateTest();

  const handleGenerate = () => {
    const targetLocale = locale === "kz" ? "kz" : "ru";

    runGenerateTest(
      {
        courseTitle: copyParent?.courseTitle,
        courseDescription: copyParent?.courseDescription,
        lessonTitle: copyParent?.lessonTitle,
        lessonDescription: copyParent?.lessonDescription,
        testTitle: copyParent?.testTitle,
        testDescription: copyParent?.testDescription,
        count,
        questionType,
        topicHint: topicHint.trim() || undefined,
        locale: targetLocale,
        existingQuestions,
      },
      {
        onSuccess: (data) => {
          setQuestions(
            data.questions.map((q) => ({
              ...q,
              selected: true,
            })),
          );
          showSuccessToast(t("generateCopySuccess"));
        },
        onError: (err) => {
          showErrorToast(getErrorMessage(err, t("generateCopyFailed")));
        },
      },
    );
  };

  const handleToggleQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected: !q.selected } : q)),
    );
  };

  const handleUpdateQuestionText = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q)),
    );
  };

  const selectedCount = questions.filter((q) => q.selected).length;

  const handleSaveToTest = async () => {
    const toSave = questions.filter((q) => q.selected);
    if (toSave.length === 0) {
      showErrorToast(t("noQuestionsSelected"));
      return;
    }

    try {
      setIsSaving(true);
      for (let i = 0; i < toSave.length; i++) {
        const item = toSave[i];
        await createQuestion(testId, {
          text: item.text,
          type: item.type,
          points: item.points ?? 1,
          order: nextOrder + i,
          options: item.options.map((opt, optIndex) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: optIndex,
          })),
        });
      }

      invalidate();
      showSuccessToast(t("successBulkAdded", { count: toSave.length }));
      onOpenChange(false);
      setQuestions([]);
      setTopicHint("");
    } catch (err) {
      showErrorToast(getErrorMessage(err, t("errors.createFailed")));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (!isSaving && !isPending) {
      onOpenChange(nextOpen);
      if (!nextOpen) {
        setQuestions([]);
      }
    }
  };

  const hasContext = Boolean(
    copyParent?.courseTitle || copyParent?.lessonTitle,
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <DialogTitle>{t("generateBulkTestTitle")}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("generateBulkTestDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <Show
            when={questions.length === 0}
            fallback={
              <QuestionsReviewSection
                questions={questions}
                selectedCount={selectedCount}
                isPending={isPending}
                isSaving={isSaving}
                onRegenerate={handleGenerate}
                onToggleQuestion={handleToggleQuestion}
                onUpdateText={handleUpdateQuestionText}
                regenerateLabel={t("regenerateQuestionsAction")}
              />
            }
          >
            <div className="space-y-4">
              <Show when={hasContext}>
                <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1 border">
                  <Show when={Boolean(copyParent?.courseTitle)}>
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Курс:{" "}
                      </span>
                      <span>{copyParent?.courseTitle}</span>
                    </div>
                  </Show>
                  <Show when={Boolean(copyParent?.lessonTitle)}>
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Урок:{" "}
                      </span>
                      <span>{copyParent?.lessonTitle}</span>
                    </div>
                  </Show>
                </div>
              </Show>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("questionsCount")}
                </Label>
                <div className="flex gap-2">
                  {COUNT_OPTIONS.map((opt) => (
                    <Button
                      key={opt}
                      type="button"
                      variant={count === opt ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCount(opt)}
                      className="flex-1"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("questionType")}
                </Label>
                <select
                  value={questionType}
                  onChange={(e) =>
                    setQuestionType(
                      e.target.value as GenerateTestRequest["questionType"],
                    )
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="MIXED">{t("typeMixed")}</option>
                  <option value="SINGLE_CHOICE">{t("typeSingleChoice")}</option>
                  <option value="MULTIPLE_CHOICE">
                    {t("typeMultipleChoice")}
                  </option>
                  <option value="TRUE_FALSE">{t("typeTrueFalse")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("topicHintLabel")}
                </Label>
                <Input
                  value={topicHint}
                  onChange={(e) => setTopicHint(e.target.value)}
                  placeholder={t("topicHintPlaceholder")}
                  disabled={isPending}
                />
              </div>

              <Show when={isPending}>
                <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
                  <Spinner className="size-8 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {t("bulkGenerating")}
                  </p>
                </div>
              </Show>
            </div>
          </Show>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSaving || isPending}
          >
            {t("cancel")}
          </Button>

          <Show
            when={questions.length === 0}
            fallback={
              <Button
                type="button"
                onClick={handleSaveToTest}
                disabled={isSaving || isPending || selectedCount === 0}
                className="gap-2"
              >
                <Show when={isSaving} fallback={<Check className="size-4" />}>
                  <Spinner className="size-4" />
                </Show>
                <Show
                  when={isSaving}
                  fallback={t("addSelectedToTest", { count: selectedCount })}
                >
                  {t("bulkSaving")}
                </Show>
              </Button>
            }
          >
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isPending}
              className="gap-2"
            >
              <Show when={isPending} fallback={<Sparkles className="size-4" />}>
                <Spinner className="size-4" />
              </Show>
              <Show when={isPending} fallback={t("generateQuestionsAction")}>
                {t("generateCopy")}...
              </Show>
            </Button>
          </Show>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type QuestionsReviewSectionProps = {
  questions: SelectableQuestion[];
  selectedCount: number;
  isPending: boolean;
  isSaving: boolean;
  onRegenerate: () => void;
  onToggleQuestion: (index: number) => void;
  onUpdateText: (index: number, text: string) => void;
  regenerateLabel: string;
};

function QuestionsReviewSection({
  questions,
  selectedCount,
  isPending,
  isSaving,
  onRegenerate,
  onToggleQuestion,
  onUpdateText,
  regenerateLabel,
}: QuestionsReviewSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="text-sm font-semibold text-foreground">
          Готово вопросов: {questions.length} (выбрано: {selectedCount})
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          disabled={isPending || isSaving}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Show when={isPending} fallback={<RotateCcw className="size-3" />}>
            <Spinner className="size-3" />
          </Show>
          {regenerateLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {questions.map((question, qIdx) => (
          <div
            key={qIdx}
            className={`rounded-xl border p-4 transition-all duration-200 ${
              question.selected
                ? "border-primary/40 bg-card shadow-sm"
                : "border-border/60 bg-muted/20 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={question.selected}
                onChange={() => onToggleQuestion(qIdx)}
                className="mt-1 size-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                id={`q-${qIdx}`}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-primary">
                    Вопрос #{qIdx + 1}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {question.type === "SINGLE_CHOICE"
                      ? "1 ответ"
                      : question.type === "MULTIPLE_CHOICE"
                        ? "Множеств."
                        : "Правда/Ложь"}
                  </span>
                </div>

                <Input
                  value={question.text}
                  onChange={(e) => onUpdateText(qIdx, e.target.value)}
                  className="font-medium text-sm"
                />

                <div className="grid gap-1.5 pt-1 sm:grid-cols-2">
                  {question.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium border ${
                        opt.isCorrect
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-muted/40 text-muted-foreground border-border/40"
                      }`}
                    >
                      <Show
                        when={opt.isCorrect}
                        fallback={
                          <span className="size-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                        }
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      </Show>
                      <span className="truncate">{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
