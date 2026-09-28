"use client";

import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { LessonMaterial } from "@/entities/course";
import { MaterialListItem } from "@/entities/course/ui/material-list-item";
import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ConfirmDeleteDialog } from "@/shared/ui/confirm-delete-dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import { useDeleteMaterial } from "../model/use-delete-material";
import { CreateMaterialDialog } from "./create-material-dialog";

type AdminLessonMaterialsProps = {
  courseId: string;
  lessonId: string;
  materials: LessonMaterial[];
};

export function AdminLessonMaterials({
  courseId,
  lessonId,
  materials,
}: AdminLessonMaterialsProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useDeleteMaterial(courseId);
  const sortedMaterials = [...materials].sort(
    (left, right) => left.order - right.order,
  );

  const handleDelete = (materialId: string) =>
    new Promise<void>((resolve, reject) => {
      mutate(materialId, {
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
    <section className="flex flex-col gap-4">
      <SectionHeading>{t("materials")}</SectionHeading>

      <Show
        when={sortedMaterials.length > 0}
        fallback={<EmptyState title={t("emptyMaterials")} />}
      >
        <div className="flex flex-col gap-3">
          {sortedMaterials.map((material) => (
            <MaterialListItem
              key={material.id}
              title={material.title}
              fileName={material.fileName}
              fileSize={material.fileSize}
              action={
                <ConfirmDeleteDialog
                  title={t("deleteMaterialTitle")}
                  description={t("deleteMaterialDescription", {
                    title: material.title,
                  })}
                  confirmLabel={t("deleteConfirm")}
                  cancelLabel={t("deleteCancel")}
                  isPending={isPending}
                  onConfirm={() => handleDelete(material.id)}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("deleteMaterialTitle")}
                    >
                      <TrashIcon aria-hidden />
                    </Button>
                  }
                />
              }
            />
          ))}
        </div>
      </Show>

      <CreateMaterialDialog
        courseId={courseId}
        lessonId={lessonId}
        nextOrder={sortedMaterials.length}
      />
    </section>
  );
}
