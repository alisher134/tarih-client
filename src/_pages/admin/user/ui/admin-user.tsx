import { getTranslations } from "next-intl/server";

import { AdminUserDetails, AdminUserBreadcrumbs } from "@/features/admin-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type AdminUserProps = {
  userId: string;
};

export async function AdminUser({ userId }: AdminUserProps) {
  const t = await getTranslations("adminUsers");

  return (
    <section className="flex flex-col gap-4">
      <AdminUserBreadcrumbs userId={userId} />

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle size="page">
            {t("userTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUserDetails userId={userId} />
        </CardContent>
      </Card>
    </section>
  );
}
