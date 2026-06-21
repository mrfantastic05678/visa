"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

interface MobileNavProps {
  links: { label: string; href: string }[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ links, open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 bg-navy shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Logo variant="light" />
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-4 gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="py-3 text-base font-sans font-medium text-white/80 hover:text-white border-b border-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pt-4">
          <Link href="/apply" onClick={onClose}>
            <Button variant="primary" size="lg" className="w-full">
              Apply Now
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
