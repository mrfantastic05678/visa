import { BRAND, WHATSAPP_URL } from "@/lib/constants";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About ${BRAND.name} — ${BRAND.tagline}`,
  description: `Learn about Visati, Dubai's trusted UAE visa consultancy. ${BRAND.clientCount} clients served with a ${BRAND.approvalRate} approval rate across ${BRAND.countriesServed} countries.`,
};

const STATS = [
  { value: BRAND.clientCount, label: "Travellers served" },
  { value: BRAND.approvalRate, label: "Approval rate" },
  { value: BRAND.countriesServed, label: "Countries served" },
  { value: BRAND.avgProcessing, label: "Avg. processing time" },
];

const VALUES = [
  {
    Icon: Zap,
    title: "Speed without shortcuts",
    body: "Our streamlined process means most applications are reviewed and submitted within hours. Fast doesn't mean careless — every file is checked before it goes in.",
  },
  {
    Icon: Shield,
    title: "Accuracy you can trust",
    body: "A missed document or incorrect entry type can cause costly delays. Every application is reviewed by a licensed consultant before submission.",
  },
  {
    Icon: Globe,
    title: "Expert local knowledge",
    body: "Based in Dubai, we know UAE immigration requirements inside out — the rules, the edge cases, and how they change. You benefit from that every time.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Pick your visa",
    body: "Browse visa types and select the one that matches your travel purpose and duration. Not sure? Our consultants are on WhatsApp.",
  },
  {
    step: "02",
    title: "Upload documents",
    body: "Our checklist tells you exactly what you need. Upload securely — no back-and-forth, no guesswork.",
  },
  {
    step: "03",
    title: "We handle the rest",
    body: "A licensed consultant reviews your application and submits it directly to UAE immigration on your behalf.",
  },
  {
    step: "04",
    title: "Receive your visa",
    body: "Your approved visa arrives by email. Track real-time progress from our portal or via WhatsApp updates.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/5" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/5" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-4">
            About Visati
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight mb-6">
            The UAE visa process — finally uncomplicated.
          </h1>
          <p className="text-white/60 font-sans text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
            We built Visati because applying for a UAE visa was harder than it
            needed to be. Too many portals, unclear requirements, slow
            responses. We built the consultancy we wished had existed —
            concierge-grade service, transparent pricing, and real humans on
            WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-blue text-white font-sans font-semibold text-sm hover:bg-blue-hover transition-colors"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/20 text-white font-sans font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              <FaWhatsapp className="h-[18px] w-[18px]" />
              Chat with Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-line">
            {STATS.map(({ value, label }) => (
              <div key={label} className="px-6 py-10 text-center">
                <p className="font-display font-bold text-3xl sm:text-4xl text-navy mb-1.5">
                  {value}
                </p>
                <p className="text-muted font-sans text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: copy */}
            <div>
              <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-6 leading-tight">
                Visa approvals should be the easy part of your trip.
              </h2>
              <p className="text-muted font-sans text-sm leading-relaxed mb-4">
                UAE immigration requirements change frequently — and the margin
                for error is zero. A missed document, a wrong photo dimension,
                or an incorrect entry type can mean delays, rejections, or
                costly amendments.
              </p>
              <p className="text-muted font-sans text-sm leading-relaxed mb-8">
                We handle every detail so you don&apos;t have to. From picking the
                right visa category to tracking submission status, our
                consultants stay with you from start to stamp.
              </p>
              <ul className="space-y-3">
                {[
                  "Licensed UAE immigration consultants",
                  "Document review before every submission",
                  "Real-time status updates via WhatsApp",
                  "Transparent pricing — no hidden fees",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-blue flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-ink font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: trust card */}
            <div className="relative">
              <div className="rounded-2xl bg-navy p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-blue fill-blue" />
                    ))}
                  </div>
                  <span className="text-white/50 font-sans text-xs">
                    {BRAND.rating} / 5.0 average rating
                  </span>
                </div>
                <blockquote className="text-white font-sans text-base leading-relaxed mb-6">
                  &ldquo;Applied on Monday, visa in my inbox by Wednesday afternoon.
                  The team updated me via WhatsApp at every stage — never felt
                  in the dark for a moment.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                  <div className="h-10 w-10 rounded-full bg-blue/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-display font-bold text-sm">
                      SR
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-sans text-sm font-semibold">
                      S. Rahman
                    </p>
                    <p className="text-white/50 font-sans text-xs">
                      Tourist 60-day Visa · Verified client
                    </p>
                  </div>
                </div>
              </div>
              {/* Accent badge */}
              <div className="absolute -bottom-4 -right-4 hidden lg:flex h-[72px] w-[72px] rounded-2xl bg-blue items-center justify-center flex-col shadow-lg">
                <p className="font-display font-bold text-white text-lg leading-none">
                  {BRAND.approvalRate}
                </p>
                <p className="text-white/75 font-sans text-[9px] mt-0.5 text-center leading-tight">
                  approval
                  <br />
                  rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-mist border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-3">
              Why Visati
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              What sets us apart.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-line p-7"
              >
                <div className="h-10 w-10 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-blue" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-3">
                  {title}
                </h3>
                <p className="text-muted font-sans text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we work ───────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-3">
              The Process
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              How it works.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {PROCESS.map(({ step, title, body }) => (
              <div key={step}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-full bg-blue/10 border border-blue/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-xs text-blue font-bold">
                      {step}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-line" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-2">
                  {title}
                </h3>
                <p className="text-muted font-sans text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────── */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-4">
            Ready to start?
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 max-w-2xl mx-auto leading-tight">
            Your UAE visa, handled by experts.
          </h2>
          <p className="text-white/55 font-sans text-sm mb-8 max-w-sm mx-auto">
            Join {BRAND.clientCount} travellers who trusted Visati with their
            UAE visa application.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-blue text-white font-sans font-semibold text-sm hover:bg-blue-hover transition-colors"
            >
              Start Application
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/visa-types"
              className="inline-flex items-center h-12 px-8 rounded-xl border border-white/20 text-white font-sans font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Browse Visa Types
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
