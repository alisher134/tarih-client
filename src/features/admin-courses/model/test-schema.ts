import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type TestMessageKey =
  "errors.titleRequired" | "errors.titleMax" | "errors.passingScoreInvalid";

const MAX_TITLE_LENGTH = 200;

export function createTestSchema(t: Translate<TestMessageKey>) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t("errors.titleRequired") })
      .max(MAX_TITLE_LENGTH, { message: t("errors.titleMax") }),
    description: z.string(),
    passingScore: z.coerce
      .number()
      .min(0, { message: t("errors.passingScoreInvalid") })
      .max(100, { message: t("errors.passingScoreInvalid") }),
    timeLimit: z.string(),
    attemptsLimit: z.string(),
  });
}

export type TestFormValues = z.infer<ReturnType<typeof createTestSchema>>;

export function toOptionalLimit(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed.length === 0) return null;

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
}
