import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

/**
 * The emailed-link landings (/auth/reset) sit outside the route groups, so
 * they inherited nothing but the root layout and rendered with no header at
 * all. They get the same chrome as every other screen; signedIn is false on
 * purpose — a recovery session is not a signed-in session to link at.
 */
export default function AuthLinkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <SiteNav />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
