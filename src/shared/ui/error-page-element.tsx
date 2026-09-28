import type { ComponentProps } from "react";

import { cn } from "cn";

import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { LinkButton } from "./link-button";
import { Show } from "./show";

type ErrorPageElementProps = {
  title: string;
  description: string;
  retryLabel?: string;
  homeLabel?: string;
  homeHref?: ComponentProps<typeof LinkButton>["href"];
  onRetry?: () => void;
  className?: string;
  layout?: "page" | "inline";
};

export function ErrorPageElement({
  title,
  description,
  retryLabel,
  homeLabel,
  homeHref,
  onRetry,
  className,
  layout = "page",
}: ErrorPageElementProps) {
  const canRetry = onRetry != null && retryLabel != null;
  const canGoHome = homeHref != null && homeLabel != null;

  const content = (
    <>
      <CardHeader className={cn(layout === "page" && "text-center")}>
        <CardTitle size={layout === "page" ? "page" : "default"}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent
        className={cn(
          "text-sm text-muted-foreground",
          layout === "page" && "text-center",
        )}
      >
        {description}
      </CardContent>

      <Show when={canRetry || canGoHome}>
        <CardFooter
          className={cn(
            "gap-2",
            layout === "page" ? "justify-center" : "justify-start",
          )}
        >
          <Show when={canRetry} data={onRetry}>
            {(handleRetry) => (
              <Button type="button" onClick={handleRetry}>
                {retryLabel}
              </Button>
            )}
          </Show>
          <Show when={canGoHome} data={homeHref}>
            {(href) => (
              <LinkButton href={href} variant="outline">
                {homeLabel}
              </LinkButton>
            )}
          </Show>
        </CardFooter>
      </Show>
    </>
  );

  if (layout === "inline") {
    return (
      <Card className={cn("w-full", className)} size="sm">
        {content}
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[70vh] items-center justify-center bg-background px-4",
        className,
      )}
    >
      <Card className="w-full max-w-md">{content}</Card>
    </div>
  );
}
