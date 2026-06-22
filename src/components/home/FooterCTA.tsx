"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

export function FooterCTA() {
  return (
    <section className="bg-navy py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" delay={0}>
          <div className="rounded-2xl bg-[#0a1a3a]/60 backdrop-blur-sm p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="min-w-0">
              <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-2">
                Need Help?
              </p>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
                Talk to a visa consultant.
              </h2>
              <p className="text-white/60 font-sans text-sm">
                Real humans, average response under 2 minutes. WhatsApp is the fastest route.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-whatsapp text-white font-sans font-semibold text-sm hover:bg-whatsapp-hover transition-colors"
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-white/20 text-white font-sans font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
