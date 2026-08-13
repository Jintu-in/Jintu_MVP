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

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.slug ?? "")) fail("slug");
if (!spec.title || !spec.summary) fail("title/summary required");
if (!DIFF_ROADMAP.includes(spec.difficulty)) fail(`difficulty ${spec.difficulty}`);
if (!Array.isArray(spec.modules) || spec.modules.length === 0) fail("no modules");

const urls = [];
for (const [mi, m] of spec.modules.entries()) {
  if (!m.title) fail(`module ${mi + 1} title`);
  if (!Array.isArray(m.nodes) || m.nodes.length === 0) fail(`module ${mi + 1} has no nodes`);
  if (m.nodes.length > 12) fail(`module ${mi + 1}: ${m.nodes.length} nodes — a module holds 8–12; split it`);
  for (const [ni, n] of m.nodes.entries()) {
    const at = `module ${mi + 1} node ${ni + 1}`;
    if (!n.title) fail(`${at} title`);
    if (!Number.isInteger(n.estMinutes) || n.estMinutes < 2 || n.estMinutes > 120)
      fail(`${at} estMinutes ${n.estMinutes} — one sitting is 2–120 minutes`);
    if (n.difficulty && !DIFF_NODE.includes(n.difficulty)) fail(`${at} difficulty`);
    if (n.points !== undefined && (!Number.isInteger(n.points) || n.points < 5 || n.points > 100))
      fail(`${at} points ${n.points} — 5–100 or omit for the default`);
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
push(`  insert into public.roadmaps (slug, title, summary, subject_tags, difficulty, estimated_weeks, estimated_hours, license_note, status)`);
push(`  values (${q(spec.slug)}, ${q(spec.title)}, ${q(spec.summary)}, ${qarr(spec.subjectTags)}, ${q(spec.difficulty)}, ${qn(spec.estimatedWeeks)}, ${qn(spec.estimatedHours)}, ${q(spec.licenseNote ?? null)}, 'draft')`);
push(`  returning id into rm;`);

for (const [mi, m] of spec.modules.entries()) {
  push(``);
  push(`  -- ── module ${mi + 1}: ${m.title.replace(/--/g, "—")}`);
  push(`  insert into public.modules (roadmap_id, position, title, week_range, objective, deliverable, est_hours)`);
  push(`  values (rm, ${mi + 1}, ${q(m.title)}, ${q(m.weekRange ?? null)}, ${q(m.objective ?? null)}, ${q(m.deliverable ?? null)}, ${qn(m.estHours)})`);
  push(`  returning id into m;`);
  for (const [ni, n] of m.nodes.entries()) {
    push(`  insert into public.nodes (module_id, position, title, summary, learning_objectives, est_minutes, difficulty, is_optional, points)`);
    push(`  values (m, ${ni + 1}, ${q(n.title)}, ${q(n.summary ?? null)}, ${qarr(n.learningObjectives)}, ${n.estMinutes}, ${q(n.difficulty ?? null)}, ${n.isOptional ? "true" : "false"}, ${Number.isInteger(n.points) ? n.points : 25})`);
    push(`  returning id into n;`);
    for (const [ri, r] of n.resources.entries()) {
      push(`  insert into public.resources (node_id, position, type, title, url, source_name, author, youtube_video_id, duration_sec, est_size_mb, editor_note, needs_verification${verified ? ", last_checked_at, health" : ""})`);
      push(`  values (n, ${ri + 1}, ${q(r.type)}, ${q(r.title)}, ${q(r.url)}, ${q(r.sourceName)}, ${q(r.author ?? null)}, ${q(r.youtubeVideoId ?? null)}, ${qn(r.durationSec)}, ${qn(r.estSizeMb)}, ${q(r.editorNote ?? null)}, ${verified ? "false, now(), 'ok'" : "true"});`);
    }
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

const outDir = path.join(ROOT, "supabase", ".bundle");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `IMPORT-${spec.slug}.sql`);
writeFileSync(outPath, lines.join("\n"));
console.error(`wrote ${path.relative(ROOT, outPath)} (${verified ? "publishes" : "draft only"})`);
// stdout carries the SQL too, so the assert guard can consume it directly.
console.log(lines.join("\n"));
