/**
 * Runs one untrusted SQL submission and prints the result as JSON.
 *
 * This file is spawned as its own OS process, and that is the whole design.
 *
 * PGlite does not honour `statement_timeout`: it is Postgres compiled to
 * WebAssembly running on one thread, and the timer that would interrupt a
 * statement never fires. A 200-million-row `generate_series` set to abort
 * after one second was measured running for fifty-one. So the read-only
 * transaction below is a real guarantee — Postgres itself enforces it — and
 * the time limit is not, and cannot be, enforced from inside. The parent
 * (src/lib/grading/sandbox.ts) enforces it by killing this process.
 *
 * Two further properties follow from being a separate process, and both are
 * the reason not to "simplify" this into an in-process call:
 *
 *   - it holds no credentials. There is no Supabase client here and no
 *     service-role key. A submission that somehow escaped the read-only
 *     transaction would find nothing worth reaching.
 *   - a runaway query blocks this process and no other. In-process, PGlite's
 *     WASM call blocks the Node event loop, so one student's cartesian join
 *     stalls every request the server is serving.
 *
 * Protocol: JSON in on stdin, one JSON object out on stdout.
 *   in:  { setup: string, sql: string }
 *   out: { ok: true, columns, rows, plan } | { ok: false, error, fatal? }
 */
import { PGlite } from "@electric-sql/pglite";

/** No week-one answer is this big; a query that returns more has already gone wrong. */
const MAX_ROWS = 5000;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const { setup, sql } = JSON.parse(await readStdin());
  const db = await PGlite.create();

  try {
    // The fixture is authored input, not student input, so it runs with full
    // rights — it has to, it creates tables.
    await db.exec(setup);

    // Everything from here is the submission. Read-only is enforced by
    // Postgres rather than by looking for the word "delete" in the text,
    // which is the only version of this check that cannot be talked around.
    await db.exec("begin; set transaction read only;");

    let result;
    try {
      result = await db.query(sql);
    } catch (error) {
      // The database's own message is almost always the most useful sentence
      // anyone could write about what is wrong with the query, so it goes
      // back to the student unedited.
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }

    if (result.rows.length > MAX_ROWS) {
      return {
        ok: false,
        error:
          `The query returned ${result.rows.length} rows. Nothing this assignment ` +
          `asks for is that large — check the join condition.`,
      };
    }

    // Best effort: `explain` fails on anything that is not a single plannable
    // statement, and a missing plan only costs the grader its cross-join
    // check.
    let plan = null;
    try {
      const explained = await db.query(`explain (format json) ${sql}`);
      plan = explained.rows[0]?.["QUERY PLAN"] ?? null;
    } catch {
      plan = null;
    }

    return {
      ok: true,
      columns: (result.fields ?? []).map((f) => f.name),
      rows: result.rows,
      plan,
    };
  } finally {
    await db.close().catch(() => {});
  }
}

try {
  process.stdout.write(JSON.stringify(await main()));
} catch (error) {
  // A failure out here is ours, not the student's: bad JSON on stdin, a
  // fixture that does not apply, PGlite failing to start. `fatal` is what
  // tells the parent not to record a zero against someone's work.
  process.stdout.write(
    JSON.stringify({
      ok: false,
      fatal: true,
      error: error instanceof Error ? error.message : String(error),
    }),
  );
  process.exitCode = 1;
}
