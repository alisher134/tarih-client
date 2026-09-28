import { apiClient } from "@/shared/api";

import { parseLessonTest } from "../lib/parse-course";
import type { LessonTest, UpdateTestInput } from "../model/types";

export async function updateTest(
  testId: string,
  input: UpdateTestInput,
): Promise<LessonTest> {
  const { data } = await apiClient.patch(`/admin/tests/${testId}`, input);

  return parseLessonTest(data);
}
