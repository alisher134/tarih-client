import type { ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

type AppFormProps<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
> = {
  children: (
    form: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
  ) => ReactNode;
  onSubmit: (values: TTransformedValues) => void | Promise<void>;
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  className?: string;
};

export function AppForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  children,
  form,
  className,
  onSubmit,
}: AppFormProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
}
