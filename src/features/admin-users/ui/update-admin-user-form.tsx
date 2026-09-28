"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useSession } from "@/entities/session";
import type { User } from "@/entities/user";
import { getErrorMessage } from "@/shared/api";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { CheckboxField } from "@/shared/ui/checkbox-field";
import { EmailField } from "@/shared/ui/email-field";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { InputField } from "@/shared/ui/input-field";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createUpdateUserSchema,
  type UpdateUserValues,
} from "../model/update-user-schema";
import { useUpdateUser } from "../model/use-update-user";

type UpdateAdminUserFormProps = {
  user: User;
};

export function UpdateAdminUserForm({ user }: UpdateAdminUserFormProps) {
  const t = useTranslations("adminUsers");
  const { data: sessionUser } = useSession();
  const { mutate, isPending } = useUpdateUser(user.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSelf = sessionUser?.id === user.id;

  const form = useZodForm(createUpdateUserSchema(t), {
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    },
    values: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    },
  });

  const { errors } = form.formState;
  const isAdminValue = form.watch("isAdmin");
  const isSelfDemotion = isSelf && user.isAdmin && !isAdminValue;

  const handleSave = (values: UpdateUserValues) => {
    setSubmitError(null);

    if (isSelf && user.isAdmin && !values.isAdmin) {
      setSubmitError(t("cannotDemoteSelf"));
      return;
    }

    mutate(
      {
        email: values.email.toLowerCase(),
        firstName: values.firstName,
        lastName: values.lastName,
        isAdmin: values.isAdmin,
      },
      {
        onSuccess: () => {
          showSuccessToast(t("successUpdate"));
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, t("errors.updateFailed")));
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading>{t("profileTitle")}</SectionHeading>

      <Show when={submitError != null}>
        <ErrorAlert errorMessage={submitError!} />
      </Show>

      <Show when={isSelfDemotion}>
        <p className="text-sm text-muted-foreground">{t("cannotDemoteSelf")}</p>
      </Show>

      <AppForm
        form={form}
        onSubmit={handleSave}
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
            <CheckboxField
              label={t("isAdmin")}
              error={errors.isAdmin?.message}
              {...register("isAdmin")}
            />
            <Button
              type="submit"
              disabled={isPending || isSelfDemotion}
              className="self-end"
            >
              {t("save")}
            </Button>
          </>
        )}
      </AppForm>
    </section>
  );
}
