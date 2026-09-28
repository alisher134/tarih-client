import { z } from "zod";

import type { ContinueLearning, CourseLearningSummary } from "../model/types";

const learningNextActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("LESSON"),
    lessonId: z.string(),
  }),
  z.object({
    type: z.literal("TEST"),
    lessonId: z.string(),
    testId: z.string(),
  }),
]);

const continueLearningLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  videoDuration: z.number(),
  watchedSeconds: z.number(),
  completed: z.boolean(),
});

const continueLearningSchema = z.object({
  course: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    progress: z.number(),
  }),
  lesson: continueLearningLessonSchema,
  nextAction: learningNextActionSchema,
});

const courseLearningSummarySchema = z.object({
  course: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
  }),
  enrollment: z
    .object({
      progress: z.number(),
      status: z.enum(["ACTIVE", "COMPLETED"]),
      enrolledAt: z.string(),
      lastActivityAt: z.string().nullable(),
      completedAt: z.string().nullable(),
    })
    .nullable(),
  lessonsTotal: z.number(),
  lessonsCompleted: z.number(),
  testsTotal: z.number(),
  testsPassed: z.number(),
  watchedSecondsTotal: z.number(),
  averageTestScore: z.number().nullable(),
  testPassRate: z.number().nullable(),
  currentLesson: continueLearningLessonSchema.nullable(),
  nextAction: learningNextActionSchema.nullable(),
});

export function parseContinueLearning(data: unknown): ContinueLearning | null {
  if (data == null || data === "") return null;
  if (typeof data !== "object") return null;

  return continueLearningSchema.parse(data);
}

export function parseCourseLearningSummary(data: unknown): CourseLearningSummary {
  return courseLearningSummarySchema.parse(data);
}
