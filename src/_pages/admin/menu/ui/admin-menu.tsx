import { getTranslations } from "next-intl/server";

import { ChangeLanguage } from "@/features/change-language";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

import { AdminMenuAccount } from "./admin-menu-account";
import { AdminMenuDashboardLink } from "./admin-menu-dashboard-link";
import { AdminMenuProfile } from "./admin-menu-profile";

export async function AdminMenu() {
  const t = await getTranslations("adminSidebar");

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle size="page">{t("menu")}</CardTitle>
        <CardAction className="md:hidden">
          <ChangeLanguage />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <AdminMenuProfile />
        <AdminMenuDashboardLink label={t("dashboard")} />
        <AdminMenuAccount logoutLabel={t("logout")} />
      </CardContent>
    </Card>
  );
}
