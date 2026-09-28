import { apiClient } from "@/shared/api";

export async function deleteCourse(id: string): Promise<void> {
  await apiClient.delete(`/admin/courses/${id}`);
}
