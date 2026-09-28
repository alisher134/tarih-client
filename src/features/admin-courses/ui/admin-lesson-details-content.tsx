"use client";

import { useTranslations } from "next-intl";

import type { CourseLesson } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { ErrorPageElement } from "@/shared/ui/error-page-element";

import { AdminLessonMaterials } from "./admin-lesson-materials";
import { AdminLessonTest } from "./admin-lesson-test";
import { UpdateAdminLessonForm } from "./update-admin-lesson-form";

type AdminLessonDetailsContentProps = {
  courseId: string;
  lesson: CourseLesson | undefined;
  copyParent?: GenerateCopyParent;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
};

export function AdminLessonDetailsContent({
  courseId,
  lesson,
  copyParent,
  isLoading,
  isError,
  error,
}: AdminLessonDetailsContentProps) {
  const t = useTranslations("adminCourses");

  return (
    <AsyncWrapper
      isLoading={isLoading}
      isError={isError}
      data={lesson}
      errorSlot={
        <ErrorPageElement
          layout="inline"
          title={t("errors.lessonNotFound")}
          description={getErrorMessage(error, t("errors.lessonNotFound"))}
          homeLabel={t("errors.backToCourse")}
          homeHref={`/admin/courses/${courseId}`}
        />
      }
    >
      {(currentLesson) => (
        <div className="flex flex-col gap-10">
          <UpdateAdminLessonForm
            courseId={courseId}
            lesson={currentLesson}
            copyParent={copyParent}
          />
          <AdminLessonMaterials
            courseId={courseId}
            lessonId={currentLesson.id}
            materials={currentLesson.materials}
          />
          <AdminLessonTest
            courseId={courseId}
            lessonId={currentLesson.id}
            test={currentLesson.test}
            copyParent={{
              ...copyParent,
              lessonTitle: currentLesson.title,
              lessonDescription: currentLesson.description ?? undefined,
            }}
          />
        </div>
      )}
    </AsyncWrapper>
  );
}
