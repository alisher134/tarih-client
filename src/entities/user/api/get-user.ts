import { apiClient } from "@/shared/api";

import { parseUser } from "../lib/parse-user";
import type { User } from "../model/types";

export async function getUser(id: string): Promise<User> {
  const { data } = await apiClient.get(`/admin/users/${id}`);

  return parseUser(data);
}
