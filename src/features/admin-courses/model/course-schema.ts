import { z } from "zod";

import { COURSE_STATUSES } from "@/entities/course";
import type { Translate } from "@/shared/types/form";

type CourseMessageKey =
  | "errors.titleRequired"
  | "errors.titleMax"
  | "errors.slugRequired"
  | "errors.slugInvalid"
  | "errors.orderInvalid";

const MAX_TITLE_LENGTH = 200;

export function createCourseSchema(t: Translate<CourseMessageKey>) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t("errors.titleRequired") })
      .max(MAX_TITLE_LENGTH, { message: t("errors.titleMax") }),
    description: z.string(),
    slug: z
      .string()
      .trim()
      .min(1, { message: t("errors.slugRequired") })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: t("errors.slugInvalid"),
      }),
    status: z.enum(COURSE_STATUSES),
    order: z.coerce.number({ invalid_type_error: t("errors.orderInvalid") }),
  });
}

export type CourseFormValues = z.infer<ReturnType<typeof createCourseSchema>>;
