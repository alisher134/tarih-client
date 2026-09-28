import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["kz", "ru"],
  defaultLocale: "kz",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
