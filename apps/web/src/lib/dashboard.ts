import "server-only";
import { countBlocks, minutesLeft } from "@/lib/blocks";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";
import { getRoadmap } from "@/lib/roadmaps";
import { createClient } from "@/lib/supabase/server";

/**
 * Everything the dashboard reads, and nothing it does not.
 *
 * The screen has three shapes rather than one shape with different numbers,
 * so the state is decided here, from real rows, and the component only
 * renders it. A dashboard of zeros on day two makes the product feel dead;
 * fourteen mostly-empty squares shown to someone who just lapsed is a
 * rebuke. Those are layout decisions, and they belong to the data.
 *
 * The streak is read through streak_status, never streaks.current_days —
 * the view decays a lapsed streak to 0 without waiting for a write.
 */

export type DueCard = {
  id: string;
  front: string;
  back: string;
  nodeId: string;
  nodeTitle: string | null;
  dueOn: string;
  reps: number;
};

export type DashboardState = "new" | "lapsed" | "habitual";

export type ResumeTarget = {
  href: string;
  roadmapSlug: string;
  roadmapTitle: string;
  nodeTitle: string;
  /** 1-based day number within the roadmap. */
  dayNumber: number;
  /** Null when they have not opened it yet — the card says "Start" instead. */
  blockPosition: number | null;
  blocks: number;
  estMinutes: number;
  minutesLeft: number;
};

export type DashboardRoadmap = {
  slug: string;
  title: string;
  href: string;
  doneDays: number;
  totalDays: number;
  /** Subject tags, at most two — the row has room for two chips. */
  tags: string[];
  /** This roadmap's own next unfinished day — null once it's all done. */
  next: { href: string; title: string; summary: string | null; position: number } | null;
};

export type DashboardData = {
  state: DashboardState;
  firstName: string | null;
  /** Local to the viewer's own timezone, not the server's. */
  greeting: string;
  /** "Saturday, 10 October" — DeskToday's header date, same timezone. */
  dateLine: string;
  streak: {
    currentDays: number;
    /** The longest run this account has ever had — survives a restart. */
    bestDays: number;
    totalDays: number;
    daysSince: number | null;
    doneToday: boolean;
    /** Oldest→newest, exactly 14. */
    last14: { date: string; done: boolean }[];
    missedInLast14: number;
    /** Monday→Sunday, exactly 7 — V2Today/V2Restart's week strip. */
    week: WeekStripDay[];
    /** "Saturday and Sunday", or "5 days" past a 3-day gap — "" when 0. */
    missedLabel: string;
  };
  resume: ResumeTarget | null;
  /** The day before the resume target — the lapsed state's escape hatch. */
  previousDay: { href: string; dayNumber: number; title: string } | null;
  /** Up to 4 undone days after the resume target, in the same roadmap —
   *  DeskToday/DeskRestart's "After that" list. Empty once there's nothing
   *  left, or no resume target at all. */
  upcoming: { title: string; position: number }[];
  /**
   * The lifetime points total. Momentum, never a credential — the UI that
   * shows it says so, and it is awarded server-side only (invariant 5).
   */
  points: number;
  review: { count: number; minutes: number };
  saved: { count: number; minutes: number };
  roadmaps: DashboardRoadmap[];
};

/** A review card is a recall prompt, not a lesson: ~45 seconds each. */
const SECONDS_PER_CARD = 45;

const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const WEEKDAY_NAMES = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export type WeekStripDay = { label: string; name: string; done: boolean; isToday: boolean };

/**
 * The Monday→Sunday strip V2Today/V2Restart draw — a real calendar week,
 * not the rolling 14-day window `last14` is (last14 is kept as the source:
 * it already spans comfortably past any day-of-week offset back to Monday,
 * so no second query is needed here). A day outside today's week but
 * before it (missed) and a day after today (not due yet) render the same
 * way — the design does not distinguish them, only `done` and `isToday`
 * matter.
 */
export function weekStrip(last14: { date: string; done: boolean }[], today: string): WeekStripDay[] {
  const doneByDate = new Map(last14.map((d) => [d.date, d.done]));
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  const isoDow = new Date(todayMs).getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const sinceMonday = (isoDow + 6) % 7; // Monday = 0 .. Sunday = 6
  return WEEKDAY_LETTERS.map((label, i) => {
    const offset = i - sinceMonday;
    const date = new Date(todayMs + offset * 86_400_000).toISOString().slice(0, 10);
    return { label, name: WEEKDAY_NAMES[i]!, done: doneByDate.get(date) ?? false, isToday: offset === 0 };
  });
}

/**
 * "You missed Saturday and Sunday" (V2Restart) — names the actual missed
 * weekdays for a short gap, where that reads as a real sentence; falls
 * back to a plain count for anything longer, where naming every day would
 * just be a wall of commas.
 */
export function missedDaysLabel(daysSince: number, today: string): string {
  if (daysSince <= 0) return "";
  if (daysSince > 3) return `${daysSince} days`;
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  const names = Array.from({ length: daysSince }, (_, i) => {
    const dow = new Date(todayMs - (daysSince - i) * 86_400_000).getUTCDay();
    return WEEKDAY_NAMES[(dow + 6) % 7]!;
  });
  if (names.length === 1) return names[0]!;
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

function greetingFor(timezone: string): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: timezone }).format(
      new Date(),
    ),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Today's date in the viewer's own timezone, as YYYY-MM-DD. */
const todayIn = (timezone: string) =>
  new Date().toLocaleDateString("en-CA", { timeZone: timezone });

export async function getDueCards(limit = 20): Promise<DueCard[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await retryRead(() =>
    supabase
      .from("review_cards")
      .select("id, front, back, node_id, due_on, reps, nodes ( title )")
      .lte("due_on", new Date().toISOString().slice(0, 10))
      .order("due_on")
      .limit(limit),
  );
  if (error) throw describeSupabaseError("reading your review queue", error);

  return (data ?? []).map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    nodeId: c.node_id,
    // PostgREST types a to-one embed as an array shape; runtime is object-
    // or-null. Same bridge the other adapters use.
    nodeTitle: (c.nodes as unknown as { title: string } | null)?.title ?? null,
    dueOn: c.due_on,
    reps: c.reps,
  }));
}

export async function getDashboard(): Promise<DashboardData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profileRes = await retryRead(() =>
    supabase.from("profiles").select("full_name, timezone").eq("id", user.id).maybeSingle(),
  );
  if (profileRes.error) throw describeSupabaseError("reading your profile", profileRes.error);
  if (!profileRes.data) return null; // authenticated but not onboarded

  const timezone = profileRes.data.timezone ?? "UTC";
  const today = todayIn(timezone);
  const since = new Date(Date.parse(`${today}T00:00:00Z`) - 13 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  // One query per concern, all at once.
  const [statusRes, daysRes, resumeRes, dueRes, savedRes, enrolRes, pointsRes] = await Promise.all([
    retryRead(() => supabase.from("streak_status").select("*").maybeSingle()),
    retryRead(() => supabase.from("activity_days").select("done_on").gte("done_on", since)),
    retryRead(() =>
      supabase
        .from("node_progress")
        .select(
          "node_id, status, last_block_position, updated_at, nodes ( slug, modules ( roadmaps ( slug, title, status ) ) )",
        )
        .order("updated_at", { ascending: false })
        .limit(8),
    ),
    retryRead(() =>
      supabase
        .from("review_cards")
        .select("id", { count: "exact", head: true })
        .lte("due_on", today),
    ),
    retryRead(() =>
      supabase
        .from("saved_resources")
        .select("resource_id, resources ( duration_sec )")
        .is("consumed_at", null),
    ),
    retryRead(() =>
      supabase.from("roadmap_enrollments").select("roadmaps ( slug, title, status )"),
    ),
    retryRead(() => supabase.from("point_events").select("points")),
  ]);

  for (const [what, res] of [
    ["your streak", statusRes],
    ["your activity", daysRes],
    ["where you stopped", resumeRes],
    ["your review queue", dueRes],
    ["your saved links", savedRes],
    ["your roadmaps", enrolRes],
    ["your points", pointsRes],
  ] as const) {
    if (res.error) throw describeSupabaseError(`reading ${what}`, res.error);
  }

  // ── the streak strip ───────────────────────────────────────────────────────
  const doneDates = new Set((daysRes.data ?? []).map((d) => String(d.done_on).slice(0, 10)));
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.parse(`${today}T00:00:00Z`) - (13 - i) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    return { date, done: doneDates.has(date) };
  });

  const currentDays = statusRes.data?.current_days ?? 0;
  const bestDays = statusRes.data?.longest_days ?? 0;
  const totalDays = statusRes.data?.total_days ?? 0;
  const daysSince = statusRes.data?.days_since ?? null;
  const doneToday = statusRes.data?.done_today ?? false;

  // ── where they stopped ─────────────────────────────────────────────────────
  // The most recent row that is not already finished; a completed day is not
  // somewhere to resume. Falls back to the newest row's roadmap so a person
  // who has finished everything still gets a next step.
  type ProgressRow = {
    node_id: string;
    status: string;
    last_block_position: number | null;
    nodes: { slug: string; modules: { roadmaps: { slug: string; status: string } | null } | null } | null;
  };
  const progressRows = (resumeRes.data ?? []) as unknown as ProgressRow[];
  const openRow =
    progressRows.find((r) => r.status !== "done" && r.nodes?.modules?.roadmaps?.status === "published") ??
    progressRows.find((r) => r.nodes?.modules?.roadmaps?.status === "published") ??
    null;

  let resume: ResumeTarget | null = null;
  let previousDay: DashboardData["previousDay"] = null;
  let upcoming: DashboardData["upcoming"] = [];
  const resumeSlug = openRow?.nodes?.modules?.roadmaps?.slug ?? null;

  if (resumeSlug) {
    const roadmap = await getRoadmap(resumeSlug).catch(() => null);
    const flat = roadmap?.modules.flatMap((m) => m.nodes) ?? [];
    let at = flat.findIndex((n) => n.id === openRow!.node_id);

    // Their last row was a finished day: point at the next unfinished one.
    if (at !== -1 && openRow!.status === "done") {
      const doneIds = new Set(
        progressRows.filter((r) => r.status === "done").map((r) => r.node_id),
      );
      const nextAt = flat.findIndex((n, i) => i > at && !doneIds.has(n.id));
      at = nextAt === -1 ? at : nextAt;
    }

    const node = at === -1 ? null : flat[at];
    if (roadmap && node) {
      const blocks = countBlocks(node);
      // A finished day carries no position to resume from.
      const position = openRow!.node_id === node.id ? openRow!.last_block_position : null;
      resume = {
        href: `/learn/${roadmap.slug}/${node.slug}`,
        roadmapSlug: roadmap.slug,
        roadmapTitle: roadmap.title,
        nodeTitle: node.title,
        dayNumber: at + 1,
        blockPosition: position,
        blocks,
        estMinutes: node.estMinutes,
        minutesLeft: minutesLeft(node.estMinutes, blocks, position),
      };
      const prev = at > 0 ? flat[at - 1] : null;
      if (prev) {
        previousDay = {
          href: `/learn/${roadmap.slug}/${prev.slug}`,
          dayNumber: at,
          title: prev.title,
        };
      }
      upcoming = flat
        .slice(at + 1, at + 5)
        .map((n, i) => ({ title: n.title, position: at + 2 + i }));
    }
  }

  // ── review and saved, with honest time costs ───────────────────────────────
  const reviewCount = dueRes.count ?? 0;
  type SavedRow = { resources: { duration_sec: number | null } | null };
  const savedRows = (savedRes.data ?? []) as unknown as SavedRow[];
  const savedSeconds = savedRows.reduce((a, r) => a + (r.resources?.duration_sec ?? 0), 0);

  // ── enrolled roadmaps, with real day counts ────────────────────────────────
  type EnrolRow = { roadmaps: { slug: string; title: string; status: string } | null };
  const enrolled = ((enrolRes.data ?? []) as unknown as EnrolRow[])
    .map((e) => e.roadmaps)
    .filter((r): r is NonNullable<EnrolRow["roadmaps"]> => Boolean(r) && r!.status === "published");

  const roadmaps: DashboardRoadmap[] = [];
  if (enrolled.length) {
    const trees = await Promise.all(enrolled.map((r) => getRoadmap(r.slug).catch(() => null)));
    const doneRes = await retryRead(() =>
      supabase.from("node_progress").select("node_id").eq("status", "done"),
    );
    if (doneRes.error) throw describeSupabaseError("reading your progress", doneRes.error);
    const doneIds = new Set((doneRes.data ?? []).map((r) => r.node_id));

    trees.forEach((tree) => {
      if (!tree) return;
      const all = tree.modules.flatMap((m) => m.nodes);
      const nextAt = all.findIndex((n) => !doneIds.has(n.id));
      const nextNode = nextAt === -1 ? null : all[nextAt]!;
      roadmaps.push({
        slug: tree.slug,
        title: tree.title,
        href: `/learn/${tree.slug}`,
        doneDays: all.filter((n) => doneIds.has(n.id)).length,
        totalDays: all.length,
        tags: tree.subjectTags.slice(0, 2),
        next: nextNode
          ? {
              href: `/learn/${tree.slug}/${nextNode.slug}`,
              title: nextNode.title,
              summary: nextNode.summary ?? null,
              position: nextAt + 1,
            }
          : null,
      });
    });
  }

  // ── which of the three screens ─────────────────────────────────────────────
  const state: DashboardState =
    totalDays < 4 ? "new" : daysSince !== null && daysSince >= 3 ? "lapsed" : "habitual";

  return {
    state,
    firstName: profileRes.data.full_name?.trim().split(/\s+/)[0] ?? null,
    greeting: greetingFor(timezone),
    dateLine: new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: timezone,
    }).format(new Date()),
    streak: {
      currentDays,
      bestDays,
      totalDays,
      daysSince,
      doneToday,
      last14,
      missedInLast14: last14.filter((d) => !d.done).length,
      week: weekStrip(last14, today),
      missedLabel: missedDaysLabel(daysSince ?? 0, today),
    },
    resume,
    previousDay,
    upcoming,
    points: (pointsRes.data ?? []).reduce((a, r) => a + (r.points ?? 0), 0),
    review: {
      count: reviewCount,
      minutes: Math.max(1, Math.round((reviewCount * SECONDS_PER_CARD) / 60)),
    },
    saved: { count: savedRows.length, minutes: Math.round(savedSeconds / 60) },
    roadmaps,
  };
}
