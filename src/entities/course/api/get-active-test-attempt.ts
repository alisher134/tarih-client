import { isAxiosError } from "axios";

import { apiClient } from "@/shared/api";

import { parseTestAttempt } from "../lib/parse-course";
import type { TestAttempt } from "../model/types";

export async function getActiveTestAttempt(
  testId: string,
): Promise<TestAttempt | null> {
  try {
    const { data } = await apiClient.get(`/tests/${testId}/attempts/active`);

    return parseTestAttempt(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}
