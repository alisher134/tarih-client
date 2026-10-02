"use client";

import { Menu } from "lucide-react";
import { Link } from "@/shared/config/i18n/navigation";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { useState } from "react";
import { AppLogo } from "@/shared/ui/app-logo";
import { Show } from "@/shared/ui/show";

export type HeaderNavProps = {
  coursesLabel: string;
  pricingLabel: string;
  faqLabel: string;
};

function getLinks(props: HeaderNavProps) {
  return [
    { href: "#courses", label: props.coursesLabel },
    { href: "#pricing", label: props.pricingLabel },
    { href: "#faq", label: props.faqLabel },
  ];
}

export function HeaderDesktopNav(props: HeaderNavProps) {
  const links = getLinks(props);

  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="relative text-muted-foreground transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export type HeaderMobileMenuProps = {
  coursesLabel?: string;
  pricingLabel?: string;
  faqLabel?: string;
  menuLabel: string;
  authSlot: React.ReactNode;
  langSlot: React.ReactNode;
  showNav?: boolean;
};

export function HeaderMobileMenu(props: HeaderMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const links =
    props.showNav && props.coursesLabel && props.pricingLabel && props.faqLabel
      ? getLinks({
          coursesLabel: props.coursesLabel,
          pricingLabel: props.pricingLabel,
          faqLabel: props.faqLabel,
        })
      : [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" />
        }
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] sm:w-[350px] flex flex-col border-l-0 sm:border-l bg-background/95 backdrop-blur-xl p-0 sm:p-6 shadow-2xl"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border/50 px-6 py-4 sm:px-0 sm:py-2">
          <SheetTitle className="text-left sr-only">
            {props.menuLabel}
          </SheetTitle>
          <div
            onClick={() => setOpen(false)}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <AppLogo />
          </div>
        </SheetHeader>

        <Show when={links.length > 0}>
          <div className="flex flex-col gap-3 flex-1 mt-6 px-6 sm:px-0 overflow-y-auto">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center rounded-2xl px-5 py-4 text-lg font-semibold text-foreground/70 transition-all duration-300 hover:bg-primary/10 hover:text-primary active:scale-[0.98] border border-transparent hover:border-primary/20"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "both",
                }}
                onClick={() => setOpen(false)}
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            ))}
          </div>
        </Show>

        <div className="mt-auto border-t border-border/50 bg-muted/30 p-6 sm:rounded-2xl sm:mb-2 sm:mx-0 flex flex-col gap-4">
          <div
            className="w-full flex justify-center [&>*]:w-full transition-transform active:scale-[0.98]"
            onClick={() => setOpen(false)}
          >
            {props.authSlot}
          </div>
          <div className="w-full flex justify-center [&>*]:w-full">
            {props.langSlot}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
