import { type ReactNode } from "react";

type ErrorGateProps = {
  isError: boolean;
  errorSlot?: ReactNode;
  children: ReactNode;
};

export function ErrorGate({ isError, errorSlot, children }: ErrorGateProps) {
  if (isError) {
    return errorSlot ?? null;
  }

  return children;
}
