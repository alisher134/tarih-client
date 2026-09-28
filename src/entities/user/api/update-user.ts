import { apiClient } from "@/shared/api";

import { parseUser } from "../lib/parse-user";
import type { UpdateUserInput, User } from "../model/types";

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  const { data } = await apiClient.patch(`/admin/users/${id}`, input);

  return parseUser(data);
}
