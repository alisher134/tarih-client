import type { ReactNode } from "react";

import { cn } from "cn";

type AdminMenuSectionProps = {
  children: ReactNode;
  className?: string;
};

export function AdminMenuSection({
  children,
  className,
}: AdminMenuSectionProps) {
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
