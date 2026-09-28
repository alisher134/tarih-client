import { getTranslations } from "next-intl/server";

import { adminNavItems } from "../model/nav-items";
import { AdminTabBarNav } from "./admin-tab-bar-nav";

export async function AdminTabBar() {
  const t = await getTranslations("adminSidebar");

  const items = adminNavItems.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  return <AdminTabBarNav items={items} menuLabel={t("menu")} />;
}
