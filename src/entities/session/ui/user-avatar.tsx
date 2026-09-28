import Image from "next/image";

import { cn } from "cn";

import { Show } from "@/shared/ui/show";

import { getUserInitials } from "../lib/get-user-initials";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string;
  className?: string;
};

export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative flex size-7 shrink-0 overflow-hidden rounded-full bg-primary/10",
        className,
      )}
    >
      <Show
        when={avatarUrl != null}
        data={avatarUrl}
        fallback={
          <span className="flex size-full items-center justify-center text-xs font-medium text-primary">
            {getUserInitials(name)}
          </span>
        }
      >
        {(url) => (
          <Image src={url} alt="" fill unoptimized className="object-cover" />
        )}
      </Show>
    </span>
  );
}
