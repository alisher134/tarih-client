"use client";

import { useId } from "react";

import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";

import type { FormUIProps } from "../types/form";
import { Field, FieldError, FieldLabel } from "./field";

export function SelectField({
  label,
  error,
  className,
  children,
  ...props
}: FormUIProps<"select">) {
  const id = useId();

  return (
    <Field data-invalid={error ? true : undefined}>
      {label && (
        <FieldLabel htmlFor={id} className="font-normal text-muted-foreground">
          {label}
        </FieldLabel>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            "h-10 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent py-2 pr-8 pl-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
