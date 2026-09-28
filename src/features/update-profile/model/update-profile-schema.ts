import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type UpdateProfileMessageKey =
  "errors.firstNameRequired" | "errors.lastNameRequired";

export function createUpdateProfileSchema(
  t: Translate<UpdateProfileMessageKey>,
) {
  return z.object({
    lastName: z
      .string()
      .trim()
      .min(1, { message: t("errors.lastNameRequired") }),
    firstName: z
      .string()
      .trim()
      .min(1, { message: t("errors.firstNameRequired") }),
  });
}

export type UpdateProfileValues = z.infer<
  ReturnType<typeof createUpdateProfileSchema>
>;
