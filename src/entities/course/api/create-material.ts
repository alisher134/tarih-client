import { apiClient } from "@/shared/api";

import { parseLessonMaterial } from "../lib/parse-course";
import type { CreateMaterialInput, LessonMaterial } from "../model/types";

export async function createMaterial(
  lessonId: string,
  input: CreateMaterialInput,
): Promise<LessonMaterial> {
  const { data } = await apiClient.post(
    `/admin/lessons/${lessonId}/materials`,
    input,
  );

  return parseLessonMaterial(data);
}
