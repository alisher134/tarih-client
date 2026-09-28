import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type CreateUserMessageKey =
  | "errors.emailRequired"
  | "errors.emailInvalid"
  | "errors.firstNameRequired"
  | "errors.firstNameMax"
  | "errors.lastNameRequired"
  | "errors.lastNameMax"
  | "errors.passwordRequired"
  | "errors.passwordLength"
  | "errors.confirmPasswordRequired"
  | "errors.passwordMismatch";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MAX_NAME_LENGTH = 100;

export function createCreateUserSchema(t: Translate<CreateUserMessageKey>) {
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
      isAdmin: z.boolean(),
    })
    .superRefine((values, ctx) => {
      if (
        values.password.length < MIN_PASSWORD_LENGTH ||
        values.password.length > MAX_PASSWORD_LENGTH
      ) {
        ctx.addIssue({
          code: "custom",
          message: t(
            values.password.length === 0
              ? "errors.passwordRequired"
              : "errors.passwordLength",
          ),
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

export type CreateUserValues = z.infer<
  ReturnType<typeof createCreateUserSchema>
>;
