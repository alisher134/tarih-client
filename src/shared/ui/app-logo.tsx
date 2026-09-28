import LogoIcon from "@/shared/assets/icons/logo-icon.svg?react";

import { Link } from "@/shared/config/i18n/navigation";

export function AppLogo() {
  return (
    <Link href="/" className="text-primary">
      <LogoIcon className="size-auto h-6 w-auto" />
    </Link>
  );
}
