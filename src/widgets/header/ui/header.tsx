import { getTranslations } from "next-intl/server";
import { cn } from "cn";

import { ChangeLanguage } from "@/features/change-language";
import { AppLogo } from "@/shared/ui/app-logo";
import { Container } from "@/shared/ui/container";

import { HeaderAuth } from "./header-auth";

type HeaderProps = {
  className?: string;
};

export async function Header({ className }: HeaderProps) {
  const t = await getTranslations("header");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 shrink-0 border-b bg-card",
        className,
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <AppLogo />

          <div className="flex items-center gap-2">
            <ChangeLanguage />

            <HeaderAuth
              loginLabel={t("login")}
              logoutLabel={t("logout")}
              profileLabel={t("profile")}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
