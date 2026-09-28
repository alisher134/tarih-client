"use client";

import { localeOptions } from "@/shared/config/i18n";
import { usePathname, useRouter } from "@/shared/config/i18n/navigation";
import { Button } from "@/shared/ui/button";

type ChangeLanguageListProps = {
  currentLocale: string;
};

export function ChangeLanguageList({ currentLocale }: ChangeLanguageListProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0.5">
      {localeOptions.map((item) => (
        <Button
          key={item.code}
          variant={item.code === currentLocale ? "default" : "ghost"}
          size="sm"
          className="justify-start"
          onClick={() => {
            router.replace(pathname, { locale: item.code });
          }}
        >
          <span>{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
