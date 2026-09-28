import { AdminLesson } from "@/_pages/admin/lesson";

type AdminLessonPageProps = {
  params: Promise<{ id: string; lessonId: string }>;
};

export default async function AdminLessonPage({
  params,
}: AdminLessonPageProps) {
  const { id, lessonId } = await params;

  return <AdminLesson courseId={id} lessonId={lessonId} />;
}
