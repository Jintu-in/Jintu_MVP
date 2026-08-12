// GENERATED from packages/grading/src by scripts/build-deno-grading.mjs.
// Do not edit: edit the package source and re-run the build. CI fails on drift.
import { gradeSqlSubmission } from "./deterministic/sql.ts";
import type { QueryRunner, SqlAssignmentSpec } from "./deterministic/types.ts";

/**
 * The checker registry — TRACK_MODEL.md Part 4's one load-bearing field.
 *
 * A rubric criterion names a checker as a string; this registry is what that
 * string resolves to. The claim it exists to keep true: adding a subject to
 * Jintu is inserting rows, never writing a grader. Eleven names, forever —
 * if a new subject seems to need a twelfth, it needs a better artifact.
 *
 * Runtime-pure like everything in this package: runs in Next server actions
 * (Node) and Supabase Edge Functions (Deno). No node: imports; fetch and
 * AbortController are the globals both runtimes share, and the one checker
 * that needs the network takes fetch as an argument so tests can hand it a
 * fake.
 *
 * Every checker takes `unknown` input and refuses with `passed: false` and a
 * detail naming what was missing, rather than throwing. A checker that throws
 * turns a data-entry mistake in a track into a failed grading run; a checker
 * that refuses legibly turns it into a sentence in the ops queue.
 */

export type CheckResult = {
  passed: boolean;
  /** Shown to a student or an operator. Says what is wrong, not merely that. */
  detail: string;
};

export type Checker = (input: unknown, args: string[]) => CheckResult | Promise<CheckResult>;

/**
 * Every name a rubric may declare (README: twelve checkers, eleven free, one
 * paid — plus two legacy/planned names). Track validation checks names
 * against THIS list, so an author can reference a planned checker in a draft
 * — but publish-time validation must require every checker on a published
 * track to be in CHECKERS, which only holds the implemented ones.
 *
 * contains_join predates contains_pattern and stays because published DA v2
 * reps reference it; new authoring uses contains_pattern.
 */
export const CHECKER_NAMES = [
  "sql_diff",
  "numeric_cells",
  "formula_present",
  "consistent_with",
  "code_test_suite",
  "answer_key_match",
  "non_empty",
  "duration_between",
  "has_sections",
  "url_reachable",
  "media_has_audio",
  "contains_join",
  "contains_pattern",
  "row_count_ceiling",
  "rubric_score",
] as const;

export type CheckerName = (typeof CHECKER_NAMES)[number];

const asRecord = (v: unknown): Record<string, unknown> | null =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;

const refuse = (detail: string): CheckResult => ({ passed: false, detail });

/* ── structural — archetype 3, free forever ────────────────────────────── */

/** Something was actually submitted. The floor under every other check. */
const non_empty: Checker = (input) => {
  const text = typeof input === "string" ? input : String(asRecord(input)?.text ?? "");
  if (text.trim().length > 0) return { passed: true, detail: "Submission is not empty." };
  return refuse("Nothing was submitted.");
};

/**
 * The recording is between N and M seconds. args: [min, max].
 *
 * Reads a duration the caller measured, it does not probe media itself — that
 * is media_has_audio's unsolved half, and this checker does not pretend to
 * solve it. What it guarantees is the honest bracket: a 20-second clip cannot
 * pass a "record two minutes" artifact by existing.
 */
const duration_between: Checker = (input, args) => {
  const min = Number(args[0]);
  const max = Number(args[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max <= min) {
    return refuse(`duration_between needs [min, max] seconds; got [${args.join(", ")}].`);
  }

  const duration = Number(asRecord(input)?.durationSec);
  if (!Number.isFinite(duration)) {
    return refuse("No duration on the submission — the uploader did not measure the recording.");
  }

  if (duration < min) {
    return refuse(`Recording is ${Math.round(duration)}s; this artifact needs at least ${min}s.`);
  }
  if (duration > max) {
    return refuse(
      `Recording is ${Math.round(duration)}s; keep it under ${max}s — making the point briefly is part of the work.`,
    );
  }
  return { passed: true, detail: `Recording is ${Math.round(duration)}s, inside ${min}–${max}s.` };
};

/**
 * The document contains each required section. args: section names.
 *
 * A heading counts if a line starts with the name (optionally after markdown
 * # marks or list markers), case-insensitive. Deliberately not a substring
 * search of the whole text: "I will not include a Methods section" must not
 * satisfy a Methods requirement.
 */
const has_sections: Checker = (input, args) => {
  if (args.length === 0) return refuse("has_sections was given no section names to look for.");

  const text = typeof input === "string" ? input : String(asRecord(input)?.text ?? "");
  if (!text.trim()) return refuse("Nothing was submitted.");

  const lines = text.split(/\r?\n/).map((l) => l.replace(/^[\s#>*-]+/, "").trim().toLowerCase());
  const missing = args.filter(
    (name) => !lines.some((l) => l === name.toLowerCase() || l.startsWith(`${name.toLowerCase()}:`)),
  );

  if (missing.length) {
    return refuse(`Missing section${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
  }
  return { passed: true, detail: `All ${args.length} required sections present.` };
};

/**
 * The submitted URL answers. Serves link-shaped artifacts: a deployed app, a
 * dashboard, a repository.
 *
 * fetch is injected (input.fetch) so tests never touch the network and the
 * edge function can pass its own. GET, not HEAD: half the hosts students
 * deploy to answer HEAD with 403/405, and a checker that fails on the host
 * rather than the work grades the wrong thing.
 */
const url_reachable: Checker = async (input) => {
  const rec = asRecord(input);
  const url = String(rec?.url ?? "");
  const doFetch = (rec?.fetch ?? globalThis.fetch) as typeof globalThis.fetch | undefined;

  if (!/^https:\/\//.test(url)) {
    return refuse("Submit an https:// link. Plain http and file links are not checkable.");
  }
  if (typeof doFetch !== "function") return refuse("No fetch available in this runtime.");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await doFetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
      if (res.status >= 200 && res.status < 400) {
        return { passed: true, detail: `Link answers with HTTP ${res.status}.` };
      }
      return refuse(`Link answers with HTTP ${res.status} — it has to load for a reviewer.`);
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return refuse("Link did not answer within ten seconds. Check it loads while signed out.");
  }
};

/**
 * The text contains a JOIN. Crude string matching, gameable, and that is
 * accepted: TRACK_MODEL Part 10 — a student who games "must contain a join"
 * has still written a join. Never attach more than one point to this.
 */
const contains_join: Checker = (input) => {
  const text = typeof input === "string" ? input : String(asRecord(input)?.text ?? "");
  if (!text.trim()) return refuse("Nothing was submitted.");
  if (/\bjoin\b/i.test(text)) return { passed: true, detail: "Uses a join." };
  return refuse("No join found — this week's work is about combining tables.");
};

/**
 * A named construct is present. args: the words/phrases to look for (ANY of
 * them satisfies — authors list synonyms, not requirements). Word-boundary
 * matching on literals, never author-supplied regex: a rubric row must not
 * be able to smuggle a pathological pattern into the grader.
 *
 * Gameable by design and priced accordingly — README: max 1 point.
 */
const contains_pattern: Checker = (input, args) => {
  if (args.length === 0) return refuse("contains_pattern was given nothing to look for.");
  const text = typeof input === "string" ? input : String(asRecord(input)?.text ?? "");
  if (!text.trim()) return refuse("Nothing was submitted.");

  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hit = args.find((p) => new RegExp(`\\b${escape(p)}\\b`, "i").test(text));
  if (hit) return { passed: true, detail: `Uses ${hit}.` };
  return refuse(
    `None of the expected constructs appear (looked for: ${args.join(", ")}).`,
  );
};

/**
 * The recording has an audio track and it is not silence. Reads a probe
 * result an adapter produced (facts.mediaProbe) — this package never shells
 * out to ffprobe. args: [minMeanVolumeDb] (default -50): quiet narration
 * passes, a muted mic does not.
 */
const media_has_audio: Checker = (input, args) => {
  const floor = args[0] !== undefined ? Number(args[0]) : -50;
  if (!Number.isFinite(floor)) {
    return refuse(`media_has_audio needs a numeric [minMeanVolumeDb]; got [${args.join(", ")}].`);
  }

  const probe = asRecord(asRecord(input)?.mediaProbe ?? input);
  const hasAudio = probe?.hasAudio;
  const mean = Number(probe?.meanVolumeDb);

  if (typeof hasAudio !== "boolean") {
    return refuse("No media probe on the submission — the adapter did not run.");
  }
  if (!hasAudio) return refuse("The recording has no audio track.");
  if (!Number.isFinite(mean)) {
    return refuse("The probe carries no volume reading, so silence cannot be ruled out.");
  }
  if (mean < floor) {
    return refuse(
      `The audio track is effectively silent (mean ${Math.round(mean)} dB). Check the microphone and re-record.`,
    );
  }
  return { passed: true, detail: `Audio present, mean ${Math.round(mean)} dB.` };
};

/* ── executable extras — sheet and cross-unit checks ───────────────────── */

/**
 * Every named cell matches the key to the stated precision. args:
 * [decimalPlaces] (default 2). Input carries the learner's parsed cells and
 * the private expected cells (the engine assembles both).
 *
 * Feedback policy: names the cell and what the learner has, NEVER the
 * expected value — that is the key. Examples capped (input.maxExamples,
 * default 3): three teach, twenty are the answer sheet.
 */
const numeric_cells: Checker = (input, args) => {
  const places = args[0] !== undefined ? Number(args[0]) : 2;
  if (!Number.isFinite(places) || places < 0) {
    return refuse(`numeric_cells needs a non-negative [decimalPlaces]; got [${args.join(", ")}].`);
  }

  const rec = asRecord(input);
  const got = asRecord(rec?.cells);
  const expected = asRecord(rec?.expected);
  if (!got || !expected) {
    return refuse("numeric_cells needs the parsed cells and the expected cells on its input.");
  }

  const cap = Number(rec?.maxExamples ?? 3);
  const wrong: string[] = [];
  let wrongCount = 0;

  for (const [cell, want] of Object.entries(expected)) {
    const have = Number(got[cell]);
    const target = Number(want);
    const off =
      !Number.isFinite(have) ||
      Math.abs(have - target) >= Math.pow(10, -places) / 2;
    if (off) {
      wrongCount++;
      if (wrong.length < cap) {
        wrong.push(
          Number.isFinite(have)
            ? `${cell}: you have ${have} — that is not the expected value`
            : `${cell}: no numeric value found`,
        );
      }
    }
  }

  const total = Object.keys(expected).length;
  if (wrongCount > 0) {
    return refuse(
      `${total - wrongCount} of ${total} cells match. ${wrong.join("; ")}` +
        (wrongCount > wrong.length ? ` — and ${wrongCount - wrong.length} more.` : "."),
    );
  }
  return { passed: true, detail: `All ${total} cells match to ${places} decimal place(s).` };
};

/**
 * The named cells hold formulas, not pasted constants. args: the cells that
 * must be computed. Reads facts.cellFormulas from the sheet-parser adapter.
 */
const formula_present: Checker = (input, args) => {
  if (args.length === 0) return refuse("formula_present was given no cells to check.");

  const formulas = asRecord(asRecord(input)?.cellFormulas ?? input);
  if (!formulas) {
    return refuse("No parsed formulas on the submission — the sheet adapter did not run.");
  }

  const pasted = args.filter((cell) => {
    const f = formulas[cell];
    return typeof f !== "string" || !f.trim().startsWith("=");
  });

  if (pasted.length) {
    return refuse(
      `${pasted.join(", ")} hold${pasted.length === 1 ? "s" : ""} a constant, not a formula — the computation is the work.`,
    );
  }
  return { passed: true, detail: `All ${args.length} checked cells are computed.` };
};

/**
 * This unit's figure agrees with one the learner already produced. args:
 * [tolerancePct] (default 1). Input: { value, priorValue } — the engine's
 * priorSubmissions adapter supplies the earlier figure.
 *
 * The point is coherence across the trail: the revenue total in week four's
 * memo has to be the number week two's query returned, or one of them is
 * wrong and the learner should be the one to find out which.
 */
const consistent_with: Checker = (input, args) => {
  const tolerance = args[0] !== undefined ? Number(args[0]) : 1;
  if (!Number.isFinite(tolerance) || tolerance < 0) {
    return refuse(`consistent_with needs a non-negative [tolerancePct]; got [${args.join(", ")}].`);
  }

  const rec = asRecord(input);
  const value = Number(rec?.value);
  const prior = Number(rec?.priorValue);
  if (!Number.isFinite(value)) return refuse("No figure on this submission to compare.");
  if (!Number.isFinite(prior)) {
    return refuse("No earlier figure to compare against — the prior-work adapter found nothing.");
  }

  const base = Math.max(Math.abs(prior), 1e-9);
  const offPct = (Math.abs(value - prior) / base) * 100;
  if (offPct > tolerance) {
    return refuse(
      `This unit says ${value}; your earlier verified figure was different by ${offPct.toFixed(1)}% — more than the ${tolerance}% tolerance. One of them is wrong, and finding which is part of the work.`,
    );
  }
  return { passed: true, detail: `Agrees with your earlier figure within ${tolerance}%.` };
};

/**
 * The result set is not explosively large. args: [max rows]. The cheap smell
 * test for an accidental cartesian product, usable without a query plan.
 */
const row_count_ceiling: Checker = (input, args) => {
  const max = Number(args[0]);
  if (!Number.isFinite(max) || max <= 0) {
    return refuse(`row_count_ceiling needs a positive [max]; got [${args.join(", ")}].`);
  }

  const rec = asRecord(input);
  const rows = rec?.rows;
  const count = Array.isArray(rows) ? rows.length : Number(rec?.rowCount);
  if (!Number.isFinite(count)) return refuse("No result rows on the submission to count.");

  if (count > max) {
    return refuse(
      `${count} rows, ceiling is ${max}. A result this size usually means a join without its condition.`,
    );
  }
  return { passed: true, detail: `${count} rows, within the ceiling of ${max}.` };
};

/* ── detectable — archetype 2 ──────────────────────────────────────────── */

/**
 * Planted-defect marking: the student's findings against a private key.
 * args: [minHits] — how many planted defects must be found to pass.
 *
 * Matching is by the key each defect was planted under (a short slug the
 * grader assigns when mapping the student's prose to defects), not by free
 * text — this checker scores the mapping, it does not do NLP.
 *
 * The detail NEVER lists which defects were missed. The key is the answer,
 * assignment_answer_keys is service-role-only for exactly that reason, and a
 * checker that names the misses hands the next cohort the list.
 */
const answer_key_match: Checker = (input, args) => {
  const minHits = Number(args[0]);
  if (!Number.isFinite(minHits) || minHits < 0) {
    return refuse(`answer_key_match needs [minHits]; got [${args.join(", ")}].`);
  }

  const rec = asRecord(input);
  const foundRaw = Array.isArray(rec?.found) ? (rec.found as unknown[]) : null;
  const plantedRaw = Array.isArray(rec?.planted) ? (rec.planted as unknown[]) : null;
  if (!foundRaw || !plantedRaw) {
    return refuse("answer_key_match needs the found list and the planted key on its input.");
  }

  // README decision 1: the row count is the fingerprint. A structured finding
  // is (column, count) and matches only when both agree — objective, cheap,
  // unguessable. Slugs/keywords remain the fallback for defects with no
  // natural count. Both shapes normalise to a comparable string.
  const fingerprint = (v: unknown): string => {
    const o = asRecord(v);
    if (o && o.column !== undefined && o.count !== undefined) {
      return `${String(o.column).trim().toLowerCase()}#${Number(o.count)}`;
    }
    return String(o?.slug ?? v).trim().toLowerCase();
  };

  const plantedSet = new Set(plantedRaw.map(fingerprint));
  const foundSet = new Set(foundRaw.map(fingerprint));
  const hits = [...foundSet].filter((f) => plantedSet.has(f)).length;
  const fabricated = [...foundSet].filter((f) => !plantedSet.has(f)).length;

  // README: decoy penalty. A fabricated finding cancels a real one, because
  // an auditor who invents problems costs their client more than one who
  // finds fewer. The submission form says exactly this before anyone ticks.
  const effective = Math.max(0, hits - fabricated);

  const tally =
    `${hits} of the planted problems identified` +
    (fabricated > 0 ? `; ${fabricated} reported problem(s) are not in the data` : "");

  if (effective < minHits) {
    return refuse(
      `${tally}. After the decoy penalty that counts as ${effective}; this artifact needs ${minHits}.`,
    );
  }
  return { passed: true, detail: `${tally}. Counts as ${effective} after the decoy rule.` };
};

/* ── executable — archetype 1 ──────────────────────────────────────────── */

/**
 * The existing SQL grader, behind the registry name that TRACK_MODEL gives
 * it. Same code path the grading pipeline already calls directly — moving
 * the entry point does not move the implementation, so nothing regrades.
 */
const sql_diff: Checker = async (input) => {
  const rec = asRecord(input);
  const sql = String(rec?.sql ?? "");
  const spec = rec?.spec as SqlAssignmentSpec | undefined;
  const runner = rec?.runner as QueryRunner | undefined;

  if (!spec?.expected || !runner) {
    return refuse("sql_diff needs the answer key (spec) and a query runner on its input.");
  }

  const grade = await gradeSqlSubmission(sql, spec, runner);
  const correctness = grade.criteria.find((c) => c.key === "returns_expected_rows");
  return {
    passed: Boolean(correctness?.passed),
    detail: correctness?.detail ?? "The query could not be graded.",
  };
};

/* ── the registry ──────────────────────────────────────────────────────── */

/**
 * The implemented thirteen. Two names exist in CHECKER_NAMES and
 * deliberately not here:
 *
 *   code_test_suite  needs the sandbox to run arbitrary test suites, which is
 *                    a container question, not a function
 *   rubric_score     the only checker that spends money — it runs through
 *                    grade()'s ctx (budgetOk + callModel), never bare through
 *                    runCheck, so no code path can spend without the gate
 *
 * media_has_audio resolves now because it reads an adapter's probe result
 * (README: comparison is pure, execution is not) — it never trusted client
 * metadata and never will; without facts.mediaProbe it refuses.
 *
 * Publish-time validation must require every checker named by a published
 * track to resolve HERE. A draft may reference the planned ones; a verified
 * track may not promise a check nothing performs.
 */
export const CHECKERS: Partial<Record<CheckerName, Checker>> = {
  sql_diff,
  numeric_cells,
  formula_present,
  consistent_with,
  answer_key_match,
  non_empty,
  duration_between,
  has_sections,
  url_reachable,
  media_has_audio,
  contains_join,
  contains_pattern,
  row_count_ceiling,
};

/**
 * Parses "duration_between:60,180" into name and args, the format checks are
 * stored in per TRACK_MODEL Part 5.
 */
export function parseCheck(spec: string): { name: string; args: string[] } {
  const [name, argString] = spec.split(":", 2);
  return {
    name: (name ?? "").trim(),
    args: argString ? argString.split(",").map((a) => a.trim()) : [],
  };
}

/** Resolves and runs one stored check spec against an input. */
export async function runCheck(spec: string, input: unknown): Promise<CheckResult> {
  const { name, args } = parseCheck(spec);
  const checker = CHECKERS[name as CheckerName];
  if (!checker) {
    // Refusal, not a throw: an unknown checker on a live track is a content
    // bug that belongs in the ops queue, not a crashed grading run.
    return refuse(`No checker named "${name}" is implemented. The track needs fixing, not the student.`);
  }
  return checker(input, args);
}
