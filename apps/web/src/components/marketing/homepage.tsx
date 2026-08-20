import Link from "next/link";
import type { Route } from "next";
import { HomepageEffects } from "@/components/marketing/homepage-effects";

/**
 * The marketing homepage — v2, from the design project.
 *
 * A teal hero the page falls out of, a wall of the sources the material
 * actually comes from, one day shown in full, a bento of the four things
 * that make it work, ninety-one squares, and a close. Every effect is
 * scoped under `.jhome` in globals.css: none of it can reach a roadmap or
 * a day, which is the whole trade. A reading surface that shimmers is one
 * people leave.
 *
 * THE NUMBERS ARE DERIVED, NOT WRITTEN. The design's pills say "~340 hours"
 * and "500+ links checked". There are 890 hours across the four roadmaps —
 * 340 is the data analyst alone — and 228 links, not 500. Both come from
 * the database now, so the page cannot drift from the product and nobody
 * has to remember to update it.
 *
 * The design carries no DCLogic; the observers live in homepage-effects.
 *
 * NOTE: v2 drops the four roadmap cards v1 had — its own section numbering
 * skips 3, 6 and 8, so they were cut upstream. The homepage no longer links
 * to individual roadmaps; /learn is one hop away from four places on the
 * page. Flagged rather than re-added, because inventing a section the
 * design removed is not conversion.
 */

export interface HomepageProps {
  counts: { roadmaps: number; days: number; hours: number; links: number };
  /** The places the material genuinely comes from, most-used first. */
  sources: string[];
  signedIn: boolean;
}

const SearchGlyph = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ArrowGlyph = () => (
  <svg aria-hidden width={14} height={14} viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** The search field is a link: /learn owns search, and a second box that
 *  behaved differently would be a lie about where you end up. */
function SearchLink({ label }: { label: string }) {
  return (
    <Link
      href="/learn"
      className="jsearch flex h-13 w-full max-w-[480px] items-center gap-2.5 rounded-full bg-white py-0 pr-2 pl-5"
    >
      <span className="text-ink-500">
        <SearchGlyph />
      </span>
      <span className="flex-1 text-left text-[15px] leading-none text-ink-500">{label}</span>
      <span className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-700 text-white">
        <ArrowGlyph />
      </span>
    </Link>
  );
}

/** One floating fact. White pill, ink text — never white-on-teal. */
function StatPill({ glyph, children, className }: { glyph: string; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`jpill inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3.5 py-2 font-mono text-[12px] leading-none text-ink-900 ${className ?? ""}`}
    >
      <span aria-hidden>{glyph}</span>
      {children}
    </span>
  );
}

const BULLETS = [
  "Every day states its length before you open it",
  "Links go to the original author, never a copy",
  "A note on why this source and not another",
  "One thing to make, then three questions to check yourself",
];

export default function Homepage({ counts, sources, signedIn }: HomepageProps) {
  return (
    <div className="jhome bg-ink-50">
      <HomepageEffects />

      {/* ── nav ─────────────────────────────────────────────────────────── */}
      <nav className="jnav fixed inset-x-0 top-0 z-50 flex h-[72px] items-center gap-7 px-5 sm:px-12">
        <Link href="/" className="text-[16px] leading-none font-medium text-white [.jscrolled_&]:text-brand-700">
          jintu
        </Link>
        <div className="hidden flex-1 items-center gap-7 sm:flex">
          <Link
            href="/learn"
            className="text-[14px] leading-none text-white/85 hover:text-white [.jscrolled_&]:text-ink-600 [.jscrolled_&]:hover:text-ink-900"
          >
            Roadmaps
          </Link>
          {/* Anchors the section that answers it — there is no separate page,
              and a nav item that 404s is worse than one that scrolls. */}
          <Link
            href={"/#one-day" as Route}
            className="text-[14px] leading-none text-white/85 hover:text-white [.jscrolled_&]:text-ink-600 [.jscrolled_&]:hover:text-ink-900"
          >
            How it works
          </Link>
          <Link
            href="/pricing"
            className="text-[14px] leading-none text-white/85 hover:text-white [.jscrolled_&]:text-ink-600 [.jscrolled_&]:hover:text-ink-900"
          >
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

      {/* ── hero ────────────────────────────────────────────────────────── */}
      {/* The gradient inserts a brand-700 stop the design does not have.
          Its own ramp reaches brand-500 by 55%, and white body copy sits in
          that band at 2.44:1 — unreadable. brand-700 is 5.32:1 and keeps
          the same dark-to-pale arc. */}
      <header className="relative -mt-[72px] flex flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#0f5566_0%,#17758a_42%,#43b4c8_72%,#f4fbfc_100%)] px-5 pb-0 sm:px-12">
        <div aria-hidden className="jglow1" />
        <div aria-hidden className="jglow2" />
        <div aria-hidden className="jgrain" />

        <div className="h-[72px] flex-none" />

        <div className="relative z-2 flex flex-col items-center gap-6 pt-12 text-center sm:gap-7 sm:pt-16">
          <span className="jpill rounded-full border border-white/30 bg-white/15 px-4.5 py-2 font-mono text-[12px] leading-none text-white sm:text-[13px]">
            Free · No account needed to read
          </span>

          <h1 className="text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-white sm:text-[72px] sm:leading-[1.02] sm:tracking-[-0.035em] lg:text-[88px]">
            Learn anything,
            <br />
            <span className="bg-gradient-to-r from-white to-brand-100 bg-clip-text text-transparent">
              properly.
            </span>
          </h1>

          <p className="max-w-[54ch] text-[16px] leading-[1.5] text-pretty text-white/85 sm:text-[20px]">
            Deep roadmaps built from the best free material on the internet. Every link opened by a
            person before it shipped.
          </p>

          <SearchLink label="What do you want to learn?" />
        </div>

        {/* The four facts, floating. Absolute on desktop where there is room
            around the headline; a plain wrap on mobile where there is not. */}
        <div className="relative z-2 mt-8 flex flex-wrap justify-center gap-2 lg:hidden">
          <StatPill glyph="⚡">{counts.roadmaps} roadmaps</StatPill>
          <StatPill glyph="▦">{counts.days} days written</StatPill>
          <StatPill glyph="◷">~{counts.hours} hours</StatPill>
          <StatPill glyph="✓">{counts.links} links checked</StatPill>
        </div>
        <div aria-hidden className="hidden lg:block">
          <StatPill glyph="⚡" className="absolute top-[230px] left-[60px]">
            {counts.roadmaps} roadmaps
          </StatPill>
          <StatPill glyph="▦" className="absolute top-[290px] right-[90px]">
            {counts.days} days written
          </StatPill>
          <StatPill glyph="◷" className="absolute top-[640px] left-[110px]">
            ~{counts.hours} hours
          </StatPill>
          <StatPill glyph="✓" className="absolute top-[600px] right-[60px]">
            {counts.links} links checked
          </StatPill>
        </div>

        {/* the day card, straddling the fold */}
        <div className="relative z-3 mt-12 w-full max-w-[620px] rounded-card border border-ink-100 bg-white p-5 sm:mt-24 sm:p-7">
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
                {/* Full contrast, italic, brand-700: this note is the proof a
                    person chose the link, and the one thing a crawler cannot
                    fake. It never dims. */}
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

        <div className="h-16 sm:h-24" />
      </header>

      {/* The nav flips to a solid surface once this scrolls out of view. */}
      <div aria-hidden data-nav-sentinel className="h-px" />

      {/* ── the sources ─────────────────────────────────────────────────── */}
      {sources.length ? (
        <section className="jreveal border-y border-ink-100 bg-white px-5 py-10 sm:px-12">
          <h2 className="text-center font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
            The material comes from
          </h2>
          {/* Names, never logos — a wordmark implies a relationship we do
              not have. Derived from the resources we actually link to, so
              the wall cannot outlive the curation. */}
          <ul className="mx-auto mt-6 flex max-w-[1000px] flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {sources.map((s) => (
              <li
                key={s}
                className="jwordmark text-[15px] leading-none font-medium text-ink-900 sm:text-[17px]"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── here is one day ─────────────────────────────────────────────── */}
      <section id="one-day" className="jreveal mx-auto max-w-[1280px] scroll-mt-24 px-5 py-16 sm:px-12 sm:py-28">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Inside a day
        </div>
        <h2 className="mt-3 text-[26px] leading-[1.25] font-medium text-ink-900 sm:text-[32px]">
          Here is one day.
        </h2>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="rounded-card border border-ink-100 bg-white p-6 sm:p-7 lg:w-[600px] lg:flex-none">
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
      <section className="jreveal mx-auto max-w-[1280px] px-5 pb-16 sm:px-12 sm:pb-28">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Platform
        </div>
        <h2 className="mt-3 text-[26px] leading-[1.25] font-medium text-ink-900 sm:text-[32px]">
          Built so
          <br />
          you finish.
        </h2>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.65] text-pretty text-ink-600">
          The habit matters more than any single feature.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-6 hover:border-brand-700">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">
              Sequenced, not searched
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Twenty modules in one order, not a search results page you have to sequence yourself.
            </p>
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-6 hover:border-brand-700">
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

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-6 hover:border-brand-700">
            <h3 className="text-[17px] leading-[1.35] font-medium text-ink-900">The streak</h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
              Miss a day and it resets. Your total never does.
            </p>
          </div>

          <div className="jcard-hover rounded-card border border-ink-100 bg-white p-6 hover:border-brand-700">
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
              className="aspect-square rounded-[3px] bg-check-machine"
              // Stagger by index: the grid fills as a sweep rather than all
              // at once, which is what makes ninety-one read as a lot.
              style={{ transitionDelay: `${i * 9}ms` }}
            />
          ))}
        </div>
      </section>

      {/* ── the close ───────────────────────────────────────────────────── */}
      <section className="jreveal mx-auto flex max-w-[1280px] flex-col items-center px-5 py-16 text-center sm:px-12 sm:py-28">
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
          <SearchLink label="What do you want to learn?" />
          <Link
            href="/learn"
            className="flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-7 text-[15px] font-medium text-white hover:bg-brand-800"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* ── what this is not ────────────────────────────────────────────── */}
      <section className="border-t border-ink-100 px-5 py-14 sm:px-12">
        <p className="mx-auto max-w-[66ch] text-[15px] leading-[1.75] text-pretty text-ink-600">
          Jintu does not promise you a job. We do not host anyone else&apos;s writing — we write our
          own explanations and link out for depth. Points and streaks are for consistency, not a
          credential.
        </p>
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
                  ["How it works", "/#one-day"],
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
