import { type ReactNode } from "react";

import { CenteredSpinner } from "./spinner";

type LoaderGateProps = {
  isLoading: boolean;
  loaderSlot?: ReactNode;
  children: ReactNode;
};

export function LoaderGate({
  isLoading,
  loaderSlot,
  children,
}: LoaderGateProps) {
  if (isLoading) {
    return loaderSlot ?? <CenteredSpinner />;
  }

  return children;
}
