import { apiClient } from "@/shared/api";

import { parseStudentCourseDetail } from "../lib/parse-course";
import type { StudentCourseDetail } from "../model/types";

export async function getCourseBySlug(
  slug: string,
): Promise<StudentCourseDetail> {
  const { data } = await apiClient.get(`/courses/${slug}`);

  return parseStudentCourseDetail(data);
}
