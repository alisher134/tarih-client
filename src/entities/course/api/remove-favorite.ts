import { apiClient } from "@/shared/api";

export async function removeFavorite(courseId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/favorite`);
}
