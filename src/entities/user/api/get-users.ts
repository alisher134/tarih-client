import { apiClient } from "@/shared/api";

import { parseUsersList } from "../lib/parse-user";
import type { UsersList, UsersListQuery } from "../model/types";

export async function getUsers(query: UsersListQuery): Promise<UsersList> {
  const { data } = await apiClient.get("/admin/users", {
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search || undefined,
      isAdmin: query.isAdmin,
      sort: query.sort,
      order: query.order,
    },
  });

  return parseUsersList(data);
}
