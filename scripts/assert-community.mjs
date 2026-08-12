/**
 * Proves the community tier's two promises hold in the database.
 *
 *   node scripts/assert-community.mjs
 *
 * Promise one: anyone signed-in and onboarded can author a track, and only
 * their own. Promise two — the load-bearing one from TRACK_MODEL Part 3 —
 * a community track NEVER carries a paid check. Three doors lead to money
 * reaching a community track (wire a paid rubric in, edit a wired rubric
 * into a paid one, re-tier a paid track down) and this guard walks into
 * all three.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");

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
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));

const one = async (q, p = []) => (await db.query(q, p)).rows[0];
const codeOf = async (q, p = []) => {
  try {
    await db.query(q, p);
    return null;
  } catch (e) {
    return e.code ?? "unknown";
  }
};

const AUTHOR = "66666666-6666-4666-8666-0000000000aa";
const OTHER = "66666666-6666-4666-8666-0000000000bb";
const HALFWAY = "66666666-6666-4666-8666-0000000000cc";
await db.query("insert into auth.users (id) values ($1), ($2), ($3)", [AUTHOR, OTHER, HALFWAY]);
await db.query(
  "insert into public.profiles (id, phone, is_adult_confirmed) values ($1, '+919000000221', true), ($2, '+919000000222', true)",
  [AUTHOR, OTHER],
);

console.log("── who may author ──────────────────────────────────────────");
await db.exec("reset jintu.uid;");
check(
  (await codeOf("select public.author_community_track('Guitar for beginners', 'Play three songs from open chords, on a schedule that survives a job.')")) === "28000",
  "no session is told to sign in (28000)",
);

await db.exec(`set jintu.uid = '${HALFWAY}';`);
check(
  (await codeOf("select public.author_community_track('Guitar for beginners', 'Play three songs from open chords, on a schedule that survives a job.')")) === "P0002",
  "a verified email without onboarding is sent to onboarding (P0002)",
);

await db.exec(`set jintu.uid = '${AUTHOR}';`);
check((await codeOf("select public.author_community_track('Gu', 'Play three songs from open chords, on a schedule that survives a job.')")) === "23514", "a two-letter title is refused");
check((await codeOf("select public.author_community_track('Guitar for beginners', 'Strum stuff')")) === "23514", "a summary too thin to describe anything is refused");

const { slug } = await one(
  "select public.author_community_track('Guitar for beginners', 'Play three songs from open chords, on a schedule that survives a job.') as slug",
);
check(slug === "guitar-for-beginners", `the slug comes from the title (${slug})`);

const track = await one("select tier, is_published, author_id from public.tracks where slug = $1", [slug]);
check(
  track.tier === "community" && track.is_published === false && track.author_id === AUTHOR,
  "a fresh track is community, unpublished, and owned by its author",
);
check(
  (await one("select count(*)::int n from public.paths p join public.tracks t on t.id = p.track_id where t.slug = $1 and p.status = 'draft'", [slug])).n === 1,
  "and it starts with a draft path to write into",
);

check(
  (await codeOf("select public.author_community_track('Guitar for beginners', 'Play three songs from open chords, on a schedule that survives a job.')")) === "23505",
  "the same author retrying the same title is told they already have it",
);

await db.exec(`set jintu.uid = '${OTHER}';`);
const { slug: otherSlug } = await one(
  "select public.author_community_track('Guitar for beginners', 'A different take: fingerstyle first, chords later, forty minutes a day.') as slug",
);
check(
  otherSlug.startsWith("guitar-for-beginners-") && otherSlug !== slug,
  `someone else may use the same title and gets their own address (${otherSlug})`,
);

await db.exec(`set jintu.uid = '${AUTHOR}';`);
await db.query("select public.author_community_track('Home barista', 'Dial in espresso on a budget machine and taste why each change matters.')");
await db.query("select public.author_community_track('Hindi touch typing', 'Sixty words a minute in Devanagari with the InScript layout.')");
check(
  (await codeOf("select public.author_community_track('A fourth idea', 'This one will surely be finished, unlike the other three, I promise.')")) === "P0003",
  "a fourth unpublished track is refused — finish one first",
);

console.log("\n── the outline ─────────────────────────────────────────────");
const WEEKS = JSON.stringify([
  { title: "Holding the instrument", objective: "Fret a clean single note on every string without buzzing." },
  { title: "Open chords", objective: "Change between G, C and D in time with a metronome at 60." },
  { title: "First song end to end", objective: "Play one three-chord song through without stopping." },
]);

await db.exec("reset jintu.uid;");
check((await codeOf("select public.set_community_outline($1, $2)", [slug, WEEKS])) === "28000", "no session cannot edit an outline");

await db.exec(`set jintu.uid = '${OTHER}';`);
check(
  (await codeOf("select public.set_community_outline($1, $2)", [slug, WEEKS])) === "P0001",
  "someone else's track answers exactly like a track that does not exist",
);

await db.exec(`set jintu.uid = '${AUTHOR}';`);
const { n } = await one("select public.set_community_outline($1, $2) as n", [slug, WEEKS]);
check(n === 3, `the outline lands (${n} weeks)`);
const weeks = await db.query(
  "select m.week_no, m.title from public.modules m join public.paths p on p.id = m.path_id join public.tracks t on t.id = p.track_id where t.slug = $1 order by m.week_no",
  [slug],
);
check(
  weeks.rows.map((w) => w.week_no).join(",") === "1,2,3" && weeks.rows[0].title === "Holding the instrument",
  "week numbers come from position, in order",
);

const { n: n2 } = await one("select public.set_community_outline($1, $2) as n", [
  slug,
  JSON.stringify([{ title: "One long week", objective: "Everything at once, which is at least honest about the workload." }]),
]);
check(
  n2 === 1 &&
    (await one("select count(*)::int c from public.modules m join public.paths p on p.id = m.path_id join public.tracks t on t.id = p.track_id where t.slug = $1", [slug])).c === 1,
  "re-sending the outline replaces it whole, no leftovers",
);

check(
  (await codeOf("select public.set_community_outline($1, $2)", [
    slug,
    JSON.stringify(Array.from({ length: 13 }, (_, i) => ({ title: `Week number ${i + 1}`, objective: "Twelve is a sprint's worth of weeks twice over; thirteen is a syllabus." }))),
  ])) === "23514",
  "thirteen weeks is refused",
);
check(
  (await codeOf("select public.set_community_outline($1, $2)", [
    slug,
    JSON.stringify([{ title: "ok", objective: "Too short a title on this one." }]),
  ])) === "23514",
  "a malformed week refuses the whole outline",
);

await db.query("update public.tracks set is_published = true where slug = $1", [slug]);
check(
  (await codeOf("select public.set_community_outline($1, $2)", [slug, WEEKS])) === "P0001",
  "a published track is no longer the author's to rewrite",
);
await db.query("update public.tracks set is_published = false where slug = $1", [slug]);

console.log("\n── the wall: community never pays ──────────────────────────");
const { id: freeRubric } = await one(`
  insert into public.rubrics (name, criteria, max_score) values ('community-free-v1', $1, 5) returning id`,
  [JSON.stringify([
    { key: "sections", label: "Has the sections it promises", weight: 2, check: "structural", checker: "has_sections" },
    { key: "useful", label: "A peer could follow it", weight: 3, check: "peer", checker: null },
  ])],
);
const { id: paidRubric } = await one(`
  insert into public.rubrics (name, criteria, max_score) values ('community-paid-v1', $1, 2) returning id`,
  [JSON.stringify([{ key: "prose", label: "Reads clearly", weight: 2, check: "rubric_ai", checker: null }])],
);
const { id: moduleId } = await one(
  "select m.id from public.modules m join public.paths p on p.id = m.path_id join public.tracks t on t.id = p.track_id where t.slug = $1 limit 1",
  [slug],
);

check(
  (await codeOf("insert into public.assignments (module_id, kind, spec, rubric_id) values ($1, 'artifact_link', '{}', $2)", [moduleId, paidRubric])) === "23514",
  "door 1: wiring a paid rubric into a community track is refused",
);
check(
  (await codeOf("insert into public.assignments (module_id, kind, spec, rubric_id) values ($1, 'artifact_link', '{}', $2)", [moduleId, freeRubric])) === null,
  "a structural + peer rubric wires in fine",
);

check(
  (await codeOf("update public.rubrics set criteria = $1 where id = $2", [
    JSON.stringify([{ key: "prose", label: "Reads clearly", weight: 2, check: "rubric_ai", checker: null }]),
    freeRubric,
  ])) === "23514",
  "door 2: a rubric in community use cannot be edited into a paid one",
);
check(
  (await codeOf("update public.rubrics set criteria = $1 where id = $2", [
    JSON.stringify([{ key: "prose", label: "Reads clearly", weight: 2, check: "rubric_ai", checker: null },
                    { key: "extra", label: "Still reads clearly", weight: 1, check: "peer", checker: null }]),
    paidRubric,
  ])) === null,
  "an unwired rubric stays freely editable",
);

const daTier = await codeOf("update public.tracks set tier = 'community' where slug = 'data-analyst-fresher'");
check(daTier === "23514", "door 3: a track graded by paid checks cannot be re-tiered to community");
check(
  (await codeOf("update public.tracks set tier = 'draft' where slug = $1", [slug])) === null &&
    (await codeOf("update public.tracks set tier = 'community' where slug = $1", [slug])) === null,
  "a track with only free checks moves tiers freely",
);

console.log("\n── who sees what ───────────────────────────────────────────");
await db.exec(
  "grant usage on schema public to anon, authenticated; grant select on all tables in schema public to anon, authenticated;",
);
await db.exec(`begin; set local role authenticated; set local jintu.uid = '${AUTHOR}';`);
const mine = await one("select count(*)::int n from public.tracks where slug = $1", [slug]);
await db.exec("rollback;");
check(mine.n === 1, "the author sees their own unpublished track");

await db.exec(`begin; set local role authenticated; set local jintu.uid = '${OTHER}';`);
const theirs = await one("select count(*)::int n from public.tracks where slug = $1", [slug]);
await db.exec("rollback;");
check(theirs.n === 0, "nobody else does");

await db.exec("begin; set local role anon;");
const anonSees = await one("select count(*)::int n from public.tracks where slug = $1", [slug]);
await db.exec("rollback;");
check(anonSees.n === 0, "anon does not either — unpublished means unpublished");

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
