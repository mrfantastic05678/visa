"use client";

import { Avatar } from "@/components/admin/ui";
import { signOutAndRedirect } from "@/lib/admin-auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAvatar } from "@/hooks/useAvatar";
import { ChevronRight, LogOut, Loader2, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const STATS = [
  { value: "48", label: "Processed" },
  { value: "2", label: "Pending" },
  { value: "4.9★", label: "Rating" },
];

const LINKS = [
  { icon: ShieldCheck, label: "User Management", sub: "Administrator only", href: "/admin/users" },
  { icon: Settings, label: "Settings", sub: "Profile and visa pricing", href: "/admin/settings" },
];

export default function AdminMorePage() {
  const currentUser = useCurrentUser();
  const { src: avatarSrc } = useAvatar();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOutAndRedirect();
  }

  return (
    <div className="px-4 lg:px-8 pt-6 lg:pt-7 pb-10 max-w-xl">
      <h1 className="font-display font-bold text-2xl text-navy mb-5">More</h1>

      {/* Profile card */}
      <div className="rounded-xl bg-navy p-5 flex items-center gap-4 mb-4">
        <Avatar initials={currentUser.initials} src={avatarSrc} className="h-14 w-14 text-lg flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-display font-bold text-lg text-white truncate">{currentUser.name}</p>
          <p className="text-sm text-white/60 font-sans truncate">{currentUser.role}</p>
          <p className="text-xs text-blue font-sans truncate mt-0.5">{currentUser.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-line p-4 text-center">
            <p className="font-display font-bold text-xl text-navy">{s.value}</p>
            <p className="text-xs text-muted font-sans mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="space-y-3 mb-4">
        {LINKS.map(({ icon: Icon, label, sub, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 bg-white rounded-xl border border-line p-4 hover:bg-mist transition-colors"
          >
            <span className="h-10 w-10 rounded-lg bg-blue/10 grid place-items-center flex-shrink-0">
              <Icon className="h-5 w-5 text-blue" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-sans font-semibold text-ink text-sm">{label}</p>
              <p className="text-xs text-muted font-sans">{sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted flex-shrink-0" />
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-red-50 text-red-500 font-semibold font-sans text-sm hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {loggingOut ? "Signing out..." : "Sign Out"}
      </button>
      <p className="text-center text-xs text-muted font-sans mt-4">Visati Admin · v3.18.2</p>
    </div>
  );
}
