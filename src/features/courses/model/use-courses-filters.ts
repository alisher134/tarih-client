"use client";

import { useCallback, useEffect, useState } from "react";

import type { CoursesListQuery } from "@/entities/course";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@/shared/config/i18n/navigation";

import {
  parseCoursesListQuery,
  toCoursesSearchParams,
} from "./parse-courses-list-query";

export function useCoursesFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filters = parseCoursesListQuery(searchParams);
  const searchFromUrl = filters.search ?? "";

  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchInput(searchFromUrl);
  }

  const replaceFilters = useCallback(
    (next: CoursesListQuery) => {
      const query = toCoursesSearchParams(next).toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = searchInput.trim().slice(0, 100);
      const currentSearch = searchParams.get("search") ?? "";

      if (nextSearch === currentSearch) return;

      const nextFilters = parseCoursesListQuery(searchParams);

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
  };
}
