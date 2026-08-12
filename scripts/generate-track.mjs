/**
 * Turns a track spec into paste-ready, idempotent SQL.
 *
 *   pnpm track:gen docs/tracks/my-track.mjs
 *
 * Validation first, generation second: every rule the database or a CI
 * guard would refuse is checked here with a sentence that teaches, so the
 * author hears "week 3's rubric weights sum to 6 but maxScore is 7" instead
 * of a trigger's stack trace after pasting.
 *
 * The emitted SQL mirrors generate-data-analyst-v2.mjs mechanics exactly:
 * `on conflict do nothing` throughout, the path built as a draft and
 * published atomically only after a completeness check, prior versions
 * untouched. Answer keys ride inside the output, which is why it lands in
 * gitignored supabase/.bundle/ and why specs themselves are gitignored.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Keep in sync with packages/grading/src/registry.ts CHECKERS (the
// implemented ones) — the DB trigger and canPublishAsVerified re-validate,
// so drift fails loudly there; this copy exists for instant feedback.
const IMPLEMENTED = new Set([
  "sql_diff", "numeric_cells", "formula_present", "consistent_with",
  "answer_key_match", "non_empty", "duration_between", "has_sections",
  "url_reachable", "media_has_audio", "contains_join", "contains_pattern",
  "row_count_ceiling",
]);
const ARCHETYPES = new Set(["executable", "detectable", "structural", "rubric_ai", "peer", "mentor_sample"]);
const MACHINE = new Set(["executable", "detectable", "structural"]);
const RESOURCE_KINDS = new Set(["video", "article", "docs", "dataset", "tool"]);
const ARTIFACT_KINDS = new Set(["sql", "artifact_link", "file", "recording"]);

const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: pnpm track:gen docs/tracks/<name>.mjs");
  process.exit(1);
}
const spec = (await import(pathToFileURL(path.resolve(specPath)).href)).default;

/* ── validate ─────────────────────────────────────────────────────────── */
const problems = [];
const fail = (msg) => problems.push(msg);

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.slug ?? "")) fail(`slug "${spec.slug}" must be kebab-case`);
if (!spec.title || spec.title.length < 4) fail("title needs at least four characters");
if (!spec.summary || spec.summary.length < 20) fail("summary should say what the track prepares someone for — one or two sentences");
if (!["verified", "community"].includes(spec.tier)) fail(`tier must be 'verified' or 'community', got "${spec.tier}"`);
if (!Number.isInteger(spec.version) || spec.version < 1) fail("version must be a positive integer");
if (!Array.isArray(spec.weeks) || spec.weeks.length === 0) fail("a track needs at least one week");

const rubricNames = new Set();
let machinePts = 0, totalPts = 0, repCount = 0;

(spec.weeks ?? []).forEach((w, i) => {
  const wk = `week ${i + 1}`;
  if (!w.title || w.title.length < 4) fail(`${wk}: title needs at least four characters`);
  if (!w.objective || w.objective.length < 10) fail(`${wk}: the objective is what they CAN DO after — one testable sentence`);
  if (!Array.isArray(w.resources) || w.resources.length === 0) fail(`${wk}: needs at least one resource — a week without resources will refuse to publish`);

  (w.resources ?? []).forEach((r, j) => {
    if (!RESOURCE_KINDS.has(r.kind)) fail(`${wk} resource ${j + 1}: kind "${r.kind}" is not one of ${[...RESOURCE_KINDS].join("/")}`);
    if (!r.title) fail(`${wk} resource ${j + 1}: needs a title in our own words`);
    if (r.youtubeId && r.url) fail(`${wk} resource ${j + 1}: youtubeId OR url, not both — YouTube only via the official embed`);
    if (r.youtubeId && !/^[\w-]{11}$/.test(r.youtubeId)) fail(`${wk} resource ${j + 1}: "${r.youtubeId}" is not an 11-character YouTube id`);
    if (!r.youtubeId && !/^https:\/\//.test(r.url ?? "")) fail(`${wk} resource ${j + 1}: needs an https:// url (or a youtubeId)`);
  });

  const days = new Set();
  (w.reps ?? []).forEach((rep) => {
    repCount++;
    if (!Number.isInteger(rep.day) || rep.day < 1 || rep.day > 7) fail(`${wk} rep: day must be 1–7`);
    if (days.has(rep.day)) fail(`${wk}: two reps on day ${rep.day}`);
    days.add(rep.day);
    if (!rep.prompt || rep.prompt.length < 10) fail(`${wk} rep day ${rep.day}: the prompt is the whole rep — one small checked thing`);
    if (!["structural", "executable", "detectable"].includes(rep.verification)) fail(`${wk} rep day ${rep.day}: reps are free archetypes only (executable/detectable/structural) — never AI, never peer`);
    const pts = rep.points ?? 10;
    if (pts < 1 || pts > 30) fail(`${wk} rep day ${rep.day}: points must be 1–30 (a learner caps at 30/day anyway)`);
    (rep.checks ?? []).forEach((c) => {
      const name = String(c).split(":")[0];
      if (!IMPLEMENTED.has(name)) fail(`${wk} rep day ${rep.day}: no checker named "${name}" is implemented`);
    });
    if (!rep.checks?.length) fail(`${wk} rep day ${rep.day}: a rep nothing checks awards points for clicking — name at least one check`);
  });

  const a = w.artifact;
  if (!a) { fail(`${wk}: needs exactly one artifact — the thing they submit`); return; }
  if (!ARTIFACT_KINDS.has(a.kind)) fail(`${wk} artifact: kind "${a.kind}" is not one of ${[...ARTIFACT_KINDS].join("/")}`);
  if (!a.prompt || a.prompt.length < 30) fail(`${wk} artifact: the prompt is a scenario, not a topic — who is asking, what do they need, by when`);

  const rub = a.rubric;
  if (!rub?.name) { fail(`${wk} artifact: needs a rubric — it is the contract with the learner`); return; }
  if (rubricNames.has(rub.name)) fail(`${wk}: rubric name "${rub.name}" is used twice — names are platform-unique, suffix them -v1`);
  rubricNames.add(rub.name);
  if (!(rub.maxScore > 0)) fail(`${wk} rubric ${rub.name}: maxScore must be positive`);

  const keys = new Set();
  let sum = 0;
  (rub.criteria ?? []).forEach((c) => {
    if (!c.key || keys.has(c.key)) fail(`${wk} rubric ${rub.name}: every criterion needs a unique key`);
    keys.add(c.key);
    if (!c.label) fail(`${wk} rubric ${rub.name} · ${c.key}: the label is a promise a stranger can check`);
    if (!(c.weight > 0)) fail(`${wk} rubric ${rub.name} · ${c.key}: zero-weight criteria are promises that count for nothing`);
    if (!ARCHETYPES.has(c.check)) fail(`${wk} rubric ${rub.name} · ${c.key}: "${c.check}" is not a verification archetype`);
    if (["peer", "mentor_sample"].includes(c.check)) {
      if (c.checker != null) fail(`${wk} rubric ${rub.name} · ${c.key}: ${c.check} criteria carry checker: null — a person marks them`);
    } else if (c.check === "rubric_ai") {
      if (c.checker !== "rubric_score") fail(`${wk} rubric ${rub.name} · ${c.key}: rubric_ai criteria use the one paid checker, "rubric_score"`);
      if (spec.tier === "community") fail(`${wk} rubric ${rub.name} · ${c.key}: community tracks NEVER call a model — the database will refuse this at three doors`);
    } else {
      const name = String(c.checker ?? "").split(":")[0];
      if (!IMPLEMENTED.has(name)) fail(`${wk} rubric ${rub.name} · ${c.key}: no checker named "${name}" is implemented`);
      if (spec.tier === "community" && c.check !== "structural") fail(`${wk} rubric ${rub.name} · ${c.key}: community tier is structural + peer ONLY`);
      if (name === "contains_pattern" && c.weight > 1) fail(`${wk} rubric ${rub.name} · ${c.key}: contains_pattern is gameable by design — never worth more than 1 point`);
    }
    sum += c.weight;
    totalPts += c.weight;
    if (MACHINE.has(c.check) && c.checker) machinePts += c.weight;
  });
  if (sum !== rub.maxScore) fail(`${wk} rubric ${rub.name}: weights sum to ${sum} but maxScore is ${rub.maxScore} — every score built on it would silently misreport`);

  if (a.kind === "sql") {
    const k = a.answerKey;
    if (!k?.setup?.includes("create table")) fail(`${wk} artifact: a sql artifact needs answerKey.setup with the fixture DDL + data`);
    if (!Array.isArray(k?.expected?.rows) || k.expected.rows.length === 0) fail(`${wk} artifact: answerKey.expected.rows is what the right query returns — it cannot be empty`);
    if (!Array.isArray(k?.expected?.columns)) fail(`${wk} artifact: answerKey.expected.columns names the result columns, in order`);
    if (typeof k?.orderMatters !== "boolean") fail(`${wk} artifact: say whether orderMatters — "most recent first" means true`);
    if (!k?.referenceSql || k.referenceSql.length < 10) fail(`${wk} artifact: answerKey.referenceSql is the canonical solution — ops re-derives expected from it when the fixture changes`);
  }
  if (a.codes) {
    a.codes.forEach((code) => {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(code)) fail(`${wk} artifact codes: "${code}" must be kebab-case`);
    });
  }
});

const share = totalPts > 0 ? machinePts / totalPts : 0;
if (spec.tier === "verified" && share < 0.5) {
  fail(
    `only ${Math.round(share * 100)}% of points are machine-checked (${machinePts} of ${totalPts}); ` +
      `the verified tier needs ≥50%. Count points, not criteria — see AUTHORING.md §2.`,
  );
}

if (problems.length) {
  console.error(`REFUSED — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  · ${p}`);
  process.exit(1);
}

/* ── generate ─────────────────────────────────────────────────────────── */
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const j = (v) => `${q(JSON.stringify(v))}::jsonb`;
const out = [];

out.push(`-- ${spec.title}: curriculum version ${spec.version}.`);
out.push(`-- GENERATED by scripts/generate-track.mjs from a local spec — the spec`);
out.push(`-- holds the answer keys and stays out of the repository.`);
out.push(`-- Idempotent: re-running is a no-op, prior versions are untouched.`);
out.push(``);

// Rubrics first: platform-unique by name, shared table, frozen by convention.
out.push(`insert into public.rubrics (name, criteria, max_score) values`);
out.push(
  spec.weeks
    .map((w) => `  (${q(w.artifact.rubric.name)}, ${j(w.artifact.rubric.criteria)}, ${w.artifact.rubric.maxScore})`)
    .join(",\n") + "\non conflict (name) do nothing;",
);
out.push(``);
out.push(`do $$`);
out.push(`declare v_track uuid; v_path uuid;`);
out.push(`begin`);
out.push(`  insert into public.tracks (slug, title, summary, tier, is_published)`);
out.push(`  values (${q(spec.slug)}, ${q(spec.title)}, ${q(spec.summary)}, ${q(spec.tier)}, false)`);
out.push(`  on conflict (slug) do nothing;`);
out.push(`  select id into v_track from public.tracks where slug = ${q(spec.slug)};`);
out.push(``);
out.push(`  insert into public.paths (track_id, version, status)`);
out.push(`  values (v_track, ${spec.version}, 'draft')`);
out.push(`  on conflict (track_id, version) do nothing;`);
out.push(`  select id into v_path from public.paths where track_id = v_track and version = ${spec.version};`);
out.push(``);
out.push(`  if (select status from public.paths where id = v_path) = 'published' then`);
out.push(`    raise notice 'version ${spec.version} is already published; nothing to do';`);
out.push(`    return;`);
out.push(`  end if;`);
out.push(``);
out.push(`  insert into public.modules (path_id, week_no, title, objective) values`);
out.push(
  spec.weeks.map((w, i) => `    (v_path, ${i + 1}, ${q(w.title)}, ${q(w.objective)})`).join(",\n") +
    "\n  on conflict (path_id, week_no) do nothing;",
);

for (const [i, w] of spec.weeks.entries()) {
  const wkNo = i + 1;
  const mod = `(select id from public.modules where path_id = v_path and week_no = ${wkNo})`;
  out.push(``);
  out.push(`  -- week ${wkNo}: ${w.title}`);
  out.push(`  insert into public.resources (module_id, kind, provider, external_url, youtube_video_id, title, position) values`);
  out.push(
    w.resources
      .map((r, p) => {
        // external_url is NOT NULL by schema; for YouTube rows it carries the
        // canonical watch URL (attribution/fallback) while the embed uses the id.
        const url = r.url ?? `https://www.youtube.com/watch?v=${r.youtubeId}`;
        return `    (${mod}, ${q(r.kind)}, ${q(r.youtubeId ? "youtube" : "web")}, ` +
          `${q(url)}, ${r.youtubeId ? q(r.youtubeId) : "null"}, ${q(r.title)}, ${p})`;
      })
      .join(",\n") + "\n  on conflict (module_id, position) do nothing;",
  );
  if (w.reps?.length) {
    out.push(`  insert into public.daily_reps (module_id, day_no, prompt, verification, checks, points) values`);
    out.push(
      w.reps
        .map((rep) =>
          `    (${mod}, ${rep.day}, ${q(rep.prompt)}, ${q(rep.verification)}, ` +
          `array[${rep.checks.map(q).join(", ")}], ${rep.points ?? 10})`)
        .join(",\n") + "\n  on conflict (module_id, day_no) do nothing;",
    );
  }
  const a = w.artifact;
  const aSpec = { prompt: a.prompt, ...(a.codes?.length ? { codes: a.codes } : {}) };
  out.push(`  insert into public.assignments (module_id, kind, spec, rubric_id, weight)`);
  out.push(`  values (${mod}, ${q(a.kind)}, ${j(aSpec)}, (select id from public.rubrics where name = ${q(a.rubric.name)}), 1)`);
  out.push(`  on conflict (module_id, kind) do nothing;`);
  if (a.kind === "sql") {
    out.push(`  insert into public.assignment_answer_keys (assignment_id, setup, reference_sql, expected, order_matters)`);
    out.push(`  values ((select id from public.assignments where module_id = ${mod} and kind = 'sql'),`);
    out.push(`    ${q(a.answerKey.setup.trim())}, ${q(a.answerKey.referenceSql.trim())}, ${j(a.answerKey.expected)}, ${a.answerKey.orderMatters})`);
    out.push(`  on conflict (assignment_id) do nothing;`);
  }
}

const sqlWeeks = spec.weeks.filter((w) => w.artifact.kind === "sql").length;
out.push(``);
out.push(`  -- Refuse to publish a half-built version: one dropped statement above`);
out.push(`  -- must not become a live track with a hole in it.`);
out.push(`  if (select count(*) from public.modules where path_id = v_path) <> ${spec.weeks.length}`);
out.push(`     or exists (select 1 from public.modules m where m.path_id = v_path`);
out.push(`                and not exists (select 1 from public.resources r where r.module_id = m.id))`);
out.push(`     or (select count(*) from public.assignments a join public.modules m on m.id = a.module_id`);
out.push(`         where m.path_id = v_path) <> ${spec.weeks.length}`);
out.push(`     or (select count(*) from public.assignment_answer_keys k`);
out.push(`         join public.assignments a on a.id = k.assignment_id`);
out.push(`         join public.modules m on m.id = a.module_id where m.path_id = v_path) <> ${sqlWeeks}`);
out.push(`     or (select count(*) from public.daily_reps dr join public.modules m on m.id = dr.module_id`);
out.push(`         where m.path_id = v_path) <> ${repCount}`);
out.push(`  then`);
out.push(`    raise exception 'version ${spec.version} of ${spec.slug} is incomplete; refusing to publish';`);
out.push(`  end if;`);
out.push(``);
out.push(`  update public.paths set status = 'published', published_at = now()`);
out.push(`  where id = v_path and status = 'draft';`);
out.push(`  update public.tracks set is_published = true where id = v_track;`);
out.push(`end $$;`);
out.push(``);

const target = path.join(ROOT, "supabase", ".bundle", `track-${spec.slug}-v${spec.version}.sql`);
mkdirSync(path.dirname(target), { recursive: true });
writeFileSync(target, out.join("\n"));

console.log(`${spec.title} — version ${spec.version}`);
console.log(`  weeks ${spec.weeks.length} · artifact points ${totalPts} · reps ${repCount}`);
console.log(`  machine-checked points: ${machinePts}/${totalPts} (${Math.round(share * 100)}%)${spec.tier === "verified" ? " — verified bar is 50%" : ""}`);
if (spec.weeks.length !== 6) console.log(`  note: ${spec.weeks.length} weeks — the house shape is 6; fine if deliberate`);
console.log(`\nWrote ${path.relative(ROOT, target)}`);
console.log(`Next: pnpm track:verify ${specPath}`);
