"use client";

import { useId } from "react";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Field, FieldLabel } from "@/shared/ui/field";
import { SearchInput } from "@/shared/ui/search-input";
import { Show } from "@/shared/ui/show";

import { useCoursesFilters } from "../model/use-courses-filters";
import { useCoursesList } from "../model/use-courses-list";
import { CourseCard } from "./course-card";
import { CoursesPagination } from "./courses-pagination";

export function CoursesCatalog() {
  const t = useTranslations("courses");
  const searchId = useId();
  const { filters, searchInput, setSearchInput, setPage } = useCoursesFilters();
  const { data, isLoading, isError, error } = useCoursesList(filters);

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel
          htmlFor={searchId}
          className="font-normal text-muted-foreground"
        >
          {t("search")}
        </FieldLabel>
        <SearchInput
          id={searchId}
          placeholder={t("searchPlaceholder")}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </Field>

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
          <div className="flex flex-col gap-5">
            <Show
              when={coursesList.data.length > 0}
              fallback={
                <EmptyState
                  title={t("emptyTitle")}
                  description={t("empty")}
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {coursesList.data.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    actionHref={`/dashboard/courses/${course.slug}`}
                    actionLabel={t("details")}
                  />
                ))}
              </div>
            </Show>

            <Show when={coursesList.meta.total > 0}>
              <CoursesPagination
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
