import { apiClient } from "@/shared/api";

import { parseContinueLearning } from "../lib/parse-learning";
import type { ContinueLearning } from "../model/types";

export async function getContinueLearning(): Promise<ContinueLearning | null> {
  const { data } = await apiClient.get("/me/learning/continue");

  return parseContinueLearning(data);
}
