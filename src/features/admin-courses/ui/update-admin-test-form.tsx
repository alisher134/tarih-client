"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import type { LessonTest } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { InputField } from "@/shared/ui/input-field";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createTestSchema,
  toOptionalLimit,
  type TestFormValues,
} from "../model/test-schema";
import { useUpdateTest } from "../model/use-update-test";
import { AdminCopyFields, GENERATED_COPY_OPTIONS } from "./admin-copy-fields";

type UpdateAdminTestFormProps = {
  courseId: string;
  test: LessonTest;
  copyParent?: GenerateCopyParent;
};

export function UpdateAdminTestForm({
  courseId,
  test,
  copyParent,
}: UpdateAdminTestFormProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useUpdateTest(courseId, test.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createTestSchema(t), {
    defaultValues: toTestValues(test),
    values: toTestValues(test),
  });
  const { errors } = form.formState;

  const handleSave = (values: TestFormValues) => {
    setSubmitError(null);

    mutate(
      {
        title: values.title,
        description: values.description,
        passingScore: values.passingScore,
        timeLimit: toOptionalLimit(values.timeLimit),
        attemptsLimit: toOptionalLimit(values.attemptsLimit),
      },
      {
        onSuccess: () => {
          showSuccessToast(t("successUpdate"));
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, t("errors.updateFailed")));
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-5">
      <Show when={submitError != null}>
        <ErrorAlert errorMessage={submitError!} />
      </Show>

      <AppForm
        form={form}
        onSubmit={handleSave}
        className="flex flex-col gap-5"
      >
        {({ register, setValue, watch }) => (
          <>
            <AdminCopyFields
              entity="test"
              parent={copyParent}
              title={watch("title")}
              description={watch("description")}
              titleError={errors.title?.message}
              titleRegister={register("title")}
              descriptionRegister={register("description")}
              onTitleGenerated={(text) =>
                setValue("title", text, GENERATED_COPY_OPTIONS)
              }
              onDescriptionGenerated={(text) =>
                setValue("description", text, GENERATED_COPY_OPTIONS)
              }
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <InputField
                label={t("passingScore")}
                type="number"
                error={errors.passingScore?.message}
                {...register("passingScore", { valueAsNumber: true })}
              />
              <InputField
                label={t("timeLimit")}
                type="number"
                placeholder={t("unlimited")}
                {...register("timeLimit")}
              />
              <InputField
                label={t("attemptsLimit")}
                type="number"
                placeholder={t("unlimited")}
                {...register("attemptsLimit")}
              />
            </div>
            <Button type="submit" disabled={isPending} className="self-end">
              {t("save")}
            </Button>
          </>
        )}
      </AppForm>
    </section>
  );
}

function toTestValues(test: LessonTest): TestFormValues {
  return {
    title: test.title,
    description: test.description ?? "",
    passingScore: test.passingScore,
    timeLimit: test.timeLimit == null ? "" : String(test.timeLimit),
    attemptsLimit: test.attemptsLimit == null ? "" : String(test.attemptsLimit),
  };
}
