"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import type { CourseLesson } from "@/entities/course";
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
  createLessonSchema,
  type LessonFormValues,
} from "../model/lesson-schema";
import { useUpdateLesson } from "../model/use-update-lesson";
import { AdminCopyFields, GENERATED_COPY_OPTIONS } from "./admin-copy-fields";
import { FileUploadButton } from "./file-upload-button";

type UpdateAdminLessonFormProps = {
  courseId: string;
  lesson: CourseLesson;
  copyParent?: GenerateCopyParent;
};

export function UpdateAdminLessonForm({
  courseId,
  lesson,
  copyParent,
}: UpdateAdminLessonFormProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useUpdateLesson(courseId, lesson.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createLessonSchema(t), {
    defaultValues: toLessonValues(lesson),
    values: toLessonValues(lesson),
  });
  const { errors } = form.formState;

  const handleSave = (values: LessonFormValues) => {
    setSubmitError(null);

    mutate(
      {
        title: values.title,
        description: values.description,
        order: values.order,
        videoObjectKey: values.videoObjectKey || undefined,
        videoDuration: values.videoDuration,
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
              entity="lesson"
              parent={copyParent}
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
              label={t("order")}
              type="number"
              {...register("order", { valueAsNumber: true })}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{t("video")}</p>
              <FileUploadButton
                purpose="video"
                accept="video/mp4,video/webm,video/quicktime"
                courseId={courseId}
                lessonId={lesson.id}
                label={t("videoUpload")}
                onUploaded={({ objectKey, duration }) => {
                  setValue("videoObjectKey", objectKey);
                  if (duration != null) setValue("videoDuration", duration);
                }}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label={t("videoKey")}
                  error={errors.videoObjectKey?.message}
                  {...register("videoObjectKey")}
                />
                <InputField
                  label={t("videoDuration")}
                  type="number"
                  {...register("videoDuration", { valueAsNumber: true })}
                />
              </div>
              <Show when={watch("videoObjectKey").length > 0}>
                <p className="truncate text-xs text-muted-foreground">
                  {watch("videoObjectKey")}
                </p>
              </Show>
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

function toLessonValues(lesson: CourseLesson): LessonFormValues {
  return {
    title: lesson.title,
    description: lesson.description ?? "",
    order: lesson.order,
    videoObjectKey: lesson.videoObjectKey ?? "",
    videoDuration: lesson.videoDuration ?? 0,
  };
}
