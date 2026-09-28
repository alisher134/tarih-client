"use client";

import type { ReactNode } from "react";

import { usePathname } from "@/shared/config/i18n/navigation";
import { isNavItemActive } from "@/shared/lib/is-nav-item-active";

import { SidebarNavLink } from "./sidebar-nav-link";

export type AppSidebarNavItem<H extends string = string> = {
  href: H;
  label: string;
  icon: ReactNode;
};

type AppSidebarNavProps = {
  items: readonly AppSidebarNavItem[];
  rootHref: string;
  footerSlot?: ReactNode;
};

export function AppSidebarNav({ items, rootHref, footerSlot }: AppSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <SidebarNavLink
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isNavItemActive(pathname, item.href, rootHref)}
            />
          </li>
        ))}
        {footerSlot}
      </ul>
    </nav>
  );
}
