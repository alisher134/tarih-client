import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { AdminCoursesList } from "@/features/admin-courses";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { LinkButton } from "@/shared/ui/link-button";
import { CenteredSpinner } from "@/shared/ui/spinner";

export async function AdminCourses() {
  const t = await getTranslations("adminCourses");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
        <CardAction>
          <LinkButton href="/admin/courses/new">{t("create")}</LinkButton>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<CenteredSpinner />}>
          <AdminCoursesList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
