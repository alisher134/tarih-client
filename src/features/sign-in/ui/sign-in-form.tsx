"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { usePostAuthRedirect } from "@/features/require-auth/model/use-auth-return-url";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { EmailField } from "@/shared/ui/email-field";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PasswordField } from "@/shared/ui/password-field";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import { createSignInSchema, SignInValues } from "../model/sign-in-schema";
import { useSignIn } from "../model/use-sign-in";

export function SignInForm() {
  const t = useTranslations("signIn");
  const redirectAfterAuth = usePostAuthRedirect();
  const { mutate, isPending } = useSignIn();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useZodForm(createSignInSchema(t), {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = form.formState;

  const handleSignIn = (values: SignInValues) => {
    setSubmitError(null);

    mutate(values, {
      onSuccess: () => {
        showSuccessToast(t("success"));
        redirectAfterAuth();
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error, t("errors.requestFailed")));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Show when={submitError != null}>
        <ErrorAlert errorMessage={submitError!} />
      </Show>

      <AppForm
        form={form}
        onSubmit={handleSignIn}
        className="flex flex-col gap-4"
      >
        {({ register }) => (
          <>
            <EmailField
              label={t("email")}
              placeholder={t("emailPlaceholder")}
              error={errors.email?.message}
              {...register("email")}
            />

            <PasswordField
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              error={errors.password?.message}
              autoComplete="current-password"
              {...register("password")}
            />

            <Button type="submit" disabled={isPending} className="mt-1 w-full">
              {t("submit")}
            </Button>
          </>
        )}
      </AppForm>
    </div>
  );
}
