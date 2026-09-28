"use client";

import { useMemo, useRef } from "react";

import { useLocale } from "next-intl";
import { Plyr, type APITypes } from "plyr-react";
import "plyr-react/plyr.css";

import type {
  UpdateLessonProgressInput,
  UserLessonProgress,
} from "@/entities/course";
import type { Locale } from "@/shared/config/i18n/routing";

import { getPlyrOptions } from "../lib/plyr-options";
import { useLessonVideoProgress } from "../model/use-lesson-video-progress";

type LessonVideoProps = {
  src: string;
  progress: UserLessonProgress | null;
  saveProgress: (input: UpdateLessonProgressInput) => void;
  flushProgress: (input: UpdateLessonProgressInput) => Promise<unknown>;
};

export function LessonVideo({
  src,
  progress,
  saveProgress,
  flushProgress,
}: LessonVideoProps) {
  const locale = useLocale();
  const playerRef = useRef<APITypes>(null);

  const source = useMemo(
    () => ({
      type: "video" as const,
      sources: [{ src }],
    }),
    [src],
  );

  const options = useMemo(() => getPlyrOptions(locale as Locale), [locale]);

  useLessonVideoProgress(playerRef, src, progress, {
    saveProgress,
    flushProgress,
  });

  return (
    <div className="lesson-video-player overflow-hidden rounded-xl bg-black">
      <Plyr ref={playerRef} source={source} options={options} key={src} />
    </div>
  );
}
