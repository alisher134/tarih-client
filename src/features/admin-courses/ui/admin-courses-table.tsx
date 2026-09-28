"use client";

import { useTranslations } from "next-intl";

import type { Course, CourseStatus } from "@/entities/course";
import { LinkButton } from "@/shared/ui/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type AdminCoursesTableProps = {
  courses: Course[];
};

export function AdminCoursesTable({ courses }: AdminCoursesTableProps) {
  const t = useTranslations("adminCourses");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("slug")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("order")}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">{course.title}</TableCell>
            <TableCell>{course.slug}</TableCell>
            <TableCell>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                {statusLabel(course.status, t)}
              </span>
            </TableCell>
            <TableCell>{course.order}</TableCell>
            <TableCell>
              <LinkButton
                href={`/admin/courses/${course.id}`}
                variant="outline"
              >
                {t("open")}
              </LinkButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function statusLabel(
  status: CourseStatus,
  t: (key: "statusDraft" | "statusPublished" | "statusArchived") => string,
) {
  if (status === "PUBLISHED") return t("statusPublished");
  if (status === "ARCHIVED") return t("statusArchived");

  return t("statusDraft");
}
