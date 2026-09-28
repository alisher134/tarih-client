import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { AdminUsersList } from "@/features/admin-users";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { LinkButton } from "@/shared/ui/link-button";
import { CenteredSpinner } from "@/shared/ui/spinner";

export async function AdminUsers() {
  const t = await getTranslations("adminUsers");

  return (
    <Card>
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
        <CardAction>
          <LinkButton href="/admin/users/new">{t("create")}</LinkButton>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<CenteredSpinner />}>
          <AdminUsersList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
