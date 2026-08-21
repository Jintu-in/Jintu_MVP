import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * The signed-in surfaces: dashboard, profile, account, review, onboarding,
 * join.
 *
 * These used to wear a thinner, separate header — the reasoning being that
 * somebody mid-signup should not be offered the whole site. In practice it
 * meant the wordmark did not go home from the dashboard, and the product
 * looked like two products. One header now, everywhere; the account link
 * still reads the viewer, so a half-onboarded person is not handed a
 * dashboard link.
 */
export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer().catch(() => null);

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <SiteNav
        signedIn={Boolean(viewer?.hasProfile)}
        initials={viewer ? initialsFor(viewer) : null}
        displayName={viewer?.fullName ?? viewer?.email ?? null}
      />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
