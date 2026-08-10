/**
 * Proves the course-request rules hold in the database.
 *
 *   node scripts/assert-course-requests.mjs
 *
 * This is an unauthenticated text box on the landing page that writes to
 * Postgres. Every limit on it is therefore a limit a stranger will eventually
 * test, so none of them are checked in the form alone:
 *
 *   - a prompt too short to write a course from is refused
 *   - a prompt long enough to be a denial-of-service is refused
 *   - one browser cannot file more than five in a day
 *   - the same browser asking twice for the same thing is one row
 *   - anon cannot read the table back
 *
 * The last one is the one with teeth. These are unmoderated strings typed by
 * strangers, and a readable table would publish them — including whatever
 * personal detail somebody decides to put in a box that looks like a chat.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const SEED = path.join(ROOT, "supabase", "seed.sql");

const BROWSER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const BROWSER_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

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
for (const f of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(MIGRATIONS, f), "utf8"));
}
await db.exec(readFileSync(SEED, "utf8"));

const one = async (q, p = []) => (await db.query(q, p)).rows[0];
const send = (prompt, who) =>
  db.query("select public.request_course($1, $2) as id", [prompt, who]);
const refuses = async (prompt, who) => {
  try {
    await send(prompt, who);
    return false;
  } catch {
    return true;
  }
};

console.log("── what gets accepted ──────────────────────────────────────");
const first = await send("Backend engineer at a product company, I know Python", BROWSER_A);
check(Boolean(first.rows[0]?.id), "a real request is filed and returns an id");

const stored = await one("select prompt, status, user_id from public.course_requests");
check(stored.status === "new", `it lands in the ops queue as 'new' (${stored.status})`);
check(stored.user_id === null, "an anonymous request has no user attached, rather than a fake one");

console.log("\n── what gets refused ───────────────────────────────────────");
check(await refuses("devops", BROWSER_A), "a prompt too short to write a course from");
check(await refuses("   ", BROWSER_A), "whitespace is not a request");
check(await refuses("x".repeat(601), BROWSER_A), "a prompt over the length cap");

// The column constraint is what makes the limit true; the function only makes
// it polite. Checked separately so removing one does not silently rely on the
// other.
let columnRefuses = false;
try {
  await db.query(
    "insert into public.course_requests (prompt, requester_key) values ($1, $2)",
    ["short", BROWSER_A],
  );
} catch {
  columnRefuses = true;
}
check(columnRefuses, "the column CHECK refuses a short prompt on a direct insert too");

console.log("\n── one browser, one voice ──────────────────────────────────");
await send("Backend engineer at a product company, I know Python", BROWSER_A);
const dupes = await one(
  "select count(*)::int n from public.course_requests where requester_key = $1",
  [BROWSER_A],
);
check(dupes.n === 1, `asking twice for the same thing is one row (${dupes.n})`);

for (let i = 2; i <= 5; i++) {
  await send(`A different job number ${i}, described at sufficient length`, BROWSER_A);
}
const atLimit = await one(
  "select count(*)::int n from public.course_requests where requester_key = $1",
  [BROWSER_A],
);
check(atLimit.n === 5, `five distinct requests are allowed (${atLimit.n})`);
check(
  await refuses("A sixth job, also described at sufficient length", BROWSER_A),
  "the sixth in a day is refused",
);
check(
  Boolean((await send("A different browser entirely, described at length", BROWSER_B)).rows[0]?.id),
  "another browser is unaffected by the first one's limit",
);

console.log("\n── what anon can see ───────────────────────────────────────");
await db.exec("grant usage on schema public to anon; grant select on all tables in schema public to anon;");
await db.exec("begin; set local role anon;");
const visible = await one("select count(*)::int n from public.course_requests");
await db.exec("rollback;");
check(visible.n === 0, `anon reads no requests back (${visible.n} visible)`);

console.log("\n── reading your own back ───────────────────────────────────");
// The landing page says "check your courses to see the status", so there has
// to be a way to check that does not open the table to everyone.
const mine = await db.query("select * from public.my_course_requests($1)", [BROWSER_A]);
check(mine.rows.length === 5, `this browser sees its own five (${mine.rows.length})`);
check(
  mine.rows.every((r) => r.status === "new"),
  "each one reports the ops status, so the page can say where it got to",
);
check(
  !mine.rows.some((r) => r.prompt.includes("different browser entirely")),
  "and not the other browser's request",
);

const theirs = await db.query("select * from public.my_course_requests($1)", [BROWSER_B]);
check(theirs.rows.length === 1, `the other browser sees only its own (${theirs.rows.length})`);

const nobody = await db.query("select * from public.my_course_requests(null)");
check(
  nobody.rows.length === 0,
  `no key and no session returns nothing, not everything (${nobody.rows.length})`,
);

console.log("\n── claiming on sign-in ─────────────────────────────────────");
// Somebody asks anonymously, likes the place, signs up. Their request should
// follow them to the account rather than being stranded in localStorage.
let refusedAnon = false;
try {
  await db.query("select public.claim_course_requests($1)", [BROWSER_B]);
} catch {
  refusedAnon = true;
}
check(refusedAnon, "claiming without a session is refused");

await db.exec(`
  -- No phone: the shim makes it unique and the seed already used one.
  insert into auth.users (id) values ('55555555-5555-4555-8555-000000000001')
  on conflict (id) do nothing;
`);
await db.exec("begin; set local jintu.uid = '55555555-5555-4555-8555-000000000001';");
const claimed = await one("select public.claim_course_requests($1) as n", [BROWSER_B]);
check(Number(claimed.n) === 1, `signing in claims what this browser filed (${claimed.n})`);

await db.exec("commit;");

// The real question is whether somebody else holding the same key can take
// rows that already belong to an account. Holding a key must not be a way to
// inherit another person's history.
await db.exec(`
  insert into auth.users (id) values ('55555555-5555-4555-8555-000000000002')
  on conflict (id) do nothing;
`);
await db.exec("begin; set local jintu.uid = '55555555-5555-4555-8555-000000000002';");
const stolen = await one("select public.claim_course_requests($1) as n", [BROWSER_B]);
await db.exec("rollback;");
check(
  Number(stolen.n) === 0,
  `a second account holding the same key claims nothing (${stolen.n} taken)`,
);

const stillTheirs = await one(
  "select user_id from public.course_requests where requester_key = $1",
  [BROWSER_B],
);
check(
  stillTheirs.user_id === "55555555-5555-4555-8555-000000000001",
  "and the row still belongs to whoever claimed it first",
);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
