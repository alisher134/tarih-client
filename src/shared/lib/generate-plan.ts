import { z } from "zod";

export const generatePlanRequestSchema = z.object({
  durationMonths: z.number().int().min(1).default(1),
  priceKzt: z.number().int().min(0).default(0),
  hint: z.string().optional(),
  locale: z.enum(["kz", "ru"]).default("ru"),
});

export type GeneratePlanRequest = z.infer<typeof generatePlanRequestSchema>;

export type GeneratePlanResult = {
  slug: string;
  titleRu: string;
  titleKz: string;
  description: string;
};

export function parseGeneratePlanRequest(value: unknown): GeneratePlanRequest {
  return generatePlanRequestSchema.parse(value);
}
