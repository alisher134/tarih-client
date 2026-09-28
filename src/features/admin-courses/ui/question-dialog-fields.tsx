"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { InputField } from "@/shared/ui/input-field";
import { SelectField } from "@/shared/ui/select-field";
import { Show } from "@/shared/ui/show";
import { TextareaField } from "@/shared/ui/textarea-field";

import type { QuestionFormValues } from "../model/question-schema";
import { GENERATED_COPY_OPTIONS } from "./admin-copy-fields";
import { GenerateCopyButton } from "./generate-copy-button";
import { QuestionOptionsEditor } from "./question-options-editor";

type QuestionDialogFieldsProps = {
  form: UseFormReturn<QuestionFormValues>;
  copyParent?: GenerateCopyParent;
  existingQuestions?: string[];
};

export function QuestionDialogFields({
  form,
  copyParent,
  existingQuestions,
}: QuestionDialogFieldsProps) {
  const t = useTranslations("adminCourses");
  const { register, setValue, watch, control, formState } = form;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      <TextareaField
        label={t("questionText")}
        error={formState.errors.text?.message}
        action={
          <GenerateCopyButton
            entity="question"
            field="questionText"
            title={watch("text")}
            description=""
            parent={{
              ...copyParent,
              questionType: watch("type"),
              questionText: watch("text"),
              optionCount: watch("options").length,
              existingQuestions,
            }}
            onGenerated={(text) =>
              setValue("text", text, GENERATED_COPY_OPTIONS)
            }
            onOptionsGenerated={(options) =>
              setValue("options", options, GENERATED_COPY_OPTIONS)
            }
          />
        }
        {...register("text")}
      />
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <SelectField
          label={t("questionType")}
          {...register("type", {
            onChange: (event) => {
              if (event.target.value === "TRUE_FALSE") {
                setValue("options", [
                  { text: "True", isCorrect: true },
                  { text: "False", isCorrect: false },
                ]);
              }
            },
          })}
        >
          <option value="SINGLE_CHOICE">{t("typeSingle")}</option>
          <option value="MULTIPLE_CHOICE">{t("typeMultiple")}</option>
          <option value="TRUE_FALSE">{t("typeTrueFalse")}</option>
        </SelectField>
        <InputField
          label={t("points")}
          type="number"
          {...register("points", { valueAsNumber: true })}
        />
      </div>
      <QuestionOptionsEditor
        control={control}
        form={form}
        copyParent={copyParent}
        existingQuestions={existingQuestions}
      />
      <Show when={formState.errors.options?.message != null}>
        <ErrorAlert errorMessage={formState.errors.options?.message ?? ""} />
      </Show>
    </div>
  );
}
