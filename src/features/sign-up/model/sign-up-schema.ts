import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type SignUpMessageKey =
  | "errors.emailRequired"
  | "errors.emailInvalid"
  | "errors.firstNameRequired"
  | "errors.firstNameMax"
  | "errors.lastNameRequired"
  | "errors.lastNameMax"
  | "errors.passwordRequired"
  | "errors.confirmPasswordRequired"
  | "errors.passwordMismatch";

const MAX_NAME_LENGTH = 100;

export function createSignUpSchema(t: Translate<SignUpMessageKey>) {
  return z
    .object({
      email: z
        .string()
        .trim()
        .min(1, { message: t("errors.emailRequired") })
        .email({ message: t("errors.emailInvalid") }),
      firstName: z
        .string()
        .trim()
        .min(1, { message: t("errors.firstNameRequired") })
        .max(MAX_NAME_LENGTH, { message: t("errors.firstNameMax") }),
      lastName: z
        .string()
        .trim()
        .min(1, { message: t("errors.lastNameRequired") })
        .max(MAX_NAME_LENGTH, { message: t("errors.lastNameMax") }),
      password: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.password.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.passwordRequired"),
          path: ["password"],
        });
      }

      if (values.confirmPassword.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.confirmPasswordRequired"),
          path: ["confirmPassword"],
        });
        return;
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.passwordMismatch"),
          path: ["confirmPassword"],
        });
      }
    });
}

export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>;
