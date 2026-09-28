import type { ComponentProps, JSX, JSXElementConstructor } from "react";
import type { FieldValues, UseFormProps } from "react-hook-form";

export type FormOptions<FormValues extends FieldValues> = Omit<
  UseFormProps<FormValues>,
  "resolver"
>;

export type FormUIProps<
  Element extends keyof JSX.IntrinsicElements | JSXElementConstructor<unknown>,
> = {
  label?: string;
  error?: string;
} & ComponentProps<Element>;

export type FieldOrientation = "vertical" | "horizontal" | "responsive";

export type TranslateParams = Record<string, string | number | Date>;

export type Translate<Key extends string = string> = (
  key: Key,
  params?: TranslateParams,
) => string;
