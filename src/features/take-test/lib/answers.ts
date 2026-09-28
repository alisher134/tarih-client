import type {
  StudentLessonTest,
  StudentQuestion,
  TestAnswerInput,
} from "@/entities/course";

export type AnswerMap = Record<string, string[]>;

export function createEmptyAnswers(test: StudentLessonTest): AnswerMap {
  return Object.fromEntries(
    test.questions.map((question) => [question.id, []]),
  );
}

export function toggleAnswer(
  question: StudentQuestion,
  optionId: string,
  current: string[],
): string[] {
  if (question.type === "MULTIPLE_CHOICE") {
    if (current.includes(optionId)) {
      return current.filter((id) => id !== optionId);
    }

    return [...current, optionId];
  }

  return [optionId];
}

export function toTestAnswers(answers: AnswerMap): TestAnswerInput[] {
  return Object.entries(answers).map(([questionId, optionIds]) => ({
    questionId,
    optionIds,
  }));
}

export function hasUnansweredQuestions(
  test: StudentLessonTest,
  answers: AnswerMap,
) {
  return test.questions.some((question) => {
    const selected = answers[question.id] ?? [];

    return selected.length === 0;
  });
}
