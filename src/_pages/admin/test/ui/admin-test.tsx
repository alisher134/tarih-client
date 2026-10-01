import { getTranslations } from "next-intl/server";

import { AdminTestPage, AdminTestBreadcrumbs } from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { Link } from "@/shared/config/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

type AdminTestProps = {
  courseId: string;
  testId: string;
};

export async function AdminTest({ courseId, testId }: AdminTestProps) {
  const t = await getTranslations("adminCourses");

  return (
    <section className="flex flex-col gap-4">
      <AdminTestBreadcrumbs courseId={courseId} testId={testId} />
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle size="page" className="flex items-center gap-3">
            <Link
              href={`/admin/courses/${courseId}`}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {t("testTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTestPage courseId={courseId} testId={testId} />
        </CardContent>
      </Card>
    </section>
  );
}
