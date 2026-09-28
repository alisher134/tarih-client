import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type SignInMessageKey =
  "errors.emailRequired" | "errors.emailInvalid" | "errors.passwordRequired";

export function createSignInSchema(t: Translate<SignInMessageKey>) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t("errors.emailRequired") })
      .email({ message: t("errors.emailInvalid") }),
    password: z.string().min(1, { message: t("errors.passwordRequired") }),
  });
}

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>;
