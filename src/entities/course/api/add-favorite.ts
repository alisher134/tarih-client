import { apiClient } from "@/shared/api";

export async function addFavorite(courseId: string): Promise<void> {
  await apiClient.post(`/courses/${courseId}/favorite`);
}
