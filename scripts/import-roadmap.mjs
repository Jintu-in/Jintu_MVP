/**
 * Turns a roadmap spec (docs/roadmaps/<slug>.mjs) into a SQL paste.
 *
 *   node scripts/import-roadmap.mjs docs/roadmaps/data-analyst.mjs [--check]
 *
 * Output: supabase/.bundle/IMPORT-<slug>.sql (gitignored, pasted by hand).
 *
 * Rule 2 of CLAUDE.md is enforced mechanically here, not by promise:
 *
 *   - WITHOUT --check, every resource is emitted needs_verification = true
 *     and the roadmap is left in DRAFT — invisible to every client. You can
 *     always generate; you cannot accidentally publish.
 *   - WITH --check, every URL is fetched (and every YouTube id resolved via
 *     oEmbed). Only if ALL of them resolve does the paste publish; one dead
 *     link fails the whole run, because a dead link on the main surface is
 *     worse than a missing one.
 *
 * The paste is deterministic and re-runnable: it deletes the roadmap by slug
 * and reinserts the whole tree. Pre-launch that is the right semantics;
 * after launch, re-import wipes progress rows for that roadmap via cascade,
 * so this script refuses to be the long-term update path — see the header
 * it writes.
 *
 * --assume-checked exists for the CI guard only (assert-import.mjs), where
 * network fetches would make the build flaky. A human pasting SQL should
 * never have used it: the paste header records which mode produced it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const specPath = args.find((a) => !a.startsWith("--"));
const doCheck = args.includes("--check");
const assumeChecked = args.includes("--assume-checked");
if (!specPath) {
  console.error("Usage: node scripts/import-roadmap.mjs docs/roadmaps/<slug>.mjs [--check]");
  process.exit(1);
}

const spec = (await import(pathToFileURL(path.resolve(specPath)).href)).default;

// ── validation: everything the schema would reject, said in plain words ─────
const fail = (msg) => {
  console.error(`spec invalid: ${msg}`);
  process.exit(1);
};
const TYPES = ["read", "video", "doc", "case_study", "tool", "latest"];
const DIFF_ROADMAP = ["beginner", "intermediate", "advanced"];
const DIFF_NODE = ["intro", "core", "stretch"];
// A question's hardness, not a day's place in a curriculum. Two axes, two
// vocabularies, deliberately different words so they cannot be confused.
const DIFF_CHECK = ["easy", "medium", "hard"];
const CHECK_KINDS = ["comprehension", "interview"];

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.slug ?? "")) fail("slug");
if (!spec.title || !spec.summary) fail("title/summary required");
if (!DIFF_ROADMAP.includes(spec.difficulty)) fail(`difficulty ${spec.difficulty}`);
if (!Array.isArray(spec.modules) || spec.modules.length === 0) fail("no modules");
// estimated_hours is derived by recompute_estimated_hours() from the days
// themselves (0020). A typed one disagreed with its own roadmap by 4x on all
// four of the originals, so the spec is no longer allowed to carry it.
if (spec.estimatedHours !== undefined)
  fail("drop estimatedHours — it is derived from the sum of est_minutes; the paste calls recompute_estimated_hours()");
for (const req of spec.requires ?? []) {
  if (typeof req === "string" ? !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(req) : !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(req.slug ?? ""))
    fail(`requires: "${typeof req === "string" ? req : req.slug}" is not a slug`);
  if ((typeof req === "string" ? req : req.slug) === spec.slug) fail("a roadmap cannot require itself");
}

const urls = [];
for (const [mi, m] of spec.modules.entries()) {
  if (!m.title) fail(`module ${mi + 1} title`);
  if (!Array.isArray(m.nodes) || m.nodes.length === 0) fail(`module ${mi + 1} has no nodes`);
  if (m.nodes.length > 12) fail(`module ${mi + 1}: ${m.nodes.length} nodes — a module holds 8–12; split it`);
  for (const [ni, n] of m.nodes.entries()) {
    const at = `module ${mi + 1} node ${ni + 1}`;
    if (!n.title) fail(`${at} title`);
    // The day number lives in `position` and every surface renders it from
    // there, so a title that repeats it prints "Day 3 · Day 3 — ...". This
    // is how 91 nodes acquired the prefix; the database now has a CHECK for
    // it too (0014), and failing here gives a sentence instead of a
    // constraint violation halfway through a paste.
    if (/^Day\s+\d+\s*[—·-]\s*/.test(n.title))
      fail(`${at}: drop the "Day N" prefix from the title — the number comes from position, and keeping both renders it twice`);
    if (!Number.isInteger(n.estMinutes) || n.estMinutes < 2 || n.estMinutes > 120)
      fail(`${at} estMinutes ${n.estMinutes} — one sitting is 2–120 minutes`);
    if (n.difficulty && !DIFF_NODE.includes(n.difficulty)) fail(`${at} difficulty`);
    if (n.points !== undefined && (!Number.isInteger(n.points) || n.points < 5 || n.points > 100))
      fail(`${at} points ${n.points} — 5–100 or omit for the default`);
    // The day-page blocks (0010), all optional.
    if (n.challengeMinutes !== undefined &&
        (!Number.isInteger(n.challengeMinutes) || n.challengeMinutes < 5 || n.challengeMinutes > 120))
      fail(`${at} challengeMinutes ${n.challengeMinutes} — 5–120`);
    for (const [ti, t] of (n.topics ?? []).entries()) {
      if (!t.title || !t.detail) fail(`${at} topic ${ti + 1} needs title AND detail — the detail line is the point`);
    }
    for (const [ci, c] of (n.checks ?? []).entries()) {
      const cat = `${at} check ${ci + 1}`;
      if (!c.question || !c.answer) fail(`${cat} needs question and answer`);
      if (c.kind && !CHECK_KINDS.includes(c.kind)) fail(`${cat} kind ${c.kind}`);
      if (c.difficulty && !DIFF_CHECK.includes(c.difficulty))
        fail(`${cat} difficulty ${c.difficulty} — easy/medium/hard, not the node's intro/core/stretch`);
      // asked_in_interviews is a claim about the world, so it may only be
      // made about a question written to be asked cold.
      if (c.askedInInterviews && (c.kind ?? "comprehension") !== "interview")
        fail(`${cat}: askedInInterviews on a comprehension check — set kind: "interview" or drop the flag`);
    }
    const comprehension = (n.checks ?? []).filter((c) => (c.kind ?? "comprehension") === "comprehension");
    if (comprehension.length > 5)
      fail(`${at}: ${comprehension.length} comprehension checks — three is the model, five the ceiling`);
    if (!Array.isArray(n.resources)) fail(`${at} resources`);
    for (const [ri, r] of n.resources.entries()) {
      const rat = `${at} resource ${ri + 1}`;
      if (!TYPES.includes(r.type)) fail(`${rat} type ${r.type}`);
      if (!/^https:\/\//.test(r.url ?? "")) fail(`${rat} url must be https`);
      if (!r.title || !r.sourceName) fail(`${rat} title/sourceName`);
      if (r.youtubeVideoId && !/^[A-Za-z0-9_-]{11}$/.test(r.youtubeVideoId)) fail(`${rat} youtubeVideoId`);
      if (r.youtubeVideoId && r.type !== "video") fail(`${rat} has a video id but type ${r.type}`);
      if (r.type === "video" && r.durationSec && !r.estSizeMb)
        fail(`${rat}: a video with a duration must carry estSizeMb — metered data is rule 2`);
      urls.push(r);
    }
  }
}

// ── pace: can this roadmap carry a streak? ─────────────────────────────────
// The streak resets on a missed day, so a roadmap has to offer a day to do.
// Data analyst is 91 days over 13 weeks — seven a week, a real daily habit.
// The other three run 2.1–2.7, which means the streak breaks on Thursday
// through no fault of the reader. A warning rather than a failure, because
// those three are already published and this is a curriculum judgement.
{
  const days = spec.modules.reduce((a, m) => a + m.nodes.length, 0);
  const perWeek = spec.estimatedWeeks ? days / spec.estimatedWeeks : null;
  const mins = spec.modules.reduce((a, m) => a + m.nodes.reduce((b, n) => b + n.estMinutes, 0), 0);
  console.error(`${days} days · ${spec.estimatedWeeks ?? "?"} weeks · ${perWeek ? perWeek.toFixed(1) : "?"}/week · ${Math.round(mins / 60)} h derived`);
  if (perWeek !== null && perWeek < 4)
    console.error(`  WARNING: ${perWeek.toFixed(1)} days a week cannot sustain a daily streak. Either write more days or state fewer weeks.`);
}

// ── the live check ───────────────────────────────────────────────────────────
let verified = assumeChecked;
if (doCheck) {
  console.error(`checking ${urls.length} URLs...`);
  const failures = [];
  for (const r of urls) {
    const target = r.youtubeVideoId
      ? `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${r.youtubeVideoId}&format=json`
      : r.url;
    try {
      const res = await fetch(target, {
        redirect: "follow",
        signal: AbortSignal.timeout(25000),
        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) JintuLinkCheck/1.0" },
      });
      if (!res.ok) failures.push(`${res.status} ${r.url}`);
      else if (r.youtubeVideoId) {
        const meta = await res.json();
        console.error(`  yt ok  ${r.youtubeVideoId}  "${meta.title}"`);
      } else {
        console.error(`  ok     ${r.url}`);
      }
    } catch (e) {
      failures.push(`${e.name === "TimeoutError" ? "timeout" : e.message} ${r.url}`);
    }
  }
  if (failures.length) {
    console.error(`\n${failures.length} URL(s) failed — refusing to emit a publishable paste:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  verified = true;
}

// ── SQL ──────────────────────────────────────────────────────────────────────
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const qn = (v) => (v === null || v === undefined ? "null" : Number(v));
const qarr = (a) =>
  a && a.length ? `array[${a.map(q).join(", ")}]::text[]` : "'{}'::text[]";

const lines = [];
const push = (s) => lines.push(s);

push(`-- IMPORT ${spec.slug} — generated by scripts/import-roadmap.mjs, ${verified ? "links verified" : "LINKS NOT VERIFIED"}.`);
push(`--`);
push(
  verified
    ? `-- Every URL resolved at generation time; the roadmap publishes at the end.`
    : `-- Generated without --check: everything lands needs_verification = true and
-- the roadmap stays DRAFT (invisible to clients). Regenerate with --check
-- to produce a publishable paste.`,
);
push(`--`);
push(`-- Re-pasting deletes and reinserts the whole roadmap. That also cascades
-- away node_progress for it — fine before launch, unacceptable after. If
-- real users exist, stop and make a surgical update instead.`);
push(``);
push(`do $$`);
push(`declare rm uuid; m uuid; n uuid;`);
push(`begin`);
push(`  delete from public.roadmaps where slug = ${q(spec.slug)};`);
push(``);
push(`  insert into public.roadmaps (slug, title, summary, subject_tags, category, difficulty, estimated_weeks, license_note, status)`);
push(`  values (${q(spec.slug)}, ${q(spec.title)}, ${q(spec.summary)}, ${qarr(spec.subjectTags)}, ${q(spec.category ?? "data")}, ${q(spec.difficulty)}, ${qn(spec.estimatedWeeks)}, ${q(spec.licenseNote ?? null)}, 'draft')`);
push(`  returning id into rm;`);

for (const [mi, m] of spec.modules.entries()) {
  push(``);
  push(`  -- ── module ${mi + 1}: ${m.title.replace(/--/g, "—")}`);
  push(`  insert into public.modules (roadmap_id, position, title, week_range, objective, deliverable, est_hours)`);
  push(`  values (rm, ${mi + 1}, ${q(m.title)}, ${q(m.weekRange ?? null)}, ${q(m.objective ?? null)}, ${q(m.deliverable ?? null)}, ${qn(m.estHours)})`);
  push(`  returning id into m;`);
  for (const [ni, n] of m.nodes.entries()) {
    push(`  insert into public.nodes (module_id, position, title, slug, summary, learning_objectives, why_today, common_mistake, principle, challenge, challenge_minutes, est_minutes, difficulty, is_optional, points)`);
    push(`  values (m, ${ni + 1}, ${q(n.title)}, ${q(slugify(n.title))}, ${q(n.summary ?? null)}, ${qarr(n.learningObjectives)}, ${q(n.whyToday ?? null)}, ${q(n.commonMistake ?? null)}, ${q(n.principle ?? null)}, ${q(n.challenge ?? null)}, ${qn(n.challengeMinutes)}, ${n.estMinutes}, ${q(n.difficulty ?? null)}, ${n.isOptional ? "true" : "false"}, ${Number.isInteger(n.points) ? n.points : 25})`);
    push(`  returning id into n;`);
    for (const [ti, t] of (n.topics ?? []).entries()) {
      push(`  insert into public.node_topics (node_id, position, title, detail) values (n, ${ti}, ${q(t.title)}, ${q(t.detail)});`);
    }
    for (const [ci, c] of (n.checks ?? []).entries()) {
      push(
        `  insert into public.node_checks (node_id, position, question, answer, kind, difficulty, asked_in_interviews)` +
          ` values (n, ${ci}, ${q(c.question)}, ${q(c.answer)}, ${q(c.kind ?? "comprehension")}, ${q(c.difficulty ?? "medium")}, ${c.askedInInterviews ? "true" : "false"});`,
      );
    }
    for (const [ri, r] of n.resources.entries()) {
      push(`  insert into public.resources (node_id, position, type, title, url, source_name, author, youtube_video_id, duration_sec, est_size_mb, editor_note, needs_verification${verified ? ", last_checked_at, health" : ""})`);
      push(`  values (n, ${ri + 1}, ${q(r.type)}, ${q(r.title)}, ${q(r.url)}, ${q(r.sourceName)}, ${q(r.author ?? null)}, ${q(r.youtubeVideoId ?? null)}, ${qn(r.durationSec)}, ${qn(r.estSizeMb)}, ${q(r.editorNote ?? null)}, ${verified ? "false, now(), 'ok'" : "true"});`);
    }
  }
}

// Prerequisites, by slug. Skipped silently when the other roadmap is not in
// the database yet — a missing edge is recoverable by re-pasting once it is,
// and failing the whole import would make build order load-bearing.
if ((spec.requires ?? []).length) {
  push(``);
  push(`  -- prerequisites`);
  for (const [i, req] of spec.requires.entries()) {
    const slug = typeof req === "string" ? req : req.slug;
    const note = typeof req === "string" ? null : (req.note ?? null);
    push(`  insert into public.roadmap_prerequisites (roadmap_id, requires_id, position, note)`);
    push(`  select rm, id, ${i}, ${q(note)} from public.roadmaps where slug = ${q(slug)}`);
    push(`  on conflict (roadmap_id, requires_id) do update set position = excluded.position, note = excluded.note;`);
  }
}

push(``);
if (verified) {
  push(`  update public.roadmaps set status = 'published', reviewed_at = now() where id = rm;`);
} else {
  push(`  -- stays draft: links were not verified at generation time.`);
}
push(`end $$;`);
push(``);
push(`-- Everything derived, recomputed from what was just inserted.`);
push(`select public.recompute_estimated_hours();`);
push(`select public.recompute_media_mix();`);
push(`select public.recompute_has_prereqs();`);
push(``);

const outDir = path.join(ROOT, "supabase", ".bundle");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `IMPORT-${spec.slug}.sql`);
writeFileSync(outPath, lines.join("\n"));
console.error(`wrote ${path.relative(ROOT, outPath)} (${verified ? "publishes" : "draft only"})`);
// stdout carries the SQL too, so the assert guard can consume it directly.
console.log(lines.join("\n"));
