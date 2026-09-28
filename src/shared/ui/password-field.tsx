"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import type { FormUIProps } from "../types/form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";

export function PasswordField({
  label,
  error,
  className,
  ...props
}: FormUIProps<"input">) {
  const id = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleToggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <Field data-invalid={error ? true : undefined}>
      {label && (
        <FieldLabel htmlFor={id} className="font-normal text-muted-foreground">
          {label}
        </FieldLabel>
      )}
      <InputGroup className={className}>
        <InputGroupInput
          autoComplete="off"
          id={id}
          {...props}
          type={isPasswordVisible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={handleToggleVisibility}>
            {isPasswordVisible ? (
              <EyeOffIcon className="size-3" aria-hidden />
            ) : (
              <EyeIcon className="size-3" aria-hidden />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
