"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  applyFilters,
  buildFacets,
  hasAnyFacet,
  toQueryString,
  toggled,
  type CatalogueRow,
  type Filters,
} from "@/lib/catalogue-filters";
import { cn } from "@/lib/utils";

/**
 * The mobile filter sheet.
 *
 * The one place in the catalogue that holds filter state outside the URL, and
 * on purpose: a sheet whose every tap navigated would close itself under the
 * person using it. So the taps edit a draft, the counts and the button label
 * recompute from that draft with the same pure functions the server used, and
 * "Show N roadmaps" commits the whole thing in a single navigation.
 *
 * Subject is deliberately absent. It has its own chip row on the page behind
 * this sheet, and a filter offered twice is two controls that can disagree.
 */
export function CatalogueSheet({ rows, filters }: { rows: CatalogueRow[]; filters: Filters }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(filters);

  const start = () => {
    setDraft(filters);
    setOpen(true);
  };
  const commit = (next: Filters) => {
    setOpen(false);
    router.push(`/learn${toQueryString(next)}` as Route, { scroll: false });
  };

  // Subject lives on the chip row; everything else belongs here.
  const groups = buildFacets(rows, draft).filter((g) => g.group !== "c");
  const shown = applyFilters(rows, draft).length;
  const chosen = [draft.level, draft.len, draft.fmt].filter(Boolean).length +
    (draft.cert ? 1 : 0) + (draft.noprereq ? 1 : 0);

  return (
    <>
      <button
        type="button"
        onClick={start}
        aria-expanded={open}
        className="flex min-h-10 items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3.5 text-[13px] text-ink-900"
      >
        <svg aria-hidden width={13} height={13} viewBox="0 0 14 14" fill="none">
          <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Filters
        {chosen > 0 ? <span className="font-mono text-[12px] text-brand-700">{chosen}</span> : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 w-full bg-ink-900/35"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[80dvh] flex-col rounded-t-2xl bg-white">
            <div className="flex flex-none items-center justify-between px-5 pt-4 pb-3">
              <button
                type="button"
                onClick={() =>
                  setDraft({ ...draft, c: null, level: null, len: null, fmt: null, cert: false, noprereq: false })
                }
                className={cn("text-[13px] leading-none", hasAnyFacet(draft) ? "text-brand-700" : "text-ink-500")}
              >
                Clear
              </button>
              <span className="text-[15px] leading-none font-medium text-ink-900">Filters</span>
              <span className="w-8" aria-hidden />
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4">
              {groups.map((g) => (
                <div key={g.group} className="flex flex-col gap-2">
                  {g.label ? (
                    <span className="font-mono text-[10.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                      {g.label}
                    </span>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {g.facets.map((x) => (
                      <button
                        key={`${x.group}-${x.key}`}
                        type="button"
                        aria-pressed={x.selected}
                        onClick={() => setDraft(toggled(draft, x.group, x.key))}
                        className={cn(
                          "min-h-10 rounded-full border px-3.5 text-[12.5px] whitespace-nowrap",
                          x.selected
                            ? "border-brand-700 bg-brand-50 text-brand-900"
                            : "border-ink-100 bg-white text-ink-600",
                        )}
                      >
                        {x.label}
                        <span className="ml-1.5 font-mono text-[11.5px] text-ink-500">{x.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {groups.length === 0 ? (
                <p className="m-0 text-[13.5px] leading-[1.6] text-ink-600">
                  Nothing left to narrow by — every roadmap here is the same on every count.
                </p>
              ) : null}
            </div>

            <div className="flex-none px-5 pt-1 pb-4">
              <button
                type="button"
                onClick={() => commit(draft)}
                className="min-h-12 w-full rounded-lg bg-brand-700 text-[14px] font-medium text-white hover:bg-brand-800"
              >
                Show {shown} {shown === 1 ? "roadmap" : "roadmaps"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
