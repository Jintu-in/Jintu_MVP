/**
 * "Download everything" has to mean everything.
 *
 * The failure mode this guards is not a bug in today's code — it is next
 * quarter's migration adding a user-scoped table and nobody remembering the
 * export. So this reads the migrations, finds every table with a user_id (or
 * a profiles reference), and fails if the export route does not name it.
 *
 * DPDP gives a person the right to what is held about them; a table quietly
 * missing from the file is a right quietly not honoured.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..", "..");
const MIGRATIONS = join(ROOT, "supabase", "migrations");

const routeSrc = readFileSync(
  join(here, "..", "src", "app", "(auth)", "profile", "export", "route.ts"),
  "utf8",
);

const sql = readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((f) => readFileSync(join(MIGRATIONS, f), "utf8"))
  .join("\n");

/** Tables whose absence from the export is deliberate, with the reason. */
const NOT_EXPORTED = {
  profiles: "exported explicitly as `profile`, not in the table loop",
  audit_log: "administrative record of our actions, not the person's data; service-role only",
  auth_attempts: "SHA-256 hashes only, never plaintext; holds no readable personal data",
  roadmaps:
    "public editorial content. Its only link to a person is maintainer_id, which is our staff attribution, not the reader's data.",
};

function userScopedTables() {
  const found = new Set();
  // Each `create table public.x ( ... );` block, scanned for a user column.
  for (const m of sql.matchAll(/create table (?:if not exists )?public\.([a-z_]+)\s*\(([\s\S]*?)\n\);/g)) {
    const [, name, body] = m;
    if (/\buser_id\b/.test(body) || /references public\.profiles/.test(body)) found.add(name);
  }
  return [...found].sort();
}

test("every user-scoped table is either exported or explicitly excused", () => {
  const missing = [];
  for (const t of userScopedTables()) {
    if (t in NOT_EXPORTED) continue;
    // Named in the TABLES list of the export route.
    if (!routeSrc.includes('["' + t + '"')) missing.push(t);
  }
  assert.deepEqual(
    missing,
    [],
    `these tables hold data about a person but are not in the export: ${missing.join(", ")}`,
  );
});

test("the export names the tables the brief lists by name", () => {
  for (const t of [
    "consents",
    "activity_days",
    "point_events",
    "saved_resources",
    "reminder_prefs",
    "public_profiles",
  ]) {
    assert.ok(routeSrc.includes('["' + t + '"'), t + " missing from the export");
  }
  assert.match(routeSrc, /profile: profile/, "the profile row itself");
});

test("the export is never cached and downloads as a named file", () => {
  assert.match(routeSrc, /no-store/);
  assert.match(routeSrc, /jintu-export-\$\{slug\}-\$\{today\}\.json/);
  assert.match(routeSrc, /content-disposition/);
});

test("it says so when a table errors, rather than dropping it silently", () => {
  // A gap in an export is indistinguishable from "we hold nothing".
  assert.match(routeSrc, /error \? \{ error: error\.message \}/);
});

test("nothing claims to export notes, which do not exist yet", () => {
  assert.match(routeSrc, /not_held/);
  const notesTable = /create table (?:if not exists )?public\.(notes|highlights)\b/.test(sql);
  assert.equal(notesTable, false, "a notes table now exists — add it to the export and delete this test");
});
