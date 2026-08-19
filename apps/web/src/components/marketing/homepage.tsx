import Link from "next/link";
import type { Route } from "next";
import { HomepageEffects } from "@/components/marketing/homepage-effects";

/**
 * The marketing homepage — the one lavish page.
 *
 * Glow, glass nav, gradient border and text, cursor spotlight, scroll
 * reveals: all here, none in the app. That is the whole trade. A reading
 * surface that shimmers is a reading surface people leave, so the effect
 * budget is spent once, on the page whose entire job is to be looked at.
 * Every animation is scoped under `.jhome` in globals.css and cannot reach
 * a roadmap or a day.
 *
 * Converted from the design project's "Marketing homepage"; the DCLogic is
 * ported in homepage-effects.tsx rather than reinvented.
 *
 * Numbers come from the database, not the design. The design's "500+
 * curated links" would have been the only unevidenced figure on the site —
 * there are 228 — and a marketing page that rounds up is the one that gets
 * quoted back at you.
 */

export interface HomepageRoadmap {
  slug: string;
  title: string;
  metaLine: string;
  summary: string;
  sizeLine: string;
}

export interface HomepageProps {
  roadmaps: HomepageRoadmap[];
  counts: { roadmaps: number; days: number; links: number };
  signedIn: boolean;
}

const BULLETS = [
  "Every day states its length before you open it",
  "Links go to the original author, never a copy",
  "A note on why this source and not another",
  "One thing to make, then three questions to check yourself",
];

const SearchGlyph = () => (
  <svg aria-hidden width={16} height={16} viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
    <path d="m12 12 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function Homepage({ roadmaps, counts, signedIn }: HomepageProps) {
  // The marquee needs its list twice: the keyframe translates -50%, so the
  // second copy is what makes the loop seamless. aria-hidden on the whole
  // strip — it is the roadmap names, already listed below as real links.
  const marquee = roadmaps.length
    ? roadmaps.map((r) => r.title.toUpperCase())
    : ["DATA ANALYST", "RETAIL MEDIA", "JAVA & SPRING BOOT", "DECISION MAKING"];

  return (
    <div className="jhome relative overflow-hidden bg-ink-50">
      <HomepageEffects />

      {/* ambient glow — two drifting washes, paused until in view */}
      <div aria-hidden className="jloop pointer-events-none absolute inset-0">
        <div className="jglow1 absolute -top-[120px] -left-[100px] size-[600px] rounded-full bg-[radial-gradient(circle,#43b4c855,transparent_70%)] blur-[60px]" />
        <div className="jglow2 absolute -top-[80px] -right-[140px] size-[560px] rounded-full bg-[radial-gradient(circle,#17758a40,transparent_70%)] blur-[60px]" />
      </div>

      {/* ── nav ─────────────────────────────────────────────────────────── */}
      <nav className="relative flex h-16 items-center px-5 backdrop-blur-md sm:px-10">
        <Link href="/" className="text-[17px] leading-none font-medium text-brand-700">
          jintu
        </Link>
        <div className="flex-1" />
        <Link href="/learn" className="mr-6 text-[14px] leading-none text-ink-900">
          Roadmaps
        </Link>
        <Link href="/learn" aria-label="Search roadmaps" className="mr-6 text-ink-900">
          <SearchGlyph />
        </Link>
        <Link
          href={(signedIn ? "/dashboard" : "/join") as Route}
          className="text-[14px] leading-none font-medium text-brand-700"
        >
          {signedIn ? "Dashboard" : "Sign in"}
        </Link>
      </nav>

      {/* ── hero ────────────────────────────────────────────────────────── */}
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-5 pt-12 sm:px-10 lg:flex-row lg:gap-20 lg:pt-24">
        <div className="w-full lg:w-[600px] lg:flex-none">
          <h1 className="m-0 text-[32px] leading-[1.15] font-medium tracking-[-0.02em] text-ink-900 sm:text-[64px] sm:leading-[1.1] sm:tracking-[-0.03em]">
            Learn anything, <span className="jgrad-text">properly.</span>
          </h1>
          <p className="mt-3.5 max-w-[52ch] text-[16px] leading-[1.6] text-pretty text-ink-600 sm:mt-5 sm:text-[19px]">
            Deep, free roadmaps. Every link opened by a person before it ships to you.
          </p>

          {/* A link dressed as a field: the catalogue owns search, and a
              second search box that behaves differently would be a lie. */}
          <Link
            href="/learn"
            className="relative mt-5 flex min-h-12 max-w-[460px] items-center rounded-lg border border-ink-100 bg-white pr-4 pl-[42px] text-[15px] text-ink-500 hover:border-brand-700 sm:mt-7"
          >
            <span className="absolute left-4 text-ink-500">
              <SearchGlyph />
            </span>
            What do you want to learn?
          </Link>

          <div className="mt-3 flex flex-wrap gap-2">
            {roadmaps.slice(0, 1).map((r) => (
              <Link
                key={r.slug}
                href={`/learn/${r.slug}`}
                className="flex min-h-10 items-center rounded-lg border border-ink-100 bg-white px-3.5 text-[13.5px] text-ink-900 hover:border-brand-700"
              >
                {r.title}
              </Link>
            ))}
            <Link
              href="/learn"
              className="flex min-h-10 items-center rounded-lg border border-ink-100 bg-white px-3.5 text-[13.5px] text-ink-900 hover:border-brand-700"
            >
              Something else
            </Link>
          </div>
        </div>

        {/* the day card, tilted */}
        <div className="flex w-full items-center justify-center lg:h-[480px] lg:w-[520px] lg:flex-none">
          <div className="jgrad-border w-full max-w-[400px] rotate-2 bg-white p-[22px]">
            <div className="font-mono text-[12px] leading-[1.5] text-ink-500">
              Day 45 of 91 · 60 min · 35 pts
            </div>
            <div className="mt-2 text-[19px] leading-[1.3] font-medium text-ink-900">Frames</div>
            <div className="mt-4 h-[3px] rounded-[2px] bg-ink-100">
              <div className="h-[3px] w-[47%] rounded-[2px] bg-check-machine" />
            </div>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="flex size-[18px] items-center justify-center rounded-full bg-check-machine text-white">
                <svg aria-hidden width={10} height={10} viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2 4.8 8.5 9.5 3.8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[14px] leading-[1.4] text-ink-900">ROWS against RANGE</span>
            </div>
            <div aria-hidden className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="aspect-square rounded-[4px] bg-check-machine" />
              ))}
              <span className="aspect-square rounded-[4px] border-[1.5px] border-brand-700 bg-brand-50" />
            </div>
          </div>
        </div>
      </div>

      {/* ── marquee ─────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="jloop relative mt-20 overflow-hidden border-y border-ink-100 py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] sm:mt-36"
      >
        <div className="jmarquee-track flex w-max gap-[60px]">
          {[...marquee, ...marquee].map((name, i) => (
            <span key={i} className="font-mono text-[15px] leading-none whitespace-nowrap text-ink-500">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── here is one day ─────────────────────────────────────────────── */}
      <section className="jreveal relative mx-auto max-w-[1280px] px-5 pt-20 sm:px-10 sm:pt-36">
        <h2 className="mb-10 text-[24px] leading-[1.3] font-medium text-ink-900 sm:text-[28px]">
          Here is one day.
        </h2>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-[60px]">
          <div className="rounded-card border border-ink-100 bg-white p-7 lg:w-[640px] lg:flex-none">
            <div className="font-mono text-[12px] leading-[1.5] text-ink-500">
              Day 45 of 91 · 60 min · 35 pts
            </div>
            <div className="mt-2.5 text-[22px] leading-[1.3] font-medium text-ink-900">Frames</div>
            <p className="mt-3 text-[16px] leading-[1.65] text-pretty text-ink-600 italic">
              A window function needs two answers before it can compute anything: which rows are in
              view, and in what order.
            </p>
          </div>
          <ul className="flex max-w-[380px] flex-1 flex-col gap-7 pt-3">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-3.5">
                <span aria-hidden className="mt-[11px] h-px w-6 flex-none bg-ink-100" />
                <span className="text-[15px] leading-[1.55] text-pretty text-ink-600">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── the roadmaps, as real links ─────────────────────────────────── */}
      <section className="jreveal relative mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-5 pt-20 sm:px-10 sm:pt-36 lg:grid-cols-2">
        {roadmaps.map((r) => (
          <Link key={r.slug} href={`/learn/${r.slug}`} className="jgrad-border jspot bg-white p-[22px]">
            <div className="text-[18px] leading-[1.35] font-medium text-ink-900">{r.title}</div>
            <div className="mt-1.5 font-mono text-[12.5px] leading-[1.5] text-ink-500">
              {r.metaLine}
            </div>
            <p className="mt-2.5 text-[14px] leading-[1.55] text-pretty text-ink-600">{r.summary}</p>
            <div className="mt-3.5 border-t border-ink-100 pt-3 font-mono text-[12.5px] leading-[1.5] text-ink-500">
              {r.sizeLine}
            </div>
          </Link>
        ))}
      </section>

      {/* ── the streak, and the honest sentence about it ────────────────── */}
      <section className="jreveal relative mx-auto max-w-[1280px] px-5 pt-20 text-center sm:px-10 sm:pt-36">
        <div
          role="img"
          aria-label="A fourteen-day streak with two days missed"
          className="mx-auto grid max-w-[700px] grid-cols-14 gap-1.5 sm:gap-2.5"
        >
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className={
                i < 2
                  ? "aspect-square rounded-lg border border-ink-100 bg-ink-50"
                  : "aspect-square rounded-lg bg-check-machine"
              }
            />
          ))}
        </div>
        <p className="mx-auto mt-7 max-w-[44ch] text-[17px] leading-[1.6] text-pretty text-ink-600">
          Miss a day and the streak resets. Your total never does.
        </p>
      </section>

      {/* ── the numbers, all four computed ──────────────────────────────── */}
      <section className="jreveal relative mt-20 bg-brand-50 py-11 sm:mt-36">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-5 sm:px-10 lg:grid-cols-4">
          {[
            [String(counts.roadmaps), "roadmaps"],
            [String(counts.days), "days written"],
            [String(counts.links), "curated links"],
            ["₹0", "free today"],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="font-mono text-[36px] leading-none font-medium text-ink-900 sm:text-[48px]">
                {value}
              </div>
              <div className="mt-2 text-[13px] leading-[1.4] text-brand-900">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── what this is not ────────────────────────────────────────────── */}
      <section className="relative px-5 py-20 sm:px-10 sm:py-36">
        <p className="mx-auto max-w-[66ch] text-[16px] leading-[1.75] text-pretty text-ink-600">
          Jintu does not promise you a job. We do not host anyone else&apos;s writing without a
          licence — we write our own explanations and link out for depth. Points and streaks are for
          consistency and for showing your work, not a credential.
        </p>
      </section>

      {/* ── footer ──────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-ink-100 px-5 pt-14 pb-10 sm:px-10">
        <div className="text-[48px] leading-none font-medium tracking-[-0.03em] text-ink-900 opacity-90 sm:text-[64px]">
          jintu
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-5">
            <Link href="/privacy" className="text-[13px] leading-none text-brand-700">
              Privacy
            </Link>
            <Link href="/terms" className="text-[13px] leading-none text-brand-700">
              Terms
            </Link>
            <Link href="/contact" className="text-[13px] leading-none text-brand-700">
              Contact
            </Link>
          </div>
          <div className="font-mono text-[13px] leading-none text-ink-500">Made in India</div>
        </div>
      </footer>
    </div>
  );
}
