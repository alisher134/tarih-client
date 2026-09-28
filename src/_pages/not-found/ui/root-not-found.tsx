import { NextIntlClientProvider } from "next-intl";

import { loadMessages } from "@/shared/config/i18n/load-messages";
import { routing } from "@/shared/config/i18n/routing";

import { NotFoundView } from "./not-found-view";

export function RootNotFound() {
  const locale = routing.defaultLocale;
  const messages = loadMessages(locale);
  const t = messages.errors;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFoundView
        title={t.notFound.title}
        description={t.notFound.description}
        homeLabel={t.home}
      />
    </NextIntlClientProvider>
  );
}
