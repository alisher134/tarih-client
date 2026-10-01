import { getTranslations } from "next-intl/server";

import {
  AdminCourseDetails,
  AdminCourseBreadcrumbs,
} from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { Link } from "@/shared/config/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

type AdminCourseProps = {
  courseId: string;
};

export async function AdminCourse({ courseId }: AdminCourseProps) {
  const t = await getTranslations("adminCourses");

  return (
    <section className="flex flex-col gap-4">
      <AdminCourseBreadcrumbs courseId={courseId} />

      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle size="page" className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {t("courseTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCourseDetails courseId={courseId} />
        </CardContent>
      </Card>
    </section>
  );
}
