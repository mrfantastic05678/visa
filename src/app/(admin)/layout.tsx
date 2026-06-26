import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { requireAdminSession } from "@/lib/admin-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Visati Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-mist">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
      <AdminMobileNav />
    </div>
  );
}
