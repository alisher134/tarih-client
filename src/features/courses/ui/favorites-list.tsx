"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";

import { useFavorites } from "../model/use-favorites";
import { CourseCard } from "./course-card";

export function FavoritesList() {
  const t = useTranslations("courses");
  const favoritesQuery = useFavorites();

  return (
    <AsyncWrapper
      isLoading={favoritesQuery.isLoading}
      isError={favoritesQuery.isError}
      data={favoritesQuery.data}
      errorSlot={
        <ErrorAlert
          errorMessage={getErrorMessage(
            favoritesQuery.error,
            t("errors.loadFailed"),
          )}
        />
      }
    >
      {(items) => (
        <Show
          when={items.length > 0}
          fallback={
            <EmptyState
              title={t("emptyFavoritesTitle")}
              description={t("emptyFavorites")}
              action={
                <LinkButton href="/dashboard/courses" variant="outline" size="sm">
                  {t("browseCourses")}
                </LinkButton>
              }
            />
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const course = item.course;

              if (course == null) return null;

              return (
                <CourseCard
                  key={item.id}
                  course={course}
                  actionHref={`/dashboard/courses/${course.slug}`}
                  actionLabel={t("details")}
                />
              );
            })}
          </div>
        </Show>
      )}
    </AsyncWrapper>
  );
}
