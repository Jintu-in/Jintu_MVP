import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { SQL_MAX_SCORE, gradeSqlSubmission } from "./sql";
import type { QueryResult, QueryRunner, SqlAssignmentSpec } from "./types";

/**
 * A QueryRunner backed by real Postgres, and the reference implementation of
 * the safety contract in types.ts: read-only transaction plus a statement
 * timeout. The edge function's runner must do the same — these tests are
 * where that contract is pinned down.
 */
let db: PGlite;

const runner: QueryRunner = {
  async run(sql) {
    // A student submission is untrusted input. Read-only is enforced by the
    // database, not by inspecting the SQL for the word "delete".
    await db.exec("begin; set transaction read only; set local statement_timeout = '5s';");
    try {
      const res = await db.query(sql);
      return {
        columns: (res.fields ?? []).map((f: { name: string }) => f.name),
        rows: res.rows as QueryResult["rows"],
      };
    } finally {
      await db.exec("rollback;");
    }
  },
  async explain(sql) {
    await db.exec("begin; set transaction read only;");
    try {
      const res = await db.query(`explain (format json) ${sql}`);
      const row = res.rows[0] as Record<string, unknown>;
      return row?.["QUERY PLAN"] ?? row;
    } finally {
      await db.exec("rollback;");
    }
  },
};

beforeAll(async () => {
  db = await PGlite.create();
  await db.exec(`
    create table customers (id int primary key, name text, city text);
    create table rentals (id int primary key, customer_id int references customers(id), amount numeric);
    insert into customers values (1,'Asha','Chennai'), (2,'Ravi','Pune'), (3,'Meera','Kochi');
    insert into rentals values
      (1,1,120.00),(2,1,80.00),(3,2,300.00),(4,3,50.00),(5,3,25.50);
  `);
});

/** The reference answer, as an assignment author would have captured it. */
const spec = (): SqlAssignmentSpec => ({
  orderMatters: true,
  expected: {
    columns: ["name", "revenue"],
    rows: [
      { name: "Ravi", revenue: 300 },
      { name: "Asha", revenue: 200 },
      { name: "Meera", revenue: 75.5 },
    ],
  },
});

const CORRECT = `
  select c.name, sum(r.amount) as revenue
  from customers c
  join rentals r on r.customer_id = c.id
  group by c.name
  order by revenue desc
`;

describe("gradeSqlSubmission", () => {
  it("gives full marks to a correct, readable query", async () => {
    const grade = await gradeSqlSubmission(CORRECT, spec(), runner);
    expect(grade.error).toBeNull();
    expect(grade.total).toBe(SQL_MAX_SCORE);
    expect(grade.criteria.every((c) => c.passed)).toBe(true);
  });

  it("matches numbers regardless of how the driver serialises them", async () => {
    // Postgres returns numeric as a string. A correct query failing over that
    // would be the grader's bug, not the student's.
    const grade = await gradeSqlSubmission(CORRECT, spec(), runner);
    const correctness = grade.criteria.find((c) => c.key === "returns_expected_rows");
    expect(correctness?.passed).toBe(true);
  });

  it("fails correctness when the ordering is wrong and order is the question", async () => {
    const grade = await gradeSqlSubmission(
      CORRECT.replace("order by revenue desc", "order by revenue asc"),
      spec(),
      runner,
    );
    const c = grade.criteria.find((x) => x.key === "returns_expected_rows");
    expect(c?.passed).toBe(false);
    expect(c?.detail).toMatch(/Row 1/);
  });

  it("accepts any ordering when the prompt did not ask for one", async () => {
    const s = { ...spec(), orderMatters: false };
    const grade = await gradeSqlSubmission(
      CORRECT.replace("order by revenue desc", "order by revenue asc"),
      s,
      runner,
    );
    expect(grade.criteria.find((x) => x.key === "returns_expected_rows")?.passed).toBe(true);
  });

  it("ignores column order but not column identity", async () => {
    const swapped = CORRECT.replace(
      "select c.name, sum(r.amount) as revenue",
      "select sum(r.amount) as revenue, c.name",
    );
    const grade = await gradeSqlSubmission(swapped, { ...spec(), orderMatters: false }, runner);
    expect(grade.criteria.find((x) => x.key === "returns_expected_rows")?.passed).toBe(true);
  });

  it("reports a missing column by name", async () => {
    const grade = await gradeSqlSubmission(
      "select c.name from customers c",
      spec(),
      runner,
    );
    const c = grade.criteria.find((x) => x.key === "returns_expected_rows");
    expect(c?.passed).toBe(false);
    expect(c?.detail).toContain("revenue");
  });

  it("reports a row-count difference in plain words", async () => {
    const grade = await gradeSqlSubmission(
      `select c.name, sum(r.amount) as revenue from customers c
       join rentals r on r.customer_id = c.id
       where c.city = 'Pune' group by c.name order by revenue desc`,
      spec(),
      runner,
    );
    expect(grade.criteria.find((x) => x.key === "returns_expected_rows")?.detail).toMatch(
      /Expected 3 rows, got 1/,
    );
  });

  it("detects an accidental cross join from the query plan", async () => {
    const grade = await gradeSqlSubmission(
      "select c.name, r.amount as revenue from customers c, rentals r",
      { ...spec(), orderMatters: false },
      runner,
    );
    const c = grade.criteria.find((x) => x.key === "no_cartesian");
    expect(c?.passed).toBe(false);
    expect(c?.detail).toMatch(/cross product/i);
  });

  it("does not accuse a properly joined query of a cross product", async () => {
    const grade = await gradeSqlSubmission(CORRECT, spec(), runner);
    expect(grade.criteria.find((x) => x.key === "no_cartesian")?.passed).toBe(true);
  });

  it("docks readability for select *", async () => {
    const grade = await gradeSqlSubmission("select * from customers", spec(), runner);
    const c = grade.criteria.find((x) => x.key === "readable");
    expect(c?.passed).toBe(false);
    expect(c?.detail).toMatch(/select \*/);
  });

  it("scores zero and passes the database's message through when the query is invalid", async () => {
    const grade = await gradeSqlSubmission("select nope from nowhere", spec(), runner);
    expect(grade.total).toBe(0);
    expect(grade.error).toBeTruthy();
    expect(grade.criteria[0]?.detail).toMatch(/did not run/);
  });

  it("scores zero for an empty submission without touching the database", async () => {
    const grade = await gradeSqlSubmission("   ", spec(), {
      run: () => {
        throw new Error("the runner must not be called for an empty submission");
      },
    });
    expect(grade.total).toBe(0);
    expect(grade.error).toBe("Nothing was submitted.");
  });

  // The security property the whole design rests on. If this ever fails, a
  // student can drop a table by submitting an assignment.
  it("cannot write, even when the submission is a DELETE", async () => {
    const before = await db.query("select count(*)::int as n from rentals");
    const grade = await gradeSqlSubmission("delete from rentals", spec(), runner);
    const after = await db.query("select count(*)::int as n from rentals");

    expect(grade.total).toBe(0);
    expect(grade.error).toMatch(/read-only|read only/i);
    expect((after.rows[0] as { n: number }).n).toBe((before.rows[0] as { n: number }).n);
  });

  it("cannot drop a table either", async () => {
    const grade = await gradeSqlSubmission("drop table rentals", spec(), runner);
    expect(grade.error).toBeTruthy();
    const still = await db.query("select count(*)::int as n from rentals");
    expect((still.rows[0] as { n: number }).n).toBe(5);
  });
});
