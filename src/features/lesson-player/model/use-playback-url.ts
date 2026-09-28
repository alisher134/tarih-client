"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getPlaybackUrl,
  lessonPlaybackQueryKey,
  type PlaybackUrl,
} from "@/entities/course";

const PLAYBACK_URL_BUFFER_SECONDS = 30;

function getPlaybackStaleTime(playback: PlaybackUrl) {
  const staleSeconds = playback.expiresIn - PLAYBACK_URL_BUFFER_SECONDS;

  return Math.max(staleSeconds, 0) * 1000;
}

export function usePlaybackUrl(lessonId: string, enabled: boolean) {
  return useQuery({
    queryKey: lessonPlaybackQueryKey(lessonId),
    queryFn: () => getPlaybackUrl(lessonId),
    enabled: enabled && lessonId.length > 0,
    staleTime: (query) => {
      const playback = query.state.data;

      if (playback == null) return 0;

      return getPlaybackStaleTime(playback);
    },
  });
}
