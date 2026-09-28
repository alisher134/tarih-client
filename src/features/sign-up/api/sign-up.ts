import { parseSession, type SignUpCredentials } from "@/entities/session";
import { apiClient } from "@/shared/api";

export async function signUp(body: SignUpCredentials) {
  const { data } = await apiClient.post("/auth/sign-up", body);
  return parseSession(data);
}
