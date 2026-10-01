import { getTranslations } from "next-intl/server";

import { AdminUserDetails, AdminUserBreadcrumbs } from "@/features/admin-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { Link } from "@/shared/config/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

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
          <CardTitle size="page" className="flex items-center gap-3">
            <Link
              href="/admin/users"
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
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
