"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import { SectionCTA } from "@/components/ui/SectionCTA";

export function FooterCTA() {
  return (
    <SectionCTA
      tag="Need Help?"
      title="Talk to a visa consultant."
      subtitle="Real humans, average response under 2 minutes. WhatsApp is the fastest route."
      buttons={[
        {
          label: "WhatsApp Us",
          href: WHATSAPP_URL,
          external: true,
          variant: "whatsapp",
        },
        {
          label: "Send Inquiry",
          href: "/contact",
          variant: "outline",
        },
      ]}
    />
  );
}
