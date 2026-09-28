import { apiClient } from "@/shared/api";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export async function changePassword(body: ChangePasswordBody) {
  await apiClient.patch("/users/me/password", body);
}
