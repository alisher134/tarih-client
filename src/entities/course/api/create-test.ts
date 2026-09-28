import { apiClient } from "@/shared/api";

import { parseLessonTest } from "../lib/parse-course";
import type { CreateTestInput, LessonTest } from "../model/types";

export async function createTest(
  lessonId: string,
  input: CreateTestInput,
): Promise<LessonTest> {
  const { data } = await apiClient.post(
    `/admin/lessons/${lessonId}/test`,
    input,
  );

  return parseLessonTest(data);
}
