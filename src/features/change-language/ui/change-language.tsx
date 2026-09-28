import { getLocale, getTranslations } from "next-intl/server";

import { getLocaleOption } from "@/shared/config/i18n";
import { buttonVariants } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";

import { ChangeLanguageList } from "./change-language-list";

export async function ChangeLanguage() {
  const locale = await getLocale();
  const t = await getTranslations("changeLanguage");
  const current = getLocaleOption(locale);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline-primary", size: "xs" }),
          "font-medium text-base gap-1 items-center",
        )}
      >
        <span className="uppercase text-primary">{current.shortLabel}</span>
        <ChevronDownIcon className="size-4 text-primary" />
      </PopoverTrigger>

      <PopoverContent className="w-32">
        <PopoverHeader>
          <PopoverTitle>{t("title")}</PopoverTitle>
        </PopoverHeader>

        <ChangeLanguageList currentLocale={locale} />
      </PopoverContent>
    </Popover>
  );
}
