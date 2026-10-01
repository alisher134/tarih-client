"use client";

import { useMemo, useRef, useEffect } from "react";

import { useLocale } from "next-intl";
import { Plyr, type APITypes } from "plyr-react";
import "plyr-react/plyr.css";

import { useSession } from "@/entities/session";
import type {
  UpdateLessonProgressInput,
  UserLessonProgress,
} from "@/entities/course";
import type { Locale } from "@/shared/config/i18n/routing";
import { getAccessToken } from "@/entities/session/lib/token-storage";

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
  const { data: user } = useSession();

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

  // Inject DRM player (Shaka) if the video is encrypted (.mpd)
  useEffect(() => {
    if (!src.includes(".mpd")) return;

    let shakaInstance: ShakaPlayer.Player | null = null;

    const initShaka = async () => {
      // Fallback for SSR if window is not defined
      if (typeof window === "undefined") return;

      // Plyr renders a <video> inside its container — we retrieve it directly
      const container = playerRef.current?.plyr?.elements?.container;
      const videoElement = container?.querySelector<HTMLVideoElement>("video");
      if (!videoElement) {
        // If Plyr hasn't mounted the video element yet, try again in 100ms
        setTimeout(initShaka, 100);
        return;
      }

      try {
        const shakaModule =
          (await import("shaka-player")) as unknown as ShakaPlayer.ShakaModule;

        // Ensure Shaka polyfills are installed
        shakaModule.polyfill.installAll();
        if (!shakaModule.Player.isBrowserSupported()) {
          console.error("Browser not supported for Shaka Player!");
          return;
        }

        const player = new shakaModule.Player(videoElement);
        shakaInstance = player;

        const token = getAccessToken();

        // Pass the auth token to the DRM License Server
        const requestFilter: ShakaPlayer.RequestFilter = (
          type: ShakaPlayer.RequestType,
          request: ShakaPlayer.Request,
        ) => {
          if (type === shakaModule.net.NetworkingEngine.RequestType.LICENSE) {
            request.headers["Authorization"] = `Bearer ${token}`;
            request.headers["Content-Type"] = "application/json";
          }
        };

        player.getNetworkingEngine()?.registerRequestFilter(requestFilter);

        player.configure({
          drm: {
            servers: {
              "org.w3.clearkey":
                process.env.NEXT_PUBLIC_API_URL + "/drm/license",
            },
          },
        });

        await player.load(src);
      } catch (e) {
        console.error("Shaka Player Error:", e);
      }
    };

    initShaka();

    return () => {
      shakaInstance?.destroy();
    };
  }, [src]);

  // Inject watermark into the Plyr container so it stays visible in fullscreen mode
  useEffect(() => {
    if (!user || !user.email) return;

    const timer = setTimeout(() => {
      const container = playerRef.current?.plyr?.elements?.container;
      if (!container) return;

      const watermarkId = "tarih-watermark-overlay";
      if (document.getElementById(watermarkId)) return;

      const watermark = document.createElement("div");
      watermark.id = watermarkId;
      watermark.className =
        "pointer-events-none absolute inset-0 z-50 flex flex-wrap content-center justify-center gap-10 overflow-hidden opacity-[0.2] select-none mix-blend-overlay";

      let content = "";
      for (let i = 0; i < 60; i++) {
        content += `<span style="transform: rotate(-30deg); display: inline-block; white-space: nowrap; font-size: 1.125rem; font-weight: 700; color: rgba(255, 255, 255, 0.4);">${user.email}</span>`;
      }
      watermark.innerHTML = content;

      container.appendChild(watermark);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, src]);

  return (
    <div className="lesson-video-player relative overflow-hidden rounded-xl bg-black">
      <Plyr ref={playerRef} source={source} options={options} key={src} />
    </div>
  );
}
