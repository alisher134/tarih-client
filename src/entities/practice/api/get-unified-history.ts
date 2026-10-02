import { apiClient } from "@/shared/api";
import type { UnifiedTestHistoryItem } from "../model/types";

export const unifiedHistoryQueryKey = () =>
  ["practice", "history", "unified"] as const;

export async function getUnifiedHistory(): Promise<UnifiedTestHistoryItem[]> {
  const { data } = await apiClient.get<UnifiedTestHistoryItem[]>(
    "/practice/history/unified",
  );
  return data;
}
