"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import type { Course } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { InputField } from "@/shared/ui/input-field";
import { SelectField } from "@/shared/ui/select-field";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createCourseSchema,
  type CourseFormValues,
} from "../model/course-schema";
import { useUpdateCourse } from "../model/use-update-course";
import { AdminCopyFields, GENERATED_COPY_OPTIONS } from "./admin-copy-fields";

type UpdateAdminCourseFormProps = {
  course: Course;
};

export function UpdateAdminCourseForm({ course }: UpdateAdminCourseFormProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useUpdateCourse(course.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createCourseSchema(t), {
    defaultValues: toCourseValues(course),
    values: toCourseValues(course),
  });
  const { errors } = form.formState;

  const handleSave = (values: CourseFormValues) => {
    setSubmitError(null);

    mutate(values, {
      onSuccess: () => {
        showSuccessToast(t("successUpdate"));
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error, t("errors.updateFailed")));
      },
    });
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
              entity="course"
              title={watch("title")}
              description={watch("description")}
              titleError={errors.title?.message}
              descriptionError={errors.description?.message}
              titleRegister={register("title")}
              descriptionRegister={register("description")}
              onTitleGenerated={(text) =>
                setValue("title", text, GENERATED_COPY_OPTIONS)
              }
              onDescriptionGenerated={(text) =>
                setValue("description", text, GENERATED_COPY_OPTIONS)
              }
            />
            <InputField
              label={t("slug")}
              error={errors.slug?.message}
              {...register("slug")}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label={t("status")}
                error={errors.status?.message}
                {...register("status")}
              >
                <option value="DRAFT">{t("statusDraft")}</option>
                <option value="PUBLISHED">{t("statusPublished")}</option>
                <option value="ARCHIVED">{t("statusArchived")}</option>
              </SelectField>
              <InputField
                label={t("order")}
                type="number"
                error={errors.order?.message}
                {...register("order", { valueAsNumber: true })}
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

function toCourseValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    description: course.description ?? "",
    slug: course.slug,
    status: course.status,
    order: course.order,
  };
}
