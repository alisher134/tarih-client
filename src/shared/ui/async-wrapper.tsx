import { type ReactNode } from "react";

import { LoaderGate } from "./loader-gate";

type AsyncWrapperProps<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined;
  children: (data: T) => ReactNode;
  loaderSlot?: ReactNode;
  errorSlot?: ReactNode;
};

export function AsyncWrapper<T>({
  children,
  data,
  isLoading,
  isError,
  loaderSlot,
  errorSlot,
}: AsyncWrapperProps<T>) {
  return (
    <LoaderGate isLoading={isLoading} loaderSlot={loaderSlot}>
      {isError ? (errorSlot ?? null) : data == null ? null : children(data)}
    </LoaderGate>
  );
}
