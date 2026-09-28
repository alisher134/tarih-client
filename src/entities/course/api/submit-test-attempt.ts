import { apiClient } from "@/shared/api";

import { parseTestAttempt } from "../lib/parse-course";
import type { TestAnswerInput, TestAttempt } from "../model/types";

export async function submitTestAttempt(
  attemptId: string,
  answers: TestAnswerInput[],
): Promise<TestAttempt> {
  const { data } = await apiClient.post(`/test-attempts/${attemptId}/submit`, {
    answers,
  });

  return parseTestAttempt(data);
}
