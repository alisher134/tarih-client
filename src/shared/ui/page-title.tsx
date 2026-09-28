import type { ReactNode } from "react";

import { cn } from "cn";

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={cn(
        "font-heading text-2xl leading-snug font-semibold",
        className,
      )}
    >
      {children}
    </h1>
  );
}
