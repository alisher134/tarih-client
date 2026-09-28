import { apiClient } from "@/shared/api";

import { parseSessionUser } from "../lib/parse-session";

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return parseSessionUser(data);
}
