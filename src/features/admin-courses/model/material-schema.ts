import { z } from "zod";

import { LESSON_MATERIAL_TYPES } from "@/entities/course";
import type { Translate } from "@/shared/types/form";

type MaterialMessageKey = "errors.titleRequired" | "errors.fileRequired";

export function createMaterialSchema(t: Translate<MaterialMessageKey>) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t("errors.titleRequired") }),
    type: z.enum(LESSON_MATERIAL_TYPES),
    fileObjectKey: z.string().min(1, { message: t("errors.fileRequired") }),
    fileName: z.string().min(1, { message: t("errors.fileRequired") }),
    fileSize: z.number(),
    order: z.coerce.number(),
  });
}

export type MaterialFormValues = z.infer<
  ReturnType<typeof createMaterialSchema>
>;
