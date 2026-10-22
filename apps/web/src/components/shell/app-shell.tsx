import { DesktopSidebar } from "@/components/shell/desktop-sidebar";
import { PhoneTabBar } from "@/components/shell/phone-tab-bar";
import type { NavKey } from "@/components/shell/nav-items";

/**
 * Wires Phase 0's two shells (desktop-sidebar.tsx, phone-tab-bar.tsx) into
 * an actual page — the first thing to do so. Both components were built
 * and tested then, deliberately unmounted, for exactly this moment.
 *
 * Called explicitly from each page that wants it (`/learn`, `/learn/[slug]`)
 * rather than from a route-group `layout.tsx`. A layout at
 * `(learning)/learn/layout.tsx` would cascade onto `/learn/[slug]/[node]`
 * too — the lesson reader, Phase 5's territory, undesigned so far and very
 * possibly an immersive view with no persistent nav at all. Calling this
 * per-page keeps today's two routes shelled without deciding that for a
 * route nobody has looked at yet.
 *
 * Readable without an account (BUILD-PLAN §3.2): `user: null` renders the
 * same shell with no account slot, never a redirect or a skeleton.
 */
export function AppShell({
  active,
  user,
  children,
}: {
  active: NavKey;
  user:
    | {
        displayName: string;
        initials: string | null;
        points: number;
        avatarAnimal?: string | null;
        avatarColor?: string | null;
      }
    | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50 lg:flex-row">
      <div className="hidden lg:flex">
        <DesktopSidebar
          active={active}
          user={
            user
              ? {
                  displayName: user.displayName,
                  initials: user.initials ?? "",
                  points: user.points,
                  avatarAnimal: user.avatarAnimal,
                  avatarColor: user.avatarColor,
                }
              : null
          }
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col pb-[72px] lg:pb-0">{children}</div>
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <PhoneTabBar active={active} />
      </div>
    </div>
  );
}
