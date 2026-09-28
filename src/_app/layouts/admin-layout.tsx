import { AdminSidebar, AdminTabBar } from "@/widgets/admin-sidebar";
import { RequireAdmin } from "@/features/require-auth";

import { AppShellLayout } from "./app-shell-layout";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellLayout
      sidebar={<AdminSidebar />}
      footer={<AdminTabBar />}
      isHeaderHiddenOnMobile
    >
      <RequireAdmin>{children}</RequireAdmin>
    </AppShellLayout>
  );
}
