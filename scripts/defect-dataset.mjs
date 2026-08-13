/**
 * Generates a planted-defect dataset and its answer key.
 *
 *   node scripts/defect-dataset.mjs --seed <secret> --label cohort-1 \
 *        [--rows 2000] [--track data-analyst-fresher] [--week 3]
 *
 * Emits into supabase/.bundle/ (gitignored):
 *
 *   defects-<label>.csv       the dataset students download and audit
 *   defects-<label>-key.sql   the answer key, pasted into the SQL editor
 *   defects-<label>-codes.txt the candidate codes for the assignment prompt
 *
 * THE SEED IS THE SECRET. This repo may be public, so nothing derivable from
 * the repo can be the answer: no committed key, no committed dataset, no
 * default seed. The generator is deterministic BY seed — same seed, same
 * bytes — so ops can regenerate exactly what a cohort saw, and rotating the
 * seed rotates every defect. TRACK_MODEL Part 10 is the operating assumption:
 * any key older than three cohorts is public.
 *
 * The defects are the seven things actually wrong with most real exports,
 * planted with exact counted truths so the key's rows_affected is a fact,
 * not an estimate. Distractor codes are offered alongside — plausible
 * problems NOT in the data — because distractors are what make "tick every
 * box" a losing strategy.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "supabase", ".bundle");

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const seed = arg("seed", null);
const label = arg("label", null);
const rowCount = Number(arg("rows", "2000"));
const track = arg("track", "data-analyst-fresher");
const week = Number(arg("week", "3"));

if (!seed || !label) {
  console.error(
    "Usage: node scripts/defect-dataset.mjs --seed <secret> --label <cohort-label>\n\n" +
      "The seed is the answer key's secret. Do not commit it, do not reuse it\n" +
      "across cohorts, and do not pick something guessable — the whole point\n" +
      "of rotation is that last cohort's key stops mattering.",
  );
  process.exit(1);
}

/* ── deterministic PRNG, seeded from the secret ─────────────────────────── */

function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(hash(seed));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

/* ── clean base data ─────────────────────────────────────────────────────── */

const FIRST = ["Priya", "Arjun", "Nandini", "Vikram", "Sana", "Rohit", "Meera", "Kabir", "Ananya", "Farhan", "Divya", "Tanvi", "Aarav", "Ishaan", "Zoya"];
const LAST = ["Sharma", "Mehta", "Rao", "Iyer", "Qureshi", "Das", "Nair", "Singh", "Bose", "Ali", "Menon", "Joshi", "Reddy", "Kaur"];
const CITY = ["Mumbai", "Pune", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Jaipur", "Indore"];
const CATEGORY = ["electronics", "clothing", "grocery", "books", "sports"];

// All dates land inside 2026, so "future" has a fixed, deterministic meaning:
// anything after 2026-12-31 is planted, full stop. No clock is consulted.
const dateIn2026 = () => {
  const day = between(1, 358); // leaves headroom so delivery +7 stays in-year
  const d = new Date(Date.UTC(2026, 0, day));
  return d.toISOString().slice(0, 10);
};
const plusDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const rows = [];
for (let i = 1; i <= rowCount; i++) {
  const ordered = dateIn2026();
  rows.push({
    order_id: i,
    customer_name: `${pick(FIRST)} ${pick(LAST)}`,
    city: pick(CITY),
    category: pick(CATEGORY),
    amount: (between(99, 24999) / 1).toFixed(2),
    ordered_on: ordered,
    delivered_on: plusDays(ordered, between(1, 7)),
    customer_age: between(18, 65),
  });
}

/* ── plant the defects, counting as we go ────────────────────────────────── */

const takeIndexes = (n, used) => {
  const out = [];
  while (out.length < n) {
    const i = between(0, rows.length - 1);
    if (!used.has(i)) {
      used.add(i);
      out.push(i);
    }
  }
  return out;
};
const used = new Set();

const planted = [];

// duplicate-rows: exact copies appended, so the count is precise.
{
  const n = between(12, 18);
  for (const i of takeIndexes(n, used)) rows.push({ ...rows[i] });
  planted.push({
    slug: "duplicate-rows",
    description: `${n} rows appear twice, byte for byte`,
    rows_affected: n,
  });
}
// negative-amount
{
  const n = between(9, 14);
  for (const i of takeIndexes(n, used)) rows[i].amount = `-${rows[i].amount}`;
  planted.push({ slug: "negative-amount", description: `${n} amounts are negative`, rows_affected: n });
}
// future-date: ordered_on pushed past the end of 2026.
{
  const n = between(7, 11);
  for (const i of takeIndexes(n, used)) rows[i].ordered_on = `2027-0${between(1, 9)}-15`;
  planted.push({ slug: "future-date", description: `${n} orders are dated after the export period`, rows_affected: n });
}
// delivered-before-ordered
{
  const n = between(8, 13);
  for (const i of takeIndexes(n, used)) rows[i].delivered_on = plusDays(rows[i].ordered_on, -between(2, 9));
  planted.push({ slug: "delivered-before-ordered", description: `${n} deliveries precede their order date`, rows_affected: n });
}
// impossible-age
{
  const n = between(6, 10);
  for (const i of takeIndexes(n, used)) rows[i].customer_age = pick([0, -3, 147, 208]);
  planted.push({ slug: "impossible-age", description: `${n} customer ages are impossible`, rows_affected: n });
}
// whitespace-name: leading/trailing spaces that survive a naive GROUP BY.
{
  const n = between(10, 16);
  for (const i of takeIndexes(n, used)) rows[i].customer_name = `  ${rows[i].customer_name} `;
  planted.push({ slug: "whitespace-name", description: `${n} names carry stray whitespace`, rows_affected: n });
}
// mixed-case-category: the same category, capitalised three ways.
{
  const n = between(11, 17);
  for (const i of takeIndexes(n, used)) {
    const c = rows[i].category;
    rows[i].category = pick([c.toUpperCase(), c[0].toUpperCase() + c.slice(1), ` ${c}`]);
  }
  planted.push({ slug: "mixed-case-category", description: `${n} categories differ only in case or spacing`, rows_affected: n });
}

// Offered but NOT planted. Each is plausible for this shape of export, and
// each is verifiably absent — the guard checks that.
const distractors = ["orphan-customer", "null-order-id", "currency-mixed", "amount-string-total"];

/* ── emit ────────────────────────────────────────────────────────────────── */

mkdirSync(OUT, { recursive: true });

const header = "order_id,customer_name,city,category,amount,ordered_on,delivered_on,customer_age";
const csvEscape = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const csv =
  header +
  "\n" +
  rows
    .map((r) =>
      [r.order_id, r.customer_name, r.city, r.category, r.amount, r.ordered_on, r.delivered_on, r.customer_age]
        .map(csvEscape)
        .join(","),
    )
    .join("\n") +
  "\n";
writeFileSync(path.join(OUT, `defects-${label}.csv`), csv);

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const minHits = Math.max(3, Math.floor(planted.length / 2) + 1);
const keySql = `-- Defect key '${label}' for ${track} week ${week}.
-- Generated by scripts/defect-dataset.mjs. The seed is NOT in this file and
-- must not be written anywhere the repo can see. Paste into the SQL editor
-- AFTER the curriculum paste publishes the path — the key binds to the
-- highest published version and freezes on arrival (insert allowed once,
-- change never; rotation is a new path version).
insert into public.assignment_defect_keys (assignment_id, planted, distractors, min_hits, seed_label)
select a.id, ${q(JSON.stringify(planted))}::jsonb,
       array[${distractors.map(q).join(", ")}]::text[],
       ${minHits}, ${q(label)}
from public.assignments a
join public.modules m on m.id = a.module_id
join public.paths p on p.id = m.path_id
join public.tracks t on t.id = p.track_id
where t.slug = ${q(track)} and m.week_no = ${week} and a.kind = 'artifact_link'
order by p.version desc
limit 1
on conflict (assignment_id) do nothing;
`;
writeFileSync(path.join(OUT, `defects-${label}-key.sql`), keySql);

// The candidate codes for the prompt, shuffled deterministically so the
// planted ones are not clustered at the top.
const codes = [...planted.map((p) => p.slug), ...distractors];
for (let i = codes.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [codes[i], codes[j]] = [codes[j], codes[i]];
}
writeFileSync(
  path.join(OUT, `defects-${label}-codes.txt`),
  `Candidate codes for the assignment prompt (${codes.length} offered, ${planted.length} planted, pass mark ${minHits}):\n\n` +
    codes.map((c) => `  ${c}`).join("\n") +
    "\n",
);

console.log(
  `Wrote supabase/.bundle/defects-${label}.{csv,-key.sql,-codes.txt}\n` +
    `${rows.length} rows, ${planted.length} defect types planted, ${distractors.length} distractors, pass mark ${minHits}.\n` +
    "Upload the CSV somewhere students can fetch it, add it as the week's dataset\n" +
    "resource, paste the key SQL before publishing, and keep the seed private.",
);
