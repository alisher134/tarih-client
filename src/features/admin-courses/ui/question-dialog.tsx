"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import type { Question } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createQuestionSchema,
  type QuestionFormValues,
} from "../model/question-schema";
import { useSaveQuestion } from "../model/use-save-question";
import { QuestionDialogFields } from "./question-dialog-fields";

type QuestionDialogProps = {
  courseId: string;
  testId: string;
  question?: Question;
  nextOrder: number;
  copyParent?: GenerateCopyParent;
  existingQuestions?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuestionDialog({
  courseId,
  testId,
  question,
  nextOrder,
  copyParent,
  existingQuestions,
  open,
  onOpenChange,
}: QuestionDialogProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useSaveQuestion(courseId, testId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createQuestionSchema(t), {
    defaultValues: toQuestionValues(question),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) return;

    form.reset(toQuestionValues(question));
    setSubmitError(null);
  };

  const handleSave = (values: QuestionFormValues) => {
    setSubmitError(null);

    mutate(
      {
        questionId: question?.id,
        values: {
          text: values.text,
          type: values.type,
          points: values.points,
          order: question?.order ?? nextOrder,
          options: values.options.map((option, index) => ({
            ...option,
            order: index,
          })),
        },
      },
      {
        onSuccess: () => {
          showSuccessToast(t("successQuestionSave"));
          onOpenChange(false);
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, t("errors.updateFailed")));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {question == null ? t("addQuestion") : t("editQuestion")}
          </DialogTitle>
        </DialogHeader>

        <Show when={submitError != null}>
          <ErrorAlert errorMessage={submitError!} />
        </Show>

        <AppForm
          form={form}
          onSubmit={handleSave}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          {(dialogForm) => (
            <>
              <QuestionDialogFields
                form={dialogForm}
                copyParent={copyParent}
                existingQuestions={existingQuestions}
              />
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  {t("cancel")}
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {t("save")}
                </Button>
              </DialogFooter>
            </>
          )}
        </AppForm>
      </DialogContent>
    </Dialog>
  );
}

function toQuestionValues(question?: Question): QuestionFormValues {
  if (question == null) {
    return {
      text: "",
      type: "SINGLE_CHOICE",
      points: 1,
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
    };
  }

  return {
    text: question.text,
    type: question.type,
    points: question.points,
    options: question.options.map((option) => ({
      text: option.text,
      isCorrect: option.isCorrect === true,
    })),
  };
}
