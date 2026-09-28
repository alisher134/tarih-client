"use client";

import { usePathname, useRouter, useSearchParams } from "@/shared/config/i18n/navigation";
import {
  buildSignInHref,
  getAuthReturnUrl,
} from "@/shared/lib/auth-return-url";

export function useAuthReturnUrl() {
  const searchParams = useSearchParams();

  return getAuthReturnUrl(searchParams);
}

export function usePostAuthRedirect(defaultHref = "/dashboard") {
  const router = useRouter();
  const returnUrl = useAuthReturnUrl();

  return () => {
    router.replace(returnUrl ?? defaultHref);
  };
}

export function useCurrentAuthReturnUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  if (query.length === 0) return pathname;

  return `${pathname}?${query}`;
}

export function useSignInHref() {
  const returnUrl = useCurrentAuthReturnUrl();

  return buildSignInHref(returnUrl);
}
