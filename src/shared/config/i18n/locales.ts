import type { Locale } from "./routing";

export const localeOptions = [
  { code: "kz", label: "Қазақша", shortLabel: "Қаз" },
  { code: "ru", label: "Русский", shortLabel: "РУ" },
] as const satisfies readonly {
  code: Locale;
  label: string;
  shortLabel: string;
}[];

export function getLocaleOption(locale: string) {
  return localeOptions.find((item) => item.code === locale) ?? localeOptions[0];
}
