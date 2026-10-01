import { getTranslations } from "next-intl/server";

import {
  AdminLessonPage,
  AdminLessonBreadcrumbs,
} from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { Link } from "@/shared/config/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

type AdminLessonProps = {
  courseId: string;
  lessonId: string;
};

export async function AdminLesson({ courseId, lessonId }: AdminLessonProps) {
  const t = await getTranslations("adminCourses");

  return (
    <section className="flex flex-col gap-4">
      <AdminLessonBreadcrumbs courseId={courseId} lessonId={lessonId} />
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle size="page" className="flex items-center gap-3">
            <Link
              href={`/admin/courses/${courseId}`}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {t("lessonTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminLessonPage courseId={courseId} lessonId={lessonId} />
        </CardContent>
      </Card>
    </section>
  );
}
