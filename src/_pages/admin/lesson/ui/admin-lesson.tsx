import { getTranslations } from "next-intl/server";

import { AdminLessonPage } from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type AdminLessonProps = {
  courseId: string;
  lessonId: string;
};

export async function AdminLesson({ courseId, lessonId }: AdminLessonProps) {
  const t = await getTranslations("adminCourses");

  return (
    <section className="flex flex-col gap-4">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle size="page">
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
