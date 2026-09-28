"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PasswordField } from "@/shared/ui/password-field";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createResetUserPasswordSchema,
  type ResetUserPasswordValues,
} from "../model/reset-user-password-schema";
import { useResetUserPassword } from "../model/use-reset-user-password";

const emptyPasswordValues = {
  newPassword: "",
  confirmPassword: "",
};

type ResetAdminUserPasswordFormProps = {
  userId: string;
};

export function ResetAdminUserPasswordForm({
  userId,
}: ResetAdminUserPasswordFormProps) {
  const t = useTranslations("adminUsers");
  const { mutate, isPending } = useResetUserPassword(userId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useZodForm(createResetUserPasswordSchema(t), {
    defaultValues: emptyPasswordValues,
  });

  const { errors } = form.formState;

  const handleSave = ({ newPassword }: ResetUserPasswordValues) => {
    setSubmitError(null);

    mutate(newPassword, {
      onSuccess: () => {
        showSuccessToast(t("successPassword"));
        form.reset(emptyPasswordValues);
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error, t("errors.passwordFailed")));
      },
    });
  };

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading>{t("passwordTitle")}</SectionHeading>

      <Show when={submitError != null}>
        <ErrorAlert errorMessage={submitError!} />
      </Show>

      <AppForm
        form={form}
        onSubmit={handleSave}
        className="flex flex-col gap-5"
      >
        {({ register }) => (
          <>
            <PasswordField
              label={t("newPassword")}
              error={errors.newPassword?.message}
              autoComplete="new-password"
              {...register("newPassword")}
            />
            <PasswordField
              label={t("confirmPassword")}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <Button type="submit" disabled={isPending} className="self-end">
              {t("save")}
            </Button>
          </>
        )}
      </AppForm>
    </section>
  );
}
