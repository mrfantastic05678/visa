import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsersManager } from "@/components/admin/UsersManager";
import { Avatar } from "@/components/admin/ui";
import { requireAdminRole } from "@/lib/admin-guard";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Users" };

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export default async function AdminUsersPage() {
  const session = await requireAdminRole();
  const admin = session!.user as { name: string; email: string };

  return (
    <>
      <AdminPageHeader
        title="User Management"
        subtitle="Administrator-only · approve, ban and audit staff"
        searchPlaceholder="Search team…"
      />
      <div className="px-4 lg:px-8 mb-6">
        <div className="flex items-center gap-3 rounded-xl bg-navy p-4 text-white">
          <Avatar initials={initialsFrom(admin.name)} color="bg-navy" className="h-10 w-10 text-xs flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-sans font-semibold truncate">{admin.name}</p>
            <p className="text-xs text-white/60 font-sans truncate">{admin.email}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-[#F0C864] px-3 py-1 text-xs font-semibold font-sans text-navy whitespace-nowrap">
            <ShieldCheck className="h-3.5 w-3.5" /> Administrator
          </span>
        </div>
      </div>
      <UsersManager />
    </>
  );
}
