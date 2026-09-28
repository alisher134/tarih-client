import { parseSession, type AuthCredentials } from "@/entities/session";
import { apiClient } from "@/shared/api";

export async function signIn(body: AuthCredentials) {
  const { data } = await apiClient.post("/auth/sign-in", body);
  return parseSession(data);
}
