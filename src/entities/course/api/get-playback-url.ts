import { apiClient } from "@/shared/api";

import { parsePlaybackUrl } from "../lib/parse-course";
import type { PlaybackUrl } from "../model/types";

export async function getPlaybackUrl(lessonId: string): Promise<PlaybackUrl> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/playback-url`);

  return parsePlaybackUrl(data);
}
