import type { Route } from "next";
import Link from "next/link";
import { CatalogueSearch } from "@/components/catalogue/catalogue-search";
import { CatalogueSheet } from "@/components/catalogue/catalogue-sheet";
import { TopicRequestForm } from "@/components/learn/topic-request-form";
import { Eyebrow } from "@/components/ui/patterns";
import {
  activePills,
  applyFilters,
  buildFacets,
  CATEGORIES,
  EMPTY_FILTERS,
  hasAnyFacet,
  resultLine,
  SORTS,
  toQueryString,
  toggled,
  type CatalogueRow,
  type Filters,
  type Group,
} from "@/lib/catalogue-filters";
import { cn } from "@/lib/utils";

/**
 * The catalogue (/learn), from the design's "Catalogue with sidebar".
 *
 * A server component with two client islands — the debounced search field and
 * the mobile filter sheet. Everything else is a link, because everything else
 * is in the URL: /learn?c=software&level=beginner is a page you can share,
 * bookmark, crawl and reverse with the back button. There is no filter state
 * to lose on reload and no first paint that disagrees with the address bar.
 *
 * Subject appears exactly once at any width — the rail owns it from lg up,
 * the chip row owns it below, and the sheet does not offer it at all.
 *
 * TWO DELIBERATE DEVIATIONS from the design, both about not lying to people:
 *
 *   - The design draws Level, Format and the two booleans as square
 *     checkboxes and Subject and Length as round radios, but the brief makes
 *     all four groups single-select. A control shaped like a checkbox that
 *     clears its sibling is a bug you can see. So: circles for the four
 *     single-select groups, squares only for the two genuine booleans.
 *   - The card badges are white on rgba(255,255,255,.2) over the accent,
 *     which is 2.3:1 on the mid accent and 1.8:1 on the palest. They are a
 *     near-solid white chip with ink text here, which keeps "a light chip on
 *     colour" and stays legible on all four.
 */

export type { CatalogueRow } from "@/lib/catalogue-filters";

export interface CataloguePageProps {
  rows: CatalogueRow[];
  filters: Filters;
}

const href = (f: Filters) => `/learn${toQueryString(f)}` as Route;

/**
 * The accent ramp, keyed by category rather than by position.
 *
 * The design's four cards run brand-700 → 600 → 400 → 300 in category order,
 * and pinning the colour to the subject rather than to the grid slot means
 * Marketing is the same colour whether it is first or third — a colour that
 * moves when you filter is decoration, one that holds is information.
 */
const ACCENTS: Record<CatalogueRow["category"], { bg: string; dark: boolean; glyph: string }> = {
  data: { bg: "bg-brand-700", dark: true, glyph: "M4 20V12M10 20V6M16 20V14M22 20V9" },
  software: { bg: "bg-brand-600", dark: true, glyph: "M8 6 3 12l5 6M16 6l5 6-5 6" },
  marketing: { bg: "bg-brand-400", dark: false, glyph: "M3 10v4h3l6 4V6L6 10Z" },
  judgement: { bg: "bg-brand-300", dark: false, glyph: "M15 9l-2 6-6 2 2-6Z" },
};

const SHORT_CATEGORY: Record<CatalogueRow["category"], string> = {
  data: "Data",
  software: "Software",
  marketing: "Marketing",
  judgement: "Judgement",
};

const SHORT_LEVEL: Record<CatalogueRow["level"], string> = {
  beginner: "Beg.",
  intermediate: "Int.",
  advanced: "Adv.",
};

function CardCap({ row }: { row: CatalogueRow }) {
  const a = ACCENTS[row.category];
  return (
    <div className={cn("relative flex h-24 items-start justify-between overflow-hidden p-2.5", a.bg)}>
      <svg
        aria-hidden
        width={46}
        height={46}
        viewBox="0 0 24 24"
        fill="none"
        className={cn("absolute -bottom-1 left-1 opacity-20", a.dark ? "text-white" : "text-ink-900")}
      >
        <path d={a.glyph} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="relative rounded-md bg-white/90 px-2 py-1 text-[10px] leading-none text-ink-900">
        {SHORT_CATEGORY[row.category]}
      </span>
      <span className="relative rounded-md bg-white/90 px-2 py-1 text-[10px] leading-none text-ink-900">
        {SHORT_LEVEL[row.level]}
      </span>
    </div>
  );
}

function RoadmapCard({ row }: { row: CatalogueRow }) {
  return (
    <Link
      href={row.href as Route}
      className="flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white no-underline outline-offset-2 transition-colors hover:border-ink-200 focus-visible:outline-2 focus-visible:outline-brand-700"
    >
      <CardCap row={row} />
      <div className="flex flex-1 flex-col gap-1.5 p-3 lg:gap-2 lg:p-4">
        <div className="flex items-start gap-1.5">
          {row.finished ? (
            <span className="mt-px flex size-4 flex-none items-center justify-center rounded-full bg-check-machine text-white">
              <svg aria-hidden width={9} height={9} viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : null}
          <span className="line-clamp-2 text-[14px] leading-[1.3] font-medium text-ink-900 lg:text-[15px]">
            {row.title}
          </span>
        </div>
        <p className="m-0 line-clamp-2 text-[11.5px] leading-[1.4] text-ink-600 lg:text-[12.5px]">
          {row.summary}
        </p>
        <span className="font-mono text-[10.5px] leading-[1.3] text-ink-500 lg:text-[11px]">
          {row.metaLine}
        </span>
        {row.progress ? (
          <span aria-hidden className="mt-0.5 block h-1 overflow-hidden rounded-full bg-ink-100">
            {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
            <span className="block h-1 rounded-full bg-check-machine" style={{ width: `${row.progress.pct}%` }} />
          </span>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink-100 pt-2.5">
          <span className="min-w-0 truncate font-mono text-[10.5px] leading-[1.3] text-ink-500 lg:text-[11px]">
            {row.finished ? row.finished.line : row.progress ? row.progress.line : row.footLine}
          </span>
          <span className="flex-none rounded-full bg-brand-700 px-3 py-1.5 text-[11px] leading-none text-white lg:text-[12px]">
            {row.finished ? "Read again" : row.progress ? "Resume" : "Start"}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** One sidebar row: radio or checkbox, label, live count, × when chosen. */
function FacetRow({
  filters,
  group,
  facetKey,
  label,
  count,
  selected,
  shape,
}: {
  filters: Filters;
  group: Group;
  facetKey: string;
  label: string;
  count: number;
  selected: boolean;
  shape: "radio" | "checkbox";
}) {
  return (
    <Link
      href={href(toggled(filters, group, facetKey))}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "-mx-2 flex items-center justify-between gap-2 rounded-md px-2 py-[7px] no-underline",
        selected ? "bg-brand-50" : "hover:bg-white",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-2 text-[13.5px] leading-none",
          selected ? "text-brand-900" : "text-ink-900",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-[15px] flex-none border-[1.5px]",
            shape === "radio" ? "rounded-full" : "rounded",
            selected ? "border-brand-700 bg-brand-700" : "border-ink-200",
          )}
        />
        {label}
      </span>
      <span
        className={cn(
          "flex items-center gap-1.5 font-mono text-[12px] leading-none",
          selected ? "text-brand-900" : "text-ink-500",
        )}
      >
        {count}
        {selected ? (
          <svg aria-hidden width={9} height={9} viewBox="0 0 10 10" fill="none">
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ) : null}
      </span>
    </Link>
  );
}

export default function CataloguePage({ rows, filters }: CataloguePageProps) {
  const shown = applyFilters(rows, filters);
  const groups = buildFacets(rows, filters);
  const subjectGroup = groups.find((g) => g.group === "c");
  const pills = activePills(filters);
  const cleared: Filters = { ...EMPTY_FILTERS, q: filters.q, sort: filters.sort };

  return (
    <div className="bg-white lg:bg-ink-50">
      <div className="flex">
        {/* ── the rail ─────────────────────────────────────────────────────── */}
        {/* No "Filters" heading: the group labels below say what these are,
            and the word already belongs to the mobile sheet's trigger. */}
        <aside
          aria-label="Filter roadmaps"
          className="sticky top-[72px] hidden h-fit w-[240px] flex-none flex-col gap-[22px] border-r border-ink-100 bg-ink-50 px-5 py-7 lg:flex"
        >
          <CatalogueSearch filters={filters} size="compact" />

          {groups.map((g) => (
            <div key={g.group} className="flex flex-col gap-2.5">
              {g.label ? (
                <span className="font-mono text-[10.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                  {g.label}
                </span>
              ) : null}
              <div className="flex flex-col">
                {g.facets.map((x) => (
                  <FacetRow
                    key={`${x.group}-${x.key}`}
                    filters={filters}
                    group={x.group}
                    facetKey={x.key}
                    label={x.label}
                    count={x.count}
                    selected={x.selected}
                    shape={g.kind === "boolean" ? "checkbox" : "radio"}
                  />
                ))}
              </div>
            </div>
          ))}

          {hasAnyFacet(filters) ? (
            <Link href={href(cleared)} scroll={false} className="text-[12.5px] leading-none text-brand-700">
              Clear all
            </Link>
          ) : null}

          {/* A footnote under the filters, not a call to action. It sits
              below the rule with its own quiet heading and an outlined
              button, so it reads as "and if none of these" rather than
              competing with the four roadmaps on the right. */}
          <div className="flex flex-col gap-1.5 border-t border-ink-100 pt-4">
            <span className="text-[13px] leading-none font-medium text-ink-900">Not here yet?</span>
            <p className="m-0 mb-1 text-[12px] leading-[1.45] text-ink-600">
              Tell us the subject and it goes on the list.
            </p>
            <TopicRequestForm source="sidebar" size="compact" defaultValue={filters.q} />
          </div>
        </aside>

        {/* ── results ──────────────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-[900px] px-4 pt-5 pb-10 sm:px-6 lg:px-10 lg:pt-9">
            <Eyebrow glyph="◆">Roadmaps</Eyebrow>
            {/* No break: balance splits it at whatever width the rail
                leaves, which changes with the sidebar. */}
            <h1 className="t-page mt-3.5 mb-0 text-ink-900">
              Pick a subject. Follow it to the end.
            </h1>
            <p className="t-lead mt-3.5 mb-0 text-ink-600">
              Every roadmap is free, readable without an account, and checked by a person before it
              shipped.
            </p>

            {/* the search field, below lg — the rail has it above */}
            <div className="mt-4 lg:hidden">
              <CatalogueSearch filters={filters} />
            </div>

            {/* subject chips, below lg — the rail owns Subject above */}
            {subjectGroup ? (
              <div className="relative mt-4 lg:hidden">
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <Link
                    href={href({ ...filters, c: null })}
                    scroll={false}
                    className={cn(
                      "flex min-h-10 flex-none items-center gap-1.5 rounded-full px-3.5 text-[12.5px] whitespace-nowrap no-underline",
                      filters.c === null
                        ? "bg-ink-900 text-white"
                        : "border border-ink-100 bg-white text-ink-600",
                    )}
                  >
                    All <span className="font-mono">{rows.length}</span>
                  </Link>
                  {subjectGroup.facets.map((x) => (
                    <Link
                      key={x.key}
                      href={href(toggled(filters, "c", x.key))}
                      scroll={false}
                      className={cn(
                        "flex min-h-10 flex-none items-center gap-1.5 rounded-full px-3.5 text-[12.5px] whitespace-nowrap no-underline",
                        x.selected
                          ? "border border-brand-700 bg-brand-50 text-brand-900"
                          : "border border-ink-100 bg-white text-ink-600",
                      )}
                    >
                      {/* Short labels here: "Marketing & commerce" in a
                          scrolling row is one chip and half a screen. */}
                      {CATEGORIES.find((c) => c.key === x.key)!.label.split(" & ")[0]}
                      <span className="font-mono text-[11.5px]">{x.count}</span>
                    </Link>
                  ))}
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-0 right-0 bottom-1 w-8 bg-gradient-to-r from-transparent to-white"
                />
              </div>
            ) : null}

            {/* active filters, removable one at a time */}
            {pills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {pills.map((p) => (
                  <Link
                    key={p.group}
                    href={href(toggled(filters, p.group, p.key))}
                    scroll={false}
                    aria-label={`Remove filter: ${p.label}`}
                    className="flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1.5 text-[12px] leading-none text-brand-900 no-underline"
                  >
                    {p.label}
                    <svg aria-hidden width={9} height={9} viewBox="0 0 10 10" fill="none">
                      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : null}

            {/* count · sort, and the sheet trigger below lg */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate font-mono text-[12.5px] leading-none text-ink-500">
                {resultLine(shown.length, filters)}
              </span>
              <div className="hidden gap-4 lg:flex">
                {SORTS.map((s) => (
                  <Link
                    key={s.key}
                    href={href({ ...filters, sort: s.key })}
                    scroll={false}
                    aria-current={filters.sort === s.key ? "true" : undefined}
                    className={cn(
                      "text-[13px] leading-none no-underline",
                      filters.sort === s.key ? "text-ink-900" : "text-ink-600 hover:text-ink-900",
                    )}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
              <div className="lg:hidden">
                <CatalogueSheet rows={rows} filters={filters} />
              </div>
            </div>

            {shown.length > 0 ? (
              <div className="mt-3.5 grid grid-cols-2 gap-3 lg:mt-4 lg:gap-4">
                {shown.map((row) => (
                  <RoadmapCard key={row.slug} row={row} />
                ))}
              </div>
            ) : (
              /* Nothing matched. The catalogue is four roadmaps deep, so this
                 is the expected outcome for most searches, not an error — the
                 request box is the page rather than a footnote on it. */
              <div className="mt-5 rounded-2xl border border-ink-100 bg-white p-6">
                <div className="text-[18px] leading-[1.3] font-medium text-ink-900">
                  Nothing matches that yet.
                </div>
                <p className="mt-3 mb-0 max-w-[52ch] text-[14px] leading-[1.5] text-pretty text-ink-600">
                  We have {rows.length} roadmaps so far, and we are writing more.
                </p>
                <div className="mt-3">
                  <TopicRequestForm source="no_results" defaultValue={filters.q} />
                </div>
                <Link
                  href={"/learn" as Route}
                  scroll={false}
                  className="mt-4 inline-block text-[13px] leading-none text-brand-700"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
