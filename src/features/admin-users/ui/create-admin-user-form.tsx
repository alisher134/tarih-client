"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { CheckboxField } from "@/shared/ui/checkbox-field";
import { EmailField } from "@/shared/ui/email-field";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { InputField } from "@/shared/ui/input-field";
import { PasswordField } from "@/shared/ui/password-field";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createCreateUserSchema,
  type CreateUserValues,
} from "../model/create-user-schema";
import { useCreateUser } from "../model/use-create-user";

export function CreateAdminUserForm() {
  const t = useTranslations("adminUsers");
  const router = useRouter();
  const { mutate, isPending } = useCreateUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useZodForm(createCreateUserSchema(t), {
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
    },
  });

  const { errors } = form.formState;

  const handleCreate = (values: CreateUserValues) => {
    setSubmitError(null);

    mutate(
      {
        email: values.email.toLowerCase(),
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        isAdmin: values.isAdmin,
      },
      {
        onSuccess: () => {
          showSuccessToast(t("successCreate"));
          router.replace("/admin/users");
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, t("errors.createFailed")));
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-5">
      <Show when={submitError != null}>
        <ErrorAlert errorMessage={submitError!} />
      </Show>

      <AppForm
        form={form}
        onSubmit={handleCreate}
        className="flex flex-col gap-5"
      >
        {({ register }) => (
          <>
            <EmailField
              label={t("email")}
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label={t("firstName")}
                error={errors.firstName?.message}
                autoComplete="given-name"
                {...register("firstName")}
              />
              <InputField
                label={t("lastName")}
                error={errors.lastName?.message}
                autoComplete="family-name"
                {...register("lastName")}
              />
            </div>
            <PasswordField
              label={t("password")}
              error={errors.password?.message}
              autoComplete="new-password"
              {...register("password")}
            />
            <PasswordField
              label={t("confirmPassword")}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <CheckboxField
              label={t("isAdmin")}
              error={errors.isAdmin?.message}
              {...register("isAdmin")}
            />
            <Button type="submit" disabled={isPending} className="self-end">
              {t("createSubmit")}
            </Button>
          </>
        )}
      </AppForm>
    </section>
  );
}
