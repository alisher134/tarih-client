import { getTranslations } from "next-intl/server";

import { PracticeContainer } from "@/features/practice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export async function DashboardPractice() {
  const t = await getTranslations("practice");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <PracticeContainer />
      </CardContent>
    </Card>
  );
}
