import { getTranslations } from "next-intl/server";

import { dashboardNavItems } from "../model/nav-items";
import { DashboardTabBarNav } from "./dashboard-tab-bar-nav";

export async function DashboardTabBar() {
  const t = await getTranslations("dashboardSidebar");

  const items = dashboardNavItems.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  return <DashboardTabBarNav items={items} menuLabel={t("menu")} />;
}
