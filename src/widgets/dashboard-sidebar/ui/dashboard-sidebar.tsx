import {
  BookIcon,
  HeartIcon,
  HouseIcon,
  LibraryIcon,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AppSidebar } from "@/shared/ui/app-sidebar";

import { dashboardNavItems, type DashboardNavHref } from "../model/nav-items";
import { DashboardAdminNavLink } from "./dashboard-admin-nav-link";

const navIcons = {
  "/dashboard": HouseIcon,
  "/dashboard/my-courses": BookIcon,
  "/dashboard/favorites": HeartIcon,
  "/dashboard/courses": LibraryIcon,
} as const satisfies Record<DashboardNavHref, LucideIcon>;

export async function DashboardSidebar() {
  const t = await getTranslations("dashboardSidebar");

  const items = dashboardNavItems.map((item) => {
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
      rootHref="/dashboard"
      isHiddenOnMobile
      footerSlot={<DashboardAdminNavLink label={t("admin")} />}
    />
  );
}
