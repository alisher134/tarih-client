"use client";

import { useTranslations } from "next-intl";

import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";

import { useAdminCourse } from "../model/use-admin-course";

type AdminCourseBreadcrumbsProps = {
  courseId: string;
};

export function AdminCourseBreadcrumbs({
  courseId,
}: AdminCourseBreadcrumbsProps) {
  const tSidebar = useTranslations("adminSidebar");
  const t = useTranslations("adminCourses");
  const { data } = useAdminCourse(courseId);

  return (
    <PageBreadcrumbs
      items={[
        { label: tSidebar("courses"), href: "/admin/courses" },
        { label: data?.title ?? t("courseTitle") },
      ]}
    />
  );
}
