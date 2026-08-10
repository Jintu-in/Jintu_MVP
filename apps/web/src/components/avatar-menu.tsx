"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { signOut } from "@/actions/auth";

/**
 * The signed-in header control: an avatar that opens a small menu.
 *
 * Built on <details>/<summary> rather than a button with React state, for one
 * reason worth stating: the marketing pages this sits on are the ones a
 * stranger reaches first, and <details> works before hydration and without
 * JavaScript at all. A hand-rolled menu is a button that does nothing until
 * the bundle lands.
 *
 * That also means the keyboard handling is the browser's — Enter and Space
 * toggle a <summary>, Tab moves through the links inside — instead of a
 * roving-tabindex implementation I would have to get right. The JS below only
 * adds the two behaviours <details> lacks: close on Escape, and close when you
 * click somewhere else.
 *
 * It is a disclosure containing a nav, not role="menu". A faux ARIA menu would
 * promise arrow-key semantics that <details> does not implement, and a
 * screen-reader user following that promise into a dead end is worse served
 * than by plain links.
 */
export function AvatarMenu({
  initials,
  fullName,
  email,
}: {
  initials: string | null;
  fullName: string | null;
  email: string | null;
}) {
  const id = useId();
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // The layout survives client-side navigation, so without this the menu is
  // still hanging open on the page you just navigated to.
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = () => {
      if (ref.current) ref.current.open = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !ref.current?.open) return;
      close();
      // Focus goes back to the control that opened it, or it lands on <body>
      // and the next Tab starts from the top of the page.
      ref.current.querySelector("summary")?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const label = fullName ?? email ?? "your account";

  return (
    <details ref={ref} className="relative [&>summary::-webkit-details-marker]:hidden">
      <summary
        aria-label={`Account menu for ${label}`}
        className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white select-none hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        {initials ?? (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
          </svg>
        )}
      </summary>

      <nav
        id={id}
        aria-label="Account"
        className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-card border border-ink-100 bg-white shadow-lg"
      >
        <div className="border-b border-ink-100 px-4 py-3">
          <p className="truncate font-medium text-ink-900">{fullName ?? "Your account"}</p>
          {email ? <p className="truncate text-sm text-ink-500">{email}</p> : null}
        </div>

        <ul className="py-1 text-sm">
          <Item href="/dashboard">This week</Item>
          <Item href="/tracks">Your tracks</Item>
          <Item href="/profile">Profile</Item>
          <Item href="/account">Account &amp; privacy</Item>
        </ul>

        <form action={signOut} className="border-t border-ink-100">
          <button
            type="submit"
            className="block w-full px-4 py-2.5 text-left text-sm text-ink-700 hover:bg-ink-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-700"
          >
            Sign out
          </button>
        </form>
      </nav>
    </details>
  );
}

function Item({
  href,
  children,
}: {
  href: "/dashboard" | "/tracks" | "/profile" | "/account";
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block px-4 py-2.5 text-ink-700 hover:bg-ink-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-700"
      >
        {children}
      </Link>
    </li>
  );
}
