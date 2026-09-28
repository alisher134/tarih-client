import { DashboardSidebar, DashboardTabBar } from "@/widgets/dashboard-sidebar";
import { RequireAuth } from "@/features/require-auth";

import { AppShellLayout } from "./app-shell-layout";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellLayout
      sidebar={<DashboardSidebar />}
      footer={<DashboardTabBar />}
      isHeaderHiddenOnMobile
    >
      <RequireAuth>{children}</RequireAuth>
    </AppShellLayout>
  );
}
