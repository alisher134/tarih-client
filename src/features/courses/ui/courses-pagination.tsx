"use client";

import { useTranslations } from "next-intl";

import type { ListMeta } from "@/entities/course";
import { ListPagination } from "@/shared/ui/list-pagination";

type CoursesPaginationProps = {
  meta: ListMeta;
  onPageChange: (page: number) => void;
};

export function CoursesPagination({
  meta,
  onPageChange,
}: CoursesPaginationProps) {
  const t = useTranslations("courses");

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
