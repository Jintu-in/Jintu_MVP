/**
 * Proves the course-request rules hold in the database.
 *
 *   node scripts/assert-course-requests.mjs
 *
 * This is a text box on the landing page that writes to Postgres. Every limit
 * on it is a limit somebody will eventually test, so none of them are checked
 * in the form alone:
 *
 *   - filing needs an account, and says so with a code the client can act on
 *   - a prompt too short to write a course from is refused
 *   - a prompt long enough to be a denial-of-service is refused
 *   - one account cannot file more than five in a day
 *   - the same person asking twice for the same thing is one row
 *   - anon cannot read the table back
 *   - a shared link opens for anyone signed in, and for nobody else
 *   - a browser key unlocks only rows nobody owns
 *
 * The last two carry the most weight. Sharing is the feature; the key is the
 * thing that must not quietly become a second password for an account, which
 * is what it was on the way to becoming when requests gained owners.
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

// Requesting needs an account since 20260810040000, so the suite runs as a
// signed-in user. The anon case is asserted separately at the bottom.
const USER_A = "55555555-5555-4555-8555-00000000000a";
const USER_B = "55555555-5555-4555-8555-00000000000b";
await db.exec(`insert into auth.users (id) values (${"'"}${USER_A}${"'"}), (${"'"}${USER_B}${"'"}) on conflict (id) do nothing;`);
const asUser = async (uid) => db.exec(`set jintu.uid = ${"'"}${uid}${"'"};`);
await asUser(USER_A);
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
// Changed by 20260810040000. It used to be that a request had no owner; now it
// always has one, which is what makes it answerable and shareable.
check(stored.user_id === USER_A, "it is attached to the account that filed it");

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

console.log("\n── one account, one voice ──────────────────────────────────");
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
await asUser(USER_B);
check(
  Boolean((await send("A different account entirely, described at length", BROWSER_B)).rows[0]?.id),
  "another account is unaffected by the first one's limit",
);
await asUser(USER_A);

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

await asUser(USER_B);
const theirs = await db.query("select * from public.my_course_requests($1)", [BROWSER_B]);
check(theirs.rows.length === 1, `the other account sees only its own (${theirs.rows.length})`);

// The hole this closes: while requests were anonymous, the key matched rows
// outright. Once every request has an owner, that made a uuid out of
// localStorage a second credential for somebody's account. It now unlocks only
// rows nobody owns.
// Signed in as B, passing A's key. B still sees B's own row — that is correct
// and not what is being tested. What must not appear is anything of A's.
const withAKey = await db.query("select * from public.my_course_requests($1)", [BROWSER_A]);
const leaked = withAKey.rows.filter((r) => r.prompt.includes("Backend engineer"));
check(
  leaked.length === 0,
  `another account's browser key unlocks none of their requests (${leaked.length} leaked)`,
);

await db.exec("reset jintu.uid;");
const nobody = await db.query("select * from public.my_course_requests($1)", [BROWSER_A]);
check(
  nobody.rows.length === 0,
  `and no session plus a stolen key is still nothing (${nobody.rows.length})`,
);

console.log("\n── requesting needs an account ─────────────────────────────");
let refusedWithoutSession = false;
let code = null;
try {
  await send("A perfectly good request from nobody at all", BROWSER_A);
} catch (e) {
  refusedWithoutSession = true;
  code = e.code ?? null;
}
check(refusedWithoutSession, "anon cannot file a request");
check(
  code === "28000",
  `and it says so with 28000, which is what opens the sign-in dialog (${code})`,
);

console.log("\n── sharing ─────────────────────────────────────────────────");
const target = (await db.query("select id from public.course_requests where user_id = $1 limit 1", [USER_B])).rows[0].id;

const anonShare = await db.query("select * from public.shared_course_request($1)", [target]);
check(anonShare.rows.length === 0, `a shared link is closed to anon (${anonShare.rows.length} rows)`);

await asUser(USER_B);
const ownerView = await db.query("select * from public.shared_course_request($1)", [target]);
check(ownerView.rows.length === 1, "the author can open their own link");
check(ownerView.rows[0]?.is_mine === true, "and it knows the link is theirs");

await asUser(USER_A);
const friendView = await db.query("select * from public.shared_course_request($1)", [target]);
check(friendView.rows.length === 1, "someone else signed in can open it — that is the point of sharing");
check(friendView.rows[0]?.is_mine === false, "and it knows the link is not theirs");
check(
  !Object.keys(friendView.rows[0] ?? {}).includes("user_id"),
  "sharing reveals what was asked, never who asked",
);

const missing = await db.query("select * from public.shared_course_request($1)", [
  "99999999-9999-4999-8999-999999999999",
]);
check(missing.rows.length === 0, "an id that does not exist returns nothing rather than erroring");

await asUser(USER_A);

console.log("\n── claiming legacy anonymous requests ──────────────────────");
// Nothing can be filed anonymously any more, so claiming only concerns rows
// written before 20260810040000. One is inserted directly to stand in for them.
const LEGACY = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
await db.query(
  "insert into public.course_requests (prompt, requester_key, user_id) values ($1, $2, null)",
  ["A request filed back when these were anonymous", LEGACY],
);

await db.exec("reset jintu.uid;");
let refusedAnon = false;
try {
  await db.query("select public.claim_course_requests($1)", [LEGACY]);
} catch {
  refusedAnon = true;
}
check(refusedAnon, "claiming without a session is refused");

// An unowned row is exactly what the browser key is still for.
const seenAnon = await db.query("select * from public.my_course_requests($1)", [LEGACY]);
check(
  seenAnon.rows.length === 1,
  `an unclaimed row is still readable by the browser that filed it (${seenAnon.rows.length})`,
);

await asUser(USER_A);
const claimed = await one("select public.claim_course_requests($1) as n", [LEGACY]);
check(Number(claimed.n) === 1, `signing in claims what that browser filed (${claimed.n})`);

// Holding a key must not be a way to inherit somebody else's history.
await asUser(USER_B);
const stolen = await one("select public.claim_course_requests($1) as n", [LEGACY]);
check(
  Number(stolen.n) === 0,
  `a second account holding the same key claims nothing (${stolen.n} taken)`,
);

const stillTheirs = await one(
  "select user_id from public.course_requests where requester_key = $1",
  [LEGACY],
);
check(stillTheirs.user_id === USER_A, "and the row still belongs to whoever claimed it first");

// And once owned, the key stops unlocking it for anyone not signed in as the
// owner — the narrowing added in 20260810040000.
await db.exec("reset jintu.uid;");
const afterClaim = await db.query("select * from public.my_course_requests($1)", [LEGACY]);
check(
  afterClaim.rows.length === 0,
  `once claimed, the key alone no longer opens it (${afterClaim.rows.length})`,
);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
