import { BRAND, CONTACT, SOCIAL, WHATSAPP_URL } from "@/lib/constants";
import { Logo } from "../ui/Logo";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const FOOTER_LINKS = {
  Visas: [
    { label: "Tourist 30-day", href: "/visa-types" },
    { label: "Tourist 60-day", href: "/visa-types" },
    { label: "Multi-Entry", href: "/visa-types" },
    { label: "Business", href: "/visa-types" },
    { label: "Transit", href: "/visa-types" },
  ],
  Services: [
    { label: "Apply", href: "/apply" },
    { label: "Track", href: "/track" },
    { label: "Renew", href: "/contact" },
    { label: "Corporate", href: "/contact" },
    { label: "Travel Insurance", href: "/contact" },
  ],
  Company: [
    { label: "About", href: "/" },
    { label: "Careers", href: "/contact" },
    { label: "Press", href: "/contact" },
    { label: "Partners", href: "/contact" },
    { label: "Blog", href: "/" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "WhatsApp", href: WHATSAPP_URL },
    { label: "Refund Policy", href: "/faq" },
    { label: "Terms", href: "/terms" },
  ],
};

const SOCIAL_ICONS = [
  { key: "facebook", Icon: Facebook, url: SOCIAL.facebook },
  { key: "instagram", Icon: Instagram, url: SOCIAL.instagram },
  { key: "twitter", Icon: Twitter, url: SOCIAL.twitter },
  { key: "linkedin", Icon: Linkedin, url: SOCIAL.linkedin },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* CTA card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-navy-2 to-ink-2 p-7 sm:p-9 mb-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue font-sans mb-2">
                Need Help?
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                Talk to a visa consultant.
              </h2>
              <p className="text-sm text-white/60 font-sans">
                Real humans, average response under 2 minutes. WhatsApp is the
                fastest route.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-whatsapp text-white text-sm font-semibold font-sans hover:bg-whatsapp-hover transition-colors whitespace-nowrap"
              >
                <FaWhatsapp className="h-[18px] w-[18px] flex-shrink-0" />
                WhatsApp Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center h-11 px-5 rounded-xl border border-white/20 text-white text-sm font-semibold font-sans hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-white/55 font-sans leading-relaxed max-w-xs">
              {BRAND.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_ICONS.map(({ key, Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="min-w-0">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 font-sans mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white font-sans transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-sans">
            &copy; {new Date().getFullYear()} {BRAND.legalName} · {BRAND.location} ·
            Trade Licence {CONTACT.tradeLicence}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-white/40 hover:text-white font-sans transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/40 hover:text-white font-sans transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-white/40 hover:text-white font-sans transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
