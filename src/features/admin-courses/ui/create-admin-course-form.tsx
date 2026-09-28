"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { slugify } from "@/shared/lib/slugify";
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
import { useCreateCourse } from "../model/use-create-course";
import { AdminCopyFields, GENERATED_COPY_OPTIONS } from "./admin-copy-fields";

export function CreateAdminCourseForm() {
  const t = useTranslations("adminCourses");
  const router = useRouter();
  const { mutate, isPending } = useCreateCourse();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createCourseSchema(t), {
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      status: "DRAFT",
      order: 0,
    } satisfies CourseFormValues,
  });
  const { errors } = form.formState;

  const handleCreate = (values: CourseFormValues) => {
    setSubmitError(null);

    mutate(values, {
      onSuccess: (course) => {
        showSuccessToast(t("successCreate"));
        router.replace(`/admin/courses/${course.id}`);
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error, t("errors.createFailed")));
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
        onSubmit={handleCreate}
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
              titleRegister={register("title", {
                onChange: (event) => {
                  if (watch("slug").length > 0) return;
                  setValue("slug", slugify(event.target.value), {
                    shouldValidate: false,
                  });
                },
              })}
              descriptionRegister={register("description")}
              onTitleGenerated={(text) => {
                setValue("title", text, GENERATED_COPY_OPTIONS);
                if (watch("slug").length > 0) return;
                setValue("slug", slugify(text), { shouldValidate: false });
              }}
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
              {t("createSubmit")}
            </Button>
          </>
        )}
      </AppForm>
    </section>
  );
}
