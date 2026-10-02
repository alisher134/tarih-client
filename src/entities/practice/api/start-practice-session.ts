import { apiClient } from "@/shared/api";
import type { PracticeStartResult } from "../model/types";

export type StartPracticeSessionPayload = {
  testIds: string[];
  questionLimit?: number;
  shuffle?: boolean;
};

export async function startPracticeSession(
  payload: StartPracticeSessionPayload,
): Promise<PracticeStartResult> {
  const { data } = await apiClient.post<PracticeStartResult>(
    "/practice/session/start",
    payload,
  );
  return data;
}
