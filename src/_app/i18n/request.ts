import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { loadMessages } from "@/shared/config/i18n/load-messages";
import { routing } from "@/shared/config/i18n/routing";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale ?? (await requestLocale);

  if (!hasLocale(routing.locales, resolvedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: loadMessages(resolvedLocale),
    timeZone: "Asia/Almaty",
  };
});
