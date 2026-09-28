const AUTH_RETURN_PARAM = "next";

const ALLOWED_RETURN_PREFIXES = ["/dashboard", "/admin"] as const;

const ALLOWED_RETURN_PATHS = ["/", "/#pricing"] as const;

export function getAuthReturnParamName() {
  return AUTH_RETURN_PARAM;
}

export function sanitizeAuthReturnUrl(value: string | null | undefined) {
  if (value == null || value.length === 0) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;

  if (
    ALLOWED_RETURN_PATHS.includes(
      value as (typeof ALLOWED_RETURN_PATHS)[number],
    )
  ) {
    return value;
  }

  const isAllowed = ALLOWED_RETURN_PREFIXES.some(
    (prefix) => value === prefix || value.startsWith(`${prefix}/`),
  );

  if (!isAllowed) return null;

  return value;
}

export function buildSignInHref(returnUrl: string | null) {
  const safeReturnUrl = sanitizeAuthReturnUrl(returnUrl);

  if (safeReturnUrl == null) return "/sign-in";

  const params = new URLSearchParams();
  params.set(AUTH_RETURN_PARAM, safeReturnUrl);

  return `/sign-in?${params.toString()}`;
}

export function getAuthReturnUrl(searchParams: URLSearchParams) {
  return sanitizeAuthReturnUrl(searchParams.get(AUTH_RETURN_PARAM));
}
