import { getTranslations } from "next-intl/server";

import { AdminAnalytics } from "@/features/admin-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export async function AdminHome() {
  const t = await getTranslations("adminSidebar");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("home")}</CardTitle>
      </CardHeader>

      <CardContent>
        <AdminAnalytics />
      </CardContent>
    </Card>
  );
}
