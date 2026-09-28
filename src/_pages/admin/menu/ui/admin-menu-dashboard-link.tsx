"use client";

import { LayoutDashboardIcon } from "lucide-react";

import { Link } from "@/shared/config/i18n/navigation";

import { AdminMenuSection } from "./admin-menu-section";

type AdminMenuDashboardLinkProps = {
  label: string;
};

export function AdminMenuDashboardLink({
  label,
}: AdminMenuDashboardLinkProps) {
  return (
    <AdminMenuSection>
      <Link
        href="/dashboard"
        className="flex items-center gap-3 p-4 text-sm font-medium"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
          <LayoutDashboardIcon
            className="size-6"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
        {label}
      </Link>
    </AdminMenuSection>
  );
}
