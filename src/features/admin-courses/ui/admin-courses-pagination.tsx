"use client";

import { useTranslations } from "next-intl";

import type { ListMeta } from "@/entities/course";
import { ListPagination } from "@/shared/ui/list-pagination";

type AdminCoursesPaginationProps = {
  meta: ListMeta;
  onPageChange: (page: number) => void;
};

export function AdminCoursesPagination({
  meta,
  onPageChange,
}: AdminCoursesPaginationProps) {
  const t = useTranslations("adminCourses");

  return (
    <ListPagination
      page={meta.page}
      totalPages={meta.totalPages}
      ariaLabel={t("pagination")}
      prevLabel={t("prev")}
      nextLabel={t("next")}
      morePagesLabel={t("morePages")}
      onPageChange={onPageChange}
    />
  );
}
