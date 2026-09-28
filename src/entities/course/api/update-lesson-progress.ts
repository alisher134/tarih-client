import { apiClient } from "@/shared/api";

import { parseLessonProgress } from "../lib/parse-course";
import type {
  UpdateLessonProgressInput,
  UserLessonProgress,
} from "../model/types";

export async function updateLessonProgress(
  lessonId: string,
  input: UpdateLessonProgressInput,
): Promise<UserLessonProgress> {
  const { data } = await apiClient.patch(
    `/lessons/${lessonId}/progress`,
    input,
  );
  const progress = parseLessonProgress(data);

  if (progress == null) {
    throw new Error("Invalid lesson progress");
  }

  return progress;
}
