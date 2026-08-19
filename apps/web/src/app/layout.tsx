import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

/*
  Mono is semantic on this site, not cosmetic: anything MEASURED — points,
  percentages, durations, data sizes, unit numbers — is set in mono, and
  prose is set in sans; the typeface tells you whether a number was counted
  or written. A fallback stack silently breaks that intent, which is why the
  faces load here (audit bug d) instead of being named in CSS and never
  fetched. next/font self-hosts both: zero external requests, no CLS.
*/
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono", display: "swap" });

const DESCRIPTION =
  "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches, with your progress tracked.";

export const metadata: Metadata = {
  title: {
    default: "Jintu — learn anything, properly",
    template: "%s · Jintu",
  },
  description: DESCRIPTION,
  applicationName: "Jintu",
  metadataBase: getSiteUrl(),
  alternates: { canonical: "/" },

  /*
    Defaults, inherited by every route that does not set its own.

    The homepage had none of this — the rendered <head> carried exactly two
    tags, `theme-color` and `application-name`. Distribution here is a student
    forwarding a link into a WhatsApp placement group, and a link with no
    og:title and no og:image previews as a bare URL, which in that context
    reads as spam. The preview is the product's first impression far more
    often than the page is.
  */
  openGraph: {
    type: "website",
    siteName: "Jintu",
    locale: "en_IN",
    url: "/",
    // "properly", never "prove it" — proving was the deleted product, and
    // this string is what every WhatsApp preview leads with.
    title: "Jintu — learn anything, properly",
    description: DESCRIPTION,
  },
  twitter: {
    // Not "summary". That renders a ~120px thumbnail beside the text; the
    // generated image below is 1200×630 and is the whole point of the link.
    card: "summary_large_image",
    title: "Jintu — learn anything, properly",
    description: DESCRIPTION,
  },
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
    <html lang="en-IN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh antialiased">
        {/*
          Hard-coded false until auth exists to read consents.analytics.
          Nobody has agreed to analytics yet, so PostHog must not initialise
          and must not set a cookie. When auth lands, pass the real value —
          do not default it to true.
        */}
        <AnalyticsProvider consented={false}>{children}</AnalyticsProvider>
        <Analytics />
      </body>
    </html>
  );
}
