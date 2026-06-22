import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Visati Admin", template: "%s | Visati Admin" },
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-mist">{children}</div>;
}
