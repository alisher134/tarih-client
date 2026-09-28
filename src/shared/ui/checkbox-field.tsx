"use client";

import { useId } from "react";
import { cn } from "cn";

import type { FormUIProps } from "../types/form";
import { Field, FieldError, FieldLabel } from "./field";

export function CheckboxField({
  label,
  error,
  className,
  ...props
}: FormUIProps<"input">) {
  const id = useId();

  return (
    <Field
      orientation="horizontal"
      data-invalid={error ? true : undefined}
      className="items-center"
    >
      <input
        id={id}
        type="checkbox"
        className={cn(
          "size-4 shrink-0 rounded border border-input accent-primary",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {label && (
        <FieldLabel htmlFor={id} className="font-normal text-muted-foreground">
          {label}
        </FieldLabel>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
