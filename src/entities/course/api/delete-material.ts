import { apiClient } from "@/shared/api";

export async function deleteMaterial(materialId: string): Promise<void> {
  await apiClient.delete(`/admin/materials/${materialId}`);
}
