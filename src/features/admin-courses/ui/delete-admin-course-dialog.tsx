"use client";

import { useTranslations } from "next-intl";

import type { Course } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { ConfirmDeleteDialog } from "@/shared/ui/confirm-delete-dialog";
import { showSuccessToast } from "@/shared/utils";

import { useDeleteCourse } from "../model/use-delete-course";

type DeleteAdminCourseDialogProps = {
  course: Course;
};

export function DeleteAdminCourseDialog({
  course,
}: DeleteAdminCourseDialogProps) {
  const t = useTranslations("adminCourses");
  const router = useRouter();
  const { mutate, isPending } = useDeleteCourse();

  const handleDelete = () =>
    new Promise<void>((resolve, reject) => {
      mutate(course.id, {
        onSuccess: () => {
          showSuccessToast(t("successDelete"));
          router.replace("/admin/courses");
          resolve();
        },
        onError: (error) => {
          reject(new Error(getErrorMessage(error, t("errors.deleteFailed"))));
        },
      });
    });

  return (
    <ConfirmDeleteDialog
      title={t("deleteCourseTitle")}
      description={t("deleteCourseDescription", { title: course.title })}
      confirmLabel={t("deleteConfirm")}
      cancelLabel={t("deleteCancel")}
      isPending={isPending}
      onConfirm={handleDelete}
      trigger={<Button variant="destructive">{t("deleteCourseTitle")}</Button>}
    />
  );
}
