import Link from "next/link";
import type { Route } from "next";
import { HomepageEffects } from "@/components/marketing/homepage-effects";
import {
  CategoryCap,
  ContribGrid,
  DayCardMini,
  LinkCardMini,
  ModuleSpine,
  StreakStrip,
} from "@/components/marketing/product-miniatures";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

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
  category: "data" | "software" | "marketing" | "judgement";
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
  /**
   * A few real curated links, each carrying the note a person wrote. Used
   * wherever the page would otherwise be claiming that such notes exist.
   */
  samples: {
    title: string;
    sourceName: string;
    type: string;
    minutes: number | null;
    editorNote: string | null;
  }[];
  /** The flagship roadmap's modules, in order, for the spine. */
  spine: { position: number; title: string; weekRange: string | null }[];
  /**
   * Category chips above the roadmap cards. Four of them, ever — they used
   * to be subject_tags[0], which put "java" and "thinking" side by side as
   * though they were the same kind of thing, and would have grown a chip per
   * import.
   */
  subjects: { key: string; label: string }[];
  signedIn: boolean;
  initials?: string | null;
  displayName?: string | null;
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
  /** Omitted by the price, which is its own symbol already. */
  glyph?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white px-4 py-2 font-mono text-[12px] leading-none whitespace-nowrap text-ink-900 ${className ?? ""}`}
    >
      {glyph ? <span aria-hidden>{glyph}</span> : null}
      {children}
    </span>
  );
}

/**
 * The four steps, each with the component it is describing.
 *
 * The copy is unchanged. What changed is that "45–90 min, it remembers where
 * you stopped" now sits beside a day card with a length on it and a bar part
 * of the way along, so the sentence has its evidence next to it rather than
 * asking to be believed.
 */
/**
 * Where each stat pill lands at xl, in the order the list below declares.
 * Hand-placed: the corners of a hero are not positions a rule derives, and
 * the fifth had to go somewhere that clears both the nav and the day card.
 */
const STAT_PINS = [
  "top-[210px] left-[64px] opacity-95",
  "top-[152px] right-[148px] opacity-95",
  "top-[288px] right-[76px] opacity-90",
  "bottom-[220px] left-[104px] opacity-90",
  "right-[64px] bottom-[260px] opacity-95",
] as const;

const STEPS = [
  ["01", "Pick a roadmap", "Read the whole thing before you sign up."],
  ["02", "Do one day", "45–90 min. It remembers where you stopped."],
  ["03", "Keep the streak", "Miss a day and it resets. Your total never does."],
  ["04", "Show what you did", "A public profile, counted not self-reported."],
] as const;

/**
 * The day-page annotations, and where each connector meets the card.
 *
 * `top` is a hand-set offset in pixels, tuned against the rendered card at
 * lg. The alternative is measuring the DOM on every resize to draw four
 * hairlines, which is a scroll-jank generator in aid of decoration — and it
 * is decoration: the notes read correctly stacked, and below lg they are.
 */
/**
 * The limits, stated. "We do not promise you a job" is a NEGATION of an
 * outcome claim, which is the opposite of the thing rule 4 forbids and the
 * only honest thing to say next to a career-shaped product.
 *
 * The last line carries the free claim. It used to sit under a ₹0 in a
 * section of its own; it says more here, next to two other things we will
 * not do, than it did as the caption of its own act.
 */
const NOT: { line: string; href?: Route; linkText?: string }[] = [
  { line: "We do not promise you a job." },
  { line: "We do not host anyone's content — every link goes to the person who wrote it." },
  {
    line: "Everything is free, and if that ever changes this page changes first.",
    href: "/pricing" as Route,
    linkText: "What that means →",
  },
];

const ANNOTATIONS = [
  { top: 4, note: "Every day states its length before you open it" },
  { top: 26, note: "One principle, before any of the links" },
  { top: 40, note: "Links go to the original author, never a copy" },
  { top: 18, note: "A note on why this source and not another" },
] as const;

export default function Homepage({
  roadmaps,
  counts,
  sources,
  samples,
  spine,
  subjects,
  signedIn,
  initials = null,
  displayName = null,
}: HomepageProps) {
  /**
   * The five facts. Every number is derived — the design asked for "500+
   * links checked" and there are 228 — and ₹0 is here rather than in a
   * section of its own, where being the only claim on screen made it look
   * like something that needed arguing for.
   */
  const stats = [
    { glyph: "⚡", text: `${counts.roadmaps} roadmaps` },
    { text: "₹0 forever" },
    { glyph: "▦", text: `${counts.days} days written` },
    { glyph: "◷", text: `~${counts.hours} hours` },
    { glyph: "✓", text: `${counts.links} links checked` },
  ].map((s, i) => ({ ...s, pin: STAT_PINS[i]! }));

  return (
    <div className="jhome bg-ink-50">
      <HomepageEffects />

      {/* The one site header, in its over-the-hero variant. Every other
          screen gets the same component with variant="solid". */}
      <SiteNav variant="overlay" signedIn={signedIn} initials={initials} displayName={displayName} />

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

        {/* The five facts, from one list rendered twice: a wrapped row
            everywhere, and the same five pinned to the corners at xl, where
            there is genuinely space beside the headline. Absolute
            positioning at smaller widths is what was colliding with the nav
            and the card. One source, so the two can never disagree — and
            the pinned copy is aria-hidden, so the facts are announced once.

            ₹0 forever is the fifth. It was a whole section, which is the
            shape of a page with tiers to compare; as a number among four
            other true numbers it makes the same claim without staging it. */}
        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-2.5 xl:hidden">
          {stats.map((s) => (
            <StatPill key={s.text} glyph={s.glyph}>
              {s.text}
            </StatPill>
          ))}
        </div>
        <div aria-hidden className="hidden xl:block">
          {stats.map((s) => (
            <StatPill key={s.text} glyph={s.glyph} className={`absolute ${s.pin}`}>
              {s.text}
            </StatPill>
          ))}
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
              not have, and a screenshot of somebody else's page is their
              content on our server, which is the one line this product does
              not cross. What CAN be shown is our own rendering of their
              link: three real cards below, exactly as a day page draws them.
              The names are derived from what we actually link to, so the
              wall cannot outlive the curation it describes. */}
          <ul className="mx-auto mt-6 flex max-w-[1000px] list-none flex-wrap items-center justify-center gap-x-8 gap-y-4 p-0">
            {sources.map((s) => (
              <li
                key={s}
                className="jwordmark text-[14px] leading-none font-medium text-ink-900 sm:text-[17px]"
              >
                {s}
              </li>
            ))}
          </ul>

          {samples.length ? (
            <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-3">
              {samples.slice(2).map((r) => (
                <LinkCardMini key={r.title} resource={r} />
              ))}
            </div>
          ) : null}
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
                key={s.key}
                href={`/learn?c=${s.key}` as Route}
                className="flex min-h-10 items-center rounded-full border border-ink-100 bg-white px-4 text-[13.5px] text-ink-900 hover:border-brand-700"
              >
                {s.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {roadmaps.map((r) => (
            <Link
              key={r.slug}
              href={`/learn/${r.slug}`}
              className="jcard-hover flex gap-4 rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6"
            >
              {/* The colour cap the catalogue cards wear, so a roadmap looks
                  like itself on both surfaces. */}
              <CategoryCap category={r.category} className="min-h-[108px] w-12 flex-none self-stretch" />
              <div className="min-w-0 flex-1">
              <div className="font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                {r.kicker}
              </div>
              <div className="mt-2.5 text-[18px] leading-[1.35] font-medium text-ink-900">
                {r.title}
              </div>
              {/* Two lines. The summaries run to forty words and the cards are a
                  grid, so one long one used to set the height of its whole
                  row. The full text is on the roadmap page. */}
              <p className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-pretty text-ink-600">
                {r.summary}
              </p>
              <div className="mt-4 border-t border-ink-100 pt-3 font-mono text-[12.5px] leading-[1.5] text-ink-500">
                {r.sizeLine}
              </div>
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

        {/* The four notes used to be a plain list beside the card, so you
            read a sentence and then went hunting for what it referred to.
            They are anchored now — a hairline runs from each note to the row
            it is about at lg, and below that they sit under the card. */}
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-0">
          <div className="relative rounded-card border border-ink-100 bg-white p-5 sm:p-7 lg:w-[560px] lg:flex-none">
            <div className="font-mono text-[12px] leading-[1.5] text-ink-500">
              Day 45 of 91 · Window functions
            </div>
            <div className="mt-2 text-[22px] leading-[1.3] font-medium text-ink-900">Frames</div>
            <p className="mt-3 text-[16px] leading-[1.65] text-pretty text-ink-600 italic">
              If you cannot say what one row means, you cannot analyse the table.
            </p>
            {samples[0] ? (
              <div className="mt-5">
                <LinkCardMini resource={samples[0]} />
              </div>
            ) : null}

            {/* Below lg the notes follow the card inline; the connectors only
                exist where there is a column to run them to. */}
            <ul className="mt-6 flex list-none flex-col gap-3 p-0 lg:hidden">
              {ANNOTATIONS.map((a) => (
                <li key={a.note} className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-600">
                  <span aria-hidden className="mt-2 h-px w-4 flex-none bg-brand-500" />
                  {a.note}
                </li>
              ))}
            </ul>
          </div>

          <ul className="hidden list-none flex-1 flex-col p-0 lg:flex">
            {ANNOTATIONS.map((a) => (
              <li
                key={a.note}
                className="flex items-start text-[14px] leading-[1.55] text-pretty text-ink-600"
                style={{ marginTop: a.top }}
              >
                {/* The line is the connection. Without it these are just a
                    second list of claims, which is what they were. */}
                <span aria-hidden className="mt-[10px] h-px w-14 flex-none bg-brand-500" />
                <span className="pl-3.5">{a.note}</span>
              </li>
            ))}
          </ul>
        </div>
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

          {/* list-none explicitly: preflight already resets ol, but the mono "01"
              IS the marker here, and a stylesheet change that dropped preflight
              would put a second number in front of every one of them. */}
          <ol className="mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([n, head, body], i) => (
              <li key={n} className="border-t border-ink-200 pt-4">
                <div className="font-mono text-[12px] leading-none text-brand-700">{n}</div>
                <h3 className="mt-3 text-[16px] leading-[1.35] font-medium text-ink-900">{head}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-pretty text-ink-600">{body}</p>
                {/* 96px of the real thing, under the words for it. */}
                <div className="mt-4 h-24">
                  {i === 0 ? <ModuleSpine modules={spine} mini className="h-24" /> : null}
                  {i === 1 ? <DayCardMini className="h-24" /> : null}
                  {i === 2 ? <StreakStrip mini className="h-24" /> : null}
                  {i === 3 ? <ContribGrid className="h-24" /> : null}
                </div>
              </li>
            ))}
          </ol>
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
            {/* The sentence that used to be here said "twenty modules in one
                order, not a search results page". These ARE the twenty
                modules, in order, read from the roadmap. */}
            <ModuleSpine modules={spine} className="mt-4" />
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">
              Checked by a person
            </h3>
            {/* One real curated link, rendered the way the day page renders
                it. The note in teal is a person's own sentence out of the
                database — the claim and its evidence are the same object. */}
            {samples[1] ? (
              <LinkCardMini resource={samples[1]} className="mt-4" />
            ) : (
              <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
                Every link comes with a note on why it, and not another.
              </p>
            )}
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">The streak</h3>
            {/* The gap in the middle is the claim. A strip with no missed day
                would be illustrating something nobody said. */}
            <StreakStrip className="mt-4" />
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-5 hover:border-brand-700 sm:p-6">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">Yours to keep</h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Every highlight and note, exportable anytime.
            </p>
            <blockquote className="mt-4 border-l-2 border-brand-500 pl-3.5">
              <p className="m-0 text-[13.5px] leading-[1.65] text-pretty text-ink-900 italic">
                A null can mean missing, unknown, or not-applicable — treating them the same
                silently changes every average.
              </p>
              {/* A highlight without its source day is a quotation with no
                  citation, which is the opposite of "yours to keep". */}
              <cite className="mt-2 block font-mono text-[11px] leading-none text-ink-500 not-italic">
                Day 31 · Cleaning and missing values
              </cite>
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

      {/* ── what this is not ────────────────────────────────────────────── */}
      {/* The three things worth saying plainly, in the place a sceptical
          reader is already looking for them. The free claim used to have a
          whole section to itself — which is the shape of a page with tiers
          to compare, and this one has neither tiers nor anything to buy. A
          product that keeps staging its own freeness invites the suspicion
          it is trying to allay; stated once among two other limits, it
          reads as a fact rather than a pitch. */}
      <section className="jreveal mx-auto max-w-[1280px] px-5 py-16 sm:px-12 sm:py-24">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          What this is not
        </div>
        <ul className="mt-6 flex max-w-[46ch] list-none flex-col gap-5 p-0">
          {NOT.map((n) => (
            <li key={n.line} className="flex gap-3.5">
              <span aria-hidden className="mt-[13px] h-px w-5 flex-none bg-ink-200" />
              <span className="text-[18px] leading-[1.5] text-pretty text-ink-900 sm:text-[20px]">
                {n.line}
                {n.href ? (
                  <>
                    {" "}
                    <Link href={n.href} className="text-brand-700 underline-offset-4 hover:underline">
                      {n.linkText}
                    </Link>
                  </>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── the close ───────────────────────────────────────────────────── */}
      {/* The cards behind the copy are cropped by the section, which is what
          makes them read as a stack continuing past the edge rather than as
          four more things to look at. Hidden below lg: at 390px there is no
          margin to crop into, and they would sit under the search field. */}
      <section className="jreveal relative mx-auto flex max-w-[1280px] flex-col items-center overflow-hidden px-5 py-16 text-center sm:px-12 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute top-10 -left-16 w-[300px] rotate-[-7deg] rounded-card border border-ink-100 bg-white p-4 opacity-70">
            <DayCardMini className="h-24" />
          </div>
          <div className="absolute -right-20 bottom-16 w-[320px] rotate-[6deg] rounded-card border border-ink-100 bg-white p-4 opacity-70">
            <StreakStrip />
          </div>
          <div className="absolute -bottom-14 left-24 w-[260px] rotate-[3deg] rounded-card border border-ink-100 bg-white p-4 opacity-60">
            <ContribGrid className="h-20" />
          </div>
          {/* Fades them out under the copy, so the words stay the thing you
              read first. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-ink-50)_38%,transparent_72%)]" />
        </div>
        <div className="relative z-10 font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Ready when you are
        </div>
        <h2 className="relative z-10 mt-3 text-[28px] leading-[1.2] font-medium text-ink-900 sm:text-[40px]">
          Your first day is waiting.
        </h2>
        <p className="relative z-10 mt-3 text-[16px] leading-[1.6] text-ink-600 sm:text-[18px]">
          Ninety-one days. Start with one.
        </p>
        <div className="relative z-10 mt-7 flex w-full flex-col items-center gap-3">
          <SearchBar id="cta-search" />
          <Link
            href="/learn"
            className="flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-7 text-[15px] font-medium text-white hover:bg-brand-800"
          >
            Start free
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
