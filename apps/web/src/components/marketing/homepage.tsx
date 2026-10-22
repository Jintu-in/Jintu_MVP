import Link from "next/link";
import type { Route } from "next";
import { HomepageEffects } from "@/components/marketing/homepage-effects";
import { FIELD_ART } from "@/components/marketing/homepage-field-art";
import type { RoleDomain } from "@/content/roles";
import { getSiteUrl } from "@/lib/env";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

/**
 * The marketing homepage — the job-first redesign
 * (design/jintu-design/screens/V2Landing.dc.html, V2Home.dc.html,
 * DeskHome.dc.html).
 *
 * This replaced an earlier homepage built around browsing an aggregator's
 * catalogue directly (search, a day-count grid, a module "spine"). The new
 * one leads with the job, not the catalogue: pick what you want to become,
 * meet the field, then the roadmap. `design/jintu-design/CURRENT-STATE.md`
 * found that the 10-field taxonomy and the per-field role copy this page
 * needs already exist — `@/content/roles`' `ROLE_DOMAINS` and `ROLES` were
 * built for the (Phase 2) /roles pages and word-for-word match this
 * design's field tiles, so this page reuses that content rather than
 * inventing a second copy of it.
 *
 * EVERY COUNT HERE IS DERIVED. The chip row's "+N more", each field tile's
 * "+N more", which roadmap carries "Open now" — all computed server-side
 * (`(home)/page.tsx`) from the real role and roadmap catalogues. The mockup
 * itself shows one illustrative roadmap list; this page shows the real one,
 * including when that real count is not the mockup's round number.
 *
 * "Find my roadmap" points at `/learn`, not the mockup's own goal-picker
 * screen — there is no such flow built yet, and a button that pixel-matches
 * a destination which 404s is worse than one that lands somewhere real.
 */

export interface HomepageFieldTile {
  domain: RoleDomain;
  label: string;
  blurb: string;
  /** Two real role titles, in the order `@/content/roles` declares them. */
  roleTitles: string[];
  /** Roles in this field beyond the two shown. 0 hides the "+N more" span. */
  moreCount: number;
}

export interface HomepageRoadmapRow {
  slug: string;
  title: string;
  /** Whether this roadmap is actually published — never asserted, always read. */
  open: boolean;
}

export interface HomepageCategoryGroup {
  key: string;
  label: string;
  roadmaps: HomepageRoadmapRow[];
}

export interface HomepageProps {
  /** Up to 7 real role titles, one per field, for the hero card's chip row. */
  heroChips: string[];
  /** Real roles beyond the chips shown — never a guessed round number. */
  heroMoreCount: number;
  fieldTiles: HomepageFieldTile[];
  categoryGroups: HomepageCategoryGroup[];
  openRoadmapCount: number;
  totalRoadmapCount: number;
  signedIn: boolean;
  initials?: string | null;
  displayName?: string | null;
}

/** The 10-step "inside a lesson" illustration, verbatim from the design. */
function LessonArt({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 440 320"
      width="100%"
      height="100%"
      className={className}
      style={{ display: "block" }}
    >
      <rect width="440" height="320" rx="28" fill="#DDF3F7" />
      <circle cx="220" cy="150" r="128" fill="#C4E9F0" />
      <rect x="40" y="250" width="360" height="12" rx="6" fill="#0A3B46" />
      <path d="M70 262v50M370 262v50" stroke="#0A3B46" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M92 214c-16 -8 -22 -24 -16 -40c14 6 20 20 16 40zM96 214c2 -22 14 -34 30 -36c0 18 -12 30 -30 36zM94 214c-6 -24 0 -42 12 -52c8 18 4 36 -12 52z"
        fill="#2FA57A"
      />
      <path d="M76 214h36l-5 36h-26z" fill="#FFFFFF" />
      <rect x="74" y="210" width="40" height="9" rx="4" fill="#C5D5D8" />
      <path d="M352 224h10a10 10 0 0 1 0 20h-8" fill="none" stroke="#F29D00" strokeWidth="5" />
      <path d="M324 216h32v24a10 10 0 0 1 -10 10h-12a10 10 0 0 1 -10 -10z" fill="#FFB627" />
      <g transform="translate(220 122) scale(1.25)">
        <path d="M-52 96c0 -34 20 -52 52 -52s52 18 52 52z" fill="#FFB627" />
        <rect x="-9" y="20" width="18" height="30" rx="8" fill="#E3A77B" />
        <path d="M-9 36q9 9 18 0v6q-9 9 -18 0z" fill="#000" opacity="0.10" />
        <circle cx="0" cy="0" r="26" fill="#E3A77B" />
        <path
          d="M-27 2c-4 -24 10 -32 27 -32s31 8 27 32c-4 -12 -10 -18 -20 -19c-10 4 -24 5 -30 3c-2 4 -3 9 -4 16z"
          fill="#0A3B46"
        />
        <circle cx="-9" cy="4" r="2.6" fill="#0A3B46" />
        <circle cx="9" cy="4" r="2.6" fill="#0A3B46" />
        <path d="M-7 13q7 6 14 0" fill="none" stroke="#0A3B46" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <path d="M150 170a10 10 0 0 1 10 -10h120a10 10 0 0 1 10 10v74h-140z" fill="#0A3B46" />
      <rect x="130" y="242" width="180" height="10" rx="5" fill="#A8DDE7" />
      <rect x="206" y="190" width="28" height="28" rx="8" fill="#43B4C8" />
      <path d="M222 198v10a4 4 0 0 1 -6 3" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="222" cy="194.5" r="1.8" fill="#FFFFFF" />
      <rect x="42" y="63" width="104" height="46" rx="14" fill="#0A3B46" opacity="0.1" />
      <rect x="42" y="58" width="104" height="46" rx="14" fill="#FFFFFF" />
      <circle cx="66" cy="81" r="12" fill="#2FA57A" />
      <path d="M61.2 81l3.2 3.6l6.4 -7.2" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="86" y="72" width="46" height="7" rx="3.5" fill="#0A3B46" />
      <rect x="86" y="85" width="30" height="6" rx="3.0" fill="#A8DDE7" />
      <rect x="310" y="45" width="96" height="46" rx="23" fill="#0A3B46" opacity="0.1" />
      <rect x="310" y="40" width="96" height="46" rx="23" fill="#FFFFFF" />
      <path
        d="M334 50c2 6 9 9 9 17a10 10 0 0 1 -20 0c0 -4 2 -6 4 -8c1 3 2 4 4 4c-2 -5 0 -10 3 -13z"
        fill="#F29D00"
      />
      <rect x="352" y="54" width="40" height="7" rx="3.5" fill="#0A3B46" />
      <rect x="352" y="67" width="26" height="6" rx="3.0" fill="#A8DDE7" />
      <g transform="rotate(-6 356 150)">
        <rect x="318" y="137" width="80" height="36" rx="18" fill="#0A3B46" opacity="0.14" />
        <rect x="318" y="132" width="80" height="36" rx="18" fill="#FFB627" />
        <text x="358" y="156" textAnchor="middle" fontFamily="Figtree, sans-serif" fontWeight="700" fontSize="16" fill="#0A3B46">
          +25
        </text>
      </g>
      <path d="M164 38h12M170 32v12" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="286" cy="22" r="4" fill="#FFFFFF" />
      <circle cx="30" cy="160" r="4" fill="#FFFFFF" />
      <path d="M408 210h12M414 204v12" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** The wavy path-and-dots decoration behind the final CTA, verbatim. */
function CloseWave({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1168 260" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" className={className} style={{ display: "block" }}>
      <g transform="translate(0 40)">
        <path d="M0 220v-60c120 -50 220 -40 330 -6c120 36 210 30 320 -24c130 -62 250 -70 518 -10v100z" fill="#DDE8E9" />
        <path d="M0 220v-30c160 -40 300 -30 440 0c150 30 300 10 420 -30c120 -40 220 -30 308 -6v66z" fill="#CFE0E2" />
        <path
          d="M60 176c120 -46 220 -40 330 -8s220 30 330 -24s200 -66 330 -52"
          fill="none"
          stroke="#43B4C8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 14"
        />
        <circle cx="60" cy="176" r="11" fill="#FFB627" stroke="#F29D00" strokeWidth="3" />
        <path d="M56.7 176l2.2 2.475l4.4 -4.95" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="250" cy="141" r="11" fill="#FFB627" stroke="#F29D00" strokeWidth="3" />
        <path d="M246.7 141l2.2 2.475l4.4 -4.95" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="470" cy="178" r="11" fill="#FFB627" stroke="#F29D00" strokeWidth="3" />
        <path d="M466.7 178l2.2 2.475l4.4 -4.95" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="700" cy="150" r="11" fill="#FFFFFF" stroke="#C5D5D8" strokeWidth="3" />
        <circle cx="900" cy="100" r="11" fill="#FFFFFF" stroke="#C5D5D8" strokeWidth="3" />
        <path d="M1052 92v-66" stroke="#0A3B46" strokeWidth="5" strokeLinecap="round" />
        <path d="M1054 28h44l-11 14l11 14h-44z" fill="#FFB627" />
        <ellipse cx="1052" cy="94" rx="16" ry="5" fill="#0A3B46" opacity="0.18" />
      </g>
    </svg>
  );
}

const ARROW_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const CHECK = (
  <svg aria-hidden width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#06262c" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** The same check, in the decorative brand teal — for a dark background,
 *  never set via a `text-brand-500` className (2.18:1, fails AA as text;
 *  the guard reads class names, not an svg's own stroke attribute, which
 *  is why this is drawn with the colour inline rather than via a wrapper
 *  span the way the on-brand CHECK above is framed elsewhere on the page). */
const CHECK_TEAL = (
  <svg aria-hidden width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#43b4c8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const X_MARK = (
  <svg aria-hidden width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);

/** The three "pick a goal / follow its roadmap / do one lesson a day" steps. */
const HOW_STEPS = [
  { n: "1", title: "Pick a goal", body: "Choose from 60 jobs, or type your own." },
  { n: "2", title: "Follow its roadmap", body: "The skills for that job, in the order to learn them." },
  { n: "3", title: "Do one lesson a day", body: "About 15 minutes. A streak keeps you coming back." },
] as const;

/** The six "inside a lesson" steps — the self-check, never a score. */
const LESSON_STEPS = [
  { title: "One small task", body: "Never a wall of reading. One thing to do, then the next." },
  { title: "What you should get", body: "The real result, with the part that matters marked." },
  { title: "You check it yourself", body: "Two buttons: mine matches, or mine is different. No score is kept." },
  { title: "Help when yours differs", body: "The common causes are one tap away." },
  { title: "Your turn", body: "A small task at the end, with no hints." },
  { title: "Done for today", body: "Points, your streak, and a card you can share." },
] as const;

/** The three "as you learn" value props. */
const LEARN_PROPS = [
  { title: "Points for every lesson", body: "They add up across every roadmap you start." },
  { title: "A streak for showing up", body: "One lesson a day keeps it. Miss a day and it restarts. Your total never does." },
  { title: "A page and a card to share", body: "Your name, what you finished, and your streak." },
] as const;

const SCATTERED = ["Twelve tabs open", "No order to follow", "Reading without doing", "No way to check yourself", "Dropped by day three"];
const ON_JINTU = [
  "One path, in order",
  "One step on the screen at a time",
  "You do every step yourself",
  "The result you should get is shown",
  "A streak that brings you back",
];

const FREE_INCLUDES = [
  "Every roadmap, in full, readable without an account",
  "Progress, streaks and points across every roadmap you start",
  "Notes and highlights, private to you, exportable any time",
  "Every link opened and checked by a person before it shipped",
  "No adverts, and no selling of anything about you",
];

const FAQ = [
  {
    q: "Is this only for people who code?",
    a: "No. The job guides cover ten fields, from healthcare and finance to design and marketing. Roadmaps open one at a time.",
  },
  {
    q: "Do I need an account?",
    a: "No. Every lesson is readable without one. An account keeps where you stopped, your streak and your points.",
  },
  { q: "How long is a lesson?", a: "About 15 minutes. Each one is a few small steps you do yourself." },
  {
    q: "Will this get me a job?",
    a: "We do not promise that. Jintu teaches the skills, one step at a time. It does not introduce you to employers.",
  },
  {
    q: "My field is not here. What now?",
    a: "Tell us what you want to learn. Requests decide which roadmap gets written next.",
  },
  {
    q: "Is it really free?",
    a: "Yes. There is nothing on the site you can pay for today. If that ever changes, the pricing page changes first.",
  },
] as const;

export default function Homepage({
  heroChips,
  heroMoreCount,
  fieldTiles,
  categoryGroups,
  openRoadmapCount,
  totalRoadmapCount,
  signedIn,
  initials = null,
  displayName = null,
}: HomepageProps) {
  return (
    <div className="jhome bg-ink-50">
      <HomepageEffects />
      <SiteNav variant="overlay" signedIn={signedIn} initials={initials} displayName={displayName} />
      <div aria-hidden data-nav-sentinel className="absolute top-0 h-[60vh] w-px" />

      {/* ── hero ────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-night-900 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-[200px] -left-[180px] size-[520px] rounded-full border border-white/10" />
        <div aria-hidden className="pointer-events-none absolute top-[260px] -right-[260px] size-[640px] rounded-full border border-white/10 lg:top-[260px] lg:-right-[220px] lg:size-[760px]" />

        <div className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-5 pt-[104px] pb-[72px] sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:pt-[176px] lg:pb-[140px]">
          <div className="flex max-w-[600px] flex-col items-start gap-3.5">
            <span className="flex h-7 items-center rounded-full bg-white/15 px-3 font-mono text-[12px] leading-none text-on-night-muted lg:h-8 lg:px-3.5 lg:text-[13.5px]">
              Free · no account needed to read
            </span>
            <h1 className="t-page text-white lg:max-w-[14ch]">Learn the skills for the job you want.</h1>
            <p className="mt-1 text-[16.5px] leading-[1.55] text-pretty text-on-night-muted lg:max-w-[460px] lg:text-[20px] lg:leading-[1.5]">
              Jintu is a free, step-by-step way to learn job skills. Pick a goal, follow its roadmap, and
              do one short lesson a day.
            </p>
            <div className="mt-1 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
              <Link
                href="/learn"
                className="flex h-15 items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-7 text-[17px] font-semibold text-on-brand hover:bg-brand-400 sm:w-auto"
              >
                <span>Find my roadmap</span>
                {ARROW_RIGHT}
              </Link>
              <Link
                href={"/#how-it-works" as Route}
                className="hidden h-15 items-center rounded-2xl border border-white/35 px-5 text-[16px] text-white lg:flex"
              >
                See how it works
              </Link>
            </div>
            <div className="mt-1 text-center font-mono text-[13px] leading-[1.45] text-on-night-muted-2 sm:text-left">
              {totalRoadmapCount} roadmaps in the pipeline · {openRoadmapCount} open today · about 15 minutes a day
            </div>
          </div>

          {/* The role picker — the one piece of UI every visitor meets first. */}
          <div className="w-full lg:max-w-[480px] lg:flex-none">
            <div className="flex flex-col gap-3.5 rounded-[24px] bg-white p-[18px] text-ink-900 shadow-[0_2px_4px_rgba(0,0,0,0.2),0_30px_60px_rgba(0,0,0,0.35)] sm:p-[22px]">
              <div className="t-card text-ink-900">What do you want to become?</div>
              <div className="flex flex-wrap gap-2">
                {heroChips.map((title) => (
                  <span
                    key={title}
                    className="flex h-10 items-center rounded-full border border-ink-50 bg-ink-50 px-3.5 text-[14.5px] font-medium whitespace-nowrap text-ink-900"
                  >
                    {title}
                  </span>
                ))}
                {heroMoreCount > 0 ? (
                  <span className="flex h-10 items-center px-1.5 text-[14.5px] font-semibold whitespace-nowrap text-link">
                    +{heroMoreCount} more
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-2 pb-6 text-[13.5px] text-on-night-muted-2 lg:hidden">
          <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span>Find your field</span>
        </div>
      </header>

      {/* ── the fields ──────────────────────────────────────────────────── */}
      <section id="fields" className="jreveal mx-auto max-w-[1280px] px-5 py-14 sm:px-12 lg:py-[88px]">
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end lg:gap-12">
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[13.5px] leading-none font-semibold text-link">
              {totalRoadmapCount} job guides across 10 fields
            </div>
            <h2 className="t-sect text-ink-900">Whatever you want to do, start with the job.</h2>
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-pretty text-ink-600">
              Each guide says what the job is, what it is not, and what to learn first.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex min-h-11 flex-none items-center gap-2 text-[15px] font-semibold text-ink-900 lg:text-[16px]"
          >
            Not here? Tell us what you want to learn
            {ARROW_RIGHT}
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 lg:mt-9 lg:grid-cols-5 lg:gap-4">
          {fieldTiles.map((field) => {
            const Art = FIELD_ART[field.domain];
            return (
              <Link
                key={field.domain}
                href={"/roles" as Route}
                className="jcard-hover flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-white text-ink-900 lg:rounded-[22px] lg:shadow-[0_1px_2px_rgba(12,42,48,0.05)]"
              >
                <span className="block h-[92px] flex-none lg:h-[120px]">
                  <Art className="block size-full" />
                </span>
                <span className="flex flex-col gap-1.5 px-3.5 pt-3.5 pb-4 lg:gap-2.5 lg:px-[18px] lg:pt-4 lg:pb-[18px]">
                  <span className="t-card text-ink-900">{field.label}</span>
                  <span className="hidden text-[14px] leading-[1.4] text-ink-600 lg:block">{field.blurb}</span>
                  <span className="text-[13.5px] leading-[1.35] text-ink-600 lg:mt-auto lg:text-[13px]">
                    {field.roleTitles.join(", ")}
                    {field.moreCount > 0 ? (
                      <span className="ml-1 font-semibold whitespace-nowrap text-link">
                        +{field.moreCount} more
                      </span>
                    ) : null}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── how it works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="jreveal scroll-mt-20 bg-white px-5 py-14 sm:px-12 lg:py-[88px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[13.5px] leading-none font-semibold text-link">How it works</div>
            <h2 className="t-sect text-ink-900">A goal, turned into one short lesson a day</h2>
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-pretty text-ink-600">
              You say where you want to go. Jintu gives you the next small step.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3.5 rounded-[24px] bg-ink-50 p-5 lg:mt-9 lg:flex-row lg:gap-6 lg:bg-transparent lg:p-0">
            {HOW_STEPS.map((step) => (
              <div
                key={step.n}
                className="flex flex-1 flex-col gap-3.5 lg:min-w-0 lg:rounded-[28px] lg:bg-white lg:p-7 lg:shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-[26px] flex-none items-center justify-center rounded-full bg-night-900 font-mono text-[12px] text-white">
                    {step.n}
                  </span>
                  <span className="text-[19px] leading-[1.25] font-medium text-ink-900">{step.title}</span>
                </div>
                <div className="text-[15px] leading-[1.5] text-pretty text-ink-600">{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── inside a lesson ─────────────────────────────────────────────── */}
      <section className="jreveal mx-auto max-w-[1280px] px-5 py-14 sm:px-12 lg:py-[88px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex flex-col items-start gap-4 lg:w-[400px] lg:flex-none">
            <div className="font-mono text-[13.5px] leading-none font-semibold text-link">Inside a lesson</div>
            <h2 className="t-sect text-ink-900">Every lesson is small things you do.</h2>
            <p className="text-[16.5px] leading-[1.6] text-pretty text-ink-600">
              No long reading before you start. You do it, you compare, you move on. It works the same
              way in every subject.
            </p>
            <div className="h-[220px] w-full lg:mt-2 lg:h-[320px]">
              <LessonArt />
            </div>
          </div>

          <div className="relative flex flex-col lg:min-w-0 lg:flex-1">
            <div aria-hidden className="absolute top-[18px] bottom-[18px] left-[14px] w-px bg-night-900" />
            {LESSON_STEPS.map((step, i) => (
              <div key={step.title} className="relative flex items-center gap-4 py-3 lg:gap-6 lg:py-6">
                <span className="flex size-[30px] flex-none items-center justify-center rounded-full bg-night-900 font-mono text-[11.5px] text-white">
                  {i + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="t-card text-ink-900">{step.title}</span>
                  <span className="text-[15px] leading-[1.45] text-pretty text-ink-500">{step.body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── as you learn ────────────────────────────────────────────────── */}
      <section className="jreveal bg-night-900 px-5 py-14 text-white sm:px-12 lg:py-[88px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex max-w-[600px] flex-col gap-5">
            <div className="font-mono text-[13.5px] leading-none font-semibold text-dark-link">As you learn</div>
            <h2 className="t-sect text-white">Earn points. Keep a streak. Show your progress.</h2>
            <div className="mt-1 flex flex-col gap-4">
              {LEARN_PROPS.map((p) => (
                <div key={p.title} className="flex items-center gap-4">
                  <span className="flex size-12 flex-none items-center justify-center rounded-full bg-amber-500 text-[13px] font-bold text-warn-700">
                    {p.title === "Points for every lesson" ? "+25" : null}
                    {p.title === "A streak for showing up" ? (
                      <svg aria-hidden width={20} height={20} viewBox="0 0 24 24">
                        <path
                          d="M12 2c1 3.6 5 5.6 5 10.2a5 5 0 0 1-10 0c0-1.7.6-3 1.6-4 .3 1.5 1 2.4 2 2.7C10.4 8.4 10.8 5 12 2z"
                          fill="#3D2600"
                        />
                      </svg>
                    ) : null}
                    {p.title === "A page and a card to share" ? (
                      <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#3D2600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15V4" />
                        <path d="M8 8l4-4 4 4" />
                        <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[17px] leading-[1.4] font-semibold">{p.title}</span>
                    <span className="text-[15px] leading-[1.45] text-pretty text-on-night-muted">{p.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* The streak share-card the "page and a card to share" line names,
              shown rather than described — "Asha" is an illustration of the
              feature's own UI, the way a product screenshot would show it,
              not a claim about a real learner. */}
          <div className="w-full lg:w-[440px] lg:flex-none">
            <div className="flex min-h-[210px] flex-col justify-between gap-5 rounded-[28px] bg-brand-500 p-6 text-on-brand shadow-[0_24px_48px_rgba(0,0,0,0.35)] lg:min-h-[264px]">
              <div className="flex flex-col gap-3">
                <div className="t-card text-on-brand">jintu</div>
                <div className="t-sub text-on-brand">Asha is on a 3 day streak</div>
              </div>
              <div className="flex items-center justify-between gap-3 text-[14.5px] font-medium">
                <div>3 lessons done · 75 points</div>
                <div className="font-mono text-[12.5px]">{getSiteUrl().host}/u/asha</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── scattered tutorials vs on Jintu ─────────────────────────────── */}
      <section className="jreveal mx-auto max-w-[1280px] px-5 py-14 sm:px-12 lg:py-[88px]">
        <h2 className="t-sect text-ink-900">From twelve open tabs to one next step</h2>
        <div className="mt-6 flex flex-col gap-4 lg:mt-9 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4 rounded-[24px] bg-white p-[22px] lg:gap-5 lg:rounded-[28px] lg:p-8">
            <div className="t-card text-ink-600">Scattered tutorials</div>
            <div className="flex flex-col items-start gap-2 lg:gap-2.5">
              {SCATTERED.map((line, i) => (
                <div
                  key={line}
                  style={{ transform: `rotate(${[-2, 1.5, -1, 2, -1.5][i]}deg)` }}
                  className="flex min-h-11 items-center gap-2.5 rounded-[22px] bg-ink-50 px-4 text-[15px] font-medium text-ink-600 lg:min-h-12 lg:gap-2.5 lg:px-[18px] lg:text-[15.5px]"
                >
                  <span className="text-risk-border">{X_MARK}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-[24px] bg-night-900 p-[22px] text-white lg:gap-5 lg:rounded-[28px] lg:p-8">
            <div className="t-card text-white">On Jintu</div>
            <div className="flex flex-col items-start gap-2 lg:gap-2.5">
              {ON_JINTU.map((line) => (
                <div
                  key={line}
                  className="flex min-h-11 items-center gap-2.5 rounded-[22px] bg-white/10 px-4 text-[15px] font-medium lg:min-h-12 lg:px-[18px] lg:text-[15.5px]"
                >
                  {CHECK_TEAL}
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── the roadmaps ─────────────────────────────────────────────────── */}
      <section id="all" className="jreveal bg-white px-5 py-14 sm:px-12 lg:py-[88px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end lg:gap-12">
            <div className="flex max-w-[680px] flex-col gap-2.5">
              <div className="font-mono text-[13.5px] leading-none font-semibold text-link">The roadmaps</div>
              <h2 className="t-sect text-ink-900">
                {openRoadmapCount} of {totalRoadmapCount} roadmaps are open.
              </h2>
              <p className="text-[16.5px] leading-[1.6] text-pretty text-ink-600">
                The rest are being written in the same step-by-step format. Ask to be told when yours
                opens.
              </p>
            </div>
            <div className="flex flex-none gap-2.5">
              <Link
                href="/learn"
                className="flex h-14 flex-none items-center gap-2.5 rounded-2xl bg-night-900 px-6 text-[16px] font-semibold text-white"
              >
                See all roadmaps
                {ARROW_RIGHT}
              </Link>
              <Link
                href="/contact"
                className="hidden h-14 flex-none items-center rounded-2xl border border-ink-200 bg-white px-5 text-[15.5px] font-semibold text-ink-900 lg:flex"
              >
                Ask for a roadmap
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-2.5 lg:mt-9 lg:grid-cols-3 lg:gap-4">
            {categoryGroups.map((group) => (
              <div key={group.key} className="flex min-w-0 flex-col gap-2 rounded-[22px] bg-ink-50 p-[18px] lg:p-[22px]">
                <div className="font-mono text-[12px] leading-4 font-semibold tracking-[.06em] text-ink-500 uppercase">
                  {group.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.roadmaps.map((r) => (
                    <div key={r.slug} className="flex min-h-11 items-center gap-3">
                      <span
                        aria-hidden
                        className={`flex size-9 flex-none items-center justify-center rounded-xl font-mono text-[12.5px] font-semibold ${
                          r.open ? "bg-brand-500 text-on-brand" : "bg-white text-link"
                        }`}
                      >
                        {r.title.slice(0, 2)}
                      </span>
                      <span className={`min-w-0 flex-1 text-[15px] leading-5 ${r.open ? "font-semibold" : "font-medium"} text-ink-900`}>
                        {r.title}
                      </span>
                      {r.open ? (
                        <span className="flex h-6 flex-none items-center rounded-xl bg-ok-bg px-2.5 text-[12px] font-semibold text-ok-700">
                          Open now
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── free ─────────────────────────────────────────────────────────── */}
      <section id="free" className="jreveal mx-auto max-w-[1280px] px-5 py-14 sm:px-12 lg:flex lg:items-center lg:gap-24 lg:py-[88px]">
        <div className="flex flex-col items-start gap-4 lg:w-[440px] lg:flex-none">
          <h2 className="t-page text-ink-900">Free. All of it.</h2>
          <p className="text-[16.5px] leading-[1.6] text-pretty text-ink-600">
            No subscription, no trial that expires, no card asked for. There is nothing on this site
            you can pay for today.
          </p>
          <Link href="/pricing" className="flex min-h-11 items-center gap-2 text-[15.5px] font-semibold text-ink-900">
            How this stays free
            {ARROW_RIGHT}
          </Link>
        </div>
        <div className="mt-6 flex flex-1 flex-col gap-4 rounded-[24px] bg-white p-[22px] shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)] lg:mt-0 lg:gap-5 lg:rounded-[28px] lg:p-8">
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {FREE_INCLUDES.map((line) => (
              <li key={line} className="flex items-start gap-3.5 text-[15.5px] leading-[1.6]">
                <span aria-hidden className="flex size-[26px] flex-none items-center justify-center rounded-full bg-brand-500">
                  {CHECK}
                </span>
                <span className="min-w-0 text-ink-900">{line}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-warn-bg px-4 py-3.5 text-[14.5px] leading-[1.55] text-warn-700">
            What free does not mean: a job, an interview, or an introduction to any employer.
          </div>
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="jreveal bg-white px-5 py-14 sm:px-12 lg:py-[88px]">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="t-sect text-ink-900">Questions people ask first</h2>
          <div className="mt-6 grid grid-cols-1 gap-2.5 lg:mt-9 lg:grid-cols-3 lg:gap-4">
            {FAQ.map((item) => (
              <div key={item.q} className="flex min-w-0 flex-col gap-2 rounded-[20px] bg-ink-50 p-5 lg:gap-2 lg:rounded-[22px] lg:p-6">
                <h3 className="t-card text-ink-900">{item.q}</h3>
                <p className="text-[15px] leading-[1.5] text-pretty text-ink-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── the close ────────────────────────────────────────────────────── */}
      <section className="jreveal relative flex flex-col items-center gap-4 overflow-hidden px-5 pt-16 pb-[150px] text-center sm:px-12 lg:pt-[88px] lg:pb-[200px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[130px] lg:h-[260px]">
          <CloseWave />
        </div>
        <h2 className="t-sect relative z-10 text-ink-900">Your first lesson takes about 15 minutes.</h2>
        <Link
          href="/learn"
          className="relative z-10 flex h-15 items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-7 text-[17px] font-semibold text-on-brand hover:bg-brand-400"
        >
          <span>Find my roadmap</span>
          {ARROW_RIGHT}
        </Link>
        <div className="relative z-10 text-[14px] leading-[1.4] text-ink-600">
          Free to read. We do not promise you a job.
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
