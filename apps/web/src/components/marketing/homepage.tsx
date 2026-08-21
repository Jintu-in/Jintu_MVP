import Link from "next/link";
import type { Route } from "next";
import { HomepageEffects } from "@/components/marketing/homepage-effects";

/**
 * The marketing homepage — v2, from the design project.
 *
 * Eleven sections: nav, hero, source wall, roadmaps, how it works,
 * pricing, one day in full, the bento, ninety-one squares, the close, the
 * footer. Every effect is scoped under `.jhome` in globals.css so none of
 * it can reach a roadmap or a day — a reading surface that shimmers is one
 * people leave.
 *
 * THE NUMBERS ARE DERIVED, NOT WRITTEN. The design's pills say "~340 hours"
 * and "500+ links checked". There are 890 hours across the four roadmaps —
 * 340 is the data analyst alone — and 228 links. Both are computed, so the
 * page cannot drift from the product.
 *
 * The search fields are real GET forms pointed at /learn, which already
 * takes `?q=`. They work with JavaScript switched off, and they land
 * somewhere that can actually answer them.
 *
 * The design carries no DCLogic; the observers live in homepage-effects.
 */

export interface HomepageRoadmap {
  slug: string;
  title: string;
  /** "Data · Beginner" */
  kicker: string;
  summary: string;
  /** "20 modules · 91 days · ~340 hrs" */
  sizeLine: string;
}

export interface HomepageProps {
  roadmaps: HomepageRoadmap[];
  counts: { roadmaps: number; days: number; hours: number; links: number };
  /** The places the material genuinely comes from, most-used first. */
  sources: string[];
  /** Subject chips above the roadmap cards. */
  subjects: string[];
  signedIn: boolean;
}

const SearchGlyph = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * A real search field: a GET form to /learn, which already understands
 * `?q=`. It submits without JavaScript, and it lands on the page that can
 * actually answer the question rather than a decorative box.
 */
function SearchBar({ id }: { id: string }) {
  return (
    <form
      action="/learn"
      method="GET"
      role="search"
      className="jsearch flex h-13 w-full max-w-[480px] items-center gap-2.5 rounded-full bg-white py-0 pr-2 pl-5"
    >
      <label htmlFor={id} className="sr-only">
        Search roadmaps
      </label>
      <span aria-hidden className="flex-none text-ink-500">
        <SearchGlyph />
      </span>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        placeholder="What do you want to learn?"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 placeholder:text-ink-500 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-700 text-white hover:bg-brand-800"
      >
        <svg aria-hidden width={14} height={14} viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

/** One floating fact. White pill, ink text — never white on teal. */
function StatPill({
  glyph,
  children,
  className,
}: {
  glyph: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3.5 py-2 font-mono text-[12px] leading-none whitespace-nowrap text-ink-900 ${className ?? ""}`}
    >
      <span aria-hidden>{glyph}</span>
      {children}
    </span>
  );
}

const STEPS = [
  ["01", "Pick a roadmap", "Read the whole thing before you sign up."],
  ["02", "Do one day", "45–90 min. It remembers where you stopped."],
  ["03", "Keep the streak", "Miss a day and it resets. Your total never does."],
  ["04", "Show what you did", "A public profile, counted not self-reported."],
];

const BULLETS = [
  "Every day states its length before you open it",
  "Links go to the original author, never a copy",
  "A note on why this source and not another",
  "One thing to make, then three questions to check yourself",
];

const FREE_INCLUDES = [
  "Every roadmap in full",
  "Progress, streaks, points",
  "No adverts, nothing sold about you",
];

const navLink =
  "text-[14px] leading-none text-white/85 transition-colors hover:text-white [.jscrolled_&]:text-ink-600 [.jscrolled_&]:hover:text-ink-900";

export default function Homepage({
  roadmaps,
  counts,
  sources,
  subjects,
  signedIn,
}: HomepageProps) {
  return (
    <div className="jhome bg-ink-50">
      <HomepageEffects />

      {/* ── nav ─────────────────────────────────────────────────────────── */}
      {/* Transparent over the dark head of the hero; it only takes a solid
          surface once the sentinel below has scrolled away. */}
      <nav className="jnav fixed inset-x-0 top-0 z-50 flex h-[72px] items-center gap-6 px-5 sm:gap-7 sm:px-12">
        <Link
          href="/"
          className="text-[16px] leading-none font-medium text-white [.jscrolled_&]:text-brand-700"
        >
          jintu
        </Link>
        <div className="hidden flex-1 items-center gap-7 sm:flex">
          <Link href="/learn" className={navLink}>
            Roadmaps
          </Link>
          {/* Anchors the section that answers it. There is no such route,
              and a nav item that 404s is worse than one that scrolls. */}
          <Link href={"/#how-it-works" as Route} className={navLink}>
            How it works
          </Link>
          <Link href="/pricing" className={navLink}>
            Free
          </Link>
        </div>
        <div className="flex-1 sm:hidden" />
        <Link
          href={(signedIn ? "/dashboard" : "/join") as Route}
          className="text-[14px] leading-none font-medium text-white [.jscrolled_&]:text-brand-700"
        >
          {signedIn ? "Dashboard" : "Sign in"}
        </Link>
      </nav>

      {/* The nav's transparency is driven by this, not by a scroll handler.
          It sits at the top of the document and is as tall as the hero's
          dark band, so the nav stays transparent while it is over teal and
          only takes a surface once the page has scrolled past it. Sized in
          vh so it tracks the hero, which is itself viewport-relative.

          Putting this AFTER the hero is the obvious mistake: it would be
          off-screen at rest, and the nav would render solid-white with
          white text from the first paint. */}
      <div aria-hidden data-nav-sentinel className="absolute top-0 h-[55vh] w-px" />

      {/* ── hero ────────────────────────────────────────────────────────── */}
      {/* The design's gradient reaches brand-500 by 55%, and white body copy
          sits in that band at 2.44:1. A brand-700 stop at 44% keeps the
          dark-to-pale arc and puts the text on 5.32:1. The contrast guard
          reads class names and cannot evaluate a gradient, so this one is
          on us. */}
      <header className="relative flex flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#0f5566_0%,#17758a_44%,#43b4c8_74%,#f4fbfc_100%)] px-5 pt-[104px] pb-0 sm:px-12 sm:pt-[132px]">
        <div aria-hidden className="jglow1" />
        <div aria-hidden className="jglow2" />
        <div aria-hidden className="jgrain" />

        <div className="relative z-10 flex w-full flex-col items-center gap-6 text-center sm:gap-7">
          <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-center font-mono text-[11.5px] leading-[1.4] text-white sm:text-[13px] sm:leading-none">
            Free · No account needed to read
          </span>

          <h1 className="text-[38px] leading-[1.06] font-medium tracking-[-0.03em] text-white sm:text-[64px] sm:leading-[1.02] sm:tracking-[-0.035em] lg:text-[88px]">
            Learn anything,
            <br />
            <span className="bg-gradient-to-r from-white to-brand-100 bg-clip-text text-transparent">
              properly.
            </span>
          </h1>

          <p className="max-w-[54ch] text-[16px] leading-[1.55] text-pretty text-white/85 sm:text-[20px] sm:leading-[1.5]">
            Deep roadmaps built from the best free material on the internet. Every link opened by a
            person before it shipped.
          </p>

          <SearchBar id="hero-search" />
        </div>

        {/* The four facts. A wrapped row everywhere; only pinned to the
            corners at xl, where there is genuinely space beside the
            headline. Absolute positioning at smaller widths is what was
            colliding with the nav and the card. */}
        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-2 xl:hidden">
          <StatPill glyph="⚡">{counts.roadmaps} roadmaps</StatPill>
          <StatPill glyph="▦">{counts.days} days written</StatPill>
          <StatPill glyph="◷">~{counts.hours} hours</StatPill>
          <StatPill glyph="✓">{counts.links} links checked</StatPill>
        </div>
        <div aria-hidden className="hidden xl:block">
          <StatPill glyph="⚡" className="absolute top-[210px] left-[64px] opacity-95">
            {counts.roadmaps} roadmaps
          </StatPill>
          <StatPill glyph="▦" className="absolute top-[280px] right-[80px] opacity-90">
            {counts.days} days written
          </StatPill>
          <StatPill glyph="◷" className="absolute bottom-[220px] left-[104px] opacity-90">
            ~{counts.hours} hours
          </StatPill>
          <StatPill glyph="✓" className="absolute right-[64px] bottom-[260px] opacity-95">
            {counts.links} links checked
          </StatPill>
        </div>

        {/* the day card, straddling the fold */}
        <div className="relative z-10 mt-12 mb-[-64px] w-full max-w-[620px] rounded-card border border-ink-100 bg-white p-5 sm:mt-20 sm:mb-[-88px] sm:p-7">
          <div className="font-mono text-[12px] leading-[1.5] text-ink-500">Day 45 of 91</div>
          <div className="mt-1.5 text-[20px] leading-[1.3] font-medium text-ink-900 sm:text-[22px]">
            Frames
          </div>
          <p className="mt-2.5 text-[15px] leading-[1.65] text-pretty text-ink-600 italic sm:text-[16px]">
            If you cannot say what one row means, you cannot analyse the table.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {[
              ["RANGE vs ROWS in window frames", "read the first example twice; it's the whole trap."],
              ["Postgres docs — window functions", "section 3.5 only, skip the rest for now."],
            ].map(([title, why]) => (
              <div key={title} className="rounded-lg border border-ink-100 p-3.5">
                <div className="text-[14px] leading-[1.4] font-medium text-ink-900">{title}</div>
                {/* Full contrast, always: this note is the proof a person
                    chose the link, and the one thing a crawler cannot fake. */}
                <p className="mt-1.5 text-[13px] leading-[1.6] text-pretty text-brand-700 italic">
                  Why this one — {why}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
            <span className="font-mono text-[12px] leading-none text-ink-500">
              Your progress · 45 of 91 days
            </span>
            <Link href="/learn" className="text-[13.5px] font-medium text-brand-700">
              Browse roadmaps →
            </Link>
          </div>
        </div>
      </header>

      {/* ── the sources ─────────────────────────────────────────────────── */}
      {sources.length ? (
        <section className="jreveal border-b border-ink-100 bg-white px-5 pt-24 pb-10 sm:px-12 sm:pt-32">
          <h2 className="text-center font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
            The material comes from
          </h2>
          {/* Names, never logos — a wordmark implies a relationship we do
              not have. Derived from what we actually link to, so the wall
              cannot outlive the curation it describes. */}
          <ul className="mx-auto mt-6 flex max-w-[1000px] flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {sources.map((s) => (
              <li
                key={s}
                className="jwordmark text-[14px] leading-none font-medium text-ink-900 sm:text-[17px]"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── the roadmaps ────────────────────────────────────────────────── */}
      <section className="jreveal mx-auto max-w-[1280px] px-5 py-16 sm:px-12 sm:py-24">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Roadmaps
        </div>
        <h2 className="mt-3 text-[26px] leading-[1.2] font-medium text-ink-900 sm:text-[36px]">
          Start with what
          <br className="hidden sm:block" /> you actually need.
        </h2>

        {subjects.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/learn"
              className="flex min-h-10 items-center rounded-full border border-brand-700 bg-brand-700 px-4 text-[13.5px] font-medium text-white"
            >
              All
            </Link>
            {subjects.map((s) => (
              <Link
                key={s}
                href={`/learn?subject=${encodeURIComponent(s)}` as Route}
                className="flex min-h-10 items-center rounded-full border border-ink-100 bg-white px-4 text-[13.5px] text-ink-900 hover:border-brand-700"
              >
                {s}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {roadmaps.map((r) => (
            <Link
              key={r.slug}
              href={`/learn/${r.slug}`}
              className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6"
            >
              <div className="font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                {r.kicker}
              </div>
              <div className="mt-2.5 text-[18px] leading-[1.35] font-medium text-ink-900">
                {r.title}
              </div>
              <p className="mt-2 text-[14px] leading-[1.6] text-pretty text-ink-600">{r.summary}</p>
              <div className="mt-4 border-t border-ink-100 pt-3 font-mono text-[12.5px] leading-[1.5] text-ink-500">
                {r.sizeLine}
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/learn"
          className="mt-6 inline-flex min-h-11 items-center text-[14px] font-medium text-brand-700"
        >
          All {counts.roadmaps} roadmaps ↗
        </Link>
      </section>

      {/* ── how it works ────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="jreveal scroll-mt-24 border-y border-ink-100 bg-white px-5 py-16 sm:px-12 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
            How it works
          </div>
          <h2 className="mt-3 text-[26px] leading-[1.2] font-medium text-ink-900 sm:text-[36px]">
            Four steps,
            <br className="hidden sm:block" /> then a habit.
          </h2>

          <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([n, head, body]) => (
              <li key={n} className="border-t border-ink-200 pt-4">
                <div className="font-mono text-[12px] leading-none text-brand-700">{n}</div>
                <h3 className="mt-3 text-[16px] leading-[1.35] font-medium text-ink-900">{head}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-pretty text-ink-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── pricing ─────────────────────────────────────────────────────── */}
      <section className="jreveal mx-auto max-w-[1280px] px-5 py-16 sm:px-12 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
              Pricing
            </div>
            <h2 className="mt-3 text-[26px] leading-[1.2] font-medium text-ink-900 sm:text-[36px]">
              Free.
              <br className="hidden sm:block" /> All of it.
            </h2>
          </div>

          <div className="rounded-card border border-ink-100 bg-white p-6 sm:p-8">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[44px] leading-none font-medium text-ink-900">₹0</span>
              <span className="text-[15px] leading-none text-ink-600">forever</span>
            </div>
            <ul className="mt-5 flex flex-col gap-2.5">
              {FREE_INCLUDES.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-[1.6] text-ink-800">
                  <span aria-hidden className="text-brand-700">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/learn"
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-brand-700 px-6 text-[15px] font-medium text-white hover:bg-brand-800 sm:w-auto sm:self-start"
            >
              Start free
            </Link>
            {/* The caveat sits with the claim, which is the only thing that
                makes "forever" honest. Do not separate them. */}
            <p className="mt-3 text-[13px] leading-[1.6] text-ink-500">
              If that ever changes, this page changes first.
            </p>
          </div>
        </div>
      </section>

      {/* ── here is one day ─────────────────────────────────────────────── */}
      <section
        id="one-day"
        className="jreveal mx-auto max-w-[1280px] scroll-mt-24 border-t border-ink-100 px-5 py-16 sm:px-12 sm:py-24"
      >
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Inside a day
        </div>
        <h2 className="mt-3 text-[26px] leading-[1.25] font-medium text-ink-900 sm:text-[32px]">
          Here is one day.
        </h2>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="rounded-card border border-ink-100 bg-white p-5 sm:p-7 lg:w-[600px] lg:flex-none">
            <div className="font-mono text-[12px] leading-[1.5] text-ink-500">
              Day 45 of 91 · Window functions
            </div>
            <div className="mt-2 text-[22px] leading-[1.3] font-medium text-ink-900">Frames</div>
            <p className="mt-3 text-[16px] leading-[1.65] text-pretty text-ink-600 italic">
              If you cannot say what one row means, you cannot analyse the table.
            </p>
            <div className="mt-5 rounded-lg border border-ink-100 p-3.5">
              <div className="text-[14px] leading-[1.4] font-medium text-ink-900">
                RANGE vs ROWS in window frames
              </div>
              <p className="mt-1.5 text-[13px] leading-[1.6] text-brand-700 italic">
                Why this one — read the first example twice.
              </p>
            </div>
          </div>

          <ul className="flex max-w-[420px] flex-1 flex-col gap-6 lg:pt-4">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-3.5">
                <span aria-hidden className="mt-[11px] h-px w-6 flex-none bg-ink-200" />
                <span className="text-[15px] leading-[1.6] text-pretty text-ink-600">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── the bento ───────────────────────────────────────────────────── */}
      <section className="jreveal mx-auto max-w-[1280px] px-5 pb-16 sm:px-12 sm:pb-24">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Platform
        </div>
        <h2 className="mt-3 text-[26px] leading-[1.25] font-medium text-ink-900 sm:text-[32px]">
          Built so
          <br className="hidden sm:block" /> you finish.
        </h2>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.65] text-pretty text-ink-600">
          The habit matters more than any single feature.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">
              Sequenced, not searched
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Twenty modules in one order, not a search results page you have to sequence yourself.
            </p>
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">
              Checked by a person
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Every link comes with a note on why it, and not another.
            </p>
            <div className="mt-4 rounded-lg border border-ink-100 p-3">
              <div className="text-[13.5px] leading-[1.4] text-ink-900">
                RANGE vs ROWS in window frames
              </div>
              <p className="mt-1 text-[12.5px] leading-[1.55] text-brand-700 italic">
                Why this one — read it twice.
              </p>
            </div>
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">The streak</h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Miss a day and it resets. Your total never does.
            </p>
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">Yours to keep</h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Every highlight and note, exportable anytime.
            </p>
            <blockquote className="mt-4 border-l-2 border-ink-200 pl-3 text-[13.5px] leading-[1.65] text-pretty text-ink-600 italic">
              A null can mean missing, unknown, or not-applicable — treating them the same silently
              changes every average.
            </blockquote>
            <Link
              href="/profile"
              className="mt-4 inline-flex min-h-11 items-center text-[13.5px] font-medium text-brand-700"
            >
              Download everything
            </Link>
          </div>
        </div>
      </section>

      {/* ── ninety-one squares ──────────────────────────────────────────── */}
      <section className="jreveal border-y border-ink-100 bg-white px-5 py-16 sm:px-12 sm:py-24">
        <h2 className="text-center text-[22px] leading-[1.3] font-medium text-pretty text-ink-900 sm:text-[28px]">
          Ninety-one days. Every one of them written.
        </h2>
        <div
          role="img"
          aria-label="Ninety-one days, drawn as a grid of squares"
          className="jgrid91 mx-auto mt-8 grid max-w-[720px] grid-cols-[repeat(13,1fr)] gap-1.5"
        >
          {Array.from({ length: 91 }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="aspect-square rounded-[3px] bg-brand-500"
              // Staggered so the grid fills as a sweep rather than all at
              // once — which is what makes ninety-one read as a lot.
              style={{ transitionDelay: `${i * 9}ms` }}
            />
          ))}
        </div>
      </section>

      {/* ── the close ───────────────────────────────────────────────────── */}
      <section className="jreveal mx-auto flex max-w-[1280px] flex-col items-center px-5 py-16 text-center sm:px-12 sm:py-24">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Ready when you are
        </div>
        <h2 className="mt-3 text-[28px] leading-[1.2] font-medium text-ink-900 sm:text-[40px]">
          Your first day is waiting.
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-ink-600 sm:text-[18px]">
          Ninety-one days. Start with one.
        </p>
        <div className="mt-7 flex w-full flex-col items-center gap-3">
          <SearchBar id="cta-search" />
          <Link
            href="/learn"
            className="flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-7 text-[15px] font-medium text-white hover:bg-brand-800"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* ── footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-100 bg-white px-5 py-12 sm:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="text-[28px] leading-none font-medium tracking-[-0.02em] text-ink-900">
            jintu
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-16">
            {[
              {
                head: "Product",
                links: [
                  ["Roadmaps", "/learn"],
                  ["How it works", "/#how-it-works"],
                  ["Free", "/pricing"],
                ],
              },
              {
                head: "Company",
                links: [
                  ["Contact", "/contact"],
                  ["hello@jintu.in", "mailto:hello@jintu.in"],
                ],
              },
              {
                head: "Legal",
                links: [
                  ["Privacy", "/privacy"],
                  ["Terms", "/terms"],
                  ["Refunds", "/refunds"],
                ],
              },
            ].map((col) => (
              <div key={col.head}>
                <div className="font-mono text-[11px] leading-none tracking-[.08em] text-ink-500 uppercase">
                  {col.head}
                </div>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      {href!.startsWith("mailto:") ? (
                        <a href={href} className="text-[13.5px] text-brand-700 hover:text-brand-800">
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={href as Route}
                          className="text-[13.5px] text-brand-700 hover:text-brand-800"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1280px] border-t border-ink-100 pt-6 font-mono text-[12.5px] leading-none text-ink-500">
          Made in India
        </div>
      </footer>
    </div>
  );
}
