"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { resetSession } from "@/entities/session";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PasswordField } from "@/shared/ui/password-field";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createChangePasswordSchema,
  type ChangePasswordValues,
} from "../model/change-password-schema";
import { useChangePassword } from "../model/use-change-password";

const emptyPasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const t = useTranslations("changePassword");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useChangePassword();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useZodForm(createChangePasswordSchema(t), {
    defaultValues: emptyPasswordValues,
  });

  const { errors } = form.formState;

  const handleSave = ({
    currentPassword,
    newPassword,
  }: ChangePasswordValues) => {
    setSubmitError(null);

    mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          resetSession(queryClient);
          showSuccessToast(t("success"));
          router.replace("/sign-in");
        },
        onError: (error) => {
          setSubmitError(
            getLocalizedApiErrorMessage(
              error,
              (code) => tErrors(`apiCodes.${code}`),
              t("errors.requestFailed"),
            ),
          );
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading>{t("title")}</SectionHeading>

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
              label={t("currentPassword")}
              placeholder={t("currentPasswordPlaceholder")}
              error={errors.currentPassword?.message}
              autoComplete="current-password"
              {...register("currentPassword")}
            />

            <PasswordField
              label={t("newPassword")}
              placeholder={t("newPasswordPlaceholder")}
              error={errors.newPassword?.message}
              autoComplete="new-password"
              {...register("newPassword")}
            />

            <PasswordField
              label={t("confirmPassword")}
              placeholder={t("confirmPasswordPlaceholder")}
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
