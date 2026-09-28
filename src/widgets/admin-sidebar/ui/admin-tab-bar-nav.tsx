"use client";

import { cn } from "cn";
import {
  HouseIcon,
  LibraryIcon,
  MenuIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Link, usePathname } from "@/shared/config/i18n/navigation";
import { isNavItemActive } from "@/shared/lib/is-nav-item-active";

import { ADMIN_MENU_HREF } from "../model/admin-menu-href";
import type { AdminNavHref, AdminNavItem } from "../model/nav-items";

const tabIcons = {
  "/admin": HouseIcon,
  "/admin/users": UsersIcon,
  "/admin/courses": LibraryIcon,
} as const satisfies Record<AdminNavHref, LucideIcon>;

type AdminTabBarNavProps = {
  items: readonly AdminNavItem[];
  menuLabel: string;
};

export function AdminTabBarNav({ items, menuLabel }: AdminTabBarNavProps) {
  const pathname = usePathname();
  const isMenuActive =
    pathname === ADMIN_MENU_HREF || pathname.startsWith(`${ADMIN_MENU_HREF}/`);

  return (
    <nav className="shrink-0 rounded-t-xl bg-card pb-[env(safe-area-inset-bottom)] shadow-soft-top md:hidden">
      <ul className="flex items-stretch">
        {items.map((item) => {
          const Icon = tabIcons[item.href];
          const isActive = isNavItemActive(pathname, item.href, "/admin");

          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={tabClassName(isActive)}
              >
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}

        <li className="min-w-0 flex-1">
          <Link
            href={ADMIN_MENU_HREF}
            aria-current={isMenuActive ? "page" : undefined}
            className={tabClassName(isMenuActive)}
          >
            <MenuIcon className="size-4" strokeWidth={1.75} aria-hidden />
            <span>{menuLabel}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function tabClassName(isActive: boolean) {
  return cn(
    "flex w-full flex-col items-center gap-1 px-1 pt-2.5 pb-2 text-center text-[11px] leading-tight transition-colors",
    isActive ? "text-primary" : "text-secondary-foreground",
  );
}
