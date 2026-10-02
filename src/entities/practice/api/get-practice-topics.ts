import { apiClient } from "@/shared/api";
import type { PracticeTopicItem } from "../model/types";

export const practiceTopicsQueryKey = () => ["practice", "topics"] as const;

export async function getPracticeTopics(): Promise<PracticeTopicItem[]> {
  const { data } = await apiClient.get<PracticeTopicItem[]>("/practice/topics");
  return data;
}
