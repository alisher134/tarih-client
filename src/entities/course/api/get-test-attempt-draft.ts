import { isAxiosError } from "axios";
import { z } from "zod";

import { apiClient } from "@/shared/api";

import type { TestAnswerInput } from "../model/types";

const testAttemptDraftSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionIds: z.array(z.string()),
    }),
  ),
});

export async function getTestAttemptDraft(
  attemptId: string,
): Promise<TestAnswerInput[] | null> {
  try {
    const { data } = await apiClient.get(`/test-attempts/${attemptId}/draft`);

    return testAttemptDraftSchema.parse(data).answers;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}
