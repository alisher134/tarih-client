import { apiClient } from "@/shared/api";

import { parseCourseLesson } from "../lib/parse-course";
import type { CourseLesson, CreateLessonInput } from "../model/types";

export async function createLesson(
  courseId: string,
  input: CreateLessonInput,
): Promise<CourseLesson> {
  const { data } = await apiClient.post(
    `/admin/courses/${courseId}/lessons`,
    // Backend still has isFree; all lessons are paid
    { ...input, isFree: false },
  );

  return parseCourseLesson(data);
}
