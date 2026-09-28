import type { AdminCoursesListQuery, CourseStatus } from "@/entities/course";
import { COURSE_STATUSES } from "@/entities/course";

export const DEFAULT_ADMIN_COURSES_LIMIT = 20;

function isCourseStatus(value: string): value is CourseStatus {
  return COURSE_STATUSES.includes(value as CourseStatus);
}

export function parseAdminCoursesQuery(
  searchParams: URLSearchParams,
): AdminCoursesListQuery {
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit"));
  const search = searchParams.get("search")?.trim() ?? "";
  const statusParam = searchParams.get("status") ?? "";

  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    limit:
      Number.isInteger(limit) && limit >= 1 && limit <= 100
        ? limit
        : DEFAULT_ADMIN_COURSES_LIMIT,
    search: search.slice(0, 100) || undefined,
    status: isCourseStatus(statusParam) ? statusParam : undefined,
  };
}

export function toAdminCoursesSearchParams(query: AdminCoursesListQuery) {
  const params = new URLSearchParams();

  if (query.page > 1) params.set("page", String(query.page));
  if (query.limit !== DEFAULT_ADMIN_COURSES_LIMIT) {
    params.set("limit", String(query.limit));
  }
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);

  return params;
}
