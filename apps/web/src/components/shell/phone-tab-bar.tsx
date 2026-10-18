import Link from "next/link";
import { NAV_ITEMS, type NavKey } from "./nav-items";

/**
 * The phone layout shell's bottom tab bar — geometry from
 * design/jintu-design/screens/V2Today.dc.html (also drawn identically on
 * V2Roadmaps/V2Role/V2Profile: 72px, white, a 1px top hairline, four equal
 * columns, icon over label).
 *
 * Phase 0 only — see desktop-sidebar.tsx's note; same status here. Meant to
 * sit in a fixed position at the bottom of the viewport once a real layout
 * mounts it; this component itself stays position-agnostic so the caller
 * decides (a modal or a lesson reader may legitimately want it absent).
 */
export function PhoneTabBar({ active }: { active: NavKey }) {
  return (
    <nav aria-label="Main" className="flex h-[72px] flex-none items-stretch border-t border-ink-100 bg-white">
      {NAV_ITEMS.map(({ key, label, href, Icon }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex flex-1 flex-col items-center justify-center gap-1 text-[11.5px] font-semibold text-link"
                : "flex flex-1 flex-col items-center justify-center gap-1 text-[11.5px] font-medium text-ink-500"
            }
          >
            <Icon size={24} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
