import { apiClient } from "@/shared/api";

import { parseUploadIntent } from "../lib/parse-course";
import type { CreateUploadIntentInput, UploadIntent } from "../model/types";

export async function createUploadIntent(
  input: CreateUploadIntentInput,
): Promise<UploadIntent> {
  const { data } = await apiClient.post("/admin/uploads/intent", input);

  return parseUploadIntent(data);
}
