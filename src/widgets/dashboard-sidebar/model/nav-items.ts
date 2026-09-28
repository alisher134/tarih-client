export const dashboardNavItems = [
  { href: "/dashboard", labelKey: "home" },
  { href: "/dashboard/my-courses", labelKey: "myCourses" },
  { href: "/dashboard/favorites", labelKey: "favorites" },
  { href: "/dashboard/courses", labelKey: "allCourses" },
] as const;

export type DashboardNavHref = (typeof dashboardNavItems)[number]["href"];

export type DashboardNavItem = {
  href: DashboardNavHref;
  label: string;
};
