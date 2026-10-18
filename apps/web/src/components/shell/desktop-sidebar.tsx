import Link from "next/link";
import { NAV_ITEMS, type NavKey } from "./nav-items";

/**
 * The desktop layout shell's left sidebar — geometry from
 * design/jintu-design/screens/DeskToday.dc.html, which is the only drawn
 * source for it; every other Desk* screen either omits the sidebar or
 * (per HANDOFF.md) isn't this redesign's concern yet.
 *
 * Phase 0 only: this component is built and unit-tested but not yet mounted
 * into a real layout — none of the four routes it links are restyled, and
 * `/today` doesn't exist. It exists now so the phases that DO need it
 * (4/5/6) aren't each reinventing the same 248px column.
 *
 * `night-900` (the deep-teal surface) and `on-night`/`on-night-muted-2`
 * (the text that sits on it) are exactly the tokens built for this —
 * see packages/config/tailwind/preset.css's "Night" section.
 */
export function DesktopSidebar({
  active,
  user,
}: {
  active: NavKey;
  /** Null renders nothing in the account slot — a signed-out shell has no
   *  account to show, not a skeleton pretending one is loading. */
  user: { displayName: string; initials: string; points: number } | null;
}) {
  return (
    <nav
      aria-label="Main"
      className="flex w-[248px] flex-none flex-col gap-1 bg-night-900 p-4 text-white"
    >
      <Link
        href="/"
        className="mb-4 flex h-12 items-center gap-2.5 px-2 font-heading text-[21px] font-semibold tracking-[-0.01em] text-white"
      >
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-9 bg-brand-500 font-heading text-base font-bold text-on-brand"
        >
          j
        </span>
        <span>jintu</span>
      </Link>

      {NAV_ITEMS.map(({ key, label, href, Icon }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex h-12 items-center gap-3 rounded-14 bg-white/12 px-3 text-[15px] font-semibold text-white"
                : "flex h-12 items-center gap-3 rounded-14 px-3 text-[15px] text-on-night"
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        );
      })}

      {user ? (
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/8 p-3">
          <div
            aria-hidden
            className="flex size-10 flex-none items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-link"
          >
            {user.initials}
          </div>
          <div className="min-w-0 flex flex-col">
            <div className="truncate text-sm leading-5 font-semibold">{user.displayName}</div>
            <div className="font-mono text-xs leading-4 text-on-night-muted-2">
              {user.points} points
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
