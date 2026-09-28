"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
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
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createLessonSchema,
  type LessonFormValues,
} from "../model/lesson-schema";
import { useCreateLesson } from "../model/use-create-lesson";
import { AdminCopyFields, GENERATED_COPY_OPTIONS } from "./admin-copy-fields";

type CreateLessonDialogProps = {
  courseId: string;
  nextOrder: number;
  copyParent?: GenerateCopyParent;
};

export function CreateLessonDialog({
  courseId,
  nextOrder,
  copyParent,
}: CreateLessonDialogProps) {
  const t = useTranslations("adminCourses");
  const router = useRouter();
  const { mutate, isPending } = useCreateLesson(courseId);
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createLessonSchema(t), {
    defaultValues: {
      title: "",
      description: "",
      order: nextOrder,
      videoObjectKey: "",
      videoDuration: 0,
    },
  });

  const handleCreate = (values: LessonFormValues) => {
    setSubmitError(null);

    mutate(
      {
        title: values.title,
        description: values.description,
        order: values.order,
      },
      {
        onSuccess: (lesson) => {
          showSuccessToast(t("successLessonCreate"));
          setOpen(false);
          router.push(`/admin/courses/${courseId}/lessons/${lesson.id}`);
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, t("errors.createFailed")));
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError(null);
      form.reset({
        title: "",
        description: "",
        order: nextOrder,
        videoObjectKey: "",
        videoDuration: 0,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        {t("addLesson")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("createLessonTitle")}</DialogTitle>
        </DialogHeader>

        <Show when={submitError != null}>
          <ErrorAlert errorMessage={submitError!} />
        </Show>

        <AppForm
          form={form}
          onSubmit={handleCreate}
          className="flex flex-col gap-4"
        >
          {({ register, setValue, watch, formState }) => (
            <>
              <AdminCopyFields
                entity="lesson"
                parent={copyParent}
                title={watch("title")}
                description={watch("description")}
                titleError={formState.errors.title?.message}
                descriptionError={formState.errors.description?.message}
                titleRegister={register("title")}
                descriptionRegister={register("description")}
                onTitleGenerated={(text) =>
                  setValue("title", text, GENERATED_COPY_OPTIONS)
                }
                onDescriptionGenerated={(text) =>
                  setValue("description", text, GENERATED_COPY_OPTIONS)
                }
              />
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  {t("cancel")}
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {t("createSubmit")}
                </Button>
              </DialogFooter>
            </>
          )}
        </AppForm>
      </DialogContent>
    </Dialog>
  );
}
