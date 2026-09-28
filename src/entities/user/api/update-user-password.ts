import { apiClient } from "@/shared/api";

export async function updateUserPassword(id: string, newPassword: string) {
  await apiClient.patch(`/admin/users/${id}/password`, { newPassword });
}
