import { apiClient } from "@/shared/api";

import { parseLessonMaterial } from "../lib/parse-course";
import type { LessonMaterial, UpdateMaterialInput } from "../model/types";

export async function updateMaterial(
  materialId: string,
  input: UpdateMaterialInput,
): Promise<LessonMaterial> {
  const { data } = await apiClient.patch(
    `/admin/materials/${materialId}`,
    input,
  );

  return parseLessonMaterial(data);
}
