export const adminNavItems = [
  { href: "/admin", labelKey: "home" },
  { href: "/admin/users", labelKey: "users" },
  { href: "/admin/courses", labelKey: "courses" },
] as const;

export type AdminNavHref = (typeof adminNavItems)[number]["href"];

export type AdminNavItem = {
  href: AdminNavHref;
  label: string;
};
