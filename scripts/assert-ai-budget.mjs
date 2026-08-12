/**
 * Proves the ai spend gate cannot leak money.
 *
 *   node scripts/assert-ai-budget.mjs
 *
 * CLAUDE.md invariant 2 says every LLM call is priced, ledgered and capped.
 * The cap lives in ai_spend_reserve / settle / release, and this guard runs
 * those functions in real Postgres (PGlite) and pushes on every edge a bug
 * could hide behind: the unconfigured budget, the ceiling crossing, the
 * cohort ring, the overshooting settle, the double release, and the client
 * that tries to call any of it directly.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");

let passed = 0;
const failures = [];
const check = (ok, label, detail) => {
  if (ok) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
};

const db = await PGlite.create();
await db.exec(SHIM);
for (const file of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
}
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));

const one = async (q, params) => (await db.query(q, params)).rows[0];
const rejects = async (q, params) => {
  try {
    await db.query(q, params);
    return null;
  } catch (e) {
    return e.message ?? String(e);
  }
};
const spent = async (scope) =>
  (await one(
    `select spent_paise from public.budget_guards where scope = $1 order by period_start desc limit 1`,
    [scope],
  ))?.spent_paise;
const reset = () => db.exec("delete from public.ai_usage; delete from public.budget_guards;");

const COHORT = (await one("select id from public.cohorts limit 1")).id;
const GHOST_COHORT = "00000000-0000-4000-8000-0000000000dd";

console.log("── fail-closed ─────────────────────────────────────────────");
const closed = await rejects("select public.ai_spend_reserve(100)");
check(
  closed !== null && /refusing to spend/.test(closed),
  "with no guard row configured, a reservation is refused",
  closed ?? "it went through",
);

console.log("\n── the global ring ─────────────────────────────────────────");
await db.exec(
  "insert into public.budget_guards (scope, scope_id, ceiling_paise) values ('global', null, 1000)",
);
check((await rejects("select public.ai_spend_reserve(300)")) === null, "a reservation inside the ceiling is accepted");
check((await spent("global")) === 300, `and the estimate is held (${await spent("global")} of 1000)`);

const over = await rejects("select public.ai_spend_reserve(800)");
check(over !== null && /exhausted/.test(over), "a reservation that would cross the ceiling is refused");
check((await spent("global")) === 300, "and a refused reservation holds nothing");

await db.query(
  "select public.ai_spend_settle($1, $2, $3, $4, $5, $6)",
  [300, 120, "rubric_score", "claude-haiku-4-5-20251001", 900, 200],
);
check((await spent("global")) === 120, `settling swaps the estimate for the actual (${await spent("global")})`);
const usage = await one("select count(*)::int n, min(cost_paise) cost, min(function_name) fn, min(input_tokens) inp from public.ai_usage");
check(
  usage.n === 1 && usage.cost === 120 && usage.fn === "rubric_score" && usage.inp === 900,
  "one call, one priced ai_usage row — invariant 2's artifact",
);

await db.query("select public.ai_spend_reserve(300)");
await db.query("select public.ai_spend_release(300)");
check((await spent("global")) === 120, "a released reservation returns its estimate");
check((await one("select count(*)::int n from public.ai_usage")).n === 1, "and a call that never happened writes no ledger row");

console.log("\n── the cohort ring ─────────────────────────────────────────");
await reset();
await db.exec("insert into public.budget_guards (scope, scope_id, ceiling_paise) values ('global', null, 10000)");
await db.query(
  "insert into public.budget_guards (scope, scope_id, ceiling_paise) values ('cohort', $1, 200)",
  [COHORT],
);
check(
  (await rejects("select public.ai_spend_reserve(150, $1)", [COHORT])) === null,
  "a cohort reservation inside both rings is accepted",
);
const cohortOver = await rejects("select public.ai_spend_reserve(100, $1)", [COHORT]);
check(
  cohortOver !== null && /cohort ai budget/.test(cohortOver),
  "the cohort ring refuses even while the global ring has room",
);
check((await spent("global")) === 150, "and the refused reservation held nothing on either ring");
check(
  (await rejects("select public.ai_spend_reserve(100, $1)", [GHOST_COHORT])) === null,
  "a cohort with no guard row of its own spends against the global ring alone",
);
await db.query(
  "select public.ai_spend_settle($1, $2, $3, $4, $5, $6, $7)",
  [150, 90, "rubric_score", "claude-haiku-4-5-20251001", 700, 150, COHORT],
);
check(
  (await spent("global")) === 190 && (await spent("cohort")) === 90,
  `settling adjusts both rings (global ${await spent("global")}, cohort ${await spent("cohort")})`,
);
check(
  (await one("select cohort_id from public.ai_usage limit 1")).cohort_id === COHORT,
  "and the ledger row names the cohort whose budget it burned",
);

console.log("\n── the ugly edges ──────────────────────────────────────────");
await reset();
await db.exec("insert into public.budget_guards (scope, scope_id, ceiling_paise) values ('global', null, 100)");
await db.query("select public.ai_spend_reserve(80)");
await db.query(
  "select public.ai_spend_settle($1, $2, $3, $4, $5, $6)",
  [80, 150, "rubric_score", "claude-haiku-4-5-20251001", 900, 700],
);
check((await spent("global")) === 150, "an overshooting settle stands — the money is spent");
const after = await rejects("select public.ai_spend_reserve(1)");
check(after !== null && /exhausted/.test(after), "and the next reservation pays for it by failing");

await db.query("select public.ai_spend_release(9999)");
check((await spent("global")) === 0, "a runaway release clamps at zero instead of minting budget");

check((await rejects("select public.ai_spend_reserve(0)")) !== null, "a zero-paise estimate is refused");
check(
  (await rejects(
    "select public.ai_spend_settle($1, $2, $3, $4, $5, $6)",
    [10, -5, "rubric_score", "m", 1, 1],
  )) !== null,
  "a negative actual cost is refused",
);

await reset();
await db.exec(`
  insert into public.budget_guards (scope, scope_id, ceiling_paise, period_start)
  values ('global', null, 1, now() - interval '60 days'),
         ('global', null, 100000, now());
`);
check(
  (await rejects("select public.ai_spend_reserve(500)")) === null,
  "the newest period's guard is the one that counts",
);

console.log("\n── who may touch the money ─────────────────────────────────");
await db.exec(
  "grant usage on schema public to anon, authenticated; grant select on all tables in schema public to anon, authenticated;",
);
for (const role of ["anon", "authenticated"]) {
  // Two transactions on purpose: the refused call aborts the first one, and
  // reading through an aborted transaction proves nothing.
  await db.exec(`begin; set local role ${role};`);
  const denied = await rejects("select public.ai_spend_reserve(1)");
  await db.exec("rollback;");
  await db.exec(`begin; set local role ${role};`);
  const usageRows = await one("select count(*)::int n from public.ai_usage");
  const guardRows = await one("select count(*)::int n from public.budget_guards");
  await db.exec("rollback;");
  check(denied !== null && /permission denied/.test(denied), `${role} cannot reserve spend`);
  check(usageRows.n === 0 && guardRows.n === 0, `${role} reads no ledger and no ceilings`);
}

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
