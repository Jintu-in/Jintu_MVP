import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jintu — Placement Sprints",
    template: "%s · Jintu",
  },
  description:
    "Six weeks. Six artifacts. One proof-of-readiness profile. A cohort-based placement sprint with a free, public curriculum.",
  applicationName: "Jintu",
  metadataBase: new URL("https://jintu.in"),
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
