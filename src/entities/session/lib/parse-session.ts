import { z } from "zod";

import type { Session, SessionTokens, SessionUser } from "../model/types";

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().optional(),
  isAdmin: z.boolean().optional().default(false),
});

export const sessionTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const sessionSchema = sessionTokensSchema.extend({
  user: sessionUserSchema,
});

export function parseSessionUser(data: unknown): SessionUser {
  return sessionUserSchema.parse(data);
}

export function parseSessionTokens(data: unknown): SessionTokens {
  return sessionTokensSchema.parse(data);
}

export function parseSession(data: unknown): Session {
  return sessionSchema.parse(data);
}
