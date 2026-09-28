import { apiClient } from "@/shared/api";

import { parseCourseDetail } from "../lib/parse-course";
import type { CourseDetail } from "../model/types";

export async function getAdminCourse(id: string): Promise<CourseDetail> {
  const { data } = await apiClient.get(`/admin/courses/${id}`);

  return parseCourseDetail(data);
}
