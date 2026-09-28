"use client";

import { useMemo } from "react";

import type { CourseDetail, LessonTest } from "@/entities/course";
import { PageBreadcrumbs, type PageBreadcrumbItem } from "@/shared/ui/page-breadcrumbs";
import { useTranslations } from "next-intl";

type AdminTestBreadcrumbsProps = {
  courseId: string;
  testId: string;
  course?: CourseDetail;
  test?: LessonTest;
};

export function AdminTestBreadcrumbs({
  courseId,
  testId,
  course,
  test,
}: AdminTestBreadcrumbsProps) {
  const tSidebar = useTranslations("adminSidebar");
  const t = useTranslations("adminCourses");
  const lesson = useMemo(
    () => course?.lessons.find((item) => item.test?.id === testId),
    [course?.lessons, testId],
  );
  const resolvedTest = test ?? lesson?.test;
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
