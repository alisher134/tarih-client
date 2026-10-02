import {
  HouseIcon,
  LibraryIcon,
  UsersIcon,
  CreditCardIcon,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AppSidebar } from "@/shared/ui/app-sidebar";

import { adminNavItems, type AdminNavHref } from "../model/nav-items";
import { AdminDashboardNavLink } from "./admin-dashboard-nav-link";

const navIcons = {
  "/admin": HouseIcon,
  "/admin/users": UsersIcon,
  "/admin/courses": LibraryIcon,
  "/admin/subscription-plans": CreditCardIcon,
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
      footerSlot={<AdminDashboardNavLink label={t("dashboard")} />}
    />
  );
}
