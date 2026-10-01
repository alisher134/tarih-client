import { getTranslations } from "next-intl/server";

import { CreateAdminCourseForm } from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageBreadcrumbs } from "@/shared/ui/page-breadcrumbs";

import { Link } from "@/shared/config/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

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
          <CardTitle size="page" className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
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
