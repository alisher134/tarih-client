import type { ReactNode } from "react";

import { cn } from "cn";

type DashboardMenuSectionProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardMenuSection({
  children,
  className,
}: DashboardMenuSectionProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card shadow-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}
