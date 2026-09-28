import type { PlyrOptions } from "plyr-react";

import type { Locale } from "@/shared/config/i18n/routing";

import { getPlyrI18n } from "./plyr-i18n";

export function getPlyrOptions(locale: Locale): PlyrOptions {
  return {
    ratio: "16:9",
    seekTime: 10,
    clickToPlay: true,
    hideControls: true,
    disableContextMenu: true,
    storage: { enabled: true, key: "tarih:plyr" },
    i18n: getPlyrI18n(locale),
    controls: [
      "play-large",
      "rewind",
      "play",
      "fast-forward",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "pip",
      "fullscreen",
    ],
    settings: ["speed"],
    speed: {
      selected: 1,
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    },
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
  };
}
