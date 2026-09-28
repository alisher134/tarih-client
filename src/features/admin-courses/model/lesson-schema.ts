import { z } from "zod";

import type { Translate } from "@/shared/types/form";

type LessonMessageKey = "errors.titleRequired" | "errors.titleMax";

const MAX_TITLE_LENGTH = 200;

export function createLessonSchema(t: Translate<LessonMessageKey>) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t("errors.titleRequired") })
      .max(MAX_TITLE_LENGTH, { message: t("errors.titleMax") }),
    description: z.string(),
    order: z.coerce.number(),
    videoObjectKey: z.string(),
    videoDuration: z.coerce.number(),
  });
}

export type LessonFormValues = z.infer<ReturnType<typeof createLessonSchema>>;
