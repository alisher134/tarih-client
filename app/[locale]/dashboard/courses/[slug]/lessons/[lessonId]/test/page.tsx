import { DashboardTest } from "@/_pages/dashboard/test";

type DashboardLessonTestPageProps = {
  params: Promise<{ slug: string; lessonId: string }>;
};

export default async function DashboardLessonTestPage({
  params,
}: DashboardLessonTestPageProps) {
  const { slug, lessonId } = await params;

  return <DashboardTest slug={slug} lessonId={lessonId} />;
}
