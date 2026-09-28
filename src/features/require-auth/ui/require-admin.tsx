"use client";

import type { ReactNode } from "react";

import { AuthGate } from "./auth-gate";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  return <AuthGate mode="require-admin">{children}</AuthGate>;
}
