import { apiClient } from "@/shared/api";

export async function deleteLesson(lessonId: string): Promise<void> {
  await apiClient.delete(`/admin/lessons/${lessonId}`);
}
