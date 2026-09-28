import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { CoursesCatalog } from "@/features/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CenteredSpinner } from "@/shared/ui/spinner";

export async function AllCourses() {
  const t = await getTranslations("courses");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<CenteredSpinner />}>
          <CoursesCatalog />
        </Suspense>
      </CardContent>
    </Card>
  );
}
