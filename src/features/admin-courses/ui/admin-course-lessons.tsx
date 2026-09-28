"use client";

import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CourseLesson } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { Button } from "@/shared/ui/button";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ConfirmDeleteDialog } from "@/shared/ui/confirm-delete-dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import { useDeleteLesson } from "../model/use-delete-lesson";
import { CreateLessonDialog } from "./create-lesson-dialog";

type AdminCourseLessonsProps = {
  courseId: string;
  lessons: CourseLesson[];
  copyParent?: GenerateCopyParent;
};

export function AdminCourseLessons({
  courseId,
  lessons,
  copyParent,
}: AdminCourseLessonsProps) {
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useDeleteLesson(courseId);
  const sortedLessons = [...lessons].sort(
    (left, right) => left.order - right.order,
  );

  const handleDelete = (lessonId: string) =>
    new Promise<void>((resolve, reject) => {
      mutate(lessonId, {
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
      <SectionHeading>{t("lessons")}</SectionHeading>

      <Show
        when={sortedLessons.length > 0}
        fallback={<EmptyState title={t("emptyLessons")} />}
      >
        <div className="flex flex-col gap-3">
          {sortedLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 rounded-xl border border-border/70 bg-card px-4 py-3 shadow-xs transition-colors hover:border-primary/40"
            >
              <span className="min-w-0 flex-1 truncate font-medium">
                {lesson.title}
              </span>
              <LinkButton
                href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                variant="outline"
              >
                {t("open")}
              </LinkButton>
              <ConfirmDeleteDialog
                title={t("deleteLessonTitle")}
                description={t("deleteLessonDescription", {
                  title: lesson.title,
                })}
                confirmLabel={t("deleteConfirm")}
                cancelLabel={t("deleteCancel")}
                isPending={isPending}
                onConfirm={() => handleDelete(lesson.id)}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("deleteLessonTitle")}
                  >
                    <TrashIcon aria-hidden />
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      </Show>

      <CreateLessonDialog
        courseId={courseId}
        nextOrder={sortedLessons.length}
        copyParent={copyParent}
      />
    </section>
  );
}
