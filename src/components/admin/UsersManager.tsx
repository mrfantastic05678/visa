"use client";

import { cn } from "@/lib/utils";
import {
  STAFF_USERS,
  USER_STATUS_LABEL,
  type StaffUser,
  type UserStatus,
} from "@/lib/admin-users";
import { Avatar } from "./ui";
import { Ban, Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";

const statusStyle: Record<UserStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  banned: "bg-red-50 text-red-500",
};

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-sans", statusStyle[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {USER_STATUS_LABEL[status]}
    </span>
  );
}

export function UsersManager() {
  const [users, setUsers] = useState<StaffUser[]>(STAFF_USERS);
  const [activityUser, setActivityUser] = useState<StaffUser | null>(null);

  function setStatus(id: string, status: UserStatus) {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, status } : u)));
  }
  function remove(id: string) {
    setUsers((list) => list.filter((u) => u.id !== id));
  }

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    banned: users.filter((u) => u.status === "banned").length,
  };

  const stats = [
    { label: "Team Members", value: counts.total },
    { label: "Active", value: counts.active },
    { label: "Pending Approval", value: counts.pending },
    { label: "Banned", value: counts.banned },
  ];

  return (
    <div className="px-4 lg:px-8 pb-10">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-line p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted font-sans">{s.label}</p>
            <p className="font-display font-bold text-3xl text-navy mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Users table (desktop) */}
      <div className="hidden lg:block bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans border-b border-line">
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="px-3 py-3 font-semibold">Role</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Last Active</th>
              <th className="px-3 py-3 font-semibold">Apps</th>
              <th className="px-3 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-mist transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={u.initials} src={u.photo} color={u.color} className="h-9 w-9 text-xs flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-sans font-medium text-ink truncate">{u.name}</p>
                      <p className="text-xs text-muted font-sans truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{u.role}</td>
                <td className="px-3 py-3.5"><StatusBadge status={u.status} /></td>
                <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{u.lastActive}</td>
                <td className="px-3 py-3.5 font-sans text-ink">{u.appsHandled}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setActivityUser(u)} className="text-xs font-sans font-medium text-gold hover:underline">Activity</button>
                    {u.status === "pending" && (
                      <>
                        <button onClick={() => setStatus(u.id, "active")} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold font-sans hover:bg-emerald-100">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button onClick={() => remove(u.id)} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-line text-muted text-xs font-semibold font-sans hover:bg-mist">
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {u.status === "active" && (
                      <button onClick={() => setStatus(u.id, "banned")} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-red-50 text-red-500 text-xs font-semibold font-sans hover:bg-red-100">
                        <Ban className="h-3.5 w-3.5" /> Ban
                      </button>
                    )}
                    {u.status === "banned" && (
                      <button onClick={() => setStatus(u.id, "active")} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-line text-ink text-xs font-semibold font-sans hover:bg-mist">
                        <RotateCcw className="h-3.5 w-3.5" /> Unban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users cards (mobile) */}
      <div className="lg:hidden space-y-3">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-line p-4">
            <div className="flex items-center gap-3">
              <Avatar initials={u.initials} src={u.photo} color={u.color} className="h-10 w-10 text-xs flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-sans font-semibold text-ink truncate">{u.name}</p>
                <p className="text-xs text-muted font-sans truncate">{u.role} · {u.lastActive}</p>
              </div>
              <StatusBadge status={u.status} />
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button onClick={() => setActivityUser(u)} className="h-8 px-3 rounded-lg border border-line text-xs font-semibold font-sans text-ink">Activity</button>
              {u.status === "pending" && (
                <>
                  <button onClick={() => setStatus(u.id, "active")} className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold font-sans">Approve</button>
                  <button onClick={() => remove(u.id)} className="h-8 px-3 rounded-lg border border-line text-muted text-xs font-semibold font-sans">Reject</button>
                </>
              )}
              {u.status === "active" && (
                <button onClick={() => setStatus(u.id, "banned")} className="h-8 px-3 rounded-lg bg-red-50 text-red-500 text-xs font-semibold font-sans">Ban</button>
              )}
              {u.status === "banned" && (
                <button onClick={() => setStatus(u.id, "active")} className="h-8 px-3 rounded-lg border border-line text-ink text-xs font-semibold font-sans">Unban</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activity drawer */}
      {activityUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setActivityUser(null)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-xl p-6 overflow-y-auto">
            <button onClick={() => setActivityUser(null)} className="absolute top-4 right-4 text-muted hover:text-ink">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Avatar initials={activityUser.initials} src={activityUser.photo} color={activityUser.color} className="h-12 w-12 text-sm flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-display font-bold text-navy truncate">{activityUser.name}</p>
                <p className="text-xs text-muted font-sans truncate">{activityUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="rounded-lg bg-mist p-3"><p className="font-display font-bold text-navy">{activityUser.appsHandled}</p><p className="text-[10px] text-muted font-sans">Apps</p></div>
              <div className="rounded-lg bg-mist p-3"><p className="font-display font-bold text-navy text-sm">{activityUser.joined}</p><p className="text-[10px] text-muted font-sans">Joined</p></div>
              <div className="rounded-lg bg-mist p-3"><p className="font-display font-bold text-navy text-xs">{USER_STATUS_LABEL[activityUser.status]}</p><p className="text-[10px] text-muted font-sans">Status</p></div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-3">Recent Activity</p>
            <ul className="space-y-4">
              {activityUser.activity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-navy flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-sans text-ink">{a.text}</p>
                    <p className="text-xs text-muted font-sans mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
