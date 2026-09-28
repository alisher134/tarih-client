"use client";

import { LogOutIcon } from "lucide-react";

import { useLogout } from "@/entities/session";

import { AdminMenuSection } from "./admin-menu-section";

type AdminMenuAccountProps = {
  logoutLabel: string;
};

export function AdminMenuAccount({ logoutLabel }: AdminMenuAccountProps) {
  const logout = useLogout();

  return (
    <AdminMenuSection className="flex justify-center p-4">
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 text-sm text-destructive"
      >
        {logoutLabel}
        <LogOutIcon className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </AdminMenuSection>
  );
}
