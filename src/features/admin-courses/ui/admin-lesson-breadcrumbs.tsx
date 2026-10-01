"use client";

import type { CourseDetail, CourseLesson } from "@/entities/course";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";
import { useTranslations } from "next-intl";

import { useAdminCourse } from "../model/use-admin-course";

type AdminLessonBreadcrumbsProps = {
  courseId: string;
  lessonId: string;
};

export function AdminLessonBreadcrumbs({
  courseId,
  lessonId,
}: AdminLessonBreadcrumbsProps) {
  const tSidebar = useTranslations("adminSidebar");
  const t = useTranslations("adminCourses");
  const { data: course } = useAdminCourse(courseId);
  const resolvedLesson = course?.lessons.find((item) => item.id === lessonId);

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
