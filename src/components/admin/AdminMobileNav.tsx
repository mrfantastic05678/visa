"use client";

import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  FileText,
  Inbox,
  FolderOpen,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Home", icon: LayoutGrid, exact: true },
  { href: "/admin/applications", label: "Apps", icon: FileText, exact: false },
  { href: "/admin/inquiries", label: "Inbox", icon: Inbox, exact: false, center: true },
  { href: "/admin/documents", label: "Docs", icon: FolderOpen, exact: false },
  { href: "/admin/more", label: "More", icon: MoreHorizontal, exact: false },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line">
      <div className="grid grid-cols-5 h-16">
        {TABS.map(({ href, label, icon: Icon, exact, center }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          if (center) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-1 relative"
              >
                <span
                  className={cn(
                    "absolute -top-4 h-12 w-12 rounded-full grid place-items-center shadow-lg",
                    active ? "bg-blue" : "bg-blue"
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-sans font-medium mt-7",
                    active ? "text-blue" : "text-muted"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-blue" : "text-muted"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-sans font-medium",
                  active ? "text-blue" : "text-muted"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
