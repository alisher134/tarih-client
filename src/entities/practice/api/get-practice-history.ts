import { apiClient } from "@/shared/api";
import type { PracticeSessionRecord } from "../model/types";

export const practiceHistoryQueryKey = () => ["practice", "history"] as const;

export async function getPracticeHistory(): Promise<PracticeSessionRecord[]> {
  const { data } =
    await apiClient.get<PracticeSessionRecord[]>("/practice/history");
  return data;
}
