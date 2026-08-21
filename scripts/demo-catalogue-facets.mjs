/**
 * 0017's facet columns, demonstrated against seeded data.
 *
 *   node scripts/demo-catalogue-facets.mjs
 *
 * The four real roadmaps, with the resource shape the live project actually
 * has — 24 videos across 228 resources, and duration_sec null on most of
 * them. Every claim the migration makes is printed as a query result rather
 * than asserted in prose, and 0017 is applied three times over to prove the
 * bundle is safe to paste again.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = readdirSync(path.join(ROOT, "supabase", "migrations"))
  .filter((f) => f.endsWith(".sql"))
  .sort();

const db = await PGlite.create();
await db.exec(SHIM);
for (const f of FILES) {
  await db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", f), "utf8"));
}
// Only the pasted bundle is re-runnable, and only it needs to be — the 0001
// baseline creates its objects unconditionally and is applied once, ever.
const apply0017 = () =>
  db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", "0017_catalogue_facets.sql"), "utf8"));

const rows = async (q, p = []) => (await db.query(q, p)).rows;
const one = async (q, p = []) => (await rows(q, p))[0];

let failures = 0;
const check = (ok, label) => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}`);
  if (!ok) failures++;
};
const table = (title, rs) => {
  console.log(`\n─── ${title}`);
  if (!rs.length) return console.log("    (no rows)");
  for (const r of rs) {
    console.log("    " + Object.entries(r).map(([k, v]) => `${k}=${v === null ? "—" : v}`).join("  "));
  }
};

// ── the four roadmaps, as they are in production ─────────────────────────────
const REAL = [
  { slug: "data-analyst", title: "Data analyst", weeks: 13, hours: 340, level: "beginner",
    tags: ["data", "sql", "python", "statistics", "analytics", "spreadsheets"],
    nodes: 91, videos: 16, resources: 113 },
  { slug: "java-spring-boot", title: "Java & Spring Boot backend developer", weeks: 14, hours: 280,
    level: "beginner", tags: ["java", "spring-boot", "backend", "sql", "programming"],
    nodes: 38, videos: 6, resources: 56 },
  { slug: "thinking-under-uncertainty", title: "Thinking clearly under uncertainty", weeks: 10,
    hours: 120, level: "intermediate",
    tags: ["thinking", "decision-making", "statistics", "forecasting", "rationality"],
    nodes: 24, videos: 2, resources: 31 },
  { slug: "amazon-ads", title: "Amazon Ads & retail media", weeks: 13, hours: 150,
    level: "intermediate", tags: ["marketing", "amazon-ads", "ecommerce", "retail-media", "advertising"],
    nodes: 27, videos: 0, resources: 28 },
];

for (const r of REAL) {
  const rm = await one(
    `insert into public.roadmaps
       (slug, title, summary, subject_tags, difficulty, estimated_weeks, estimated_hours, status)
     values ($1, $2, $3, $4, $5, $6, $7, 'published') returning id`,
    [r.slug, r.title, `${r.title} — seeded for the facet demo.`, r.tags, r.level, r.weeks, r.hours],
  );
  const mod = await one(
    `insert into public.modules (roadmap_id, position, title) values ($1, 1, 'Module 1') returning id`,
    [rm.id],
  );
  // est_minutes 55 a node reproduces the live totals closely enough for the
  // ratio to mean the same thing.
  for (let i = 1; i <= r.nodes; i++) {
    const node = await one(
      `insert into public.nodes (module_id, position, title, est_minutes)
       values ($1, $2, $3, 55) returning id`,
      [mod.id, i, `${r.slug} node ${i}`],
    );
    const here = Math.floor((r.resources - r.videos) / r.nodes) + (i === 1 ? (r.resources - r.videos) % r.nodes : 0);
    for (let k = 1; k <= here; k++) {
      await db.query(
        `insert into public.resources (node_id, position, type, title, url, source_name)
         values ($1, $2, 'read', 'A read', 'https://example.com/a', 'Somewhere')`,
        [node.id, k],
      );
    }
    if (i <= r.videos) {
      // The live shape: only a couple of videos carry a duration.
      await db.query(
        `insert into public.resources
           (node_id, position, type, title, url, source_name, youtube_video_id, duration_sec)
         values ($1, 99, 'video', 'A video', 'https://youtube.com/watch?v=x', 'YouTube', 'abcdefghijk', $2)`,
        [node.id, i <= 2 ? 1500 : null],
      );
    }
  }
}

// 0017 ran before these rows existed, so its backfill has to be re-applied —
// which is itself the first re-runnability test.
await apply0017();

// ── 1. category is a closed set of four, and it is not subject_tags[0] ───────
console.log("\n═══ 1. category — navigation, not description");
table(
  "every roadmap's category next to the tag it used to be filtered by",
  await rows(`select slug, category, subject_tags[1] as old_facet from public.roadmaps order by slug`),
);
check(
  (await rows(`select 1 from public.roadmaps where category not in ('data','software','marketing','judgement')`)).length === 0,
  "every category is one of the four",
);
check(
  (await one(`select count(distinct category)::int as n from public.roadmaps`)).n === 4,
  "all four categories are in use — one roadmap each",
);
let rejected = false;
try {
  await db.query(`insert into public.roadmaps (slug, title, summary, difficulty, category)
                  values ('x', 'X', 'X', 'beginner', 'astrology')`);
} catch {
  rejected = true;
}
check(rejected, "an unknown category is rejected by the CHECK, so the facet list cannot grow by accident");

// ── 2. the derived facet columns ─────────────────────────────────────────────
console.log("\n═══ 2. derived facets");
table(
  "facet columns as the catalogue reads them",
  await rows(`select slug, category, difficulty, estimated_weeks, media_mix, has_free_cert, has_prereqs
              from public.roadmaps order by slug`),
);
check(
  (await one(`select has_free_cert as v from public.roadmaps where slug = 'amazon-ads'`)).v === true,
  "Amazon Ads is the one roadmap with a free certification",
);
check(
  (await one(`select count(*)::int as n from public.roadmaps where has_free_cert`)).n === 1,
  "and it is the only one — the facet discriminates (1 of 4)",
);
check(
  (await one(`select count(*)::int as n from public.roadmaps where has_prereqs`)).n === 0,
  "has_prereqs is false everywhere — nobody has marked one, so the facet is a no-op and the UI hides it",
);

// ── 3. media_mix is computed, and says why it says what it says ──────────────
console.log("\n═══ 3. media_mix");
table(
  "the ratio recompute_media_mix() actually measures",
  await rows(`
    with nm as (select r.id, r.slug, sum(n.est_minutes)::numeric est_min
                from public.roadmaps r
                join public.modules m on m.roadmap_id = r.id
                join public.nodes n on n.module_id = m.id group by r.id, r.slug),
         vm as (select r.id,
                  count(*) filter (where res.type = 'video')::int vids,
                  count(*) filter (where res.type = 'video' and res.duration_sec is not null)::int timed,
                  sum(coalesce(res.duration_sec,0))::numeric / 60 vid_min
                from public.roadmaps r
                join public.modules m on m.roadmap_id = r.id
                join public.nodes n on n.module_id = m.id
                join public.resources res on res.node_id = n.id
                where res.type = 'video' group by r.id)
    select nm.slug, nm.est_min, coalesce(vm.vids,0) videos, coalesce(vm.timed,0) with_duration,
           round(coalesce(vm.vid_min,0), 1) video_min,
           round(100 * coalesce(vm.vid_min,0) / nm.est_min, 1) pct,
           r.media_mix
    from nm join public.roadmaps r on r.id = nm.id
    left join vm on vm.id = nm.id order by nm.slug`),
);
check(
  (await one(`select count(distinct media_mix)::int as n from public.roadmaps`)).n === 1,
  "every roadmap computes to the same bucket today — duration_sec is null on most videos, so Format cannot discriminate yet",
);
// Give one roadmap real durations and the classification moves on its own.
await db.query(`update public.resources set duration_sec = 5400
                where type = 'video' and node_id in (
                  select n.id from public.nodes n
                  join public.modules m on m.id = n.module_id
                  join public.roadmaps r on r.id = m.roadmap_id
                  where r.slug = 'data-analyst')`);
const moved = await one(`select public.recompute_media_mix() as n`);
table(
  "after backfilling data-analyst's durations — 16 × 90 min against 5005 estimated, 28.8%",
  await rows(`select slug, media_mix from public.roadmaps order by slug`),
);
check(moved.n === 1, "recompute_media_mix() moved exactly the one roadmap whose data changed");
check(
  (await one(`select media_mix as v from public.roadmaps where slug = 'data-analyst'`)).v !== "reading",
  "the Format facet starts discriminating the moment the durations exist — no code change needed",
);
check(
  (await one(`select public.recompute_media_mix() as n`)).n === 0,
  "running it again changes nothing: it only writes rows whose answer differs",
);

// ── 4. facet counts against the other filters ────────────────────────────────
console.log("\n═══ 4. facet counts are live, and zeros do not exist");
table(
  "Level counts with no other filter",
  await rows(`select difficulty, count(*)::int as n from public.roadmaps group by 1 order by 1`),
);
table(
  "Level counts once category = 'software' is chosen — intermediate is simply absent",
  await rows(`select difficulty, count(*)::int as n from public.roadmaps
              where category = 'software' group by 1 order by 1`),
);
check(
  (await rows(`select 1 from public.roadmaps where category = 'software' and difficulty = 'intermediate'`)).length === 0,
  "no row backs an 'intermediate' facet under software, so the UI has nothing to render as zero",
);
check(
  (await one(`select count(*)::int as n from public.roadmaps
              where category = 'software' and difficulty = 'beginner'`)).n === 1,
  "/learn?c=software&level=beginner returns exactly one roadmap",
);

// ── 5. search reaches subject_tags ───────────────────────────────────────────
console.log("\n═══ 5. search");
table(
  "matches for 'sql' and where each match came from",
  await rows(`
    select slug,
           title ilike '%sql%' as in_title,
           summary ilike '%sql%' as in_summary,
           exists (select 1 from unnest(subject_tags) t where t ilike '%sql%') as in_tags
    from public.roadmaps
    where title ilike '%sql%' or summary ilike '%sql%'
       or exists (select 1 from unnest(subject_tags) t where t ilike '%sql%')
    order by slug`),
);
check(
  (await one(`select exists (select 1 from unnest(subject_tags) t where t = 'sql') as v
              from public.roadmaps where slug = 'data-analyst'`)).v === true,
  "'sql' finds Data analyst through its tags, which neither its title nor its summary contain",
);

// ── 6. topic_requests: source, and a rate limit that has something to count ──
console.log("\n═══ 6. the request box");
await db.query(`insert into public.topic_requests (wanted, source, ip_hash) values
  ('kubernetes', 'sidebar', repeat('a', 64)),
  ('rust', 'no_results', repeat('a', 64)),
  ('go', 'sidebar', repeat('b', 64))`);
table(
  "requests by source",
  await rows(`select source, count(*)::int as n from public.topic_requests group by 1 order by 1`),
);
table(
  "what the rate limit counts — one row per IP hash in the last hour",
  await rows(`select left(ip_hash, 8) || '…' as ip, count(*)::int as n
              from public.topic_requests
              where ip_hash is not null and created_at > now() - interval '1 hour'
              group by 1 order by 1`),
);
let badSource = false;
try {
  await db.query(`insert into public.topic_requests (wanted, source) values ('x', 'twitter')`);
} catch {
  badSource = true;
}
check(badSource, "an unknown source is rejected — the column stays a small set worth grouping by");
let badHash = false;
try {
  await db.query(`insert into public.topic_requests (wanted, ip_hash) values ('x', '203.0.113.9')`);
} catch {
  badHash = true;
}
check(badHash, "a plaintext IP cannot be written to ip_hash — the CHECK only accepts a SHA-256 hex");

// ── 7. re-runnable ───────────────────────────────────────────────────────────
console.log("\n═══ 7. the bundle is safe to paste twice");
const before = await one(`select count(*)::int as n from public.roadmaps`);
await apply0017();
await apply0017();
const after = await one(`select count(*)::int as n from public.roadmaps`);
check(before.n === after.n, "two more applications change no rows and raise no error");
check(
  (await one(`select category as v from public.roadmaps where slug = 'amazon-ads'`)).v === "marketing",
  "and the backfill is idempotent rather than cumulative",
);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) FAILED.`}`);
process.exit(failures === 0 ? 0 : 1);
