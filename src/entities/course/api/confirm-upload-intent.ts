import { apiClient } from "@/shared/api";

export async function confirmUploadIntent(objectKey: string): Promise<void> {
  await apiClient.post(
    `/admin/uploads/intent/${encodeURIComponent(objectKey)}/confirm`,
  );
}
