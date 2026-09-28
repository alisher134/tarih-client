import { apiClient } from "@/shared/api";

import { parseQuestion } from "../lib/parse-course";
import type { CreateQuestionInput, Question } from "../model/types";

export async function createQuestion(
  testId: string,
  input: CreateQuestionInput,
): Promise<Question> {
  const { data } = await apiClient.post(
    `/admin/tests/${testId}/questions`,
    input,
  );

  return parseQuestion(data);
}
