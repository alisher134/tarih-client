"use client";

import { useId } from "react";

import { useTranslations } from "next-intl";

import type { SortOrder, UserSortField } from "@/entities/user";
import { Field, FieldLabel } from "@/shared/ui/field";
import { SearchInput } from "@/shared/ui/search-input";
import { SelectField } from "@/shared/ui/select-field";

type AdminUsersFiltersProps = {
  searchInput: string;
  isAdmin: boolean | undefined;
  sort: UserSortField;
  order: SortOrder;
  limit: number;
  onSearchChange: (value: string) => void;
  onIsAdminChange: (value: boolean | undefined) => void;
  onSortChange: (value: UserSortField) => void;
  onOrderChange: (value: SortOrder) => void;
  onLimitChange: (value: number) => void;
};

export function AdminUsersFilters({
  searchInput,
  isAdmin,
  sort,
  order,
  limit,
  onSearchChange,
  onIsAdminChange,
  onSortChange,
  onOrderChange,
  onLimitChange,
}: AdminUsersFiltersProps) {
  const t = useTranslations("adminUsers");
  const searchId = useId();

  return (
    <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
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
        label={t("role")}
        value={isAdmin == null ? "all" : String(isAdmin)}
        onChange={(event) => {
          const nextValue = event.target.value;

          onIsAdminChange(
            nextValue === "all" ? undefined : nextValue === "true",
          );
        }}
      >
        <option value="all">{t("allRoles")}</option>
        <option value="true">{t("admin")}</option>
        <option value="false">{t("user")}</option>
      </SelectField>

      <SelectField
        label={t("sort")}
        value={sort}
        onChange={(event) => onSortChange(event.target.value as UserSortField)}
      >
        <option value="createdAt">{t("sortCreatedAt")}</option>
        <option value="email">{t("sortEmail")}</option>
        <option value="firstName">{t("sortFirstName")}</option>
        <option value="lastName">{t("sortLastName")}</option>
      </SelectField>

      <SelectField
        label={t("order")}
        value={order}
        onChange={(event) => onOrderChange(event.target.value as SortOrder)}
      >
        <option value="desc">{t("orderDesc")}</option>
        <option value="asc">{t("orderAsc")}</option>
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
