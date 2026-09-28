import {
  HouseIcon,
  LibraryIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AppSidebar } from "@/shared/ui/app-sidebar";

import { adminNavItems, type AdminNavHref } from "../model/nav-items";

const navIcons = {
  "/admin": HouseIcon,
  "/admin/users": UsersIcon,
  "/admin/courses": LibraryIcon,
} as const satisfies Record<AdminNavHref, LucideIcon>;

export async function AdminSidebar() {
  const t = await getTranslations("adminSidebar");

  const items = adminNavItems.map((item) => {
    const Icon = navIcons[item.href];

    return {
      href: item.href,
      label: t(item.labelKey),
      icon: <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />,
    };
  });

  return (
    <AppSidebar
      title={t("menu")}
      items={items}
      rootHref="/admin"
      isHiddenOnMobile
    />
  );
}
