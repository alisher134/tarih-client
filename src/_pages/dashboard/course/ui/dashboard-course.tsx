import { CourseDetails } from "@/features/courses";

type DashboardCourseProps = {
  slug: string;
};

export function DashboardCourse({ slug }: DashboardCourseProps) {
  return <CourseDetails slug={slug} />;
}
