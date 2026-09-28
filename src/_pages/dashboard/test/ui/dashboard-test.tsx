import { TakeTest } from "@/features/take-test";

type DashboardTestProps = {
  slug: string;
  lessonId: string;
};

export function DashboardTest({ slug, lessonId }: DashboardTestProps) {
  return <TakeTest slug={slug} lessonId={lessonId} />;
}
