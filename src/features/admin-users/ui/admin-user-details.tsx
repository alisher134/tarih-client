"use client";

import { useLocale, useTranslations } from "next-intl";

import { AdminUserSubscriptions } from "@/features/admin-subscriptions";
import { getErrorMessage } from "@/shared/api";
import { formatDateTime } from "@/shared/lib/dayjs";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { ErrorAlert } from "@/shared/ui/error-alert";

import { useUser } from "../model/use-user";
import { DeleteAdminUserDialog } from "./delete-admin-user-dialog";
import { ResetAdminUserPasswordForm } from "./reset-admin-user-password-form";
import { UpdateAdminUserForm } from "./update-admin-user-form";

type AdminUserDetailsProps = {
  userId: string;
};

export function AdminUserDetails({ userId }: AdminUserDetailsProps) {
  const t = useTranslations("adminUsers");
  const locale = useLocale();
  const { data, isLoading, isError, error } = useUser(userId);

  return (
    <AsyncWrapper
      isLoading={isLoading}
      isError={isError}
      data={data}
      errorSlot={
        <ErrorAlert
          errorMessage={getErrorMessage(error, t("errors.userLoadFailed"))}
        />
      }
    >
      {(user) => (
        <div className="flex flex-col gap-10">
          <p className="text-sm text-muted-foreground">
            {t("createdAt")}: {formatDateTime(user.createdAt, locale)} ·{" "}
            {t("updatedAt")}: {formatDateTime(user.updatedAt, locale)}
          </p>
          <UpdateAdminUserForm user={user} />
          <AdminUserSubscriptions userId={user.id} />
          <ResetAdminUserPasswordForm userId={user.id} />
          <DeleteAdminUserDialog user={user} />
        </div>
      )}
    </AsyncWrapper>
  );
}
