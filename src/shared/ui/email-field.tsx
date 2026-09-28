import type { FormUIProps } from "../types/form";
import { InputField } from "./input-field";

export function EmailField({ label, error, ...props }: FormUIProps<"input">) {
  return (
    <InputField
      label={label}
      error={error}
      type="email"
      autoComplete="email"
      {...props}
    />
  );
}
