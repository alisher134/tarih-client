import { apiClient } from "@/shared/api";

import { parseCourse } from "../lib/parse-course";
import type { Course, UpdateCourseInput } from "../model/types";

export async function updateCourse(
  id: string,
  input: UpdateCourseInput,
): Promise<Course> {
  const { data } = await apiClient.patch(`/admin/courses/${id}`, input);

  return parseCourse(data);
}
