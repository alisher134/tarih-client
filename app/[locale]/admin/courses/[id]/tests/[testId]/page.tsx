import { AdminTest } from "@/_pages/admin/test";

type AdminTestPageProps = {
  params: Promise<{ id: string; testId: string }>;
};

export default async function AdminTestPage({ params }: AdminTestPageProps) {
  const { id, testId } = await params;

  return <AdminTest courseId={id} testId={testId} />;
}
