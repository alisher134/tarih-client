"use client";

import { useLocale, useTranslations } from "next-intl";

import type { User } from "@/entities/user";
import { formatDateTime } from "@/shared/lib/dayjs";
import { LinkButton } from "@/shared/ui/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type AdminUsersTableProps = {
  users: User[];
};

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const t = useTranslations("adminUsers");
  const locale = useLocale();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("email")}</TableHead>
          <TableHead>{t("firstName")}</TableHead>
          <TableHead>{t("lastName")}</TableHead>
          <TableHead>{t("role")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>
              <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-foreground">
                {user.isAdmin ? t("admin") : t("user")}
              </span>
            </TableCell>
            <TableCell>{formatDateTime(user.createdAt, locale)}</TableCell>
            <TableCell>
              <LinkButton
                href={`/admin/users/${user.id}`}
                variant="outline"
                size="sm"
              >
                {t("open")}
              </LinkButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
