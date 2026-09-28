import { AdminCourse } from "@/_pages/admin/course";

type AdminCoursePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCoursePage({
  params,
}: AdminCoursePageProps) {
  const { id } = await params;

  return <AdminCourse courseId={id} />;
}
