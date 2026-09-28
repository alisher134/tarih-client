import { apiClient } from "@/shared/api";

import { parseCourseLesson } from "../lib/parse-course";
import type { CourseLesson, UpdateLessonInput } from "../model/types";

export async function updateLesson(
  lessonId: string,
  input: UpdateLessonInput,
): Promise<CourseLesson> {
  const { data } = await apiClient.patch(`/admin/lessons/${lessonId}`, {
    ...input,
    // Backend still has isFree; all lessons are paid
    isFree: false,
  });

  return parseCourseLesson(data);
}
