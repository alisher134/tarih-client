"use client";

import { useId } from "react";

import { useTranslations } from "next-intl";

import type { CourseStatus } from "@/entities/course";
import { Field, FieldLabel } from "@/shared/ui/field";
import { SearchInput } from "@/shared/ui/search-input";
import { SelectField } from "@/shared/ui/select-field";

type AdminCoursesFiltersProps = {
  searchInput: string;
  status: CourseStatus | undefined;
  limit: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CourseStatus | undefined) => void;
  onLimitChange: (value: number) => void;
};

export function AdminCoursesFilters({
  searchInput,
  status,
  limit,
  onSearchChange,
  onStatusChange,
  onLimitChange,
}: AdminCoursesFiltersProps) {
  const t = useTranslations("adminCourses");
  const searchId = useId();

  return (
    <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
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
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </Field>

      <SelectField
        label={t("status")}
        value={status ?? "all"}
        onChange={(event) => {
          const nextValue = event.target.value;

          onStatusChange(
            nextValue === "all" ? undefined : (nextValue as CourseStatus),
          );
        }}
      >
        <option value="all">{t("allStatuses")}</option>
        <option value="DRAFT">{t("statusDraft")}</option>
        <option value="PUBLISHED">{t("statusPublished")}</option>
        <option value="ARCHIVED">{t("statusArchived")}</option>
      </SelectField>

      <SelectField
        label={t("limit")}
        value={String(limit)}
        onChange={(event) => onLimitChange(Number(event.target.value))}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </SelectField>
    </div>
  );
}
