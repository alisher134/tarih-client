export const dashboardMenuNavItems = [
  { href: "/dashboard", labelKey: "home" },
  { href: "/dashboard/my-courses", labelKey: "myCourses" },
  { href: "/dashboard/favorites", labelKey: "favorites" },
  { href: "/dashboard/courses", labelKey: "allCourses" },
] as const;

export type DashboardMenuNavHref =
  (typeof dashboardMenuNavItems)[number]["href"];

export type DashboardMenuNavItem = {
  href: DashboardMenuNavHref;
  label: string;
};
