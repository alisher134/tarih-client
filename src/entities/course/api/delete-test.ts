import { apiClient } from "@/shared/api";

export async function deleteTest(testId: string): Promise<void> {
  await apiClient.delete(`/admin/tests/${testId}`);
}
