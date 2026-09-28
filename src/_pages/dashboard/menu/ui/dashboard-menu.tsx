import { getTranslations } from "next-intl/server";

import { ChangeLanguage } from "@/features/change-language";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

import { dashboardMenuNavItems } from "../model/menu-nav-items";
import { DashboardMenuAccount } from "./dashboard-menu-account";
import { DashboardMenuAdminLink } from "./dashboard-menu-admin-link";
import { DashboardMenuNav } from "./dashboard-menu-nav";
import { DashboardMenuProfile } from "./dashboard-menu-profile";

export async function DashboardMenu() {
  const t = await getTranslations("dashboardMenu");

  const items = dashboardMenuNavItems.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
        <CardAction className="md:hidden">
          <ChangeLanguage />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <DashboardMenuProfile />
        <DashboardMenuNav items={items} />
        <DashboardMenuAdminLink label={t("admin")} />
        <DashboardMenuAccount logoutLabel={t("logout")} />
      </CardContent>
    </Card>
  );
}
