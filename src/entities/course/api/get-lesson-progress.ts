import { apiClient } from "@/shared/api";

import { parseLessonProgress } from "../lib/parse-course";
import type { UserLessonProgress } from "../model/types";

export async function getLessonProgress(
  lessonId: string,
): Promise<UserLessonProgress | null> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/progress`);

  return parseLessonProgress(data);
}
