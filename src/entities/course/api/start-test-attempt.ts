import { apiClient } from "@/shared/api";

import { parseTestAttempt } from "../lib/parse-course";
import type { TestAttempt } from "../model/types";

export async function startTestAttempt(testId: string): Promise<TestAttempt> {
  const { data } = await apiClient.post(`/tests/${testId}/attempts`);

  return parseTestAttempt(data);
}
