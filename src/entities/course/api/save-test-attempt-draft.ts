import { apiClient } from "@/shared/api";

import type { TestAnswerInput } from "../model/types";

export async function saveTestAttemptDraft(
  attemptId: string,
  answers: TestAnswerInput[],
): Promise<void> {
  await apiClient.put(`/test-attempts/${attemptId}/draft`, { answers });
}
