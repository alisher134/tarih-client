import { getTranslations } from "next-intl/server";

import { FavoritesList } from "@/features/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export async function Favorites() {
  const t = await getTranslations("courses");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("favorites")}</CardTitle>
      </CardHeader>

      <CardContent>
        <FavoritesList />
      </CardContent>
    </Card>
  );
}
