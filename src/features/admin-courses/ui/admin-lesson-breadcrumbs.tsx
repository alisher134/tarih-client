"use client";

import type { CourseDetail, CourseLesson } from "@/entities/course";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";
import { useTranslations } from "next-intl";

type AdminLessonBreadcrumbsProps = {
  courseId: string;
  lessonId: string;
  course?: CourseDetail;
  lesson?: CourseLesson;
};

export function AdminLessonBreadcrumbs({
  courseId,
  lessonId,
  course,
  lesson,
}: AdminLessonBreadcrumbsProps) {
  const tSidebar = useTranslations("adminSidebar");
  const t = useTranslations("adminCourses");
  const resolvedLesson =
    lesson ?? course?.lessons.find((item) => item.id === lessonId);

  return (
    <PageBreadcrumbs
      items={[
        { label: tSidebar("courses"), href: "/admin/courses" },
        {
          label: course?.title ?? t("courseTitle"),
          href: `/admin/courses/${courseId}`,
        },
        { label: resolvedLesson?.title ?? t("lessonTitle") },
      ]}
    />
  );
}
