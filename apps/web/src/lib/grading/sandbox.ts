import { execFile } from "node:child_process";
import path from "node:path";
import type { QueryResult, QueryRunner } from "@jintu/grading";

/**
 * A QueryRunner that executes a student's SQL in a process we are willing to
 * kill.
 *
 * @jintu/grading takes the database as an injected `QueryRunner` precisely so
 * that the dangerous part is replaceable — the grading logic never opens a
 * connection and never sees one. This is the implementation for the Next
 * server. The Phase 2 edge function will bring its own.
 *
 * The contract in the grading package asks a runner to enforce two things at
 * the database: a read-only transaction and a statement timeout. The first is
 * enforced in sandbox/run-sql.mjs; the second cannot be, because PGlite does
 * not implement statement_timeout (measured, not assumed — see that file). So
 * the timeout is a wall clock on the child process and a SIGKILL, which is
 * the one form of "stop" that works on a thread wedged inside WASM.
 *
 * One process per submission, one query per process. The grader calls `run`
 * once and `explain` once; both are served from a single execution, so the
 * child does not get to run a submission twice.
 */

/** Long enough for a real query on a fixture of a few dozen rows. */
const DEADLINE_MS = 15_000;
/** A result larger than this is a bug in the fixture or an attack, not an answer. */
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024;

export class SandboxUnavailable extends Error {}

type SandboxResult =
  | { ok: true; columns: string[]; rows: QueryResult["rows"]; plan: unknown }
  | { ok: false; error: string; fatal?: boolean };

function sandboxScript() {
  // Resolved from cwd rather than import.meta.url: the app is bundled and the
  // module's own path at runtime is inside .next, while `sandbox/` is traced
  // in as a plain file next to package.json (see next.config.ts).
  return path.join(process.cwd(), "sandbox", "run-sql.mjs");
}

async function runInSandbox(setup: string, sql: string): Promise<SandboxResult> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      process.execPath,
      [sandboxScript()],
      {
        timeout: DEADLINE_MS,
        killSignal: "SIGKILL",
        maxBuffer: MAX_OUTPUT_BYTES,
        // No inherited environment. The child needs nothing from ours — it is
        // handed the node binary by absolute path and talks over stdio — and
        // what it does not have it cannot leak into an error message that
        // ends up in front of a student.
        //
        // The cast is for Next's ProcessEnv augmentation, which declares
        // NODE_ENV required. An empty environment is the point.
        env: {} as NodeJS.ProcessEnv,
      },
      (error: Error | null, stdout: string) => {
        if (error) {
          // execFile reports the kill as an error with `killed`, which is the
          // only way to tell "ran too long" from "crashed".
          const killed = (error as { killed?: boolean }).killed;
          if (killed) {
            resolve({
              ok: false,
              error:
                `The query was still running after ${DEADLINE_MS / 1000} seconds and was stopped. ` +
                `That is almost always a join without a condition.`,
            });
            return;
          }
          reject(new SandboxUnavailable(`The SQL sandbox failed to run: ${error.message}`));
          return;
        }

        try {
          resolve(JSON.parse(stdout) as SandboxResult);
        } catch {
          reject(new SandboxUnavailable("The SQL sandbox returned something that was not JSON."));
        }
      },
    );

    child.stdin?.end(JSON.stringify({ setup, sql }));
  });
}

/**
 * Runs the submission once and hands the grading package a runner over the
 * cached outcome.
 */
export async function sandboxRunner(setup: string, sql: string): Promise<QueryRunner> {
  const outcome = await runInSandbox(setup, sql);

  if (!outcome.ok && outcome.fatal) {
    // Our fault, not the student's. Throwing leaves the submission ungraded
    // and visibly waiting, which is honest; recording a zero would not be.
    throw new SandboxUnavailable(outcome.error);
  }

  return {
    async run() {
      if (!outcome.ok) throw new Error(outcome.error);
      return { columns: outcome.columns, rows: outcome.rows };
    },
    async explain() {
      if (!outcome.ok || outcome.plan === null) {
        throw new Error("No plan available.");
      }
      return outcome.plan;
    },
  };
}
