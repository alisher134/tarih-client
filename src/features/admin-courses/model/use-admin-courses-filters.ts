"use client";

import { useCallback, useEffect, useState } from "react";

import type { AdminCoursesListQuery, CourseStatus } from "@/entities/course";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@/shared/config/i18n/navigation";

import {
  parseAdminCoursesQuery,
  toAdminCoursesSearchParams,
} from "./parse-admin-courses-query";

export function useAdminCoursesFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filters = parseAdminCoursesQuery(searchParams);
  const searchFromUrl = filters.search ?? "";

  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchInput(searchFromUrl);
  }

  const replaceFilters = useCallback(
    (next: AdminCoursesListQuery) => {
      const query = toAdminCoursesSearchParams(next).toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = searchInput.trim().slice(0, 100);
      const currentSearch = searchParams.get("search") ?? "";

      if (nextSearch === currentSearch) return;

      const nextFilters = parseAdminCoursesQuery(searchParams);

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
    setStatus: (status: CourseStatus | undefined) =>
      replaceFilters({ ...filters, status, page: 1 }),
  };
}
