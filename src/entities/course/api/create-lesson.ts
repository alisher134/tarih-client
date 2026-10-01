import { apiClient } from "@/shared/api";

import { parseCourseLesson } from "../lib/parse-course";
import type { CourseLesson, CreateLessonInput } from "../model/types";

export async function createLesson(
  courseId: string,
  input: CreateLessonInput,
): Promise<CourseLesson> {
  const { data } = await apiClient.post(
    `/admin/courses/${courseId}/lessons`,
    input,
  );

  return parseCourseLesson(data);
}
