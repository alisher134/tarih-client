import { apiClient } from "@/shared/api";

import { parseQuestion } from "../lib/parse-course";
import type { Question, UpdateQuestionInput } from "../model/types";

export async function updateQuestion(
  questionId: string,
  input: UpdateQuestionInput,
): Promise<Question> {
  const { data } = await apiClient.patch(
    `/admin/questions/${questionId}`,
    input,
  );

  return parseQuestion(data);
}
