"use client";

import { useTranslations } from "next-intl";

import type { LessonTest } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { ConfirmDeleteDialog } from "@/shared/ui/confirm-delete-dialog";
import { LinkButton } from "@/shared/ui/link-button";
import { showSuccessToast } from "@/shared/utils";

import { useDeleteTest } from "../model/use-delete-test";

type AdminExistingTestProps = {
  courseId: string;
  test: LessonTest;
};

export function AdminExistingTest({ courseId, test }: AdminExistingTestProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useDeleteTest(courseId, test.id);

  const handleDelete = () =>
    new Promise<void>((resolve, reject) => {
      mutate(test.id, {
        onSuccess: () => {
          showSuccessToast(t("successDelete"));
          resolve();
        },
        onError: (error) => {
          reject(new Error(getErrorMessage(error, t("errors.deleteFailed"))));
        },
      });
    });

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{test.title}</p>
        <p className="text-sm text-muted-foreground">
          {t("passingScore")}: {test.passingScore}
        </p>
      </div>
      <LinkButton
        href={`/admin/courses/${courseId}/tests/${test.id}`}
        variant="outline"
      >
        {t("editTest")}
      </LinkButton>
      <ConfirmDeleteDialog
        title={t("deleteTestTitle")}
        description={t("deleteTestDescription", { title: test.title })}
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("deleteCancel")}
        isPending={isPending}
        onConfirm={handleDelete}
        trigger={
          <Button type="button" variant="destructive">
            {t("deleteTestTitle")}
          </Button>
        }
      />
    </div>
  );
}
