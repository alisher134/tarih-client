"use client";

import { useMemo } from "react";

import type { CourseDetail, LessonTest } from "@/entities/course";
import {
  PageBreadcrumbs,
  type PageBreadcrumbItem,
} from "@/shared/ui/page-breadcrumbs";
import { useTranslations } from "next-intl";

import { useAdminCourse } from "../model/use-admin-course";

type AdminTestBreadcrumbsProps = {
  courseId: string;
  testId: string;
};

export function AdminTestBreadcrumbs({
  courseId,
  testId,
}: AdminTestBreadcrumbsProps) {
  const tSidebar = useTranslations("adminSidebar");
  const t = useTranslations("adminCourses");
  const { data: course } = useAdminCourse(courseId);
  const lesson = useMemo(
    () => course?.lessons.find((item) => item.test?.id === testId),
    [course?.lessons, testId],
  );
  const resolvedTest = lesson?.test;
  const items: PageBreadcrumbItem[] = [
    { label: tSidebar("courses"), href: "/admin/courses" },
    {
      label: course?.title ?? t("courseTitle"),
      href: `/admin/courses/${courseId}`,
    },
  ];

  if (lesson != null) {
    items.push({
      label: lesson.title,
      href: `/admin/courses/${courseId}/lessons/${lesson.id}`,
    });
  }

  items.push({ label: resolvedTest?.title ?? t("testTitle") });

  return <PageBreadcrumbs items={items} />;
}
