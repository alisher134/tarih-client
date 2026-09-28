"use client";

import { useState } from "react";

import { cn } from "cn";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react";

import {
  formatUserName,
  useLogout,
  UserAvatar,
  type SessionUser,
} from "@/entities/session";
import { Link } from "@/shared/config/i18n/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";

type HeaderUserMenuProps = {
  user: SessionUser;
  profileLabel: string;
  logoutLabel: string;
};

const menuItemClassName =
  "flex w-full items-center gap-3 rounded-lg px-3 py-1 text-left text-sm transition-colors";

export function HeaderUserMenu({
  user,
  profileLabel,
  logoutLabel,
}: HeaderUserMenuProps) {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const displayName = formatUserName(user);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="max-w-36 truncate text-sm text-secondary-foreground">
          {displayName}
        </span>
        <UserAvatar name={displayName} avatarUrl={user.avatarUrl} />
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-36 gap-0 rounded-xl p-2"
      >
        <Link
          href="/dashboard/profile"
          onClick={handleProfileClick}
          className={cn(
            menuItemClassName,
            "text-secondary-foreground hover:bg-muted",
          )}
        >
          <UserIcon className="size-4" strokeWidth={1.75} aria-hidden />
          {profileLabel}
        </Link>

        <Separator className="mx-2 my-1" />

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            menuItemClassName,
            "text-destructive hover:bg-destructive/10",
          )}
        >
          <LogOutIcon className="size-4" strokeWidth={1.75} aria-hidden />
          {logoutLabel}
        </button>
      </PopoverContent>
    </Popover>
  );
}
