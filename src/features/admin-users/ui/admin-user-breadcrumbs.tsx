"use client";

import { useTranslations } from "next-intl";

import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";

import { useUser } from "../model/use-user";

type AdminUserBreadcrumbsProps = {
  userId: string;
};

export function AdminUserBreadcrumbs({ userId }: AdminUserBreadcrumbsProps) {
  const tSidebar = useTranslations("adminSidebar");
  const t = useTranslations("adminUsers");
  const { data } = useUser(userId);

  const userLabel =
    data != null
      ? `${data.firstName} ${data.lastName}`.trim() || data.email
      : t("userTitle");

  return (
    <PageBreadcrumbs
      items={[
        { label: tSidebar("users"), href: "/admin/users" },
        { label: userLabel },
      ]}
    />
  );
}
