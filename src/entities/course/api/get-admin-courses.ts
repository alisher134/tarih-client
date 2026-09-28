import { apiClient } from "@/shared/api";

import { parseCoursesList } from "../lib/parse-course";
import type { AdminCoursesListQuery, CoursesList } from "../model/types";

export async function getAdminCourses(
  query: AdminCoursesListQuery,
): Promise<CoursesList> {
  const { data } = await apiClient.get("/admin/courses", {
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search || undefined,
      status: query.status,
    },
  });

  return parseCoursesList(data);
}
