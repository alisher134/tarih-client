import type { ReactNode } from "react";

import { cn } from "cn";

import { Show } from "./show";

type SectionHeadingProps = {
  children: ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeading({
  children,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h2 className="text-lg font-semibold">{children}</h2>
      <Show when={description != null}>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Show>
    </div>
  );
}
