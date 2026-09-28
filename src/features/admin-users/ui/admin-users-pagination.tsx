"use client";

import { useTranslations } from "next-intl";

import type { UsersListMeta } from "@/entities/user";
import { ListPagination } from "@/shared/ui/list-pagination";

type AdminUsersPaginationProps = {
  meta: UsersListMeta;
  onPageChange: (page: number) => void;
};

export function AdminUsersPagination({
  meta,
  onPageChange,
}: AdminUsersPaginationProps) {
  const t = useTranslations("adminUsers");

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
