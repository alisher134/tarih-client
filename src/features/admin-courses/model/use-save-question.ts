"use client";

import { useMutation } from "@tanstack/react-query";

import {
  createQuestion,
  updateQuestion,
  type CreateQuestionInput,
} from "@/entities/course";

import { useInvalidateAdminCourse } from "./use-invalidate-admin-course";

type SaveQuestionInput = {
  questionId?: string;
  values: CreateQuestionInput;
};

export function useSaveQuestion(courseId: string, testId: string) {
  const invalidate = useInvalidateAdminCourse(courseId, testId);

  return useMutation({
    mutationKey: ["admin", "tests", testId, "questions", "save"],
    mutationFn: ({ questionId, values }: SaveQuestionInput) =>
      questionId == null
        ? createQuestion(testId, values)
        : updateQuestion(questionId, values),
    onSuccess: invalidate,
  });
}
