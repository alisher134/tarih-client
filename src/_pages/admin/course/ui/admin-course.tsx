import { getTranslations } from "next-intl/server";

import { AdminCourseDetails, AdminCourseBreadcrumbs } from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

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
          <CardTitle size="page">
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
