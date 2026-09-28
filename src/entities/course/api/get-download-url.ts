import { apiClient } from "@/shared/api";

import { parseDownloadUrl } from "../lib/parse-course";
import type { DownloadUrl } from "../model/types";

export async function getDownloadUrl(materialId: string): Promise<DownloadUrl> {
  const { data } = await apiClient.get(`/materials/${materialId}/download-url`);

  return parseDownloadUrl(data);
}
