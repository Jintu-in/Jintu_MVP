import Link from "next/link";
import type { Route } from "next";
import { SiteNavMenu } from "@/components/site/site-nav-menu";
import { cn } from "@/lib/utils";

/**
 * The one site header. Same on every screen, so the product stops looking
 * like five products.
 *
 * Wordmark hard left, everything else hard right. The links used to sit next
 * to the wordmark with the account control pushed to the far edge, which put
 * the two things people actually click at opposite ends of a 1400px bar.
 *
 * Two variants, because the homepage's hero is dark teal and everywhere
 * else is pale:
 *
 *   overlay  transparent with white text, sitting over the hero. It takes
 *            a solid surface on scroll — the homepage's observer adds
 *            `.jscrolled`, and the `[.jscrolled_&]` rules below respond.
 *   solid    a plain white bar with a hairline. Every other screen.
 *
 * The wordmark always links to `/`. That is the one navigation guarantee
 * a header owes you, and it was missing on half the screens.
 *
 * Below sm the links move inside the avatar menu, because a wordmark plus
 * links plus an account control in 390px leaves nothing tappable.
 *
 * Pricing IS on the bar now (per DeskHome.dc.html's own header), alongside
 * a filled "Start free" action next to Sign in — a deliberate reversal of
 * this component's earlier "no Free item" rule, made for the redesign,
 * where the bar carries a real conversion action rather than only a
 * destination list.
 */
export interface SiteNavProps {
  variant?: "overlay" | "solid";
  signedIn?: boolean;
  /** Initials for the avatar. Null falls back to a generic person glyph. */
  initials?: string | null;
  /** Shown at the top of the account menu, so you can see whose it is. */
  displayName?: string | null;
  /** Rendered on the bar, between the links and the account control. */
  children?: React.ReactNode;
  className?: string;
}

export function SiteNav({
  variant = "solid",
  signedIn = false,
  initials = null,
  displayName = null,
  children,
  className,
}: SiteNavProps) {
  const overlay = variant === "overlay";

  const link = overlay
    ? "text-[14px] leading-none text-white/85 transition-colors hover:text-white [.jscrolled_&]:text-ink-600 [.jscrolled_&]:hover:text-ink-900"
    : "text-[14px] leading-none text-ink-600 transition-colors hover:text-ink-900";

  const strong = overlay
    ? "text-[16px] leading-none font-medium text-white [.jscrolled_&]:text-brand-700"
    : "text-[16px] leading-none font-medium text-brand-700";

  return (
    <nav
      className={cn(
        "jnav z-50 flex h-[72px] items-center px-5 sm:px-12",
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0 border-b border-ink-100 bg-white",
        className,
      )}
    >
      <Link href="/" aria-label="Jintu — home" className={cn("flex items-center gap-2", strong)}>
        {/* The literal "j" badge from the redesign's own header mark —
            on-brand text on a brand-500 fill, exactly like every other
            brand-500 use: a decorative fill, never the text colour itself. */}
        <span
          aria-hidden
          className={cn(
            "flex size-[26px] items-center justify-center rounded-[9px] font-mono text-[13px] font-bold",
            overlay
              ? "bg-white/90 text-night-900 [.jscrolled_&]:bg-brand-500 [.jscrolled_&]:text-on-brand"
              : "bg-brand-500 text-on-brand",
          )}
        >
          j
        </span>
        jintu
      </Link>

      <div className="flex-1" />

      <div className="hidden items-center gap-7 sm:flex">
        <Link href="/learn" className={link}>
          Roadmaps
        </Link>
        {/* Before the catalogue, because choosing a roadmap assumes you
            already know what the jobs are — and most visitors do not. */}
        <Link href={"/roles" as Route} className={link}>
          Roles
        </Link>
        {/* Anchors the homepage section that answers it — there is no such
            route, and a nav item that 404s is worse than one that scrolls. */}
        <Link href={"/#how-it-works" as Route} className={link}>
          How it works
        </Link>
        <Link href={"/pricing" as Route} className={link}>
          Pricing
        </Link>
      </div>

      {children ? <div className="ml-6 flex items-center sm:ml-7">{children}</div> : null}

      <div className="ml-4 flex items-center gap-3 sm:ml-7">
        {/* The redesign's one filled bar action, beside Sign in — a real
            conversion target, not just a destination list. Signed-in visitors
            already have an account, so it goes with Sign in, not past it. */}
        {!signedIn ? (
          <Link
            href={"/join" as Route}
            className="hidden h-11 items-center rounded-2xl bg-brand-500 px-4.5 text-[14.5px] font-semibold text-on-brand hover:bg-brand-400 sm:flex"
          >
            Start free
          </Link>
        ) : null}
        <SiteNavMenu
          signedIn={signedIn}
          initials={initials}
          displayName={displayName}
          overlay={overlay}
        />
      </div>
    </nav>
  );
}
