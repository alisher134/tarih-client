import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className="min-h-screen py-2">{children}</main>

      <Footer />
    </>
  );
}
