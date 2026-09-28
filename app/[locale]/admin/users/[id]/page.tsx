import { AdminUser } from "@/_pages/admin/user";

type AdminUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const { id } = await params;

  return <AdminUser userId={id} />;
}
