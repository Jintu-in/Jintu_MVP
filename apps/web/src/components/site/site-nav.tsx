import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

/**
 * The one site header. Same on every screen, so the product stops looking
 * like five products.
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
 */
export interface SiteNavProps {
  variant?: "overlay" | "solid";
  signedIn?: boolean;
  /** Rendered at the right of the bar, before the account link. */
  children?: React.ReactNode;
  className?: string;
}

export function SiteNav({
  variant = "solid",
  signedIn = false,
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
        "jnav z-50 flex h-[72px] items-center gap-6 px-5 sm:gap-7 sm:px-12",
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0 border-b border-ink-100 bg-white",
        className,
      )}
    >
      <Link href="/" aria-label="Jintu — home" className={cn("flex items-center gap-2", strong)}>
        {/* The mark is decorative; the wordmark beside it carries the name. */}
        <svg aria-hidden width={20} height={20} viewBox="0 0 20 20" fill="none">
          <rect
            width="20"
            height="20"
            rx="5"
            className={overlay ? "fill-white/90 [.jscrolled_&]:fill-brand-700" : "fill-brand-700"}
          />
          <path
            d="M10 5.5v6a2.5 2.5 0 0 1-2.5 2.5H6.5"
            className={overlay ? "stroke-brand-700 [.jscrolled_&]:stroke-white" : "stroke-white"}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        jintu
      </Link>

      <div className="hidden flex-1 items-center gap-7 sm:flex">
        <Link href="/learn" className={link}>
          Roadmaps
        </Link>
        {/* Anchors the homepage section that answers it — there is no such
            route, and a nav item that 404s is worse than one that scrolls. */}
        <Link href={"/#how-it-works" as Route} className={link}>
          How it works
        </Link>
        <Link href="/pricing" className={link}>
          Free
        </Link>
      </div>
      <div className="flex-1 sm:hidden" />

      {children}

      <Link href={(signedIn ? "/dashboard" : "/join") as Route} className={strong}>
        {signedIn ? "Dashboard" : "Sign in"}
      </Link>
    </nav>
  );
}
