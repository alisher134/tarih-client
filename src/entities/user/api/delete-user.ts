import { apiClient } from "@/shared/api";

export async function deleteUser(id: string) {
  await apiClient.delete(`/admin/users/${id}`);
}
