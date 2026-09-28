"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getUsers,
  usersListQueryKey,
  type UsersListQuery,
} from "@/entities/user";

export function useUsersList(query: UsersListQuery) {
  return useQuery({
    queryKey: usersListQueryKey(query),
    queryFn: () => getUsers(query),
    placeholderData: keepPreviousData,
  });
}
