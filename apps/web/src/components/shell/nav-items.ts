import type { Route } from "next";
import {
  ProfileNavIcon,
  RoadmapsNavIcon,
  RolesNavIcon,
  TodayNavIcon,
} from "@/components/ui/icons";

/**
 * The four primary destinations, shared by both shells (desktop-sidebar.tsx,
 * phone-tab-bar.tsx) so their route list can't silently drift apart — both
 * screens in the design (DeskToday.dc.html, V2Today.dc.html) draw the exact
 * same four items in the exact same order.
 *
 * `/today` doesn't exist as a route yet (it's Phase 4/6 work — see
 * design/jintu-design/CURRENT-STATE.md) and typedRoutes won't admit a
 * string Next can't resolve to a real page, so it's cast rather than typed;
 * the other three are real, already-shipped routes and need no cast.
 */
export type NavKey = "today" | "roadmaps" | "roles" | "profile";

export const NAV_ITEMS: { key: NavKey; label: string; href: Route; Icon: typeof TodayNavIcon }[] = [
  { key: "today", label: "Today", href: "/today" as Route, Icon: TodayNavIcon },
  { key: "roadmaps", label: "Roadmaps", href: "/learn", Icon: RoadmapsNavIcon },
  { key: "roles", label: "Roles", href: "/roles", Icon: RolesNavIcon },
  { key: "profile", label: "Profile", href: "/profile", Icon: ProfileNavIcon },
];
