import { z } from "zod";

export const generateTestRequestSchema = z.object({
  courseTitle: z.string().optional(),
  courseDescription: z.string().optional(),
  lessonTitle: z.string().optional(),
  lessonDescription: z.string().optional(),
  testTitle: z.string().optional(),
  testDescription: z.string().optional(),
  topicHint: z.string().optional(),
  count: z.number().int().min(1).max(15).default(5),
  questionType: z
    .enum(["MIXED", "SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"])
    .default("MIXED"),
  locale: z.enum(["kz", "ru"]),
  existingQuestions: z.array(z.string()).optional(),
});

export type GenerateTestRequest = z.infer<typeof generateTestRequestSchema>;

export const generatedQuestionOptionSchema = z.object({
  text: z.string().trim().min(1),
  isCorrect: z.boolean(),
});

export const generatedTestQuestionSchema = z.object({
  text: z.string().trim().min(1),
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"]),
  points: z.number().int().min(1).default(1),
  options: z.array(generatedQuestionOptionSchema).min(2),
});

export type GeneratedTestQuestion = z.infer<typeof generatedTestQuestionSchema>;

export type GenerateTestResult = {
  questions: GeneratedTestQuestion[];
};

export function parseGenerateTestRequest(value: unknown): GenerateTestRequest {
  return generateTestRequestSchema.parse(value);
}
