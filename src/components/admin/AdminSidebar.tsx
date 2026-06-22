"use client";

import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/admin-sample-data";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "./ui";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderOpen,
  Users,
  ShieldCheck,
  Settings,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, count: null },
  { href: "/admin/applications", label: "Applications", icon: FileText, exact: false, count: 142 },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, exact: false, count: 38 },
  { href: "/admin/documents", label: "Documents", icon: FolderOpen, exact: false, count: null },
  { href: "/admin/clients", label: "Clients", icon: Users, exact: false, count: null },
  { href: "/admin/users", label: "Users", icon: ShieldCheck, exact: false, count: 2 },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false, count: null },
  { href: "/admin/studio", label: "CMS Studio", icon: PenLine, exact: false, count: null },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-navy min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-6">
        <Logo variant="light" showTagline />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 font-sans">
          Workspace
        </p>
        <div className="space-y-1">
          {ADMIN_NAV.map(({ href, label, icon: Icon, exact, count }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors",
                  active
                    ? "bg-blue text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="truncate flex-1">{label}</span>
                {count != null && (
                  <span
                    className={cn(
                      "text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center",
                      active ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="p-3 m-3 rounded-xl bg-white/5 flex items-center gap-3">
        <Avatar initials={CURRENT_USER.initials} className="h-9 w-9 text-xs flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-sans font-semibold text-white truncate">
            {CURRENT_USER.name}
          </p>
          <p className="text-xs font-sans text-white/50 truncate">{CURRENT_USER.role}</p>
        </div>
      </div>
    </aside>
  );
}
