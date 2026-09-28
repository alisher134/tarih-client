export function isNavItemActive(
  pathname: string,
  href: string,
  rootHref: string,
): boolean {
  if (href === rootHref) return pathname === rootHref;

  return pathname === href || pathname.startsWith(`${href}/`);
}
