import { parseSessionUser } from "@/entities/session";
import { apiClient } from "@/shared/api";

import type { UpdateProfileValues } from "../model/update-profile-schema";

export async function updateProfile(body: UpdateProfileValues) {
  const { data } = await apiClient.patch("/users/me", body);
  return parseSessionUser(data);
}
