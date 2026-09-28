import { apiClient } from "@/shared/api";

import { parseStudentLessonTest } from "../lib/parse-course";
import type { StudentLessonTest } from "../model/types";

export async function getLessonTest(
  lessonId: string,
): Promise<StudentLessonTest> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/test`);

  return parseStudentLessonTest(data);
}
