import { apiClient } from "@/shared/api";

import { parseCoursesList } from "../lib/parse-course";
import type { CoursesList, CoursesListQuery } from "../model/types";

export async function getCourses(
  query: CoursesListQuery,
): Promise<CoursesList> {
  const { data } = await apiClient.get("/courses", {
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search || undefined,
    },
  });

  return parseCoursesList(data);
}
