"use client";

import { LayoutDashboardIcon } from "lucide-react";

import { usePathname } from "@/shared/config/i18n/navigation";
import { isNavItemActive } from "@/shared/lib/is-nav-item-active";
import { SidebarNavLink } from "@/shared/ui/sidebar-nav-link";

const DASHBOARD_HREF = "/dashboard";

type AdminDashboardNavLinkProps = {
  label: string;
};

export function AdminDashboardNavLink({ label }: AdminDashboardNavLinkProps) {
  const pathname = usePathname();

  return (
    <li>
      <SidebarNavLink
        href={DASHBOARD_HREF}
        label={label}
        icon={
          <LayoutDashboardIcon
            className="size-4 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
        }
        isActive={isNavItemActive(pathname, DASHBOARD_HREF, "/admin")}
      />
    </li>
  );
}
