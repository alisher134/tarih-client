import axios from "axios";

import { API_BASE_URL } from "@/shared/config/api";

import { parseSessionTokens } from "../lib/parse-session";
import { getRefreshToken, saveTokens } from "../lib/token-storage";

export async function refreshSession() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const { data } = await axios.post(
    "/auth/refresh",
    { refreshToken },
    {
      baseURL: API_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const tokens = parseSessionTokens(data);
  saveTokens(tokens);

  return tokens.accessToken;
}
