import type { ReactNode } from "react";
import { cn } from "cn";

import { AppSidebarNav, type AppSidebarNavItem } from "./app-sidebar-nav";

type AppSidebarProps = {
  title: string;
  items: readonly AppSidebarNavItem[];
  rootHref: string;
  isHiddenOnMobile?: boolean;
  footerSlot?: ReactNode;
};

export function AppSidebar({
  title,
  items,
  rootHref,
  isHiddenOnMobile = false,
  footerSlot,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "w-[320px] shrink-0",
        isHiddenOnMobile ? "hidden md:block" : "block",
      )}
    >
      <div className="fixed top-16 bottom-0 z-40 flex w-[320px] flex-col gap-5 overflow-y-auto border-r border-sidebar-border bg-sidebar py-6 pl-3">
        <p className="px-3 text-base font-medium text-muted-foreground">
          {title}
        </p>
        <AppSidebarNav
          items={items}
          rootHref={rootHref}
          footerSlot={footerSlot}
        />
      </div>
    </aside>
  );
}
