import type { Metadata, Viewport } from "next";
import { AnalyticsProvider } from "@/components/analytics-provider";
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
  // brand-700, not brand-500. This paints the Android status bar, and the
  // system draws white icons on it: #43b4c8 gives them 2.44:1, which is
  // unreadable. #17758a gives 5.32:1 and still reads as Jintu.
  themeColor: "#17758a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh antialiased">
        {/*
          Hard-coded false until auth exists to read consents.analytics.
          Nobody has agreed to analytics yet, so PostHog must not initialise
          and must not set a cookie. When auth lands, pass the real value —
          do not default it to true.
        */}
        <AnalyticsProvider consented={false}>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
