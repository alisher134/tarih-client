import { z } from "zod";

import { QUESTION_TYPES } from "@/entities/course";
import type { Translate } from "@/shared/types/form";

type QuestionMessageKey =
  | "errors.questionRequired"
  | "errors.optionRequired"
  | "errors.optionsMin"
  | "errors.correctRequired";

export function createQuestionSchema(t: Translate<QuestionMessageKey>) {
  return z
    .object({
      text: z
        .string()
        .trim()
        .min(1, { message: t("errors.questionRequired") }),
      type: z.enum(QUESTION_TYPES),
      points: z.coerce.number(),
      options: z.array(
        z.object({
          text: z
            .string()
            .trim()
            .min(1, { message: t("errors.optionRequired") }),
          isCorrect: z.boolean(),
        }),
      ),
    })
    .superRefine((values, ctx) => {
      if (values.options.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.optionsMin"),
          path: ["options"],
        });
      }

      if (!values.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: "custom",
          message: t("errors.correctRequired"),
          path: ["options"],
        });
      }
    });
}

export type QuestionFormValues = z.infer<
  ReturnType<typeof createQuestionSchema>
>;
