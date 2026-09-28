import type { ReactNode } from "react";

import { cn } from "cn";

import { Show } from "./show";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border bg-muted/30 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-base font-semibold">{title}</p>
        <Show when={description != null}>
          <p className="text-sm text-balance text-muted-foreground">
            {description}
          </p>
        </Show>
      </div>

      <Show when={action != null}>
        <div className="mt-1">{action}</div>
      </Show>
    </div>
  );
}
