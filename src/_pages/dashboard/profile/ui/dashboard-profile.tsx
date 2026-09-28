import { getTranslations } from "next-intl/server";

import { ChangePasswordForm } from "@/features/change-password";
import { MySubscriptionCard } from "@/features/subscription";
import { UpdateProfileForm } from "@/features/update-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export async function DashboardProfile() {
  const t = await getTranslations("profile");

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle size="page">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-10">
        <MySubscriptionCard />
        <UpdateProfileForm />
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
