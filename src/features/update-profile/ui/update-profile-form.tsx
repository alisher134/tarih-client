"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useSession } from "@/entities/session";
import { getErrorMessage } from "@/shared/api";
import { useZodForm } from "@/shared/hooks/use-zod-form";
import { AppForm } from "@/shared/ui/app-form";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { InputField } from "@/shared/ui/input-field";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import {
  createUpdateProfileSchema,
  type UpdateProfileValues,
} from "../model/update-profile-schema";
import { useUpdateProfile } from "../model/use-update-profile";

export function UpdateProfileForm() {
  const t = useTranslations("updateProfile");
  const { data: user } = useSession();
  const { mutate, isPending } = useUpdateProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useZodForm(createUpdateProfileSchema(t), {
    defaultValues: { lastName: "", firstName: "" },
    values: {
      lastName: user?.lastName ?? "",
      firstName: user?.firstName ?? "",
    },
  });

  const { errors } = form.formState;

  const handleSave = (values: UpdateProfileValues) => {
    setSubmitError(null);

    mutate(values, {
      onSuccess: () => {
        showSuccessToast(t("success"));
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error, t("errors.requestFailed")));
      },
    });
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
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label={t("lastName")}
                placeholder={t("lastNamePlaceholder")}
                error={errors.lastName?.message}
                autoComplete="family-name"
                {...register("lastName")}
              />
              <InputField
                label={t("firstName")}
                placeholder={t("firstNamePlaceholder")}
                error={errors.firstName?.message}
                autoComplete="given-name"
                {...register("firstName")}
              />
            </div>

            <Button type="submit" disabled={isPending} className="self-end">
              {t("save")}
            </Button>
          </>
        )}
      </AppForm>
    </section>
  );
}
