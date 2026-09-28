import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type ChangePasswordMessageKey =
  | "errors.currentPasswordRequired"
  | "errors.newPasswordRequired"
  | "errors.passwordWeak"
  | "errors.confirmPasswordRequired"
  | "errors.passwordMismatch";

const MIN_PASSWORD_LENGTH = 8;

export function createChangePasswordSchema(
  t: Translate<ChangePasswordMessageKey>,
) {
  return z
    .object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.currentPassword.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.currentPasswordRequired"),
          path: ["currentPassword"],
        });
      }

      if (values.newPassword.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.newPasswordRequired"),
          path: ["newPassword"],
        });
      } else if (values.newPassword.length < MIN_PASSWORD_LENGTH) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.passwordWeak"),
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

export type ChangePasswordValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
