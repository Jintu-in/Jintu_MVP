"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { signOut } from "@/actions/auth";
import { cn } from "@/lib/utils";

/**
 * The header's one interactive control: an avatar when signed in, a menu
 * button when not.
 *
 * Below sm it is the whole navigation — Roadmaps and How it works live inside
 * it, because links plus a wordmark plus an account control in 390px leaves
 * nothing tappable. From sm up those links are back on the bar and this holds
 * only the account items, so a signed-out visitor on a desktop sees a plain
 * "Sign in" link and no menu at all.
 *
 * Closes on route change, on Escape, and on a click outside. All three,
 * because a menu that survives a navigation is the most common way a header
 * ends up covering the page somebody just asked for.
 */

export interface SiteNavMenuProps {
  signedIn: boolean;
  /** Null when there is no name and no email to derive one from. */
  initials: string | null;
  displayName: string | null;
  overlay: boolean;
}

const NAV_LINKS: { href: Route; label: string }[] = [
  { href: "/learn" as Route, label: "Roadmaps" },
  { href: "/roles" as Route, label: "Roles" },
  { href: "/#how-it-works" as Route, label: "How it works" },
];

const ACCOUNT_LINKS: { href: Route; label: string }[] = [
  { href: "/dashboard" as Route, label: "Dashboard" },
  { href: "/profile" as Route, label: "Your record" },
  { href: "/profile/saved" as Route, label: "Saved" },
  { href: "/account" as Route, label: "Account" },
];

export function SiteNavMenu({ signedIn, initials, displayName, overlay }: SiteNavMenuProps) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  // Signed out on a wide screen: the three links are on the bar and there is
  // nothing left for a menu to hold, so it is a link, not a button.
  const triggerRing = overlay
    ? "border-white/30 text-white [.jscrolled_&]:border-ink-100 [.jscrolled_&]:text-ink-900"
    : "border-ink-100 text-ink-900";

  return (
    <div ref={wrap} className="relative flex items-center">
      {!signedIn ? (
        <Link
          href={"/join" as Route}
          className={cn(
            "hidden text-[14px] leading-none font-medium sm:block",
            overlay ? "text-white [.jscrolled_&]:text-brand-700" : "text-brand-700",
          )}
        >
          Sign in
        </Link>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={signedIn ? `Account menu for ${displayName ?? "you"}` : "Menu"}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border transition-colors",
          signedIn
            ? "border-transparent bg-brand-50 font-mono text-[13px] font-medium text-brand-700"
            : cn("bg-transparent", triggerRing),
          // Signed out, the bar already carries every link from sm up.
          !signedIn && "sm:hidden",
        )}
      >
        {signedIn ? (
          (initials ?? (
            <svg aria-hidden width={17} height={17} viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="6.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 17c.9-3.1 3.2-4.6 6-4.6s5.1 1.5 6 4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ))
        ) : (
          <svg aria-hidden width={17} height={17} viewBox="0 0 18 18" fill="none">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute top-[calc(100%+10px)] right-0 z-50 w-[224px] overflow-hidden rounded-card border border-ink-100 bg-white py-1.5"
        >
          {signedIn && displayName ? (
            <div className="truncate border-b border-ink-100 px-4 pt-1.5 pb-2.5 text-[13px] leading-[1.4] text-ink-600">
              {displayName}
            </div>
          ) : null}

          {/* On the bar from sm up, so the menu stops repeating them there. */}
          <div className="sm:hidden">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-2.5 text-[14.5px] leading-none text-ink-900 no-underline hover:bg-ink-50"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {signedIn ? (
            <>
              <div className="mx-4 my-1.5 h-px bg-ink-100 sm:hidden" />
              {ACCOUNT_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block px-4 py-2.5 text-[14.5px] leading-none text-ink-900 no-underline hover:bg-ink-50"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mx-4 my-1.5 h-px bg-ink-100" />
              {/* A server action, so signing out survives a dead JS bundle. */}
              <form action={signOut}>
                <button
                  type="submit"
                  className="block w-full px-4 py-2.5 text-left text-[14.5px] leading-none text-ink-900 hover:bg-ink-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mx-4 my-1.5 h-px bg-ink-100 sm:hidden" />
              <Link
                href={"/join" as Route}
                className="block px-4 py-2.5 text-[14.5px] leading-none font-medium text-brand-700 no-underline hover:bg-ink-50"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
