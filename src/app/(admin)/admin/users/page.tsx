import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsersManager } from "@/components/admin/UsersManager";
import { Avatar } from "@/components/admin/ui";
import { ADMINISTRATOR } from "@/lib/admin-users";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader
        title="User Management"
        subtitle="Administrator-only · approve, ban and audit staff"
        searchPlaceholder="Search team…"
      />
      <div className="px-4 lg:px-8 mb-6">
        <div className="flex items-center gap-3 rounded-xl bg-navy p-4 text-white">
          <Avatar initials={ADMINISTRATOR.initials} color="bg-blue" className="h-10 w-10 text-xs flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-sans font-semibold truncate">{ADMINISTRATOR.name}</p>
            <p className="text-xs text-white/60 font-sans truncate">{ADMINISTRATOR.email}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue px-3 py-1 text-xs font-semibold font-sans text-white whitespace-nowrap">
            <ShieldCheck className="h-3.5 w-3.5" /> Administrator
          </span>
        </div>
      </div>
      <UsersManager />
    </>
  );
}
