import { ChangeLanguage } from "@/features/change-language";
import { GuestOnly } from "@/features/require-auth";
import { AppLogo } from "@/shared/ui/app-logo";

export async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestOnly>
      <div className="flex min-h-dvh w-full flex-col">
        <div className="flex items-center justify-between px-4 py-4 md:hidden">
          <AppLogo />
          <ChangeLanguage />
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center px-4">
          {children}
        </div>
      </div>
    </GuestOnly>
  );
}
