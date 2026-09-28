import { getTranslations } from "next-intl/server";

import { AdminTestPage } from "@/features/admin-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type AdminTestProps = {
  courseId: string;
  testId: string;
};

export async function AdminTest({ courseId, testId }: AdminTestProps) {
  const t = await getTranslations("adminCourses");

  return (
    <section className="flex flex-col gap-4">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle size="page">
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
