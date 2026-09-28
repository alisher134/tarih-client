import { Header } from "@/widgets/header";

type AppShellLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  footer?: React.ReactNode;
  isHeaderHiddenOnMobile?: boolean;
};

export function AppShellLayout({
  children,
  sidebar,
  footer,
  isHeaderHiddenOnMobile = false,
}: AppShellLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header
        className={isHeaderHiddenOnMobile ? "hidden md:block" : undefined}
      />

      <div className="flex min-h-0 flex-1">
        {sidebar}
        <main className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {footer}
    </div>
  );
}
