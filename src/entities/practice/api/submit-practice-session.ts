import { apiClient } from "@/shared/api";
import type { PracticeAnswerInput, PracticeSubmitResult } from "../model/types";

export type SubmitPracticeSessionPayload = {
  testIds: string[];
  answers: PracticeAnswerInput[];
  timeSpentSeconds?: number;
};

export async function submitPracticeSession(
  payload: SubmitPracticeSessionPayload,
): Promise<PracticeSubmitResult> {
  const { data } = await apiClient.post<PracticeSubmitResult>(
    "/practice/session/submit",
    payload,
  );
  return data;
}
