/**
 * Recomputes the reference results for the auto-graded SQL assignments.
 *
 *   node scripts/pagila-expected.mjs        # verify the committed JSON
 *   node scripts/pagila-expected.mjs --write # regenerate it
 *
 * The deterministic grader marks a SQL submission by running it and diffing
 * the result against `spec.expected` (packages/grading/src/deterministic).
 * That expected result has to come from somewhere, and "a number I typed in"
 * is not good enough — if it is wrong, every correct student answer is marked
 * wrong, and the failure looks like the student's fault.
 *
 * So the numbers in scripts/pagila-expected.json are computed by running the
 * reference query against the real Pagila database, in PGlite, in this file.
 * Anyone can re-derive them, and CI can check they still hold.
 *
 * Pagila is downloaded rather than vendored: the data dump is 13 MB and this
 * runs by hand, not on every build.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "../apps/web/node_modules/@electric-sql/pglite/dist/index.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "node_modules", ".cache", "pagila");
const OUT = path.join(ROOT, "scripts", "pagila-expected.json");
const BASE = "https://raw.githubusercontent.com/devrimgunduz/pagila/master";

/**
 * The reference queries. Each one IS the answer to its assignment prompt, so
 * the prompt has to name the columns and the ordering exactly — otherwise a
 * student who solves the problem correctly still fails the diff on a column
 * alias, which teaches them nothing.
 */
const QUERIES = {
  week1: `
select c.customer_id,
       c.first_name,
       c.last_name,
       sum(p.amount)::numeric(10,2) as lifetime_revenue
from customer c
join payment p on p.customer_id = c.customer_id
group by c.customer_id, c.first_name, c.last_name
order by lifetime_revenue desc, c.customer_id
limit 10`,
  week2: `
select store_id, customer_id, total_paid, rank_in_store
from (
  select c.store_id,
         c.customer_id,
         sum(p.amount)::numeric(10,2) as total_paid,
         rank() over (partition by c.store_id order by sum(p.amount) desc, c.customer_id) as rank_in_store
  from customer c
  join payment p on p.customer_id = c.customer_id
  group by c.store_id, c.customer_id
) ranked
where rank_in_store <= 3
order by store_id, rank_in_store`,
};

async function download(name) {
  if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, name);
  if (existsSync(file)) return readFileSync(file, "utf8");

  const res = await fetch(`${BASE}/${name}`);
  if (!res.ok) throw new Error(`Could not download ${name}: HTTP ${res.status}`);
  const text = await res.text();
  writeFileSync(file, text);
  return text;
}

async function load() {
  // pgvector is not available in PGlite, and film_embedding is irrelevant to
  // every query here. Strip rather than fail.
  const schema = (await download("pagila-schema.sql"))
    .replace(/CREATE EXTENSION IF NOT EXISTS vector[^;]*;/gi, "")
    .replace(/COMMENT ON EXTENSION vector[^;]*;/gi, "")
    .replace(/CREATE TABLE public\.film_embedding \([\s\S]*?\);/gi, "")
    .replace(/ALTER TABLE public\.film_embedding[^;]*;/gi, "")
    .replace(/ALTER TABLE ONLY public\.film_embedding[\s\S]*?;/gi, "")
    .replace(/CREATE INDEX film_embedding[^;]*;/gi, "")
    .replace(/CREATE TRIGGER last_updated BEFORE UPDATE ON public\.film_embedding[^;]*;/gi, "");

  const db = new PGlite();
  await db.exec(schema);

  // pg_dump writes `COPY t (cols) FROM stdin;` with the rows inline. PGlite's
  // exec cannot consume that, but COPY FROM a blob is the identical wire
  // format, so each block is replayed as its own blob.
  const data = await download("pagila-data.sql");
  const block = /^COPY (public\.[\w.]+) (\([^)]*\)) FROM stdin;\r?\n([\s\S]*?)\r?\n\\\.$/gm;
  let m;
  while ((m = block.exec(data)) !== null) {
    const [, table, cols, body] = m;
    if (!body.trim() || table.includes("film_embedding")) continue;
    await db.query(`COPY ${table} ${cols} FROM '/dev/blob'`, [], {
      blob: new Blob([`${body}\n`]),
    });
  }

  // pg_dump sets search_path to '' — restore it so the reference queries can
  // be written the way a student would write them.
  await db.exec("set search_path to public;");
  return db;
}

const db = await load();
const computed = {};

for (const [key, sql] of Object.entries(QUERIES)) {
  const res = await db.query(sql);
  computed[key] = {
    sql: sql.trim(),
    expected: {
      columns: res.fields.map((f) => f.name),
      rows: res.rows.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([c, v]) => [c, typeof v === "bigint" ? Number(v) : v]),
        ),
      ),
    },
  };
}

await db.close();

if (process.argv.includes("--write")) {
  writeFileSync(OUT, `${JSON.stringify(computed, null, 2)}\n`);
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
} else {
  const onDisk = readFileSync(OUT, "utf8").trim();
  if (onDisk !== JSON.stringify(computed, null, 2)) {
    console.error(
      "scripts/pagila-expected.json does not match a fresh run against Pagila.\n" +
        "Either the dataset changed upstream or a reference query was edited.\n" +
        "Re-run with --write and check the diff before committing it — every\n" +
        "row here is an answer key.",
    );
    process.exit(1);
  }
  for (const [key, { expected }] of Object.entries(computed)) {
    console.log(`${key}: ${expected.rows.length} rows, columns ${expected.columns.join(", ")}`);
  }
  console.log("Reference results match.");
}
