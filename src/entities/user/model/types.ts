export const USER_SORT_FIELDS = [
  "createdAt",
  "email",
  "firstName",
  "lastName",
] as const;

export type UserSortField = (typeof USER_SORT_FIELDS)[number];

export type SortOrder = "asc" | "desc";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsersListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UsersList = {
  data: User[];
  meta: UsersListMeta;
};

export type UsersListQuery = {
  page: number;
  limit: number;
  search?: string;
  isAdmin?: boolean;
  sort: UserSortField;
  order: SortOrder;
};

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin?: boolean;
};

export type UpdateUserInput = {
  email?: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
};
