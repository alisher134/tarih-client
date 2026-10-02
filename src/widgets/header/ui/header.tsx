import { getTranslations } from "next-intl/server";
import { cn } from "cn";

import { ChangeLanguage } from "@/features/change-language";
import { AppLogo } from "@/shared/ui/app-logo";
import { Container } from "@/shared/ui/container";
import { Show } from "@/shared/ui/show";

import { HeaderAuth } from "./header-auth";
import { HeaderDesktopNav, HeaderMobileMenu } from "./header-nav";

type HeaderProps = {
  className?: string;
  showNav?: boolean;
};

export async function Header({ className, showNav = false }: HeaderProps) {
  const t = await getTranslations("header");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 shrink-0 border-b bg-background/80 backdrop-blur-md",
        className,
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10">
            <AppLogo />
            <Show when={showNav}>
              <HeaderDesktopNav
                coursesLabel={t("links.courses")}
                pricingLabel={t("links.pricing")}
                faqLabel={t("links.faq")}
              />
            </Show>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <ChangeLanguage />
              <HeaderAuth
                loginLabel={t("login")}
                logoutLabel={t("logout")}
                profileLabel={t("profile")}
              />
            </div>

            <HeaderMobileMenu
              showNav={showNav}
              coursesLabel={t("links.courses")}
              pricingLabel={t("links.pricing")}
              faqLabel={t("links.faq")}
              menuLabel={t("menu")}
              authSlot={
                <HeaderAuth
                  loginLabel={t("login")}
                  logoutLabel={t("logout")}
                  profileLabel={t("profile")}
                />
              }
              langSlot={<ChangeLanguage />}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
