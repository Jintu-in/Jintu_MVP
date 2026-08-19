import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServiceEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/**
 * /admin/metrics — the five numbers, as plain tables.
 *
 * The gate is a hardcoded allowlist of user ids, not a role and not a
 * flag. A role is a row somebody can grant themselves once they have any
 * write path into the table that holds it; a flag is a boolean somebody
 * forgets to unset. An allowlist in source changes only through a commit
 * and a review, which is the correct amount of friction for a page that
 * shows every cohort in the product.
 *
 * The views are service_role-only, so this page reads them with the
 * service key AFTER the allowlist check — never before. A 404 rather than
 * a 403: an unauthorised visitor should not learn the page exists.
 *
 * No charts. The numbers are the point, and a chart of six rows is
 * decoration that makes them harder to read.
 */
export const metadata: Metadata = { title: "Metrics", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Add a Supabase user id here, in a commit, to grant access. */
const ALLOWLIST: readonly string[] = [
  // contact@tindata.com — the owner. Replace with the real uuid; an empty
  // allowlist means nobody, which is the safe default until it is filled.
];

type Row = Record<string, string | number | null>;

const VIEWS = [
  ["retention_cohorts", "1 · Retention by signup cohort", "D3 is the one to watch. Day 1 is curiosity; day 3 is a habit forming or not."],
  ["node_dropoff", "2 · Where people stop", "Worst-first. The top rows are the content backlog, measured rather than guessed."],
  ["streak_distribution", "3 · Streak length", "The lapsed row is the recoverable audience — days behind them, none today."],
  ["time_to_first_day", "4 · Time to first completed day", "If this reads in days rather than minutes, the signup flow ends in the wrong place."],
  ["resource_engagement", "5 · Resource engagement", "APPROXIMATE — we store no clicks, so this counts completions of the node a resource sits on. Read the ignored tail, not the popular head."],
] as const;

function Table({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="mt-2 text-[14px] text-ink-500">No rows yet.</p>;
  const cols = Object.keys(rows[0]!);
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                className="border-b border-ink-200 px-2.5 py-2 font-mono text-[11px] leading-[1.4] font-normal tracking-[.06em] text-ink-500 uppercase"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td
                  key={c}
                  className="border-b border-ink-100 px-2.5 py-2 font-mono text-[12.5px] leading-[1.5] text-ink-900"
                >
                  {r[c] === null ? "—" : String(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function MetricsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // 404, not 403: an unauthorised visitor learns nothing, including that
  // there is something here to be unauthorised for.
  if (!user || !ALLOWLIST.includes(user.id)) notFound();

  const env = getServiceEnv();
  if (!env) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <h1 className="text-[22px] font-medium text-ink-900">Metrics</h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-600">
          The service key is not configured on this deployment, so the views
          cannot be read. Nothing is wrong with the data.
        </p>
      </main>
    );
  }

  const admin = createSupabaseClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const results = await Promise.all(
    VIEWS.map(async ([view]) => {
      // Bounded: node_dropoff is one row per day per roadmap, which is
      // hundreds. The worst rows sort first, and those are the ones that
      // change a decision.
      const { data, error } = await admin.from(view).select("*").limit(60);
      return { view, rows: (data ?? []) as Row[], error: error?.message ?? null };
    }),
  );

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10">
      <h1 className="text-[22px] leading-[1.3] font-medium text-ink-900">Metrics</h1>
      <p className="mt-2 max-w-[70ch] text-[14px] leading-[1.7] text-ink-600">
        Computed in Postgres, read with the service key. These views are not
        readable by anon or by a signed-in user — a cohort of one is a person.
      </p>

      {VIEWS.map(([view, title, note], i) => {
        const r = results[i]!;
        return (
          <section key={view} className="mt-10">
            <h2 className="text-[16px] leading-[1.4] font-medium text-ink-900">{title}</h2>
            <p className="mt-1 max-w-[80ch] text-[13px] leading-[1.7] text-ink-600">{note}</p>
            {r.error ? (
              <p className="mt-2 text-[14px] text-ink-900">Could not read this view: {r.error}</p>
            ) : (
              <Table rows={r.rows} />
            )}
          </section>
        );
      })}
    </main>
  );
}
