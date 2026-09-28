import {
  USER_SORT_FIELDS,
  type SortOrder,
  type UserSortField,
  type UsersListQuery,
} from "@/entities/user";

export const DEFAULT_USERS_LIMIT = 20;

function isUserSortField(value: string): value is UserSortField {
  return USER_SORT_FIELDS.includes(value as UserSortField);
}

function isSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

export function parseUsersListQuery(
  searchParams: URLSearchParams,
): UsersListQuery {
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit"));
  const search = searchParams.get("search")?.trim() ?? "";
  const isAdminParam = searchParams.get("isAdmin");
  const sortParam = searchParams.get("sort") ?? "";
  const orderParam = searchParams.get("order") ?? "";

  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    limit:
      Number.isInteger(limit) && limit >= 1 && limit <= 100
        ? limit
        : DEFAULT_USERS_LIMIT,
    search: search.slice(0, 100) || undefined,
    isAdmin:
      isAdminParam === "true"
        ? true
        : isAdminParam === "false"
          ? false
          : undefined,
    sort: isUserSortField(sortParam) ? sortParam : "createdAt",
    order: isSortOrder(orderParam) ? orderParam : "desc",
  };
}

export function toUsersSearchParams(query: UsersListQuery) {
  const params = new URLSearchParams();

  if (query.page > 1) params.set("page", String(query.page));
  if (query.limit !== DEFAULT_USERS_LIMIT) {
    params.set("limit", String(query.limit));
  }
  if (query.search) params.set("search", query.search);
  if (query.isAdmin != null) params.set("isAdmin", String(query.isAdmin));
  if (query.sort !== "createdAt") params.set("sort", query.sort);
  if (query.order !== "desc") params.set("order", query.order);

  return params;
}
