import { z } from "zod";

import type { User, UsersList } from "../model/types";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const usersListSchema = z.object({
  data: z.array(userSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export function parseUser(data: unknown): User {
  return userSchema.parse(data);
}

export function parseUsersList(data: unknown): UsersList {
  return usersListSchema.parse(data);
}
