"use client";

import { useSearchParams } from "@/shared/config/i18n/navigation";
import {
  buildSignInHref,
  getAuthReturnParamName,
  getAuthReturnUrl,
} from "@/shared/lib/auth-return-url";
import { LinkButton } from "@/shared/ui/link-button";

type AuthFormSwitchLinkProps = {
  href: "/sign-in" | "/sign-up";
  label: string;
};

export function AuthFormSwitchLink({ href, label }: AuthFormSwitchLinkProps) {
  const searchParams = useSearchParams();
  const returnUrl = getAuthReturnUrl(searchParams);
  const switchHref =
    returnUrl == null
      ? href
      : `${href}?${getAuthReturnParamName()}=${encodeURIComponent(returnUrl)}`;

  return (
    <LinkButton href={switchHref} variant="link" className="inline h-auto p-0">
      {label}
    </LinkButton>
  );
}

export function useSignInHrefWithReturn(
  fallbackReturnUrl: string | null = null,
) {
  const searchParams = useSearchParams();
  const returnUrl = getAuthReturnUrl(searchParams) ?? fallbackReturnUrl;

  return buildSignInHref(returnUrl);
}
