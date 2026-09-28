import { DashboardLesson } from "@/_pages/dashboard/lesson";

type DashboardLessonPageProps = {
  params: Promise<{ slug: string; lessonId: string }>;
};

export default async function DashboardLessonPage({
  params,
}: DashboardLessonPageProps) {
  const { slug, lessonId } = await params;

  return <DashboardLesson slug={slug} lessonId={lessonId} />;
}
