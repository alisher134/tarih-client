"use client";

import { useCallback, useEffect, useState } from "react";

import type { SortOrder, UserSortField, UsersListQuery } from "@/entities/user";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@/shared/config/i18n/navigation";

import {
  parseUsersListQuery,
  toUsersSearchParams,
} from "./parse-users-list-query";

export function useAdminUsersFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filters = parseUsersListQuery(searchParams);
  const searchFromUrl = filters.search ?? "";

  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchInput(searchFromUrl);
  }

  const replaceFilters = useCallback(
    (next: UsersListQuery) => {
      const query = toUsersSearchParams(next).toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = searchInput.trim().slice(0, 100);
      const currentSearch = searchParams.get("search") ?? "";

      if (nextSearch === currentSearch) return;

      const nextFilters = parseUsersListQuery(searchParams);

      replaceFilters({
        ...nextFilters,
        search: nextSearch || undefined,
        page: 1,
      });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, searchParams, replaceFilters]);

  return {
    filters,
    searchInput,
    setSearchInput,
    setPage: (page: number) => replaceFilters({ ...filters, page }),
    setLimit: (limit: number) => replaceFilters({ ...filters, limit, page: 1 }),
    setIsAdmin: (isAdmin: boolean | undefined) =>
      replaceFilters({ ...filters, isAdmin, page: 1 }),
    setSort: (sort: UserSortField) =>
      replaceFilters({ ...filters, sort, page: 1 }),
    setOrder: (order: SortOrder) =>
      replaceFilters({ ...filters, order, page: 1 }),
  };
}
