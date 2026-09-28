"use client";

import { ShieldIcon } from "lucide-react";

import { useIsAdmin } from "@/entities/session";
import { usePathname } from "@/shared/config/i18n/navigation";
import { isNavItemActive } from "@/shared/lib/is-nav-item-active";
import { SidebarNavLink } from "@/shared/ui/sidebar-nav-link";

const ADMIN_HREF = "/admin";

type DashboardAdminNavLinkProps = {
  label: string;
};

export function DashboardAdminNavLink({ label }: DashboardAdminNavLinkProps) {
  const { isAdmin, isLoading } = useIsAdmin();
  const pathname = usePathname();

  if (isLoading || !isAdmin) return null;

  return (
    <li>
      <SidebarNavLink
        href={ADMIN_HREF}
        label={label}
        icon={
          <ShieldIcon
            className="size-4 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
        }
        isActive={isNavItemActive(pathname, ADMIN_HREF, "/dashboard")}
      />
    </li>
  );
}
