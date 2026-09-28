"use client";

import { LogOutIcon } from "lucide-react";

import { useLogout } from "@/entities/session";

import { DashboardMenuSection } from "./dashboard-menu-section";

type DashboardMenuAccountProps = {
  logoutLabel: string;
};

export function DashboardMenuAccount({
  logoutLabel,
}: DashboardMenuAccountProps) {
  const logout = useLogout();

  return (
    <DashboardMenuSection className="flex justify-center p-4">
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 text-sm text-destructive"
      >
        {logoutLabel}
        <LogOutIcon className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </DashboardMenuSection>
  );
}
