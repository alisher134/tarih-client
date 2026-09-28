import { apiClient } from "@/shared/api";

export async function deleteQuestion(questionId: string): Promise<void> {
  await apiClient.delete(`/admin/questions/${questionId}`);
}
