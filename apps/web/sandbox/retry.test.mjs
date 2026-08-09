/**
 * Tests the retry predicate and loop.
 *
 *   node apps/web/sandbox/retry.test.mjs
 *
 * The logic is duplicated here rather than imported: lib/supabase/retry.ts is
 * TypeScript inside the Next app and this suite runs on plain node, the same
 * way run-sql.test.mjs does. Duplication is a real cost, so the rule is that
 * the copy below must stay identical to the source — if the regex changes
 * there and not here, this file is testing fiction.
 *
 * The behaviour is worth pinning down because getting it wrong is silent in
 * both directions: retry a permission error and the page just fails slower;
 * fail to retry a dropped socket and one blip 500s the funnel page.
 */

const TRANSIENT =
  /fetch failed|network|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|socket hang up|terminated|other side closed/i;

function isTransient(error) {
  if (!error) return false;
  if (error.code) return false;
  return TRANSIENT.test(error.message ?? "");
}

async function retryRead(run, { attempts = 3, baseDelayMs = 1 } = {}) {
  let last;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    last = await run();
    if (!isTransient(last.error)) return last;
    if (attempt < attempts) {
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
    }
  }
  return last;
}

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

console.log("── what counts as transient ────────────────────────────────");
for (const [label, error, expected] of [
  ["a dropped fetch", { message: "TypeError: fetch failed" }, true],
  ["a reset connection", { message: "read ECONNRESET" }, true],
  ["a DNS failure", { message: "getaddrinfo EAI_AGAIN db.supabase.co" }, true],
  ["a hung socket", { message: "socket hang up" }, true],
  ["an undici termination", { message: "terminated" }, true],
  // These are answers from the server. Retrying them fails slower and hides
  // the real cause behind a delay.
  ["a missing table", { message: "Could not find the table", code: "PGRST205" }, false],
  ["a permission error", { message: "permission denied", code: "42501" }, false],
  ["a constraint violation", { message: "violates check constraint", code: "23514" }, false],
  ["no error at all", null, false],
  // A coded error whose text happens to contain a transient word must still
  // not be retried — the code is what decides.
  ["a coded error mentioning the network", { message: "network policy denied", code: "42501" }, false],
]) {
  check(isTransient(error) === expected, `${label} -> ${expected ? "retry" : "do not retry"}`);
}

console.log("\n── the loop ────────────────────────────────────────────────");
{
  let calls = 0;
  const res = await retryRead(async () => {
    calls++;
    return calls < 3
      ? { data: null, error: { message: "TypeError: fetch failed" } }
      : { data: [{ slug: "ok" }], error: null };
  });
  check(calls === 3, `retried until it succeeded (${calls} calls)`);
  check(res.error === null && res.data?.[0]?.slug === "ok", "returned the successful result");
}
{
  let calls = 0;
  const res = await retryRead(async () => {
    calls++;
    return { data: null, error: { message: "TypeError: fetch failed" } };
  });
  check(calls === 3, `gave up after the attempt limit (${calls} calls)`);
  check(res.error !== null, "surfaced the last error rather than swallowing it");
}
{
  let calls = 0;
  await retryRead(async () => {
    calls++;
    return { data: null, error: { message: "permission denied", code: "42501" } };
  });
  check(calls === 1, `a real database error is not retried (${calls} call)`);
}
{
  let calls = 0;
  const res = await retryRead(async () => {
    calls++;
    return { data: [], error: null };
  });
  check(calls === 1, "a success is not retried");
  check(Array.isArray(res.data), "an empty result is a success, not a failure");
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
