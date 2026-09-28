import { getTranslations } from "next-intl/server";

import { CreateAdminCourseForm } from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";

export async function AdminCoursesNew() {
  const t = await getTranslations("adminCourses");
  const tSidebar = await getTranslations("adminSidebar");

  return (
    <section className="flex flex-col gap-4">
      <PageBreadcrumbs
        items={[
          { label: tSidebar("courses"), href: "/admin/courses" },
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
          <CreateAdminCourseForm />
        </CardContent>
      </Card>
    </section>
  );
}
