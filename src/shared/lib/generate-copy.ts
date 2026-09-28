import { z } from "zod";

import type { Locale } from "@/shared/config/i18n/routing";

export const GENERATE_COPY_ENTITIES = [
  "course",
  "lesson",
  "test",
  "question",
] as const;
export const GENERATE_COPY_FIELDS = [
  "title",
  "description",
  "questionText",
  "option",
] as const;
export const GENERATE_QUESTION_TYPES = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
] as const;

export type GenerateCopyEntity = (typeof GENERATE_COPY_ENTITIES)[number];
export type GenerateCopyField = (typeof GENERATE_COPY_FIELDS)[number];
export type GenerateQuestionType = (typeof GENERATE_QUESTION_TYPES)[number];

export type GeneratedOption = {
  text: string;
  isCorrect: boolean;
};

export type GenerateCopyResult = {
  text: string;
  options?: GeneratedOption[];
};

export type GenerateCopyParent = {
  courseTitle?: string;
  courseDescription?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  testTitle?: string;
  testDescription?: string;
  questionType?: GenerateQuestionType;
  questionText?: string;
  optionIsCorrect?: boolean;
  otherOptions?: string[];
  existingQuestions?: string[];
  optionCount?: number;
};

export type GenerateCopyRequest = {
  entity: GenerateCopyEntity;
  field: GenerateCopyField;
  locale: Locale;
  title: string;
  description: string;
  parent?: GenerateCopyParent;
};

const generateCopyParentSchema = z.object({
  courseTitle: z.string().optional(),
  courseDescription: z.string().optional(),
  lessonTitle: z.string().optional(),
  lessonDescription: z.string().optional(),
  testTitle: z.string().optional(),
  testDescription: z.string().optional(),
  questionType: z.enum(GENERATE_QUESTION_TYPES).optional(),
  questionText: z.string().optional(),
  optionIsCorrect: z.boolean().optional(),
  otherOptions: z.array(z.string()).optional(),
  existingQuestions: z.array(z.string()).optional(),
  optionCount: z.number().int().positive().optional(),
});

export const generateCopyRequestSchema = z.object({
  entity: z.enum(GENERATE_COPY_ENTITIES),
  field: z.enum(GENERATE_COPY_FIELDS),
  locale: z.enum(["kz", "ru"]),
  title: z.string(),
  description: z.string(),
  parent: generateCopyParentSchema.optional(),
});

export const generatedOptionSchema = z.object({
  text: z.string().trim().min(1),
  isCorrect: z.boolean(),
});

export function parseGenerateCopyRequest(value: unknown): GenerateCopyRequest {
  return generateCopyRequestSchema.parse(value);
}

export function hasCopyContext(request: GenerateCopyRequest): boolean {
  return getContextSnippets(request).length > 0;
}

export function getContextSnippets(request: GenerateCopyRequest): string[] {
  return [
    request.title,
    request.description,
    request.parent?.courseTitle,
    request.parent?.courseDescription,
    request.parent?.lessonTitle,
    request.parent?.lessonDescription,
    request.parent?.testTitle,
    request.parent?.testDescription,
    request.parent?.questionText,
    ...(request.parent?.otherOptions ?? []),
    ...(request.parent?.existingQuestions ?? []),
  ].flatMap((value) => {
    const trimmed = value?.trim() ?? "";

    return trimmed.length > 0 ? [trimmed] : [];
  });
}
