import type { CoursesListQuery } from "@/entities/course";

export const DEFAULT_COURSES_LIMIT = 12;

export function parseCoursesListQuery(
  searchParams: URLSearchParams,
): CoursesListQuery {
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit"));
  const search = searchParams.get("search")?.trim() ?? "";

  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    limit:
      Number.isInteger(limit) && limit >= 1 && limit <= 100
        ? limit
        : DEFAULT_COURSES_LIMIT,
    search: search.slice(0, 100) || undefined,
  };
}

export function toCoursesSearchParams(query: CoursesListQuery) {
  const params = new URLSearchParams();

  if (query.page > 1) params.set("page", String(query.page));
  if (query.limit !== DEFAULT_COURSES_LIMIT) {
    params.set("limit", String(query.limit));
  }
  if (query.search) params.set("search", query.search);

  return params;
}
