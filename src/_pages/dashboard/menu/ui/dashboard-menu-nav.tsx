import {
  BookMarkedIcon,
  BookPlusIcon,
  HeartIcon,
  HouseIcon,
  type LucideIcon,
} from "lucide-react";

import { Link } from "@/shared/config/i18n/navigation";

import type {
  DashboardMenuNavHref,
  DashboardMenuNavItem,
} from "../model/menu-nav-items";
import { DashboardMenuSection } from "./dashboard-menu-section";

const menuNavIcons = {
  "/dashboard": HouseIcon,
  "/dashboard/my-courses": BookMarkedIcon,
  "/dashboard/favorites": HeartIcon,
  "/dashboard/courses": BookPlusIcon,
} as const satisfies Record<DashboardMenuNavHref, LucideIcon>;

type DashboardMenuNavProps = {
  items: readonly DashboardMenuNavItem[];
};

export function DashboardMenuNav({ items }: DashboardMenuNavProps) {
  return (
    <DashboardMenuSection className="p-4">
      <ul className="grid grid-cols-3 gap-x-2 gap-y-5">
        {items.map((item) => {
          const Icon = menuNavIcons[item.href];

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-xs leading-tight text-muted-foreground">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </DashboardMenuSection>
  );
}
