import { DashboardCourse } from "@/_pages/dashboard/course";

type DashboardCoursePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardCoursePage({
  params,
}: DashboardCoursePageProps) {
  const { slug } = await params;

  return <DashboardCourse slug={slug} />;
}
