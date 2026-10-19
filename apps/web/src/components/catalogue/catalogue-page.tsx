import type { Route } from "next";
import Link from "next/link";
import { CatalogueSearch } from "@/components/catalogue/catalogue-search";
import {
  applyFilters,
  CATEGORIES,
  resultLine,
  toggled,
  toQueryString,
  type CatalogueRow,
  type Filters,
} from "@/lib/catalogue-filters";
import { cn } from "@/lib/utils";

/**
 * The catalogue (/learn) — rebuilt against V2Roadmaps.dc.html /
 * DeskRoadmaps.dc.html.
 *
 * This replaced a richer, facet-sidebar catalogue (Level/Length/Format/
 * certification/prerequisites, three sort orders) built against an older
 * design. See catalogue-filters.ts's own header for why that was cut down
 * to category + search — asked and answered 2026-10-19, not a default.
 *
 * One mark style throughout — a filled circle with a two-letter mono
 * initial, brand-500/on-brand for the open roadmap, white/link for the
 * rest — reusing the homepage's "the roadmaps" section treatment rather
 * than building the design's second illustration set (a 68×68 bespoke
 * drawing per roadmap). Same visual language, bounded effort; the
 * per-roadmap illustrations are the one deliberate fidelity gap in this
 * page.
 */

const ARROW_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const BELL_ICON = (
  <svg aria-hidden width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export type { CatalogueRow } from "@/lib/catalogue-filters";

export interface CataloguePageProps {
  rows: CatalogueRow[];
  filters: Filters;
  streakDays: number | null;
}

const href = (f: Filters) => `/learn${toQueryString(f)}` as Route;

function Mark({ row }: { row: CatalogueRow }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 flex-none items-center justify-center rounded-2xl font-mono text-[13px] font-semibold",
        row.open ? "bg-brand-500 text-on-brand" : "bg-white text-link",
      )}
    >
      {row.title.slice(0, 2)}
    </span>
  );
}

/** The one open roadmap — the bento-style hero card. */
function OpenCard({ row }: { row: CatalogueRow }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[24px] bg-night-900 p-4 text-white sm:p-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex h-[26px] items-center gap-1.5 rounded-xl bg-brand-500/20 px-2.5 text-[12px] font-semibold text-on-night-muted">
          <span aria-hidden className="size-[7px] rounded-full bg-brand-500" />
          Open now
        </span>
        <span className="font-mono text-[12.5px] text-on-night-muted-2">
          {CATEGORIES.find((c) => c.key === row.category)?.label}
          {row.weeks ? ` · ${row.weeks} weeks` : null}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="t-card text-white">{row.title}</div>
        <p className="text-[15px] leading-[1.45] text-pretty text-on-night-muted">{row.summary}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {row.progress ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span aria-hidden className="block h-1.5 overflow-hidden rounded-full bg-white/15">
              <span className="block h-1.5 rounded-full bg-brand-500" style={{ width: `${row.progress.pct}%` }} />
            </span>
            <span className="font-mono text-[12px] text-on-night-muted-2">{row.progress.line}</span>
          </div>
        ) : row.finished ? (
          <span className="font-mono text-[12px] text-on-night-muted-2">{row.finished.line}</span>
        ) : (
          <span className="font-mono text-[12px] text-on-night-muted-2">{row.footLine}</span>
        )}
        <Link
          href={row.href as Route}
          className="flex h-12 flex-none items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-5 text-[15.5px] font-semibold text-on-brand hover:bg-brand-400"
        >
          <span>{row.progress ? "Continue" : row.finished ? "Read again" : "Start"}</span>
          {ARROW_RIGHT}
        </Link>
      </div>
    </div>
  );
}

/** Every other roadmap — "coming soon," with a notify button. */
function PlannedCard({ row }: { row: CatalogueRow }) {
  return (
    <div className="flex items-start gap-3.5 rounded-[22px] bg-white p-3.5 sm:p-4">
      <Mark row={row} />
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[12px] leading-4 font-semibold text-link">
          {CATEGORIES.find((c) => c.key === row.category)?.label}
        </div>
        <div className="t-card mt-0.5 text-ink-900">{row.title}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="flex h-6 items-center rounded-xl bg-ink-50 px-2.5 text-[12px] font-semibold text-ink-600">
            Coming soon
          </span>
          <span className="font-mono text-[12px] text-ink-500">
            {row.level ? row.level[0]!.toUpperCase() + row.level.slice(1) : null}
            {row.weeks ? ` · ${row.weeks} weeks` : null}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Tell me when ${row.title} opens`}
        className="flex size-11 flex-none items-center justify-center rounded-full bg-ink-50 text-link"
      >
        {BELL_ICON}
      </button>
    </div>
  );
}

export default function CataloguePage({ rows, filters, streakDays }: CataloguePageProps) {
  const shown = applyFilters(rows, filters);
  const open = shown.filter((r) => r.open);
  const planned = shown.filter((r) => !r.open);
  const [hero, ...restOpen] = open;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-5 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex items-center justify-between gap-3 lg:justify-start lg:gap-4">
            <h1 className="t-sect text-ink-900">Roadmaps</h1>
            {streakDays !== null && streakDays > 0 ? (
              <span className="flex h-8 items-center gap-1.5 rounded-2xl bg-warn-bg px-3 text-[13.5px] font-semibold text-warn-700">
                <svg aria-hidden width={14} height={14} viewBox="0 0 24 24">
                  <path
                    d="M12 2c1 3.6 5 5.6 5 10.2a5 5 0 0 1-10 0c0-1.7.6-3 1.6-4 .3 1.5 1 2.4 2 2.7C10.4 8.4 10.8 5 12 2z"
                    fill="#F29D00"
                  />
                </svg>
                <span>{streakDays}</span>
              </span>
            ) : null}
          </div>
          <div className="lg:w-[340px] lg:flex-none">
            <CatalogueSearch filters={filters} />
          </div>
        </div>

        <div role="group" aria-label="Groups" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          <Link
            href={href({ ...filters, c: null })}
            scroll={false}
            className={cn(
              "flex min-h-11 flex-none items-center rounded-2xl border px-4 text-[14px] whitespace-nowrap no-underline",
              filters.c === null ? "border-night-900 bg-night-900 text-white font-semibold" : "border-ink-100 bg-white text-ink-900",
            )}
          >
            All {rows.length}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={href(toggled(filters, "c", c.key))}
              scroll={false}
              className={cn(
                "flex min-h-11 flex-none items-center rounded-2xl border px-4 text-[14px] whitespace-nowrap no-underline",
                filters.c === c.key ? "border-night-900 bg-night-900 text-white font-semibold" : "border-ink-100 bg-white text-ink-900",
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="font-mono text-[12.5px] leading-none text-ink-500">{resultLine(shown.length, filters)}</div>

        {shown.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {hero ? <OpenCard row={hero} /> : null}
            {restOpen.map((r) => (
              <OpenCard key={r.slug} row={r} />
            ))}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {planned.map((r) => (
                <PlannedCard key={r.slug} row={r} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[22px] bg-white p-6">
            <div className="t-card text-ink-900">Nothing matches that yet.</div>
            <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.5] text-pretty text-ink-600">
              We have {rows.length} roadmaps so far, and we are writing more.
            </p>
            <Link href="/contact" className="mt-3 inline-flex min-h-11 items-center text-[13.5px] font-semibold text-ink-900">
              Tell us what you want to learn
            </Link>
          </div>
        )}

        <Link
          href="/contact"
          className="flex min-h-[64px] items-center gap-3.5 rounded-[22px] border border-dashed border-ink-200 p-4 text-ink-900 no-underline"
        >
          <span aria-hidden className="flex size-11 flex-none items-center justify-center rounded-2xl bg-white">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">Ask for a roadmap</span>
            <span className="text-[13.5px] text-ink-600">
              Entrepreneurship, sales, something else? Tell us what you want to learn.
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
