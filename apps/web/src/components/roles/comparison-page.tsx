import Link from "next/link";
import type { Route } from "next";
import type { Comparison } from "@/content/roles";

/**
 * A comparison page.
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

      <div className="mt-8 rounded-card border border-brand-500 bg-white p-6 sm:p-7">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          The short answer
        </div>
        <p className="mt-3 max-w-[70ch] text-[16px] leading-[1.7] text-pretty text-ink-900">
          {comparison.shortAnswer}
        </p>
      </div>

      {/* overflow-x-auto on the wrapper, never on the page. */}
      <div className="mt-10 overflow-x-auto">
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

      <section className="mt-12 rounded-card border border-ink-100 bg-white p-6 sm:p-8">
        <h2 className="t-sub text-ink-900">Decided which one you want?</h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          The role pages above say what each job is like day to day, and each one ends in the
          roadmap that gets you there — or says plainly that we have not built it yet.
        </p>
        <Link
          href={"/roles" as Route}
          className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-700 px-5 text-[15px] font-medium text-white hover:bg-brand-800"
        >
          All roles
        </Link>
      </section>
    </main>
  );
}
