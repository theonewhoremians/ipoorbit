import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPO Orbit — Discover what's next",
  description: "Explore upcoming Indian IPOs, issue details, key dates and company news in one place.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
