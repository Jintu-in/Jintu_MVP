/**
 * Enforces the ARCHITECTURE.md §7 schema rules against supabase/migrations.
 *
 * Static analysis, deliberately: it needs no database, no Docker, and no
 * secrets, so it runs on every PR in a few milliseconds. It cannot prove a
 * policy is *correct* — only that the structural guarantees are present. The
 * failure it exists to prevent is a table shipped without RLS, which in
 * Postgres means world-readable to anyone holding the anon key, and the anon
 * key ships in the client bundle by design.
 *
 *   node scripts/assert-schema-rules.mjs [migrations-dir]
 *
 * The optional directory argument exists so the rules can be tested against
 * deliberately broken fixtures — a guard that has never been seen to fail is
 * not a guard.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "supabase", "migrations");

/** Strip comments and string literals so prose never trips a rule. */
function strip(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ")
    .replace(/'(?:[^']|'')*'/g, "''");
}

const files = readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("No migrations found in supabase/migrations — nothing to check.");
  process.exit(1);
}

const sql = strip(files.map((f) => readFileSync(path.join(MIGRATIONS, f), "utf8")).join("\n"));

const failures = [];
const fail = (rule, detail) => failures.push({ rule, detail });

// ── Rule 1 — every table has RLS enabled ─────────────────────────────────────
const tables = [
  ...sql.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?(\w+)"?/gi),
].map((m) => m[1]);

const rlsEnabled = new Set(
  [
    ...sql.matchAll(
      /alter\s+table\s+(?:public\.)?"?(\w+)"?\s+enable\s+row\s+level\s+security/gi,
    ),
  ].map((m) => m[1]),
);

// ── Rule 2 — every table has at least one policy ─────────────────────────────
// The policy NAME must be consumed explicitly rather than skipped over with a
// lazy `.*?`. A name like "authors read grades on their own work" contains the
// word "on", so a lazy match binds there and captures "their" as the table —
// silently reporting a policied table as unprotected.
const policied = new Set(
  [
    ...sql.matchAll(
      /create\s+policy\s+(?:"(?:[^"]|"")*"|[^\s"]+)\s+on\s+(?:public\.)?"?(\w+)"?/gi,
    ),
  ].map((m) => m[1]),
);

// Some tables are correctly unreachable from any client: cost ledgers, audit
// logs, crawler output. RLS on with no policy denies everyone, and the service
// role bypasses RLS, which is exactly right for those. The exemption has to be
// declared in the schema rather than inferred, so it is visible in review and
// cannot be acquired by forgetting to write a policy.
const serviceRoleOnly = new Set(
  [
    ...sql.matchAll(
      /comment\s+on\s+table\s+(?:public\.)?"?(\w+)"?\s+is\s+''/gi,
    ),
  ].map((m) => m[1]),
);
// Comments are blanked by strip(); re-read the raw text for the marker.
const rawSql = files
  .map((f) => readFileSync(path.join(MIGRATIONS, f), "utf8"))
  .join("\n");
for (const m of rawSql.matchAll(
  /comment\s+on\s+table\s+(?:public\.)?"?(\w+)"?\s+is\s+'([^']*(?:''[^']*)*)'/gi,
)) {
  if (/service-role only/i.test(m[2] ?? "")) serviceRoleOnly.add(m[1]);
  else serviceRoleOnly.delete(m[1]);
}

for (const t of tables) {
  if (!rlsEnabled.has(t)) {
    fail("rls-enabled", `table "${t}" never enables row level security`);
  } else if (!policied.has(t) && !serviceRoleOnly.has(t)) {
    fail(
      "rls-policy",
      `table "${t}" has RLS on but no policy, so it is unreachable by every client. ` +
        `If that is intended, say so in a table comment containing "service-role only".`,
    );
  }
}

// ── Rule 3 — Law 2: no third-party content columns ───────────────────────────
//
// Scoped, because a blanket ban on these words produces false positives that
// get guards switched off. ARCHITECTURE.md §7 scopes the rule to `resources`,
// and §3 itself specifies a `tracks.summary` column — our own one-line blurb
// about our own track, which Law 2 has nothing to say about.
//
// So the rule follows the semantics rather than a hardcoded table name: any
// table that points at someone else's content (it has an external_url) may
// not also store that content. "transcript" and "full_text" are banned
// everywhere, because there is no innocent use of either.
const CONTENT_COLUMNS = ["transcript", "summary", "full_text", "content"];
const ALWAYS_FORBIDDEN = ["transcript", "full_text"];

/** Split into `create table <name> ( ... );` blocks so rules can be per-table. */
const tableBlocks = [
  ...sql.matchAll(
    /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?(\w+)"?\s*\(([\s\S]*?)\n\s*\);/gi,
  ),
].map((m) => ({ name: m[1], body: m[2] ?? "" }));

const declaresColumn = (body, col) =>
  new RegExp(`^\\s*"?${col}"?\\s+(text|varchar|jsonb|json)\\b`, "im").test(body);

for (const { name, body } of tableBlocks) {
  const referencesThirdParty = /^\s*"?external_url"?\s/im.test(body);
  const banned = referencesThirdParty ? CONTENT_COLUMNS : ALWAYS_FORBIDDEN;

  for (const col of banned) {
    if (declaresColumn(body, col))
      fail(
        "law-2-no-stored-content",
        `"${name}.${col}" — ${
          referencesThirdParty
            ? `${name} links to third-party content, so it may not also store it`
            : `a "${col}" column has no innocent use`
        }. Law 2 permits URLs and metadata only.`,
      );
  }
}

// ── Rule 4 — policies must use (select auth.uid()) ───────────────────────────
// Bare auth.uid() re-evaluates per row; the subquery form is cached per
// statement. On a 600-student batch this is the difference between fast and
// unusable, so it is a rule rather than a review comment.
for (const m of sql.matchAll(/auth\.uid\s*\(\s*\)/gi)) {
  const before = sql.slice(Math.max(0, m.index - 40), m.index);
  if (!/\(\s*select\s+$/i.test(before))
    fail(
      "auth-uid-subquery",
      `bare auth.uid() near "...${before.trim().slice(-30)}" — wrap it as (select auth.uid())`,
    );
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`Checked ${files.length} migration(s), ${tables.length} table(s).\n`);
for (const t of tables) {
  const hasPolicy = policied.has(t);
  const exempt = serviceRoleOnly.has(t);
  const ok = rlsEnabled.has(t) && (hasPolicy || exempt);
  const label = ok ? (exempt && !hasPolicy ? "svc " : "ok  ") : "FAIL";
  console.log(
    `  ${label}  ${t.padEnd(20)} rls=${rlsEnabled.has(t) ? "on" : "OFF"}  ` +
      `policies=${hasPolicy ? "yes" : exempt ? "none (service-role only)" : "none"}`,
  );
}

if (failures.length) {
  console.error(`\n${failures.length} violation(s):\n`);
  for (const { rule, detail } of failures) console.error(`  [${rule}] ${detail}`);
  console.error("\nSee ARCHITECTURE.md §7.");
  process.exit(1);
}

console.log("\nAll §7 schema rules pass.");
