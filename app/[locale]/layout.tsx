import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { OfflineGate } from "@/_app";
import { routing } from "@/shared/config/i18n/routing";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <OfflineGate>{children}</OfflineGate>
    </NextIntlClientProvider>
  );
}
