import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * Pricing, privacy, terms, refunds, contact, report.
 *
 * These now wear the same header and footer as the homepage — one product,
 * one chrome. The old bespoke header lived here and was the reason the
 * wordmark did not link home from half the site.
 *
 * Still per-request, because the header needs to know whether to say
 * "Sign in" or "Dashboard". That is a much smaller read than the avatar
 * and streak chip it used to do, and docs/PERFORMANCE_PLAN.md wants even
 * this moved into an island so these pages can go static.
 */
export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer().catch(() => null);

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-60 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteNav
        signedIn={Boolean(viewer?.hasProfile)}
        initials={viewer ? initialsFor(viewer) : null}
        displayName={viewer?.fullName ?? viewer?.email ?? null}
      />
      <div id="content" className="flex-1">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
