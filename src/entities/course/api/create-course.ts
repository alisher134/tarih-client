import { apiClient } from "@/shared/api";

import { parseCourse } from "../lib/parse-course";
import type { Course, CreateCourseInput } from "../model/types";

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const { data } = await apiClient.post("/admin/courses", input);

  return parseCourse(data);
}
