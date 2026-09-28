import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type UpdateUserMessageKey =
  | "errors.emailRequired"
  | "errors.emailInvalid"
  | "errors.firstNameRequired"
  | "errors.firstNameMax"
  | "errors.lastNameRequired"
  | "errors.lastNameMax";

const MAX_NAME_LENGTH = 100;

export function createUpdateUserSchema(t: Translate<UpdateUserMessageKey>) {
  return z.object({
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
    isAdmin: z.boolean(),
  });
}

export type UpdateUserValues = z.infer<
  ReturnType<typeof createUpdateUserSchema>
>;
