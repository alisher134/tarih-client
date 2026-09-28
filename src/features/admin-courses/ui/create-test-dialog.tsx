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
import { InputField } from "@/shared/ui/input-field";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createTestSchema,
  toOptionalLimit,
  type TestFormValues,
} from "../model/test-schema";
import { useCreateTest } from "../model/use-create-test";
import { AdminCopyFields, GENERATED_COPY_OPTIONS } from "./admin-copy-fields";

type CreateTestDialogProps = {
  courseId: string;
  lessonId: string;
  copyParent?: GenerateCopyParent;
};

export function CreateTestDialog({
  courseId,
  lessonId,
  copyParent,
}: CreateTestDialogProps) {
  const t = useTranslations("adminCourses");
  const router = useRouter();
  const { mutate, isPending } = useCreateTest(courseId, lessonId);
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useZodForm(createTestSchema(t), {
    defaultValues: {
      title: "",
      description: "",
      passingScore: 70,
      timeLimit: "",
      attemptsLimit: "",
    },
  });

  const handleCreate = (values: TestFormValues) => {
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
        onSuccess: (test) => {
          showSuccessToast(t("successTestCreate"));
          setOpen(false);
          router.push(`/admin/courses/${courseId}/tests/${test.id}`);
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
        passingScore: 70,
        timeLimit: "",
        attemptsLimit: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        {t("createTest")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("createTest")}</DialogTitle>
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
                entity="test"
                parent={copyParent}
                title={watch("title")}
                description={watch("description")}
                titleError={formState.errors.title?.message}
                titleRegister={register("title")}
                descriptionRegister={register("description")}
                onTitleGenerated={(text) =>
                  setValue("title", text, GENERATED_COPY_OPTIONS)
                }
                onDescriptionGenerated={(text) =>
                  setValue("description", text, GENERATED_COPY_OPTIONS)
                }
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <InputField
                  label={t("passingScore")}
                  type="number"
                  error={formState.errors.passingScore?.message}
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
