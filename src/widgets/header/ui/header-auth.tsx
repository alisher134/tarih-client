"use client";

import { useSession } from "@/entities/session";
import { useSignInHref } from "@/features/require-auth/model/use-auth-return-url";
import { LinkButton } from "@/shared/ui/link-button";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { Show } from "@/shared/ui/show";

import { HeaderUserMenu } from "./header-user-menu";

type HeaderAuthProps = {
  loginLabel: string;
  logoutLabel: string;
  profileLabel: string;
};

export function HeaderAuth({
  loginLabel,
  logoutLabel,
  profileLabel,
}: HeaderAuthProps) {
  const { data: user, isLoading } = useSession();
  const signInHref = useSignInHref();

  return (
    <LoaderGate isLoading={isLoading} loaderSlot={<div className="h-7 w-16" />}>
      <Show
        when={user != null}
        data={user}
        fallback={<LinkButton href={signInHref}>{loginLabel}</LinkButton>}
      >
        {(user) => (
          <HeaderUserMenu
            user={user}
            profileLabel={profileLabel}
            logoutLabel={logoutLabel}
          />
        )}
      </Show>
    </LoaderGate>
  );
}
