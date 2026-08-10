/**
 * Builds the answer keys for the auto-graded SQL assignments.
 *
 *   node scripts/sql-fixtures.mjs           # verify the committed JSON
 *   node scripts/sql-fixtures.mjs --write   # regenerate it
 *
 * An answer key is three things: a `setup` fixture applied to an empty
 * database, the `reference_sql` that answers the prompt against it, and the
 * `expected` result that query produces. The grader applies setup, runs the
 * student's query, and diffs. See assignment_answer_keys in
 * supabase/migrations/20260809050000_weekly_loop.sql.
 *
 * This replaces an earlier attempt that used Pagila. Two things were wrong
 * with that, and both are worth recording so nobody tries it again:
 *
 *   1. Pagila is a 13 MB dump. `setup` is applied to an empty database on
 *      every single grading run, so the fixture has to be small. A dataset you
 *      download is not a fixture.
 *
 *   2. It put `expected` into assignments.spec, which anon can read through
 *      the public curriculum. That published the answer. The whole reason
 *      assignment_answer_keys exists as a separate, service-role-only table is
 *      that `assignments` next to it is public — its own comment says so.
 *
 * The fixture below is deliberately tiny and deliberately unambiguous: every
 * customer has a distinct total, so "top ten" and "top three per store" have
 * exactly one correct answer and no tie-breaking to argue about.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "scripts", "sql-answer-keys.json");

/** customer_id → [first, last, store, total]. Totals are distinct on purpose. */
const CUSTOMERS = [
  [1, "Priya", "Sharma", 1, 340.0],
  [2, "Arjun", "Mehta", 1, 325.5],
  [3, "Nandini", "Rao", 1, 318.25],
  [4, "Vikram", "Iyer", 1, 301.0],
  [5, "Sana", "Qureshi", 1, 290.75],
  [6, "Rohit", "Das", 1, 282.5],
  [7, "Meera", "Nair", 2, 355.25],
  [8, "Kabir", "Singh", 2, 331.0],
  [9, "Ananya", "Bose", 2, 310.5],
  [10, "Farhan", "Ali", 2, 299.25],
  [11, "Divya", "Menon", 2, 288.0],
  [12, "Tanvi", "Joshi", 2, 270.75],
];

/**
 * Each total split across three dated payments, so the table looks like
 * something that happened rather than one row per customer — a student should
 * have to aggregate.
 */
function payments() {
  const rows = [];
  let id = 1;
  for (const [customerId, , , , total] of CUSTOMERS) {
    const first = Math.round(total * 0.5 * 100) / 100;
    const second = Math.round(total * 0.3 * 100) / 100;
    const third = Math.round((total - first - second) * 100) / 100;
    const months = ["2026-01-14", "2026-02-11", "2026-03-09"];
    for (const [i, amount] of [first, second, third].entries()) {
      rows.push(`  (${id++}, ${customerId}, ${amount.toFixed(2)}, '${months[i]}')`);
    }
  }
  return rows.join(",\n");
}

const SETUP = `
create table store (
  store_id int primary key,
  city     text not null
);

create table customer (
  customer_id int primary key,
  first_name  text not null,
  last_name   text not null,
  store_id    int not null references store (store_id)
);

create table payment (
  payment_id  int primary key,
  customer_id int not null references customer (customer_id),
  amount      numeric(10,2) not null,
  paid_on     date not null
);

insert into store (store_id, city) values
  (1, 'Mumbai'),
  (2, 'Pune');

insert into customer (customer_id, first_name, last_name, store_id) values
${CUSTOMERS.map(([id, f, l, s]) => `  (${id}, '${f}', '${l}', ${s})`).join(",\n")};

insert into payment (payment_id, customer_id, amount, paid_on) values
${payments()};
`.trim();

const KEYS = {
  "data-analyst-fresher/1": {
    reference_sql: `
select c.customer_id,
       c.first_name,
       c.last_name,
       sum(p.amount)::numeric(10,2) as lifetime_revenue
from customer c
join payment p on p.customer_id = c.customer_id
group by c.customer_id, c.first_name, c.last_name
order by lifetime_revenue desc, c.customer_id
limit 10`.trim(),
    order_matters: true,
  },
  "data-analyst-fresher/2": {
    reference_sql: `
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
order by store_id, rank_in_store`.trim(),
    order_matters: true,
  },
};

const db = new PGlite();
await db.exec(SETUP);

const computed = {};
for (const [key, { reference_sql, order_matters }] of Object.entries(KEYS)) {
  const res = await db.query(reference_sql);
  computed[key] = {
    setup: SETUP,
    reference_sql,
    order_matters,
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

const serialised = `${JSON.stringify(computed, null, 2)}\n`;

if (process.argv.includes("--write")) {
  writeFileSync(OUT, serialised);
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
} else {
  if (readFileSync(OUT, "utf8") !== serialised) {
    console.error(
      "scripts/sql-answer-keys.json does not match a fresh run of the fixture.\n" +
        "A reference query or the fixture changed. Re-run with --write and read the\n" +
        "diff carefully — every row in that file is an answer key, and a wrong one\n" +
        "marks every correct submission wrong.",
    );
    process.exit(1);
  }
  for (const [key, v] of Object.entries(computed)) {
    console.log(`${key}: ${v.expected.rows.length} rows, columns ${v.expected.columns.join(", ")}`);
  }
  console.log("Answer keys match the fixture.");
}
