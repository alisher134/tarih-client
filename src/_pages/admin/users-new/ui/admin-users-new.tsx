import { getTranslations } from "next-intl/server";

import { CreateAdminUserForm } from "@/features/admin-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";

export async function AdminUsersNew() {
  const t = await getTranslations("adminUsers");
  const tSidebar = await getTranslations("adminSidebar");

  return (
    <section className="flex flex-col gap-4">
      <PageBreadcrumbs
        items={[
          { label: tSidebar("users"), href: "/admin/users" },
          { label: t("createTitle") },
        ]}
      />

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle size="page">
            {t("createTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateAdminUserForm />
        </CardContent>
      </Card>
    </section>
  );
}
