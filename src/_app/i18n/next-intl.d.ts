import type { loadMessages } from "@/shared/config/i18n/load-messages";
import type { routing } from "@/shared/config/i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: ReturnType<typeof loadMessages>;
  }
}
