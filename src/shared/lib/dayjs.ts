import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/kk";
import "dayjs/locale/ru";

import type { Locale } from "@/shared/config/i18n";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export const APP_TIMEZONE = "Asia/Almaty";

const dayjsLocaleByAppLocale = {
  kz: "kk",
  ru: "ru",
} as const satisfies Record<Locale, string>;

export function getDayjs(date?: dayjs.ConfigType, locale?: Locale) {
  const instance =
    date === undefined
      ? dayjs().tz(APP_TIMEZONE)
      : dayjs(date).tz(APP_TIMEZONE);

  if (locale == null) return instance;

  return instance.locale(dayjsLocaleByAppLocale[locale]);
}

export function formatDateTime(isoDate: string, locale: Locale) {
  const date = getDayjs(isoDate, locale);

  if (!date.isValid()) return "";

  return date.format("L LT");
}

export function getCurrentYear() {
  return getDayjs().year();
}

export { dayjs };
