import type { ComponentProps } from "react";
import { VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Link } from "@/shared/config/i18n/navigation";

import { buttonVariants } from "./button";

type LinkButtonProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof buttonVariants>;

export function LinkButton({
  children,
  className,
  variant = "secondary",
  size = "sm",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
