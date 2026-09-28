"use client";

import type { ReactNode } from "react";
import { cn } from "cn";

import { Link } from "@/shared/config/i18n/navigation";
import { Show } from "@/shared/ui/show";

type SidebarNavLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
};

export function SidebarNavLink({
  href,
  label,
  icon,
  isActive,
}: SidebarNavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent font-medium text-sidebar-primary"
          : "text-secondary-foreground hover:bg-sidebar-accent/50",
      )}
    >
      {icon}
      {label}
      <Show when={isActive}>
        <span
          aria-hidden
          className="absolute inset-y-0 right-0 w-0.5 rounded-r-lg bg-sidebar-primary"
        />
      </Show>
    </Link>
  );
}
