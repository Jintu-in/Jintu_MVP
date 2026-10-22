import Link from "next/link";
import type { Route } from "next";
import type { Comparison } from "@/content/roles";

/**
 * A comparison page — restyled against V2Compare.dc.html / DeskCompare.dc.html.
 *
 * Stayed on the marketing route group's chrome (SiteNav/SiteFooter),
 * unlike /roles and /roles/[slug]: V2Compare's own mobile screen draws the
 * full dark marketing footer (Learn/Jintu/small print columns), not the
 * app shell's bottom tab bar — the one place in this whole roles/roadmap
 * area where the design is unambiguous about which chrome it wants, so
 * this page is the one exception to the app-shell move.
 *
 * The short answer comes FIRST, before the table, because the reader arrived
 * with one question and most pages on this subject make them scroll past an
 * introduction to reach it. The table is the reference; the nuance
 * underneath is the part a table cannot carry, and it is where the honest
 * caveats about Indian job adverts live.
 *
 * The table scrolls inside its own container rather than pushing the page
 * sideways — five columns do not fit a phone and this site is mobile-first.
 */
export function ComparisonPage({ comparison }: { comparison: Comparison }) {
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
        Compare
      </div>
      <h1 className="t-page mt-3 text-ink-900">{comparison.title}</h1>
      <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.65] text-pretty text-ink-600">
        {comparison.standfirst}
      </p>

      <div className="mt-8 rounded-[24px] bg-night-900 p-6 text-white sm:p-7">
        <div className="font-mono text-[12.5px] leading-none font-semibold text-dark-link">
          The short answer
        </div>
        <p className="mt-3 max-w-[70ch] text-[16px] leading-[1.65] text-pretty text-white">
          {comparison.shortAnswer}
        </p>
      </div>

      {/* Cards below lg — V2Compare.dc.html's own mobile screen draws each
          role as a stacked card, not a shrunk table, which is the real
          reason five columns "do not fit a phone": the design's answer was
          a different layout, not a scrolling one. The table survives at lg,
          where DeskCompare has the width for it and a table is the more
          scannable shape for comparing several roles side by side. */}
      <div className="mt-10 flex flex-col gap-3 lg:hidden">
        {comparison.rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-3 rounded-[20px] bg-white p-[18px]">
            {r.role ? (
              <Link
                href={`/roles/${r.role}` as Route}
                className="flex items-center justify-between gap-2.5 text-[19px] leading-[1.3] font-semibold text-ink-900 no-underline"
              >
                <span>{r.label}</span>
                <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-ink-500">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ) : (
              <div className="text-[19px] leading-[1.3] font-semibold text-ink-900">{r.label}</div>
            )}
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[11px] leading-4 font-semibold tracking-[.06em] text-ink-500 uppercase">
                Owns
              </div>
              <div className="text-[15px] leading-[1.45] text-pretty text-ink-900">{r.owns}</div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[11px] leading-4 font-semibold tracking-[.06em] text-ink-500 uppercase">
                Does not own
              </div>
              <div className="text-[15px] leading-[1.45] text-pretty text-ink-600">{r.doesNotOwn}</div>
            </div>
            <div className="rounded-2xl bg-brand-50 px-3.5 py-2.5 text-[14.5px] leading-[1.45] font-medium text-night-900">
              {r.tell}
            </div>
          </div>
        ))}
      </div>

      {/* overflow-x-auto on the wrapper, never on the page. */}
      <div className="mt-10 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-200">
              {["Role", "Owns", "Does not own", "The tell"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="py-3 pr-5 font-mono text-[11px] leading-none tracking-[.08em] text-ink-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((r) => (
              <tr key={r.label} className="border-b border-ink-100 align-top">
                <th scope="row" className="py-4 pr-5 text-[15px] leading-[1.45] font-medium text-ink-900">
                  {r.role ? (
                    <Link
                      href={`/roles/${r.role}` as Route}
                      className="text-brand-700 hover:text-brand-800"
                    >
                      {r.label} →
                    </Link>
                  ) : (
                    r.label
                  )}
                </th>
                <td className="py-4 pr-5 text-[14.5px] leading-[1.6] text-pretty text-ink-900">
                  {r.owns}
                </td>
                <td className="py-4 pr-5 text-[14.5px] leading-[1.6] text-pretty text-ink-600">
                  {r.doesNotOwn}
                </td>
                <td className="py-4 text-[14.5px] leading-[1.6] text-pretty text-ink-600 italic">
                  {r.tell}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-12 border-t border-ink-100 pt-8">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          The nuance
        </div>
        <div className="mt-5 flex max-w-[62ch] flex-col gap-5">
          {comparison.nuance.map((p) => (
            <p key={p} className="text-[15px] leading-[1.7] text-pretty text-ink-900">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col gap-3.5 rounded-[24px] bg-brand-50 p-6 text-night-900 sm:p-7">
        <h2 className="t-card text-night-900">Pick one and see what you would learn</h2>
        <p className="max-w-[62ch] text-[15px] leading-[1.6] text-pretty">
          The role pages above say what each job is like day to day, and each one ends in the
          roadmap that gets you there — or says plainly that we have not built it yet.
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={"/roles" as Route}
            className="flex h-13 items-center justify-center rounded-2xl bg-night-900 px-6 text-[15.5px] font-semibold text-white"
          >
            All roles
          </Link>
        </div>
      </section>
    </main>
  );
}
