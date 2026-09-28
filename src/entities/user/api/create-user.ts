import { apiClient } from "@/shared/api";

import { parseUser } from "../lib/parse-user";
import type { CreateUserInput, User } from "../model/types";

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data } = await apiClient.post("/admin/users", input);

  return parseUser(data);
}
