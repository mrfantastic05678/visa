import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin — Visati", template: "%s | Visati Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-mist">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
      <AdminMobileNav />
    </div>
  );
}
