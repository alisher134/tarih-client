"use client";

import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type Control,
  type UseFormReturn,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import type { QuestionType } from "@/entities/course";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { Button } from "@/shared/ui/button";
import { CheckboxField } from "@/shared/ui/checkbox-field";
import { InputField } from "@/shared/ui/input-field";

import type { QuestionFormValues } from "../model/question-schema";
import { GENERATED_COPY_OPTIONS } from "./admin-copy-fields";
import { GenerateCopyButton } from "./generate-copy-button";

type QuestionOptionsEditorProps = {
  control: Control<QuestionFormValues>;
  form: UseFormReturn<QuestionFormValues>;
  copyParent?: GenerateCopyParent;
  existingQuestions?: string[];
};

export function QuestionOptionsEditor({
  control,
  form,
  copyParent,
  existingQuestions,
}: QuestionOptionsEditorProps) {
  const t = useTranslations("adminCourses");
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "options",
  });
  const questionType = useWatch({ control, name: "type" });
  const questionText = useWatch({ control, name: "text" });
  const options = useWatch({ control, name: "options" });

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    if (questionType === "MULTIPLE_CHOICE") {
      form.setValue(`options.${index}.isCorrect`, isCorrect);
      return;
    }

    replace(
      fields.map((field, optionIndex) => ({
        text: form.getValues(`options.${optionIndex}.text`),
        isCorrect: optionIndex === index ? isCorrect : false,
      })),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{t("options")}</p>

      {fields.map((field, index) => {
        const option = form.watch(`options.${index}`);

        return (
          <div key={field.id} className="flex items-end gap-2">
            <InputField
              label={t("optionText")}
              error={form.formState.errors.options?.[index]?.text?.message}
              action={
                <GenerateCopyButton
                  entity="question"
                  field="option"
                  title={option?.text ?? ""}
                  description=""
                  parent={{
                    ...copyParent,
                    questionType,
                    questionText,
                    optionIsCorrect: option?.isCorrect === true,
                    otherOptions: (options ?? [])
                      .filter((_, optionIndex) => optionIndex !== index)
                      .map((item) => item.text),
                    existingQuestions,
                  }}
                  onGenerated={(text) =>
                    form.setValue(
                      `options.${index}.text`,
                      text,
                      GENERATED_COPY_OPTIONS,
                    )
                  }
                />
              }
              {...form.register(`options.${index}.text`)}
            />
            <CheckboxField
              label={t("correct")}
              checked={option?.isCorrect === true}
              onChange={(event) => {
                handleCorrectChange(index, event.target.checked);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("deleteQuestionTitle")}
              onClick={() => remove(index)}
            >
              <TrashIcon aria-hidden />
            </Button>
          </div>
        );
      })}

      <ShowAddOption
        type={questionType}
        onAdd={() => append({ text: "", isCorrect: false })}
        label={t("addOption")}
      />
    </div>
  );
}

type ShowAddOptionProps = {
  type: QuestionType;
  onAdd: () => void;
  label: string;
};

function ShowAddOption({ type, onAdd, label }: ShowAddOptionProps) {
  if (type === "TRUE_FALSE") return null;

  return (
    <Button type="button" variant="outline" onClick={onAdd}>
      {label}
    </Button>
  );
}
