"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";

import { useAdminCoursesFilters } from "../model/use-admin-courses-filters";
import { useAdminCoursesList } from "../model/use-admin-courses-list";
import { AdminCoursesFilters } from "./admin-courses-filters";
import { AdminCoursesPagination } from "./admin-courses-pagination";
import { AdminCoursesTable } from "./admin-courses-table";

export function AdminCoursesList() {
  const t = useTranslations("adminCourses");
  const { filters, searchInput, setSearchInput, setPage, setLimit, setStatus } =
    useAdminCoursesFilters();
  const { data, isLoading, isError, error } = useAdminCoursesList(filters);

  return (
    <div className="flex flex-col gap-5">
      <AdminCoursesFilters
        searchInput={searchInput}
        status={filters.status}
        limit={filters.limit}
        onSearchChange={setSearchInput}
        onStatusChange={setStatus}
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
        {(coursesList) => (
          <div className="flex flex-col gap-4">
            <Show
              when={coursesList.data.length > 0}
              fallback={
                <EmptyState title={t("empty")} />
              }
            >
              <AdminCoursesTable courses={coursesList.data} />
            </Show>

            <Show when={coursesList.meta.total > 0}>
              <AdminCoursesPagination
                meta={coursesList.meta}
                onPageChange={setPage}
              />
            </Show>
          </div>
        )}
      </AsyncWrapper>
    </div>
  );
}
