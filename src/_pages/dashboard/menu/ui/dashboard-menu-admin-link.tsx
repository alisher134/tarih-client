"use client";

import { ShieldIcon } from "lucide-react";

import { useIsAdmin } from "@/entities/session";
import { Link } from "@/shared/config/i18n/navigation";
import { Show } from "@/shared/ui/show";

import { DashboardMenuSection } from "./dashboard-menu-section";

type DashboardMenuAdminLinkProps = {
  label: string;
};

export function DashboardMenuAdminLink({ label }: DashboardMenuAdminLinkProps) {
  const { isAdmin, isLoading } = useIsAdmin();

  return (
    <Show when={!isLoading && isAdmin}>
      <DashboardMenuSection>
        <Link
          href="/admin"
          className="flex items-center gap-3 p-4 text-sm font-medium"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
            <ShieldIcon className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
          {label}
        </Link>
      </DashboardMenuSection>
    </Show>
  );
}
