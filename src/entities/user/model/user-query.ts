import type { UsersListQuery } from "./types";

export const USERS_QUERY_KEY = ["admin", "users"] as const;

export function usersListQueryKey(query: UsersListQuery) {
  return [...USERS_QUERY_KEY, "list", query] as const;
}

export function userDetailQueryKey(id: string) {
  return [...USERS_QUERY_KEY, "detail", id] as const;
}
