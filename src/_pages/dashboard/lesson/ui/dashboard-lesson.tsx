import { LessonPlayer } from "@/features/lesson-player";

type DashboardLessonProps = {
  slug: string;
  lessonId: string;
};

export function DashboardLesson({ slug, lessonId }: DashboardLessonProps) {
  return <LessonPlayer slug={slug} lessonId={lessonId} />;
}
