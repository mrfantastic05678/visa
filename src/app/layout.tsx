import type { Metadata } from "next";
import { clashDisplay, jetbrainsMono, montserrat, satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Visati — Dubai Visas. Simplified.",
    template: "%s | Visati",
  },
  description:
    "Apply for UAE tourist, transit, and long-stay visas online. Fast processing, 99% approval rate, trusted by 1,000+ travellers worldwide.",
  metadataBase: new URL("https://visati.ae"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "Visati",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${clashDisplay.variable} ${satoshi.variable} ${jetbrainsMono.variable} ${montserrat.variable}`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
