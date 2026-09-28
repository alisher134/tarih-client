"use client";

import type { ReactNode } from "react";

import { AuthGate } from "./auth-gate";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  return <AuthGate mode="require-auth">{children}</AuthGate>;
}
