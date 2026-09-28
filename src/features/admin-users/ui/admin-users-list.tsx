"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";

import { useAdminUsersFilters } from "../model/use-admin-users-filters";
import { useUsersList } from "../model/use-users-list";
import { AdminUsersFilters } from "./admin-users-filters";
import { AdminUsersPagination } from "./admin-users-pagination";
import { AdminUsersTable } from "./admin-users-table";

export function AdminUsersList() {
  const t = useTranslations("adminUsers");
  const {
    filters,
    searchInput,
    setSearchInput,
    setPage,
    setLimit,
    setIsAdmin,
    setSort,
    setOrder,
  } = useAdminUsersFilters();
  const { data, isLoading, isError, error } = useUsersList(filters);

  return (
    <div className="flex flex-col gap-5">
      <AdminUsersFilters
        searchInput={searchInput}
        isAdmin={filters.isAdmin}
        sort={filters.sort}
        order={filters.order}
        limit={filters.limit}
        onSearchChange={setSearchInput}
        onIsAdminChange={setIsAdmin}
        onSortChange={setSort}
        onOrderChange={setOrder}
        onLimitChange={setLimit}
      />

      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        errorSlot={
          <ErrorAlert
            errorMessage={getErrorMessage(error, t("errors.loadFailed"))}
          />
        }
      >
        {(usersList) => (
          <div className="flex flex-col gap-4">
            <Show
              when={usersList.data.length > 0}
              fallback={
                <EmptyState title={t("empty")} />
              }
            >
              <AdminUsersTable users={usersList.data} />
            </Show>

            <Show when={usersList.meta.total > 0}>
              <AdminUsersPagination
                meta={usersList.meta}
                onPageChange={setPage}
              />
            </Show>
          </div>
        )}
      </AsyncWrapper>
    </div>
  );
}
