import Link from "next/link";
import type { Route } from "next";
import { AppShell } from "@/components/shell/app-shell";
import { IdentityMark } from "@/components/avatar/identity-mark";
import type { DashboardData } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

/**
 * Phase 6 Part A — `/today` in its three shapes (V2New/DeskNew,
 * V2Today/DeskToday, V2Restart/DeskRestart), plus the 2+ roadmaps case
 * layered on top of the habitual shape (UniToday/DeskUniToday). Replaces
 * the pre-redesign dashboard-screen.tsx/dashboard-tinted.tsx wholesale —
 * the DATA underneath (lib/dashboard.ts's getDashboard()) was already
 * complete and correct; only the presentation was pre-redesign.
 *
 * One component tree per state, `lg:` prefixes throughout rather than
 * separate mobile/desktop trees — same discipline as the lesson reader.
 *
 * Deliberately not built here, flagged rather than faked: the streak
 * share card (DeskToday's "Asha is on a 3 day streak" / jintu.in/u/asha)
 * — it needs the public-profile toggle wired into a share flow first
 * (CURRENT-STATE.md's own note: prompt to turn public-profile on, then
 * share once it is), which is a separate, later piece of work. "After
 * that"'s upcoming-lesson rows are plain text, not links, on purpose —
 * this reader is strictly sequential elsewhere, and a shortcut to a
 * lesson three days ahead would contradict that.
 */

type ShellUser = {
  displayName: string;
  initials: string | null;
  points: number;
  avatarAnimal?: string | null;
  avatarColor?: string | null;
};

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const CHEVRON_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const PLUS_ICON = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

function FlameIcon({ size, dim }: { size: number; dim?: boolean }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" className="flex-none">
      <path
        d="M12 2c1 3.6 5 5.6 5 10.2a5 5 0 0 1-10 0c0-1.7.6-3 1.6-4 .3 1.5 1 2.4 2 2.7C10.4 8.4 10.8 5 12 2z"
        fill={dim ? "rgba(255,182,39,0.55)" : "var(--color-amber-500)"}
      />
      {dim ? null : <path d="M12 12.5c.6 1.3 2 2 2 3.6a2 2 0 0 1-4 0c0-1.5 1.3-2.2 2-3.6z" fill="var(--color-night-900)" />}
    </svg>
  );
}

const CHECK_ICON = (
  <svg aria-hidden width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-warn-700)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export function TodayScreen({ data, user }: { data: DashboardData; user: ShellUser }) {
  return (
    <AppShell active="today" user={user}>
      <main className="flex min-h-dvh w-full flex-col gap-4 px-5 pt-6 pb-6 lg:gap-6 lg:px-12 lg:py-9">
        <Header
          name={data.firstName}
          state={data.state}
          dateLine={data.dateLine}
          avatarAnimal={user.avatarAnimal}
          avatarColor={user.avatarColor}
        />
        {data.state === "new" ? (
          <NewBody data={data} />
        ) : data.state === "lapsed" ? (
          <LapsedBody data={data} />
        ) : (
          <HabitualBody data={data} />
        )}
      </main>
    </AppShell>
  );
}

function Header({
  name,
  state,
  dateLine,
  avatarAnimal,
  avatarColor,
}: {
  name: string | null;
  state: DashboardData["state"];
  dateLine: string;
  avatarAnimal?: string | null;
  avatarColor?: string | null;
}) {
  const text =
    state === "new"
      ? name ? `Welcome, ${name}` : "Welcome"
      : state === "lapsed"
        ? name ? `Good to see you, ${name}` : "Good to see you"
        : name
          ? `Good morning, ${name}`
          : "Good morning";
  return (
    <div className="flex h-12 flex-none items-center justify-between gap-3">
      <h1 className="t-sect font-semibold text-ink-900">{text}</h1>
      <span className="hidden text-[15px] leading-[22px] text-ink-600 lg:inline">{dateLine}</span>
      <Link
        href={"/profile" as Route}
        aria-label="Your profile"
        className="flex size-11 flex-none items-center justify-center rounded-full lg:hidden"
      >
        <IdentityMark avatarAnimal={avatarAnimal} avatarColor={avatarColor} size={44} />
      </Link>
    </div>
  );
}

/** Monday→Sunday — shared by every state's dark card. */
function WeekStrip({ week, size }: { week: DashboardData["streak"]["week"]; size: "sm" | "lg" }) {
  const dim = size === "sm" ? 32 : 40;
  const label = week.some((d) => d.done)
    ? `This week: ${week.filter((d) => d.done).map((d) => d.name).join(", ")} done.`
    : "This week: no days done yet.";
  return (
    <div role="img" aria-label={label} className="flex justify-between">
      {week.map((d) => (
        <div key={d.name} className="flex flex-col items-center gap-2">
          <span className={cn("font-mono text-[11px] leading-[14px]", d.isToday ? "font-medium text-white" : "text-on-night-muted-2")}>
            {d.label}
          </span>
          <span
            style={{ width: dim, height: dim }}
            className={cn(
              "box-border rounded-full",
              d.done
                ? "flex items-center justify-center bg-amber-500"
                : d.isToday
                  ? "border-2 border-dashed border-amber-500"
                  : "bg-white/8",
            )}
          >
            {d.done ? CHECK_ICON : null}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProgressDots({ done, current, total }: { done: number; current: number; total: number }) {
  return (
    <div role="img" aria-label={`${done} of ${total} lessons done`} className="flex gap-1 lg:gap-[5px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-[6px] flex-1 rounded-[3px] lg:h-2 lg:rounded-sm",
            i < done ? "bg-night-900" : i === current ? "bg-brand-500" : "bg-ink-100",
          )}
        />
      ))}
    </div>
  );
}

const CARD = "rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)] lg:rounded-[28px] lg:p-7";
const DARK_CARD = "rounded-[24px] bg-night-900 p-5 text-white lg:rounded-[28px] lg:p-7";

function PrimaryLink({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-[52px] flex-none items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16px] font-semibold text-on-brand no-underline lg:h-14 lg:px-7 lg:text-[16.5px]"
    >
      <span>{children}</span>
      {ARROW_RIGHT}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hidden h-14 flex-none items-center justify-center rounded-2xl border border-ink-200 px-[22px] text-[15.5px] font-medium text-ink-900 no-underline lg:flex"
    >
      {children}
    </Link>
  );
}

/* ── new ──────────────────────────────────────────────────────────────── */

function NewBody({ data }: { data: DashboardData }) {
  return (
    <>
      <div className="flex flex-col gap-4 lg:h-[340px] lg:flex-none lg:flex-row lg:gap-6">
        {data.resume ? (
          <div className={cn(CARD, "flex flex-none flex-col gap-4 lg:flex-[1.55] lg:justify-between")}>
            <div className="flex flex-col gap-1.5 lg:gap-2">
              <div className="text-[12.5px] leading-[18px] font-semibold text-link lg:text-[13.5px]">
                {data.resume.roadmapTitle} · lesson {data.resume.dayNumber} of{" "}
                {data.roadmaps.find((r) => r.slug === data.resume!.roadmapSlug)?.totalDays ?? data.resume.dayNumber}
              </div>
              <div className="font-heading text-[21px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900 lg:text-[32px] lg:leading-9 lg:font-bold lg:tracking-[-0.02em]">
                {data.resume.nodeTitle}
              </div>
              <div className="text-[14px] leading-5 text-ink-600 lg:text-[16px] lg:leading-6">
                About {data.resume.estMinutes} minutes.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryLink href={data.resume.href as Route}>Start lesson {data.resume.dayNumber}</PrimaryLink>
              <SecondaryLink href={`/learn/${data.resume.roadmapSlug}` as Route}>See the whole path</SecondaryLink>
            </div>
          </div>
        ) : (
          <div className={cn(CARD, "flex flex-none flex-col gap-4 lg:flex-[1.55] lg:justify-between")}>
            <div className="flex flex-col gap-1.5">
              <div className="font-heading text-[21px] leading-[26px] font-semibold text-ink-900">Pick a roadmap</div>
              <div className="text-[15px] leading-6 text-ink-600">Free, and readable without an account.</div>
            </div>
            <PrimaryLink href={"/learn" as Route}>Browse roadmaps</PrimaryLink>
          </div>
        )}

        <div className={cn(DARK_CARD, "flex flex-none flex-col gap-4 lg:flex-1 lg:justify-between")}>
          <div className="flex items-center gap-3.5 lg:gap-4">
            <FlameIcon size={44} dim />
            <div className="flex flex-col gap-0.5">
              <div className="font-heading text-[22px] leading-7 font-bold tracking-[-0.01em] lg:text-[28px] lg:leading-8">
                Your streak starts today
              </div>
              <div className="text-[14px] leading-5 text-on-night-muted lg:text-[15px] lg:leading-[22px]">
                Finish one lesson and day 1 is yours.
              </div>
            </div>
          </div>
          <WeekStrip week={data.streak.week} size="sm" />
        </div>
      </div>

      {data.resume ? (
        <Link
          href={"/roles" as Route}
          className="flex min-h-[68px] flex-none items-center gap-3 rounded-[20px] bg-white px-4 py-2.5 text-ink-900 no-underline lg:hidden"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[15.5px] leading-[21px] font-semibold">
              Not sure {data.resume.roadmapTitle} is your first step?
            </span>
            <span className="block text-[13.5px] leading-[19px] text-ink-600">Pick the job you want and see its path</span>
          </span>
          <span className="flex-none text-ink-600">{CHEVRON_RIGHT}</span>
        </Link>
      ) : null}

      <div className="hidden flex-none gap-6 lg:flex" style={{ height: 320 }}>
        <div className={cn(CARD, "flex flex-[1.1] flex-col gap-2")}>
          <h2 className="m-0 mb-1 font-heading text-[20px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900">
            How a lesson works
          </h2>
          {[
            ["You type one command", "Copy it or type it"],
            ["You see what should appear", "With the line that matters marked"],
            ["You check and move on", "If yours differs, help is one click away"],
          ].map(([title, sub], i) => (
            <div key={title} className="flex min-h-14 items-center gap-3.5">
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-50 font-mono text-[14px] font-semibold text-link">
                {i + 1}
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] leading-[22px] font-semibold text-ink-900">{title}</span>
                <span className="text-[14px] leading-5 text-ink-600">{sub}</span>
              </span>
            </div>
          ))}
        </div>
        {data.resume ? (
          <div className={cn(CARD, "flex flex-[0.9] flex-col justify-between gap-4 bg-brand-50")}>
            <div className="flex flex-col gap-2">
              <div className="text-[13.5px] leading-[18px] font-semibold text-link">
                Not sure {data.resume.roadmapTitle} is your first step?
              </div>
              <div className="font-heading text-[24px] leading-[30px] font-semibold tracking-[-0.015em] text-pretty text-ink-900">
                Pick the job you want and see its path
              </div>
            </div>
            <Link
              href={"/roles" as Route}
              className="flex h-13 flex-none items-center self-start rounded-2xl bg-night-900 px-7 text-[15.5px] font-semibold text-on-night no-underline"
            >
              See all roles
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}

/* ── lapsed (streak restarted) ────────────────────────────────────────── */

function LapsedBody({ data }: { data: DashboardData }) {
  const stats: [string, string][] = [
    [String(data.streak.totalDays), "lessons"],
    [String(data.points), "points"],
    [String(data.streak.bestDays), "best streak"],
  ];
  return (
    <>
      <div className="flex flex-col gap-4 lg:h-[340px] lg:flex-none lg:flex-row lg:gap-6">
        <div className={cn(DARK_CARD, "flex flex-none flex-col gap-4 lg:justify-between")}>
          <div className="flex items-center gap-4">
            <span className="hidden size-16 flex-none items-center justify-center rounded-full bg-white/8 lg:flex">
              <FlameIcon size={34} dim />
            </span>
            <div className="flex flex-col gap-1.5 lg:gap-1">
              <div className="t-sub font-bold">Streak restarted</div>
              <div className="text-[15px] leading-[22px] text-on-night-muted">
                You missed {data.streak.missedLabel}
                <span className="lg:hidden">. Everything below is still yours.</span>
                <span className="hidden lg:inline">.</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 lg:hidden">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-1 flex-col gap-0.5 rounded-2xl bg-white/8 px-3.5 py-3">
                <div className="font-heading text-[22px] leading-[26px] font-bold">{value}</div>
                <div className="text-[12.5px] leading-[17px] text-on-night-muted-2">{label}</div>
              </div>
            ))}
          </div>
          <WeekStrip week={data.streak.week} size="sm" />
          <div className="text-[14.5px] leading-5 text-on-night-muted lg:text-[15.5px] lg:leading-[22px]">
            One lesson today starts a new one.
          </div>
        </div>

        {data.resume ? (
          <div className={cn(CARD, "flex flex-none flex-col gap-4 lg:flex-1 lg:justify-between")}>
            <div className="flex flex-col gap-1.5">
              <div className="text-[12.5px] leading-[18px] font-semibold text-link lg:text-[13.5px]">
                {data.resume.roadmapTitle} · lesson {data.resume.dayNumber} of{" "}
                {data.roadmaps.find((r) => r.slug === data.resume!.roadmapSlug)?.totalDays ?? data.resume.dayNumber}
              </div>
              <div className="font-heading text-[21px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900 lg:text-[32px] lg:leading-9 lg:font-bold lg:tracking-[-0.02em]">
                {data.resume.nodeTitle}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryLink href={data.resume.href as Route}>Pick up where you left off</PrimaryLink>
              <SecondaryLink href={`/learn/${data.resume.roadmapSlug}` as Route}>See the whole path</SecondaryLink>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden flex-none gap-6 lg:flex" style={{ height: 320 }}>
        <div className={cn(CARD, "flex flex-1 flex-col gap-3.5")}>
          <div className="flex flex-col gap-0.5">
            <h2 className="m-0 font-heading text-[20px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900">
              Still yours
            </h2>
            <div className="text-[14.5px] leading-[21px] text-ink-600">A restart never takes these away.</div>
          </div>
          <div className="flex flex-1 flex-col gap-2.5">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-1 items-center gap-3.5 rounded-2xl bg-ink-50 px-4.5">
                <div className="min-w-13 font-heading text-[30px] leading-[34px] font-bold tracking-[-0.02em] text-ink-900">
                  {value}
                </div>
                <div className="text-[15px] leading-[21px] text-ink-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <UpcomingCard upcoming={data.upcoming} />
        {data.review.count > 0 ? (
          <div className={cn(CARD, "flex flex-[0.9] flex-col justify-between gap-4 bg-brand-50")}>
            <div className="flex flex-col gap-2">
              <div className="text-[13.5px] leading-[18px] font-semibold text-link">
                Review · {data.review.minutes} minute{data.review.minutes === 1 ? "" : "s"}
              </div>
              <div className="font-heading text-[24px] leading-[30px] font-semibold tracking-[-0.015em] text-pretty text-ink-900">
                {data.review.count} card{data.review.count === 1 ? "" : "s"} are due
              </div>
              <div className="text-[15px] leading-[22px] text-ink-600">A quick way back in after a break.</div>
            </div>
            <Link
              href={"/review" as Route}
              className="flex h-13 flex-none items-center self-start rounded-2xl bg-night-900 px-7 text-[15.5px] font-semibold text-on-night no-underline"
            >
              Start review
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}

/* ── habitual (streak going, 1+ roadmaps) ────────────────────────────── */

function HabitualBody({ data }: { data: DashboardData }) {
  const secondary = data.roadmaps.filter((r) => r.slug !== data.resume?.roadmapSlug);
  const multi = secondary.length > 0;

  return (
    <>
      <div className="flex flex-col gap-4 lg:h-[340px] lg:flex-none lg:flex-row lg:gap-6">
        {data.resume ? (
          <div className={cn(CARD, "flex flex-none flex-col gap-4 lg:flex-[1.55] lg:justify-between", multi && "lg:flex-[1.35]")}>
            <div className="flex flex-col gap-1.5 lg:gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12.5px] leading-[18px] font-semibold text-link lg:text-[13.5px]">
                  {data.resume.roadmapTitle} · lesson {data.resume.dayNumber} of{" "}
                  {data.roadmaps.find((r) => r.slug === data.resume!.roadmapSlug)?.totalDays ?? data.resume.dayNumber}
                </div>
                {multi ? <span className="hidden font-mono text-[12.5px] leading-[18px] text-ink-500 lg:inline">last opened</span> : null}
              </div>
              <div className="font-heading text-[21px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900 lg:text-[32px] lg:leading-9 lg:font-bold lg:tracking-[-0.02em]">
                {data.resume.nodeTitle}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <ProgressDots
                done={data.resume.dayNumber - 1}
                current={data.resume.dayNumber - 1}
                total={data.roadmaps.find((r) => r.slug === data.resume!.roadmapSlug)?.totalDays ?? data.resume.dayNumber}
              />
              <div className="flex items-center gap-3">
                <PrimaryLink href={data.resume.href as Route}>Continue</PrimaryLink>
                <SecondaryLink href={`/learn/${data.resume.roadmapSlug}` as Route}>See the whole path</SecondaryLink>
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(CARD, "flex flex-none flex-col gap-4 lg:flex-[1.55] lg:justify-between")}>
            <div className="font-heading text-[21px] leading-[26px] font-semibold text-ink-900">Pick a roadmap</div>
            <PrimaryLink href={"/learn" as Route}>Browse roadmaps</PrimaryLink>
          </div>
        )}

        {multi ? (
          <AlsoLearningCard roadmap={secondary[0]!} />
        ) : (
          <div className={cn(DARK_CARD, "flex flex-none flex-col gap-4 lg:flex-1 lg:justify-between")}>
            <div className="flex items-center gap-3.5 lg:gap-4">
              <FlameIcon size={44} />
              <div className="t-hero font-bold">{data.streak.currentDays}</div>
              <div className="flex flex-col gap-0.5">
                <div className="text-[16px] leading-[22px] font-semibold lg:text-[17px]">day streak</div>
                <div className="font-mono text-[12px] leading-4 text-on-night-muted-2">best so far: {data.streak.bestDays}</div>
              </div>
            </div>
            <WeekStrip week={data.streak.week} size="sm" />
            <div className="text-[14.5px] leading-5 text-on-night-muted lg:text-[15px] lg:leading-[22px]">
              {data.streak.doneToday
                ? "Today is done. Nice work."
                : `One lesson today makes it ${data.streak.currentDays + 1}.`}
            </div>
          </div>
        )}
      </div>

      {multi ? (
        <MobileAlsoLearning secondary={secondary} />
      ) : (
        <div className="flex flex-none gap-2.5 lg:hidden">
          <div className="flex flex-1 flex-col gap-0.5 rounded-20 bg-white p-4">
            <div className="font-heading text-[28px] leading-8 font-bold tracking-[-0.02em] text-ink-900">{data.points}</div>
            <div className="text-[13px] leading-[18px] text-ink-600">points</div>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 rounded-20 bg-white p-4">
            <div className="font-heading text-[28px] leading-8 font-bold tracking-[-0.02em] text-ink-900">
              {data.roadmaps.find((r) => r.slug === data.resume?.roadmapSlug)?.doneDays ?? 0} of{" "}
              {data.roadmaps.find((r) => r.slug === data.resume?.roadmapSlug)?.totalDays ?? 0}
            </div>
            <div className="text-[13px] leading-[18px] text-ink-600">lessons done</div>
          </div>
        </div>
      )}

      {multi ? (
        <AddRoadmapCta compact />
      ) : (
        <div className="hidden flex-none gap-6 lg:flex" style={{ height: 320 }}>
          <UpcomingCard upcoming={data.upcoming} />
          <div className="grid flex-[0.9] grid-cols-2 gap-3 rounded-[24px] bg-white p-6">
            {[
              [String(data.points), "points"],
              [
                String(data.roadmaps.find((r) => r.slug === data.resume?.roadmapSlug)?.doneDays ?? 0),
                "lessons done",
              ],
              [String(data.streak.totalDays), "days learned"],
              [
                String(
                  Math.max(
                    0,
                    (data.roadmaps.find((r) => r.slug === data.resume?.roadmapSlug)?.totalDays ?? 0) -
                      (data.roadmaps.find((r) => r.slug === data.resume?.roadmapSlug)?.doneDays ?? 0),
                  ),
                ),
                "lessons to go",
              ],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col justify-center gap-0.5 rounded-[18px] bg-ink-50 p-4">
                <div className="font-heading text-[32px] leading-9 font-bold tracking-[-0.02em] text-ink-900">{value}</div>
                <div className="text-[13.5px] leading-[18px] text-ink-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function UpcomingCard({ upcoming }: { upcoming: DashboardData["upcoming"] }) {
  if (upcoming.length === 0) return null;
  return (
    <div className={cn(CARD, "flex flex-[1.1] flex-col gap-1")}>
      <h2 className="m-0 mb-1 font-heading text-[20px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900">
        After that
      </h2>
      {upcoming.map((n, i) => (
        <div
          key={n.position}
          className={cn(
            "flex min-h-[50px] items-center gap-3.5 text-ink-900",
            i < upcoming.length - 1 && "border-b border-ink-50",
          )}
        >
          <span className="flex size-6.5 flex-none items-center justify-center rounded-full border-2 border-ink-400 font-mono text-[11px] font-medium text-ink-600">
            {n.position}
          </span>
          <span className="text-[15.5px]">{n.title}</span>
        </div>
      ))}
    </div>
  );
}

/** The one secondary roadmap card DeskUniToday draws — further enrolled
 *  roadmaps beyond this one are listed only on mobile (MobileAlsoLearning
 *  below), not in this fixed-height desktop row. No mockup draws a 3+
 *  roadmap desktop layout to build toward instead. */
function AlsoLearningCard({ roadmap }: { roadmap: DashboardData["roadmaps"][number] }) {
  const pct = roadmap.totalDays > 0 ? Math.round((roadmap.doneDays / roadmap.totalDays) * 100) : 0;
  return (
    <div className={cn(CARD, "hidden flex-1 flex-col gap-4 justify-between lg:flex")}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 flex-none items-center justify-center rounded-xl bg-brand-50 font-mono text-[13px] font-semibold text-link">
            {roadmap.title.slice(0, 2)}
          </span>
          <span className="text-[13.5px] leading-[18px] font-semibold text-link">
            {roadmap.title} · lesson {roadmap.doneDays + 1}
          </span>
        </div>
        {roadmap.next ? (
          <>
            <div className="font-heading text-[26px] leading-[31px] font-semibold tracking-[-0.015em] text-ink-900">
              {roadmap.next.title}
            </div>
            {roadmap.next.summary ? (
              <div className="text-[15.5px] leading-[23px] text-ink-600">{roadmap.next.summary}</div>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="flex flex-col gap-2.5">
        <div role="img" aria-label={`About ${pct}% done`} className="h-2 rounded-sm bg-ink-100">
          <div className="h-2 rounded-sm bg-night-900" style={{ width: `${pct}%` }} />
        </div>
        <div className="font-mono text-[12.5px] leading-[18px] text-ink-500">
          {roadmap.doneDays} lesson{roadmap.doneDays === 1 ? "" : "s"} done · also counts for your streak
        </div>
      </div>
      {roadmap.next ? (
        <SecondaryLink href={roadmap.next.href as Route}>Open lesson {roadmap.doneDays + 1}</SecondaryLink>
      ) : null}
    </div>
  );
}

function MobileAlsoLearning({ secondary }: { secondary: DashboardData["roadmaps"] }) {
  return (
    <div className="flex flex-none flex-col gap-2.5 lg:hidden">
      <h2 className="m-0 mt-1 font-heading text-[18px] leading-6 font-semibold tracking-[-0.01em] text-ink-900">
        Also learning
      </h2>
      {secondary.map((r) => {
        const pct = r.totalDays > 0 ? Math.round((r.doneDays / r.totalDays) * 100) : 0;
        return (
          <Link
            key={r.slug}
            href={(r.next?.href ?? r.href) as Route}
            className="flex items-center gap-3.5 rounded-[20px] bg-white py-3.5 pr-3 pl-4 text-ink-900 no-underline"
          >
            <span className="flex size-11 flex-none items-center justify-center rounded-2xl bg-brand-50 font-mono text-[14px] font-semibold text-link">
              {r.title.slice(0, 2)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[15.5px] leading-[21px] font-semibold">{r.title}</span>
              <span className="flex items-center gap-2.5">
                <span className="h-[6px] flex-1 rounded-[3px] bg-ink-100">
                  <span className="block h-[6px] rounded-[3px] bg-night-900" style={{ width: `${pct}%` }} />
                </span>
                <span className="flex-none font-mono text-[12px] leading-[18px] text-ink-500">lesson {r.doneDays + 1}</span>
              </span>
            </span>
            <span className="flex size-9 flex-none items-center justify-center rounded-full bg-ink-50 text-ink-900">
              {ARROW_RIGHT}
            </span>
          </Link>
        );
      })}
      <AddRoadmapCta />
    </div>
  );
}

function AddRoadmapCta({ compact }: { compact?: boolean }) {
  return (
    <Link
      href={"/learn" as Route}
      className={cn(
        "flex min-h-13 items-center justify-center gap-2 rounded-[20px] border-[1.5px] border-dashed border-ink-400 text-[15px] font-semibold text-ink-900 no-underline",
        compact
          ? "hidden flex-1 flex-col gap-2.5 p-6 text-center lg:flex"
          : "lg:hidden",
      )}
    >
      {compact ? (
        <>
          <span className="flex size-13 items-center justify-center rounded-full bg-white text-link">{PLUS_ICON}</span>
          <span className="text-[16.5px] leading-[22px] font-semibold">Add a roadmap</span>
          <span className="text-[14px] leading-5 text-ink-600">Learning two at once is fine. Today shows them all.</span>
        </>
      ) : (
        <>
          {PLUS_ICON}
          <span>Add a roadmap</span>
        </>
      )}
    </Link>
  );
}
