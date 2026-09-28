import { routing, type Locale } from "@/shared/config/i18n/routing";

import { buildSignInHref, sanitizeAuthReturnUrl } from "./auth-return-url";

function getLocaleFromPathname(pathname: string): Locale {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length) || "/";
    }
  }

  return pathname;
}

function withLocalePrefix(path: string, locale: Locale) {
  if (
    routing.localePrefix === "as-needed" &&
    locale === routing.defaultLocale
  ) {
    return path;
  }

  return `/${locale}${path}`;
}

export function buildSignInLocationFromBrowser() {
  if (typeof window === "undefined") return "/sign-in";

  const pathname = window.location.pathname;
  const search = window.location.search;
  const pathWithoutLocale = stripLocalePrefix(pathname);
  const currentPath =
    search.length > 0 ? `${pathWithoutLocale}${search}` : pathWithoutLocale;
  const returnUrl = sanitizeAuthReturnUrl(currentPath);
  const signInHref = buildSignInHref(returnUrl);
  const locale = getLocaleFromPathname(pathname);

  return withLocalePrefix(signInHref, locale);
}
