"use client";

import type { ReactNode } from "react";

import { AuthGate } from "./auth-gate";

type GuestOnlyProps = {
  children: ReactNode;
};

export function GuestOnly({ children }: GuestOnlyProps) {
  return <AuthGate mode="guest-only">{children}</AuthGate>;
}
