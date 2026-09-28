"use client";

import { formatUserName, useSession, UserAvatar } from "@/entities/session";
import { Link } from "@/shared/config/i18n/navigation";
import { Show } from "@/shared/ui/show";

import { DashboardMenuSection } from "./dashboard-menu-section";

export function DashboardMenuProfile() {
  const { data: user } = useSession();

  return (
    <Show when={user != null} data={user}>
      {(user) => {
        const displayName = formatUserName(user);

        return (
          <DashboardMenuSection>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 p-4"
            >
              <UserAvatar
                name={displayName}
                avatarUrl={user.avatarUrl}
                className="size-12 [&>span]:text-sm"
              />
              <span className="truncate text-base font-medium">
                {displayName}
              </span>
            </Link>
          </DashboardMenuSection>
        );
      }}
    </Show>
  );
}
