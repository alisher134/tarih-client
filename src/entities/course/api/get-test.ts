import { apiClient } from "@/shared/api";

import { parseStudentLessonTest } from "../lib/parse-course";
import type { StudentLessonTest } from "../model/types";

export async function getTest(testId: string): Promise<StudentLessonTest> {
  const { data } = await apiClient.get(`/tests/${testId}`);

  return parseStudentLessonTest(data);
}
