import { useId, type ReactNode } from "react";

import type { FormUIProps } from "../types/form";
import { Field, FieldError, FieldHeader } from "./field";
import { Input } from "./input";

type InputFieldProps = FormUIProps<"input"> & {
  action?: ReactNode;
};

export function InputField({
  label,
  error,
  action,
  ...props
}: InputFieldProps) {
  const id = useId();

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldHeader htmlFor={id} label={label} action={action} />
      <Input
        autoComplete="off"
        id={id}
        {...props}
        aria-invalid={error ? true : undefined}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
