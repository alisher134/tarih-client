import { getTranslations } from "next-intl/server";

import { DashboardAnalytics } from "@/features/dashboard-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export async function DashboardHome() {
  const t = await getTranslations("dashboardAnalytics");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <DashboardAnalytics />
      </CardContent>
    </Card>
  );
}
