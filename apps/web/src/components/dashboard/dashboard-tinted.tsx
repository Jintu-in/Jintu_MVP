import Link from "next/link";
import type { Route } from "next";
import type { DashboardData } from "@/lib/dashboard";
import { Eyebrow } from "@/components/ui/patterns";
import { cn, formatCount } from "@/lib/utils";

/**
 * The tinted dashboard — the returning learner's home, converted from the
 * design project's "Dashboard tinted".
 *
 * This is the HABITUAL layout only. The new-account and lapsed layouts stay
 * as they are in dashboard-screen.tsx, because the rule that produced them
 * has not changed: a wall of zeros on day two makes the product feel dead,
 * and a full stat grid shown to somebody who just lapsed is a rebuke. The
 * tinted design's own content assumes a returning user — an eleven-day
 * streak, 45 of 91, a points total — so this is the state it describes.
 *
 * Two knowing substitutions from the design file:
 *
 *   · Tag chips use ink-100, not #F1F0EC. That hex is the design canvas's
 *     surround; PALETTE.md says it is not a product surface and must not
 *     appear inside a screen.
 *   · The roadmap accent bars walk brand-700 → 600 → 400 → 300. All four
 *     are fills a few pixels wide, which is the only thing the pale end of
 *     the ramp is allowed to be.
 *
 * The resume card keeps the design's brand-50 → white gradient. CLAUDE.md's
 * design section says "no gradients", written before the design set had
 * any; the homepage already ships gradient text and borders from the same
 * project. Flagged rather than silently resolved.
 */

const CIRCUMFERENCE = 2 * Math.PI * 19;

/** The progress ring: one number given a shape. Nothing is plotted here. */
function ProgressRing({ done, total, size = 46 }: { done: number; total: number; size?: number }) {
  const pct = total > 0 ? Math.min(1, done / total) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" aria-hidden>
      <circle cx="23" cy="23" r="19" fill="none" stroke="var(--color-ink-100)" strokeWidth="5" />
      <circle
        cx="23"
        cy="23"
        r="19"
        fill="none"
        stroke="var(--color-check-machine)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE.toFixed(1)}
        strokeDashoffset={(CIRCUMFERENCE * (1 - pct)).toFixed(1)}
        transform="rotate(-90 23 23)"
      />
    </svg>
  );
}

const TinyTick = ({ size = 9 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path
      d="M2.5 6.2 4.8 8.5 9.5 3.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Today, still open — a clock rather than a tick, ringed not filled. */
const TinyClock = ({ size = 9 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6 3.6V6l1.6 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Fourteen days as one element. Nobody tabs through fourteen divs. */
function ActivityStrip({ streak }: { streak: DashboardData["streak"] }) {
  const first = streak.last14[0]?.date;
  const label = first
    ? new Date(`${first}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "";
  return (
    <div className="rounded-card border border-ink-100 bg-white p-4 sm:p-[18px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[12.5px] leading-none text-ink-600">Activity</span>
        <span className="rounded-full bg-brand-50 px-2.5 py-[3px] text-[11.5px] leading-none text-brand-900">
          {streak.currentDays} {streak.currentDays === 1 ? "day" : "days"} in a row
        </span>
      </div>
      <div
        role="img"
        aria-label={`${streak.currentDays} day streak, ${streak.missedInLast14} ${
          streak.missedInLast14 === 1 ? "day" : "days"
        } missed in the last 14`}
        className="grid grid-cols-14 gap-[2.5px]"
      >
        {streak.last14.map((d, i) => {
          const isToday = i === streak.last14.length - 1;
          if (d.done) {
            return (
              <span
                key={d.date}
                aria-hidden
                className="flex aspect-square items-center justify-center rounded-[3px] bg-brand-700 text-white"
              >
                <TinyTick />
              </span>
            );
          }
          if (isToday) {
            return (
              <span
                key={d.date}
                aria-hidden
                className="flex aspect-square items-center justify-center rounded-[3px] border-[1.5px] border-brand-700 bg-brand-50 text-brand-700"
              >
                <TinyClock />
              </span>
            );
          }
          return (
            <span
              key={d.date}
              aria-hidden
              className="aspect-square rounded-[3px] border border-ink-100 bg-white"
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10.5px] leading-none text-ink-500">
        <span>{label}</span>
        <span>today</span>
      </div>
    </div>
  );
}

/**
 * The 6px cap on a Today card, as its own component.
 *
 * Split out so its pale fill never shares a class region with the white
 * label on the primary button below it. The contrast guard reads class
 * names rather than reachability, and it is right to — white on brand-50
 * is 1.06:1 wherever it can be expressed.
 */
const CardCap = ({ quiet }: { quiet?: boolean }) => (
  <div aria-hidden className={quiet ? "h-1.5 bg-ink-50" : "h-1.5 bg-brand-50"} />
);

/** One "Today" card: a tinted cap, a fact, a cost, and one control. */
function TodayCard({
  title,
  note,
  cost,
  action,
  href,
  primary,
  quiet,
}: {
  title: string;
  note?: string;
  cost: string;
  action: string;
  href: Route;
  primary?: boolean;
  /** The saved queue reads as calmer than the two that are actually due. */
  quiet?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-ink-100 bg-white">
      <CardCap quiet={quiet} />
      <div className="p-3.5">
        <div className="text-[13.5px] leading-[1.3] text-ink-900">{title}</div>
        {note ? <div className="mt-1 text-[11.5px] leading-[1.4] text-ink-600">{note}</div> : null}
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] leading-none text-ink-500">{cost}</span>
          <Link
            href={href}
            className={cn(
              "flex min-h-10 items-center rounded-lg px-3.5 text-[12.5px] font-medium sm:min-h-8",
              // The outlined variant darkens its edge rather than filling
              // with brand-50: a pale fill in the same class list as the
              // filled variant's white label is a 1.06:1 pair the contrast
              // guard will refuse, reachable or not.
              primary
                ? "bg-brand-700 text-white hover:bg-brand-800"
                : "border border-brand-700 bg-white text-brand-700 hover:border-brand-800",
            )}
          >
            {action}
          </Link>
        </div>
      </div>
    </div>
  );
}

/** The accent ramp. Fills only — the pale end never carries text. */
const ACCENTS = ["bg-brand-700", "bg-brand-600", "bg-brand-400", "bg-brand-300"];

function RoadmapRow({
  roadmap,
  accent,
  compact,
}: {
  roadmap: DashboardData["roadmaps"][number];
  accent: string;
  compact?: boolean;
}) {
  const pct = roadmap.totalDays > 0 ? Math.round((roadmap.doneDays / roadmap.totalDays) * 100) : 0;
  return (
    <Link
      href={roadmap.href as Route}
      className={cn(
        "flex items-center gap-3 py-3 transition-transform duration-150 ease-out hover:translate-x-[5px]",
        !compact && "border-b border-ink-100 px-1 last:border-b-0",
      )}
    >
      <span aria-hidden className={cn("w-[3px] flex-none rounded-[2px]", accent, compact ? "h-7" : "h-8")} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] leading-[1.3] text-ink-900">{roadmap.title}</span>
        {!compact && roadmap.tags.length ? (
          <span className="mt-1 flex gap-1.5">
            {roadmap.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] leading-[1.4] text-ink-600"
              >
                {t}
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span aria-hidden className="h-1 w-11 flex-none overflow-hidden rounded-[2px] bg-ink-100 sm:w-13">
        {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
        <span className={cn("block h-1 rounded-[2px]", accent)} style={{ width: `${pct}%` }} />
      </span>
      <span className="w-11 flex-none text-right font-mono text-[12px] leading-none text-ink-600">
        {roadmap.doneDays}/{roadmap.totalDays}
      </span>
    </Link>
  );
}

export default function TintedDashboard({ data }: { data: DashboardData }) {
  const { streak, resume, roadmaps } = data;
  const name = data.firstName;
  const primaryRoadmap = roadmaps[0] ?? null;

  return (
    <div className="min-h-dvh bg-ink-50">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 pt-5 pb-24 sm:gap-7 sm:px-8 sm:pt-8 sm:pb-10">
        <h1 className="text-[18px] leading-[1.3] text-ink-900">
          {name ? `${data.greeting}, ${name}` : data.greeting}
        </h1>

        {/* "Your record" names the region the three stat cards belong to,
            and the statement says what they are for. Without it the cards
            are three numbers with no argument. */}
        <div>
          <Eyebrow glyph="◷">Your record</Eyebrow>
          <h2 className="mt-3 text-[22px] leading-[1.25] font-medium text-balance text-ink-900">
            Everything, at a glance.
          </h2>
        </div>

        {/* ── the three stat cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <ActivityStrip streak={streak} />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:contents">
            <div className="flex flex-col gap-2 rounded-card border border-ink-100 bg-white p-4 sm:p-[18px]">
              <span className="text-[12.5px] leading-none text-ink-600">Progress</span>
              {primaryRoadmap ? (
                <div className="flex items-center gap-3">
                  <ProgressRing done={primaryRoadmap.doneDays} total={primaryRoadmap.totalDays} />
                  <div>
                    <div>
                      <span className="font-mono text-[21px] leading-none font-medium text-ink-900">
                        {primaryRoadmap.doneDays}
                      </span>
                      <span className="font-mono text-[13px] leading-none text-ink-500">
                        /{primaryRoadmap.totalDays}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] leading-none text-ink-600">
                      {primaryRoadmap.title}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] leading-[1.6] text-ink-600">
                  Open a roadmap and this fills in.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 rounded-card border border-ink-100 bg-white p-4 sm:p-[18px]">
              <span className="font-mono text-[21px] leading-none font-medium text-ink-900">
                {streak.totalDays}
              </span>
              <span className="text-[11px] leading-[1.4] text-ink-600">
                days learned · never resets
              </span>
              {/* Momentum, not a credential — invariant 5. A count of what
                  was done, never compared against anybody else. */}
              <span className="self-start rounded-full bg-brand-50 px-2.5 py-[3px] font-mono text-[11.5px] leading-none text-brand-900">
                {formatCount(data.points)} pts
              </span>
            </div>
          </div>
        </div>

        {/* ── the work, and the rail ───────────────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="flex flex-col gap-5">
            {resume ? (
              <section className="rounded-card border border-brand-500 bg-gradient-to-br from-brand-50 to-white p-[18px] sm:p-[22px]">
                <h2 className="font-mono text-[10.5px] leading-none tracking-[.08em] text-brand-900 uppercase sm:text-[11px]">
                  Pick up where you stopped
                </h2>
                <div className="mt-2 text-[17px] leading-[1.3] font-medium text-ink-900">
                  {resume.nodeTitle}
                </div>
                <div className="mt-1.5 text-[13px] leading-[1.4] text-ink-600">
                  Day {resume.dayNumber}
                  {resume.blockPosition !== null ? (
                    <>
                      {" · "}block {resume.blockPosition} of {resume.blocks}
                      {" · "}
                      <span className="text-ink-900">~{resume.minutesLeft} min left</span>
                    </>
                  ) : (
                    <>
                      {" · "}
                      <span className="text-ink-900">~{resume.estMinutes} min</span>
                    </>
                  )}
                </div>
                <div aria-hidden className="mt-3.5 h-1 overflow-hidden rounded-[2px] bg-brand-50">
                  <div
                    className="h-1 rounded-[2px] bg-brand-700"
                    style={{
                      width: `${
                        resume.blocks > 0 && resume.blockPosition
                          ? Math.round((resume.blockPosition / resume.blocks) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <Link
                  href={resume.href as Route}
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 text-[14px] font-medium text-white hover:bg-brand-800 sm:inline-flex sm:min-h-10 sm:w-auto"
                >
                  {resume.blockPosition !== null ? "Resume →" : "Start →"}
                </Link>
              </section>
            ) : null}

            {roadmaps.length ? (
              <section className="hidden rounded-card border border-ink-100 bg-white p-5 lg:block">
                <div className="mb-3.5 flex items-center justify-between gap-3">
                  <Eyebrow glyph="▤">Your roadmaps</Eyebrow>
                  <Link href="/learn" className="text-[13px] leading-none text-brand-700">
                    Browse all
                  </Link>
                </div>
                <div className="flex flex-col">
                  {roadmaps.map((r, i) => (
                    <RoadmapRow key={r.slug} roadmap={r} accent={ACCENTS[i % ACCENTS.length]!} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* ── Today ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3.5">
            <Eyebrow glyph="●" tone="brand">
              Today
            </Eyebrow>

            {resume ? (
              <TodayCard
                primary
                title={`Day ${resume.dayNumber} · ${resume.nodeTitle}`}
                note={resume.roadmapTitle}
                cost={`~${resume.blockPosition !== null ? resume.minutesLeft : resume.estMinutes} min`}
                action="Continue"
                href={resume.href as Route}
              />
            ) : null}

            {data.review.count > 0 ? (
              <TodayCard
                title={`${data.review.count} ${data.review.count === 1 ? "card" : "cards"} due`}
                note="Quick spaced review."
                cost={`~${data.review.minutes} min`}
                action="Review"
                href={"/review" as Route}
              />
            ) : null}

            {data.saved.count > 0 ? (
              <TodayCard
                quiet
                title={`${data.saved.count} ${data.saved.count === 1 ? "read" : "reads"} waiting`}
                note="Saved for later."
                cost={data.saved.minutes > 0 ? `~${data.saved.minutes} min` : "unknown length"}
                action="Open"
                href={"/profile/saved" as Route}
              />
            ) : null}

            {/* The sentence that makes the rail safe to ignore. */}
            <p className="text-[12px] leading-[1.5] text-ink-600">
              No deadlines here. These wait for you.
            </p>
          </div>
        </div>

        {/* ── roadmaps, mobile ─────────────────────────────────────────── */}
        {roadmaps.length ? (
          <section className="flex flex-col gap-3 border-t border-ink-100 pt-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow glyph="▤">Your roadmaps</Eyebrow>
              <Link href="/learn" className="text-[13px] leading-none text-brand-700">
                Browse all
              </Link>
            </div>
            {roadmaps.map((r, i) => (
              <RoadmapRow key={r.slug} roadmap={r} accent={ACCENTS[i % ACCENTS.length]!} compact />
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
