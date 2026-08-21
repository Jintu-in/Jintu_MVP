"use client";

import { useMemo, useState } from "react";
import { Eyebrow } from "@/components/ui/patterns";
import { cn } from "@/lib/utils";

/**
 * The catalogue (/learn), converted from docs/design: Catalogue,
 * Catalogue body, Catalogue header, Catalogue filter states. One
 * responsive tree — mobile is the chip row + Filters button + single
 * column; lg adds the 220px filter rail and the two-column grid and
 * hides the chips.
 *
 * Copy is the design's, verbatim. Zero-count facets are removed, never
 * greyed or shown as "0" (the design's stated rule). No-results turns
 * the small catalogue into a request instead of a dead end — the
 * request form renders only when the route passes an action for it; a
 * dead Send button would be worse than a missing one.
 *
 * Extrapolations, flagged not hidden: subjects are a multi-select set
 * (the desktop rail shows checkboxes; the mobile active-chip state
 * generalises to several); the signed-in header swaps "Sign in" for
 * "Dashboard" (the design only draws the signed-out header).
 */

export interface CatalogueCard {
  slug: string;
  href: string;
  title: string;
  /** e.g. "intermediate · ~13 weeks" — rendered mono. */
  metaLine: string;
  summary: string;
  /** Facet keys. */
  subject: string;
  level: string;
  weeks: number | null;
  /** Bottom line when not started, e.g. "11 modules · 27 nodes · ~150 hours". */
  footLine: string;
  /** In-progress state: green bar + "45 of 91 days · ~180 hours left". */
  progress?: { pct: number; line: string };
  /** Finished state: tick + "Finished 3 April 2026 · 98 days". */
  finished?: { line: string };
}

export interface CataloguePageProps {
  cards: CatalogueCard[];
  /** Prefill from ?q= so shared search links keep working. */
  initialQuery?: string;
  /**
   * Server action for the no-results "what should we build next?" form.
   * Omitted → the form is not rendered (no backend, no dead button).
   */
  requestAction?: (formData: FormData) => Promise<void>;
}

const TIME_BUCKETS = [
  { id: "short", label: "Under 12 weeks", test: (w: number | null) => w !== null && w < 12 },
  { id: "long", label: "12 weeks or more", test: (w: number | null) => w !== null && w >= 12 },
] as const;

const SearchIcon = ({ active }: { active?: boolean }) => (
  <svg
    aria-hidden
    width={16}
    height={16}
    viewBox="0 0 18 18"
    fill="none"
    className={cn(
      "pointer-events-none absolute top-4 left-4",
      active ? "text-brand-700" : "text-ink-500",
    )}
  >
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
    <path d="m12 12 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);


/**
 * The accent ramp for card headers, and the glyph that rides in each.
 *
 * Straight from the design: brand-700 → 600 → 400 → 300, cycled by
 * position. All four are large flat fills, which is the one thing the
 * pale end of the ramp is allowed to be.
 *
 * The icon flips to ink on the two pale accents — the design does this
 * itself on #74CFDE, which tells you the ramp was known to be too light
 * for white at the bottom end.
 */
const ACCENTS = [
  { bg: "bg-brand-700", dark: true },
  { bg: "bg-brand-600", dark: true },
  { bg: "bg-brand-400", dark: false },
  { bg: "bg-brand-300", dark: false },
] as const;

const CARD_GLYPHS = [
  "M4 20V12M10 20V6M16 20V14M22 20V9",
  "M8 6 3 12l5 6M16 6l5 6-5 6",
  "M3 10v4h3l6 4V6L6 10Z",
  "M15 9l-2 6-6 2 2-6Z",
] as const;

/**
 * One roadmap card.
 *
 * A 96px colour block carrying the subject/level badges and a big quiet
 * glyph, then the body: title, two lines of summary, the mono size line,
 * a hairline, and the filled Start pill. 20px radius, no border — the
 * colour block is what separates it from the page.
 *
 * ONE DEVIATION, deliberate: the design's badges are white text on
 * rgba(255,255,255,.2) over the accent. That is 2.3:1 on brand-600 and
 * 1.8:1 on brand-300 — unreadable at 9.5px on three of the four cards.
 * They are a near-solid white chip with ink text instead, which keeps
 * "a light chip on colour" and is legible on every accent.
 */
function RoadmapCard({ card: c, accent }: { card: CatalogueCard; accent: number }) {
  const a = ACCENTS[accent]!;
  const glyph = CARD_GLYPHS[accent]!;
  return (
    <a
      href={c.href}
      className="flex flex-col overflow-hidden rounded-[20px] border border-ink-100 bg-white no-underline outline-offset-2 transition-colors hover:border-ink-200 focus-visible:outline-2 focus-visible:outline-brand-700"
    >
      <div className={cn("relative flex h-24 items-start justify-end gap-1.5 overflow-hidden p-2.5", a.bg)}>
        <svg
          aria-hidden
          width={46}
          height={46}
          viewBox="0 0 24 24"
          fill="none"
          className={cn("absolute bottom-1 left-1.5 opacity-20", a.dark ? "text-white" : "text-ink-900")}
        >
          <path d={glyph} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="relative rounded-md bg-white/90 px-2 py-1 text-[9.5px] leading-none text-ink-900">
          {c.subject}
        </span>
        <span className="relative rounded-md bg-white/90 px-2 py-1 text-[9.5px] leading-none text-ink-900">
          {c.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-start gap-1.5">
          {c.finished ? (
            <span className="mt-px flex size-4 flex-none items-center justify-center rounded-full bg-check-machine text-white">
              <svg aria-hidden width={9} height={9} viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : null}
          <span className="line-clamp-2 text-[14px] leading-[1.3] font-medium text-ink-900">
            {c.title}
          </span>
        </div>
        <p className="m-0 line-clamp-2 text-[11.5px] leading-[1.4] text-ink-600">{c.summary}</p>
        <span className="font-mono text-[10px] leading-[1.3] text-ink-500">
          {c.finished ? c.finished.line : c.progress ? c.progress.line : c.footLine}
        </span>
        {c.progress ? (
          <span aria-hidden className="mt-0.5 block h-1 overflow-hidden rounded-full bg-ink-100">
            {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
            <span className="block h-1 rounded-full bg-check-machine" style={{ width: `${c.progress.pct}%` }} />
          </span>
        ) : null}
        <span aria-hidden className="my-0.5 h-px bg-ink-100" />
        <span className="mt-auto self-start rounded-full bg-brand-700 px-3 py-1.5 text-[11.5px] leading-none text-white">
          {c.finished ? "Read again" : c.progress ? "Resume" : "Start"}
        </span>
      </div>
    </a>
  );
}

export default function CataloguePage({
  cards,
  initialQuery = "",
  requestAction,
}: CataloguePageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [subjects, setSubjects] = useState<Set<string>>(new Set());
  const [levels, setLevels] = useState<Set<string>>(new Set());
  const [times, setTimes] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const q = query.trim().toLowerCase();
  const textMatch = (c: CatalogueCard) =>
    !q || [c.title, c.summary, c.subject].some((s) => s.toLowerCase().includes(q));

  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          textMatch(c) &&
          (subjects.size === 0 || subjects.has(c.subject)) &&
          (levels.size === 0 || levels.has(c.level)) &&
          (times.size === 0 || TIME_BUCKETS.some((b) => times.has(b.id) && b.test(c.weeks))),
      ),
    [cards, q, subjects, levels, times],
  );

  // Facet counts against the OTHER active filters, so a facet's number says
  // what choosing it would leave. Zero-count facets are removed entirely.
  const countBy = (facet: (c: CatalogueCard) => boolean, ignore: "subject" | "level" | "time") =>
    cards.filter(
      (c) =>
        textMatch(c) &&
        facet(c) &&
        (ignore === "subject" || subjects.size === 0 || subjects.has(c.subject)) &&
        (ignore === "level" || levels.size === 0 || levels.has(c.level)) &&
        (ignore === "time" ||
          times.size === 0 ||
          TIME_BUCKETS.some((b) => times.has(b.id) && b.test(c.weeks))),
    ).length;

  const subjectFacets = [...new Set(cards.map((c) => c.subject))]
    .map((s) => ({ key: s, count: countBy((c) => c.subject === s, "subject") }))
    .filter((f) => f.count > 0 || subjects.has(f.key));
  const levelFacets = [...new Set(cards.map((c) => c.level))]
    .map((l) => ({ key: l, count: countBy((c) => c.level === l, "level") }))
    .filter((f) => f.count > 0 || levels.has(f.key));
  const timeFacets = TIME_BUCKETS.map((b) => ({
    key: b.id,
    label: b.label,
    count: countBy((c) => b.test(c.weeks), "time"),
  })).filter((f) => f.count > 0 || times.has(f.key));

  const anyFilter = subjects.size > 0 || levels.size > 0 || times.size > 0;
  const clearAll = () => {
    setSubjects(new Set());
    setLevels(new Set());
    setTimes(new Set());
  };
  const toggle = (set: Set<string>, apply: (next: Set<string>) => void, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    apply(next);
  };

  const countLine = q
    ? `${filtered.length} ${filtered.length === 1 ? "roadmap" : "roadmaps"} matching ${q}`
    : subjects.size > 0
      ? `${filtered.length} ${filtered.length === 1 ? "roadmap" : "roadmaps"} in ${[...subjects].join(", ")}`
      : `${filtered.length} ${filtered.length === 1 ? "roadmap" : "roadmaps"}`;

  const suggestions = q && focused ? cards.filter(textMatch).slice(0, 5) : [];

  const searchBox = (
    <div className="relative">
      <SearchIcon active={focused && q.length > 0} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="What do you want to learn?"
        aria-label="Search roadmaps"
        className={cn(
          "min-h-12 w-full rounded-lg border bg-white pr-12 pl-[42px] text-[15px] text-ink-900 placeholder:text-ink-500",
          "border-ink-100 focus:border-brand-700 focus:outline-none",
          "focus:[box-shadow:0_0_0_2px_var(--color-brand-50),0_0_0_4px_var(--color-brand-700)]",
        )}
      />
      {query ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery("")}
          className="absolute top-2 right-2 flex size-8 items-center justify-center text-ink-500"
        >
          <svg aria-hidden width={12} height={12} viewBox="0 0 12 12" fill="none">
            <path d="m2 2 8 8M10 2 2 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}

      {/* Suggestions: matches first, then the open invitation — a miss
          still gets a next step. */}
      {suggestions.length > 0 || (q && focused) ? (
        <div className="absolute right-0 left-0 z-10 mt-2 overflow-hidden rounded-card border border-ink-100 bg-white">
          {suggestions.length > 0 ? (
            <>
              <div className="px-4 pt-3 pb-2 font-mono text-[11px] leading-none tracking-[.06em] text-ink-500 uppercase">
                Roadmaps
              </div>
              {suggestions.map((c) => (
                <a key={c.slug} href={c.href} className="block px-4 py-2.5 no-underline hover:bg-ink-50">
                  <span className="block text-[15px] leading-[1.4] text-ink-900">{c.title}</span>
                  <span className="mt-[3px] block font-mono text-[12px] leading-[1.4] text-ink-500">
                    {c.metaLine}
                  </span>
                </a>
              ))}
            </>
          ) : null}
          {q ? (
            <>
              <div
                className={cn(
                  "px-4 pt-3 pb-2 font-mono text-[11px] leading-none tracking-[.06em] text-ink-500 uppercase",
                  suggestions.length > 0 && "border-t border-ink-100",
                )}
              >
                Not yet written
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFocused(false);
                }}
                className="block w-full px-4 pt-2.5 pb-3.5 text-left text-[14.5px] leading-[1.4] font-medium text-brand-700 hover:bg-ink-50"
              >
                Ask for &ldquo;{query.trim()}&rdquo; →
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const checkboxRow = (
    label: string,
    count: number,
    checked: boolean,
    onChange: () => void,
    mobile?: boolean,
  ) => (
    <label
      key={label}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2",
        mobile && "min-h-12 border-b border-ink-100 last:border-b-0",
      )}
    >
      <span
        className={cn(
          "flex items-center",
          mobile ? "gap-2.5 text-[15px]" : "gap-2 text-[13.5px]",
          checked ? "text-brand-700" : "text-ink-900",
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn("accent-brand-700", mobile ? "size-4" : "size-3.5")}
        />
        {label}
      </span>
      <span className={cn("font-mono leading-none text-ink-500", mobile ? "text-[12.5px]" : "text-[12px]")}>
        {count}
      </span>
    </label>
  );

  const filterGroups = (mobile: boolean) => (
    <>
      {!mobile ? (
        <div className="mb-[22px]">
          <div className="mb-2.5 text-[12px] leading-none font-medium text-ink-900">Subject</div>
          <div className="flex flex-col gap-[9px]">
            {subjectFacets.map((f) =>
              checkboxRow(f.key, f.count, subjects.has(f.key), () =>
                toggle(subjects, setSubjects, f.key),
              ),
            )}
          </div>
        </div>
      ) : null}
      <div className={mobile ? "" : "mb-[22px]"}>
        <div className={cn("text-[12px] leading-none font-medium text-ink-900", mobile ? "mb-1.5" : "mb-2.5")}>
          Level
        </div>
        <div className={cn("flex flex-col", mobile ? "" : "gap-[9px]")}>
          {levelFacets.map((f) =>
            checkboxRow(f.key, f.count, levels.has(f.key), () => toggle(levels, setLevels, f.key), mobile),
          )}
        </div>
      </div>
      <div className={mobile ? "mt-[18px]" : ""}>
        <div className={cn("text-[12px] leading-none font-medium text-ink-900", mobile ? "mb-1.5" : "mb-2.5")}>
          Time
        </div>
        <div className={cn("flex flex-col", mobile ? "" : "gap-[9px]")}>
          {timeFacets.map((f) =>
            checkboxRow(f.label, f.count, times.has(f.key), () => toggle(times, setTimes, f.key), mobile),
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col bg-white lg:bg-ink-50">
      <div className="flex">
        {/* ── desktop filter rail ──────────────────────────────────────────── */}
        <aside className="sticky top-[72px] hidden h-fit w-[220px] flex-none border-r border-ink-100 bg-ink-50 px-5 py-6 lg:block">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="font-mono text-[11px] leading-none tracking-[.06em] text-ink-500 uppercase">
              Filters
            </span>
            {anyFilter ? (
              <button type="button" onClick={clearAll} className="text-[12.5px] leading-none text-brand-700">
                Clear all
              </button>
            ) : null}
          </div>
          {filterGroups(false)}
        </aside>

        {/* ── the scrolling body ───────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-[820px]">
            <div className="min-h-full bg-white lg:border-x lg:border-ink-100">
              <div className="px-5 pt-[22px] lg:px-7 lg:pt-7">
                <Eyebrow glyph="▦">Roadmaps</Eyebrow>
                <h1 className="mt-3 mb-0 text-[26px] leading-[1.25] font-medium text-balance text-ink-900 lg:text-[30px]">
                  Start with what you actually need.
                </h1>
                <p className="mt-2.5 mb-0 max-w-[60ch] text-[15px] leading-[1.6] text-pretty text-ink-600 lg:text-[16px]">
                  Free to read in full, no account needed.
                </p>
              </div>

              <div className="px-5 pt-[18px] lg:max-w-[520px] lg:px-7">{searchBox}</div>

              {/* chip row — mobile only; the rail owns subjects from lg up */}
              <div className="relative pt-4 pl-5 lg:hidden">
                <div className="flex gap-2 overflow-x-auto pr-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setSubjects(new Set())}
                    className={cn(
                      "flex min-h-10 flex-none items-center gap-1.5 rounded-full border px-3.5 text-[13.5px]",
                      subjects.size === 0
                        ? "border-brand-700 bg-brand-700 text-white"
                        : "border-ink-100 bg-white text-ink-900",
                    )}
                  >
                    All{" "}
                    {subjects.size === 0 ? (
                      <span className="font-mono text-[12px]">{cards.length}</span>
                    ) : null}
                  </button>
                  {subjectFacets.map((f) => {
                    const on = subjects.has(f.key);
                    return (
                      <button
                        key={f.key}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(subjects, setSubjects, f.key)}
                        className={cn(
                          "flex min-h-10 flex-none items-center gap-2 rounded-full border whitespace-nowrap",
                          on
                            ? "border-brand-50 bg-brand-50 pr-2.5 pl-3.5 text-[13.5px] text-brand-900"
                            : "border-ink-100 bg-white px-3.5 text-[13.5px] text-ink-900",
                        )}
                      >
                        {f.key}
                        {on ? (
                          <span className="flex size-[18px] items-center justify-center rounded-full bg-brand-900">
                            <svg aria-hidden width={8} height={8} viewBox="0 0 10 10" fill="none">
                              <path
                                d="m2 2 6 6M8 2 2 8"
                                className="stroke-brand-50"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="font-mono text-[12px] text-ink-500">{f.count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* right-edge fade so the row reads as scrollable */}
                <div className="pointer-events-none absolute top-4 right-0 bottom-1 w-7 bg-gradient-to-r from-transparent to-white" />
              </div>

              {/* Filters button — opens the sheet; mobile only */}
              <div className="px-5 pt-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="flex min-h-12 items-center gap-2 rounded-lg border border-ink-100 bg-white px-4 text-[14px] font-medium text-ink-900"
                >
                  <svg aria-hidden width={14} height={14} viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Filters
                  {anyFilter ? (
                    <span className="font-mono text-[12px] text-brand-700">
                      {subjects.size + levels.size + times.size}
                    </span>
                  ) : null}
                </button>
              </div>

              {/* count line */}
              <div className="flex items-baseline justify-between gap-3 px-5 pt-5 lg:px-7">
                <div className="font-mono text-[13px] leading-none text-ink-500">{countLine}</div>
                {anyFilter || q ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearAll();
                      setQuery("");
                    }}
                    className="text-[13px] leading-none text-brand-700"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              {/* cards, or the no-results request */}
              {filtered.length > 0 ? (
                <div className="flex flex-col gap-3.5 px-5 pt-3.5 pb-8 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-7 lg:pt-4 lg:pb-10">
                  {filtered.map((c, i) => (
                    <RoadmapCard key={c.slug} card={c} accent={i % ACCENTS.length} />
                  ))}
                </div>
              ) : (
                <div className="px-5 pt-8 pb-7 lg:px-7">
                  <div className="text-[18px] leading-[1.4] font-medium text-ink-900">
                    Nothing matches that yet.
                  </div>
                  <p className="mt-2.5 mb-0 max-w-[52ch] text-[15px] leading-[1.65] text-pretty text-ink-600">
                    We have {cards.length === 4 ? "four" : cards.length} roadmaps so far, and we are
                    writing more. Tell us what you were looking for and it goes on the list.
                  </p>
                  {requestAction && !requestSent ? (
                    <form
                      action={async (fd) => {
                        await requestAction(fd);
                        setRequestSent(true);
                      }}
                      className="mt-5 flex flex-col gap-2.5"
                    >
                      <input type="hidden" name="query" value={query} />
                      <input
                        name="wish"
                        placeholder="What should we build next?"
                        aria-label="What should we build next?"
                        className="min-h-12 w-full rounded-lg border border-ink-100 bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-500 focus:border-brand-700 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="min-h-12 w-full rounded-lg border border-brand-700 bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
                      >
                        Send
                      </button>
                    </form>
                  ) : requestSent ? (
                    <p className="mt-5 mb-0 text-[15px] leading-[1.65] text-ink-700">
                      On the list. Thank you.
                    </p>
                  ) : null}
                  <div className="mt-[18px] pb-4">
                    <button
                      type="button"
                      onClick={() => {
                        clearAll();
                        setQuery("");
                      }}
                      className="text-[14.5px] leading-[1.4] font-medium text-brand-700"
                    >
                      Show all roadmaps
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── mobile filter sheet ──────────────────────────────────────────── */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-20 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 w-full bg-ink-900/20"
          />
          <div className="absolute right-0 bottom-0 left-0 flex max-h-[80dvh] flex-col rounded-t-2xl bg-white">
            <div className="flex flex-none items-center justify-between border-b border-ink-100 px-5 pt-3 pb-4">
              <button type="button" onClick={clearAll} className="text-[14px] leading-none text-brand-700">
                Clear all
              </button>
              <div className="text-[15px] leading-none font-medium text-ink-900">Filters</div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSheetOpen(false)}
                className="flex size-8 items-center justify-center text-ink-900"
              >
                <svg aria-hidden width={13} height={13} viewBox="0 0 14 14" fill="none">
                  <path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-[18px]">{filterGroups(true)}</div>
            <div className="flex-none border-t border-ink-100 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="min-h-12 w-full rounded-lg border border-brand-700 bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
              >
                Show {filtered.length} {filtered.length === 1 ? "roadmap" : "roadmaps"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
