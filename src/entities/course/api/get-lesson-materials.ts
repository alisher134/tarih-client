import { apiClient } from "@/shared/api";

import { parseLessonMaterials } from "../lib/parse-course";
import type { LessonMaterial } from "../model/types";

export async function getLessonMaterials(
  lessonId: string,
): Promise<LessonMaterial[]> {
  const { data } = await apiClient.get(
    `/lessons/${encodeURIComponent(lessonId)}/materials`,
  );

  return parseLessonMaterials(data);
}
