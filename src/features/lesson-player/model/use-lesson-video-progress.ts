"use client";

import { useEffect, useRef, type RefObject } from "react";

import type { APITypes } from "plyr-react";

import type {
  UpdateLessonProgressInput,
  UserLessonProgress,
} from "@/entities/course";

const SAVE_INTERVAL_SECONDS = 5;

function getPlyrInstance(ref: RefObject<APITypes | null>) {
  const plyr = ref.current?.plyr;

  if (plyr == null || typeof plyr.on !== "function") {
    return null;
  }

  return plyr;
}

type UseLessonVideoProgressOptions = {
  saveProgress: (input: UpdateLessonProgressInput) => void;
  flushProgress: (input: UpdateLessonProgressInput) => Promise<unknown>;
};

export function useLessonVideoProgress(
  playerRef: RefObject<APITypes | null>,
  src: string,
  progress: UserLessonProgress | null,
  { saveProgress, flushProgress }: UseLessonVideoProgressOptions,
) {
  const lastSavedRef = useRef(0);

  useEffect(() => {
    lastSavedRef.current = progress?.watchedSeconds ?? 0;
  }, [progress?.watchedSeconds, src]);

  useEffect(() => {
    let disposed = false;
    let unbindEvents: (() => void) | undefined;
    let intervalId: number | undefined;

    const bindEvents = () => {
      const plyr = getPlyrInstance(playerRef);
      if (plyr == null || disposed) return;

      const flushCurrentProgress = () => {
        const watchedSeconds = Math.floor(plyr.currentTime);
        void flushProgress({ watchedSeconds });
      };

      const handleLoadedMetadata = () => {
        if (progress == null || progress.watchedSeconds <= 0) return;

        plyr.currentTime = progress.watchedSeconds;
      };

      const handleTimeUpdate = () => {
        const watchedSeconds = Math.floor(plyr.currentTime);

        if (watchedSeconds - lastSavedRef.current < SAVE_INTERVAL_SECONDS) {
          return;
        }

        lastSavedRef.current = watchedSeconds;
        saveProgress({ watchedSeconds });
      };

      const handleEnded = () => {
        const watchedSeconds = Math.floor(plyr.duration);
        lastSavedRef.current = watchedSeconds;
        void flushProgress({ watchedSeconds });
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState !== "hidden") return;

        flushCurrentProgress();
      };

      const handlePageHide = () => {
        flushCurrentProgress();
      };

      plyr.on("loadedmetadata", handleLoadedMetadata);
      plyr.on("timeupdate", handleTimeUpdate);
      plyr.on("ended", handleEnded);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", handlePageHide);

      unbindEvents = () => {
        plyr.off("loadedmetadata", handleLoadedMetadata);
        plyr.off("timeupdate", handleTimeUpdate);
        plyr.off("ended", handleEnded);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        window.removeEventListener("pagehide", handlePageHide);
      };
    };

    const tryBindEvents = () => {
      if (getPlyrInstance(playerRef) == null) return false;

      unbindEvents?.();
      bindEvents();
      return true;
    };

    if (!tryBindEvents()) {
      intervalId = window.setInterval(() => {
        if (tryBindEvents()) {
          window.clearInterval(intervalId);
        }
      }, 50);
    }

    return () => {
      disposed = true;

      if (intervalId != null) {
        window.clearInterval(intervalId);
      }

      unbindEvents?.();
    };
  }, [src, progress, playerRef, saveProgress, flushProgress]);
}
