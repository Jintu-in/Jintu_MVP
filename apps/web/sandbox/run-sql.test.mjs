/**
 * Tests the sandbox process itself, not a stand-in for it.
 *
 *   node apps/web/sandbox/run-sql.test.mjs
 *
 * The grading package already proves read-only against a runner defined in
 * its own test file. That is a different program. run-sql.mjs is the one that
 * actually receives student SQL in production, and until now nothing executed
 * it — the same shape as the trigger that shipped green because no test ever
 * fired it.
 *
 * Everything here spawns the real script the real way: `node run-sql.mjs`,
 * JSON on stdin, JSON on stdout, empty environment.
 */
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, "run-sql.mjs");

const SETUP = `
  create table customers (id int primary key, name text);
  create table rentals (id int primary key, customer_id int, amount numeric);
  insert into customers values (1,'Asha'), (2,'Ravi');
  insert into rentals values (1,1,120.00), (2,2,300.00);
`;

function runSandbox(sql, { setup = SETUP, timeout = 20_000 } = {}) {
  return new Promise((resolve) => {
    const child = execFile(
      process.execPath,
      [SCRIPT],
      { timeout, killSignal: "SIGKILL", env: {}, maxBuffer: 8 * 1024 * 1024 },
      (error, stdout) => {
        if (error && !stdout) return resolve({ killed: true, error });
        try {
          resolve({ killed: false, result: JSON.parse(stdout) });
        } catch {
          resolve({ killed: false, raw: stdout, parseFailed: true });
        }
      },
    );
    child.stdin.end(JSON.stringify({ setup, sql }));
  });
}

let passed = 0;
const failures = [];
function check(ok, label, detail) {
  if (ok) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push({ label, detail });
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log("── sandbox: the real process ───────────────────────────────");

{
  const { result } = await runSandbox(
    "select c.name, sum(r.amount) as revenue from customers c join rentals r on r.customer_id = c.id group by c.name order by revenue desc",
  );
  check(result?.ok === true, "a correct query returns rows and columns", JSON.stringify(result)?.slice(0, 90));
  check(
    result?.columns?.join(",") === "name,revenue",
    "columns come back in order",
    result?.columns?.join(","),
  );
  check(Array.isArray(result?.plan) || result?.plan !== undefined, "a query plan is returned for the cross-join check");
}

// The security boundary. If these ever pass, a student can mutate the fixture
// — and the same runner shape is what will face a real dataset.
console.log("\n── read-only is enforced by Postgres, not by string matching ──");
for (const [label, sql] of [
  ["delete", "delete from rentals"],
  ["update", "update rentals set amount = 0"],
  ["insert", "insert into rentals values (99, 1, 1)"],
  ["drop table", "drop table rentals"],
  ["create table", "create table sneaky (id int)"],
  ["truncate", "truncate rentals"],
]) {
  const { result } = await runSandbox(sql);
  const refused = result?.ok === false && /read-only|read only/i.test(result?.error ?? "");
  check(refused, `${label} is refused by the transaction`, result?.error?.slice(0, 70));
}

console.log("\n── failure handling ────────────────────────────────────────");
{
  const { result } = await runSandbox("select nope from nowhere");
  check(result?.ok === false && !result?.fatal, "an invalid query is the student's error, not fatal");
  check(/nowhere/i.test(result?.error ?? ""), "the database's own message reaches the student", result?.error?.slice(0, 60));
}
{
  const { result } = await runSandbox("select generate_series(1, 20000) as n");
  check(
    result?.ok === false && /rows/i.test(result?.error ?? ""),
    "an oversized result is refused rather than returned",
    result?.error?.slice(0, 70),
  );
}
{
  // A fixture that cannot apply is our bug; `fatal` is what stops the parent
  // recording a zero against someone's work.
  const { result } = await runSandbox("select 1", { setup: "this is not sql" });
  check(result?.ok === false && result?.fatal === true, "a broken fixture is reported as fatal");
}

console.log("\n── the process holds nothing worth stealing ────────────────");
{
  // Spawned with env: {} — a submission that escaped read-only would still
  // find no credentials here.
  const { result } = await runSandbox(
    "select count(*)::int as n from customers where name = 'Asha'",
  );
  check(result?.ok === true && result.rows?.[0]?.n === 1, "the child works with an empty environment");
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  for (const f of failures) console.error(`  - ${f.label}${f.detail ? `: ${f.detail}` : ""}`);
  process.exit(1);
}
