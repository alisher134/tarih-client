import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type ResetPasswordMessageKey =
  | "errors.passwordRequired"
  | "errors.passwordLength"
  | "errors.confirmPasswordRequired"
  | "errors.passwordMismatch";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export function createResetUserPasswordSchema(
  t: Translate<ResetPasswordMessageKey>,
) {
  return z
    .object({
      newPassword: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((values, ctx) => {
      if (
        values.newPassword.length < MIN_PASSWORD_LENGTH ||
        values.newPassword.length > MAX_PASSWORD_LENGTH
      ) {
        ctx.addIssue({
          code: "custom",
          message: t(
            values.newPassword.length === 0
              ? "errors.passwordRequired"
              : "errors.passwordLength",
          ),
          path: ["newPassword"],
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

      if (values.newPassword !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.passwordMismatch"),
          path: ["confirmPassword"],
        });
      }
    });
}

export type ResetUserPasswordValues = z.infer<
  ReturnType<typeof createResetUserPasswordSchema>
>;
