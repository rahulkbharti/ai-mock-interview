import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import MobileNav from "@/components/shared/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar session={session} />
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
      <Footer className="hidden md:block" />
      <MobileNav />
    </div>
  );
}
