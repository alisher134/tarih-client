import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from "react-hook-form";
import type { z } from "zod";

export function useZodForm<T extends FieldValues>(
  schema: z.ZodType<T>,
  options?: Omit<UseFormProps<T>, "resolver"> & {
    defaultValues?: DefaultValues<T>;
  },
) {
  return useForm<T>({
    resolver: zodResolver(schema as never) as Resolver<T>,
    ...options,
  });
}
