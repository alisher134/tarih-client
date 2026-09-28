import type { SessionUser } from "../model/types";

export function formatUserName(user: SessionUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || user.email;
}
