"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "../ui/Logo";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Visa Types", href: "/visa-types" },
  { label: "Apply", href: "/apply" },
  { label: "Track", href: "/track" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "bg-navy/95 backdrop-blur-md shadow-lg"
            : "bg-navy"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" aria-label="Visati home">
              <Logo variant="light" showTagline />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-sans font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="hidden md:inline-flex items-center text-sm font-sans font-medium text-white/70">
                EN
              </span>
              <Link
                href="/apply"
                className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors whitespace-nowrap"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Link>
              <button
                className="lg:hidden text-white/80 hover:text-white p-2"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        links={NAV_LINKS}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
