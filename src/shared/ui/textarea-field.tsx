"use client";

import { useId, type ReactNode } from "react";

import type { FormUIProps } from "../types/form";
import { Field, FieldError, FieldHeader } from "./field";
import { Textarea } from "./textarea";

type TextareaFieldProps = FormUIProps<"textarea"> & {
  action?: ReactNode;
};

export function TextareaField({
  label,
  error,
  action,
  ...props
}: TextareaFieldProps) {
  const id = useId();

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldHeader htmlFor={id} label={label} action={action} />
      <Textarea
        id={id}
        autoComplete="off"
        {...props}
        aria-invalid={error ? true : undefined}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
