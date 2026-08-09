/**
 * Applies every migration and the seed to a real Postgres, then asserts the
 * behaviour the schema is supposed to guarantee.
 *
 *   pnpm db:simulate
 *
 * Postgres runs in-process via PGlite (WASM), so this needs no Docker, no
 * network, no project, and no secrets. That matters: the Docker-based
 * `database` CI job and `supabase start` were both unavailable on the machine
 * this schema was written on, which is exactly how a trigger that raises
 * "record new has no field module_id" reached main with three green checks.
 *
 * Static analysis cannot catch that class of bug. plpgsql resolves record
 * fields when a statement executes, so the only way to know a trigger works
 * is to fire it.
 *
 * This is not a replacement for the Docker job: PGlite has no Supabase auth
 * schema, no anon/authenticated roles, and does not enforce RLS the way a
 * real project does — the shims below fake just enough for the DDL to apply.
 * It catches schema and trigger logic. The Docker job catches the rest.
 */
import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const SEED = path.join(ROOT, "supabase", "seed.sql");

/** Objects Supabase provides that the migrations depend on but do not create. */
const SHIM = `
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  phone text unique
);
create or replace function auth.uid() returns uuid
  language sql stable
  as $fn$ select nullif(current_setting('jintu.uid', true), '')::uuid $fn$;
do $do$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role; end if;
end $do$;

-- Storage. Only the three objects the migrations touch: the bucket registry,
-- the object table policies attach to, and foldername(), which is how a path
-- convention becomes an ownership check. Column set matches the real
-- storage.buckets closely enough for the insert to be meaningful — if a
-- migration references a column that does not exist here, that is a finding,
-- not a shim to widen.
create schema if not exists storage;
create table if not exists storage.buckets (
  id                 text primary key,
  name               text not null,
  public             boolean not null default false,
  file_size_limit    bigint,
  allowed_mime_types text[],
  created_at         timestamptz not null default now()
);
create table if not exists storage.objects (
  id         uuid primary key default gen_random_uuid(),
  bucket_id  text references storage.buckets (id),
  name       text,
  owner      uuid,
  created_at timestamptz not null default now()
);
alter table storage.objects enable row level security;
-- The real implementation returns the path minus the filename, so the first
-- element is the top folder. Matching that exactly matters: a shim that
-- returned every segment would make [1] the same value either way and the
-- ownership assertions below would pass against a broken policy.
create or replace function storage.foldername(name text) returns text[]
  language sql immutable
  as $fn$
    select case
      when array_length(string_to_array(name, '/'), 1) > 1
        then (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1]
      else array[]::text[]
    end
  $fn$;
`;

const PATH_ID = "22222222-2222-4222-8222-222222222222";
const MODULE_1 = "33333333-3333-4333-8333-000000000001";
const USER_1 = "55555555-5555-4555-8555-000000000001";

let passed = 0;
const failures = [];

function record(ok, label, detail) {
  if (ok) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push({ label, detail });
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const db = await PGlite.create();
await db.exec(SHIM);

console.log("── migrations ──────────────────────────────────────────────");
const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort();
if (files.length === 0) {
  console.error("No migrations found.");
  process.exit(1);
}
for (const file of files) {
  try {
    await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
    record(true, file);
  } catch (e) {
    record(false, file, e.message);
    console.error("\nMigration failed; later assertions would be meaningless.");
    process.exit(1);
  }
}

if (existsSync(SEED)) {
  console.log("\n── seed ────────────────────────────────────────────────────");
  try {
    await db.exec(readFileSync(SEED, "utf8"));
    // The seed publishes last on purpose; if the triggers are wrong it is the
    // first thing that breaks.
    record(true, "seed.sql applies (exercises insert-then-publish ordering)");
  } catch (e) {
    record(false, "seed.sql", e.message);
  }
}

async function rejects(label, sql) {
  try {
    await db.exec(sql);
    record(false, label, "succeeded, should have been rejected");
  } catch {
    record(true, label);
  }
}

async function allows(label, sql) {
  try {
    await db.exec(sql);
    record(true, label);
  } catch (e) {
    record(false, label, e.message.split("\n")[0]);
  }
}

console.log("\n── answer keys produce the answers they claim ──────────────");
// An `expected` result that no query can produce marks every correct
// submission wrong, and does it silently — the students see a diff against
// something that was never right. So each key's reference query is run
// against its own fixture, in a throwaway database, and compared.
{
  const keys = await db.query(`
    select k.assignment_id, k.setup, k.reference_sql, k.expected, k.order_matters
    from public.assignment_answer_keys k`);

  record(keys.rows.length > 0, "there is at least one answer key to check");

  for (const key of keys.rows) {
    // A separate PGlite instance per key: the fixtures create tables with
    // ordinary names and would collide.
    const fixture = await PGlite.create();
    try {
      await fixture.exec(key.setup);
      const produced = await fixture.query(key.reference_sql);

      const asText = (rows, columns) =>
        rows.map((r) =>
          columns.map((c) => {
            const v = r[c];
            if (v === null || v === undefined) return "null";
            const n = Number(v);
            return !Number.isNaN(n) && String(v).trim() !== "" ? `n:${n}` : `s:${v}`;
          }).join("|"),
        );

      const columns = key.expected.columns.map((c) => c.toLowerCase());
      const actualCols = (produced.fields ?? []).map((f) => f.name.toLowerCase());
      const lower = (r) =>
        Object.fromEntries(Object.entries(r).map(([k2, v]) => [k2.toLowerCase(), v]));

      const expectedRows = asText(key.expected.rows.map(lower), columns);
      const actualRows = asText(produced.rows.map(lower), columns);
      const sameOrder = key.order_matters
        ? expectedRows.join("\n") === actualRows.join("\n")
        : [...expectedRows].sort().join("\n") === [...actualRows].sort().join("\n");

      record(
        columns.join(",") === actualCols.join(",") && sameOrder,
        `answer key ${key.assignment_id} matches its reference query`,
        `expected ${JSON.stringify(expectedRows)} got ${JSON.stringify(actualRows)}`,
      );
    } catch (e) {
      record(false, `answer key ${key.assignment_id} runs at all`, e.message.split("\n")[0]);
    } finally {
      await fixture.close();
    }
  }

  // The answer key is the answer, and `assignments` beside it is anon-readable.
  await db.exec(`grant usage on schema public to authenticated;
                 grant select on all tables in schema public to authenticated;`);
  await db.exec("begin; set local role authenticated; set local jintu.uid = '55555555-5555-4555-8555-000000000001';");
  const leaked = await db.query(`select assignment_id from public.assignment_answer_keys`);
  await db.exec("rollback;");
  record(
    leaked.rows.length === 0,
    "a signed-in student cannot read the answer keys",
    `leaked ${leaked.rows.length} row(s)`,
  );

  await rejects(
    "changing the answer key of a published assignment",
    `update public.assignment_answer_keys set expected = '{"columns":[],"rows":[]}'::jsonb;`,
  );
}
console.log("\n── published curriculum is immutable ───────────────────────");
await rejects(
  "insert a module into a published path",
  `insert into public.modules (path_id, week_no, title, objective)
   values ('${PATH_ID}', 9, 'Sneaky', 'nope');`,
);
await rejects(
  "rewrite a module title",
  `update public.modules set title = 'Rewritten' where id = '${MODULE_1}';`,
);
await rejects("delete a module", `delete from public.modules where id = '${MODULE_1}';`);
await rejects(
  "rewrite a resource title",
  `update public.resources set title = 'Rewritten' where module_id = '${MODULE_1}';`,
);
await rejects(
  "insert an assignment",
  `insert into public.assignments (module_id, kind, spec)
   values ('${MODULE_1}', 'file', '{}'::jsonb);`,
);
await rejects("delete a published path", `delete from public.paths where id = '${PATH_ID}';`);
await rejects(
  "rewrite a published path's version",
  `update public.paths set version = 99 where id = '${PATH_ID}';`,
);
// The exception to all of the above, and the reason the trigger is not a
// blanket freeze — see §6's check-link-health cron.
await allows(
  "the link-health cron may still mark a resource dead",
  `update public.resources set health = 'dead', last_checked_at = now()
   where module_id = '${MODULE_1}';`,
);
await allows(
  "archiving a published path",
  `update public.paths set status = 'archived' where id = '${PATH_ID}';`,
);

console.log("\n── Law 3 and DPDP consent ──────────────────────────────────");
await db.exec(`insert into auth.users (id, phone) values ('${USER_1}', '+919876543210');`);
await rejects(
  "a profile without the 18+ confirmation",
  `insert into public.profiles (id, phone, is_adult_confirmed)
   values ('${USER_1}', '+919876543210', false);`,
);
await allows(
  "a profile with the 18+ confirmation",
  `insert into public.profiles (id, phone, is_adult_confirmed)
   values ('${USER_1}', '+919876543210', true);`,
);
await allows(
  "granting a purpose-scoped consent",
  `insert into public.consents (user_id, purpose, notice_version)
   values ('${USER_1}', 'analytics', '2026-08-09.v1');`,
);
await rejects(
  "two live consents for the same purpose",
  `insert into public.consents (user_id, purpose, notice_version)
   values ('${USER_1}', 'analytics', '2026-08-09.v1');`,
);
await allows(
  "withdrawing then re-granting keeps the audit trail",
  `update public.consents set withdrawn_at = now()
     where user_id = '${USER_1}' and purpose = 'analytics';
   insert into public.consents (user_id, purpose, notice_version)
     values ('${USER_1}', 'analytics', '2026-08-09.v2');`,
);
await rejects(
  "a purpose that is not in the allowed set",
  `insert into public.consents (user_id, purpose, notice_version)
   values ('${USER_1}', 'sell_to_advertisers', 'v1');`,
);

console.log("\n── waitlist ────────────────────────────────────────────────");
await rejects(
  "a waitlist row without the 18+ confirmation",
  `insert into public.waitlist_signups (phone, is_adult_confirmed, consent_contact, notice_version)
   values ('+919876543211', false, true, 'v1');`,
);
await rejects(
  "a waitlist row without contact consent",
  `insert into public.waitlist_signups (phone, is_adult_confirmed, consent_contact, notice_version)
   values ('+919876543211', true, false, 'v1');`,
);
await rejects(
  "a non-Indian mobile number",
  `insert into public.waitlist_signups (phone, is_adult_confirmed, consent_contact, notice_version)
   values ('+14155550123', true, true, 'v1');`,
);
// Declining the optional purpose must never block the signup, or the consent
// stops being freely given — docs/LEGAL.md §2.2.
await allows(
  "a valid signup that declines WhatsApp updates",
  `insert into public.waitlist_signups
     (phone, is_adult_confirmed, consent_contact, consent_whatsapp, notice_version)
   values ('+919876543211', true, true, false, 'v1');`,
);

console.log("\n── sprint loop ─────────────────────────────────────────────");
const COHORT = "66666666-6666-4666-8666-000000000001";
const ENROL_A = "77777777-7777-4777-8777-00000000000a";
const ENROL_B = "77777777-7777-4777-8777-00000000000b";
const USER_2 = "55555555-5555-4555-8555-000000000002";
const ASSIGNMENT = await db.query(
  `select id from public.assignments where kind = 'sql' limit 1`,
);
const ASSIGN_ID = ASSIGNMENT.rows[0]?.id;

await db.exec(`
  insert into auth.users (id, phone) values ('${USER_2}', '+919876543212');
  insert into public.profiles (id, phone, is_adult_confirmed)
    values ('${USER_2}', '+919876543212', true);
  insert into public.cohorts (id, path_id, mode, starts_on, ends_on, capacity, status)
    values ('${COHORT}', '${PATH_ID}', 'public', date '2026-09-01', date '2026-10-13', 20, 'open');
  insert into public.enrollments (id, cohort_id, user_id)
    values ('${ENROL_A}', '${COHORT}', '${USER_1}'),
           ('${ENROL_B}', '${COHORT}', '${USER_2}');
  insert into public.submissions (id, enrollment_id, assignment_id, week_no, payload)
    values ('88888888-8888-4888-8888-000000000001', '${ENROL_A}', '${ASSIGN_ID}', 1, '{"sql":"select 1"}'::jsonb);
`);
record(true, "cohort, enrolments and a submission insert cleanly");

// A student marking their own work is not peer review.
await rejects(
  "assigning a student their own submission to review",
  `insert into public.peer_reviews (submission_id, reviewer_enrollment_id, due_at)
   values ('88888888-8888-4888-8888-000000000001', '${ENROL_A}', now() + interval '3 days');`,
);
await allows(
  "assigning a different student as reviewer",
  `insert into public.peer_reviews (submission_id, reviewer_enrollment_id, due_at)
   values ('88888888-8888-4888-8888-000000000001', '${ENROL_B}', now() + interval '3 days');`,
);

// Law 1: an AI grade that cannot be costed, or a free grade that charges.
await rejects(
  "an AI grading with no model recorded",
  `insert into public.gradings (submission_id, grader_type, scores, total, cost_paise)
   values ('88888888-8888-4888-8888-000000000001', 'ai', '{}'::jsonb, 4, 120);`,
);
await rejects(
  "a deterministic grading that claims an AI cost",
  `insert into public.gradings (submission_id, grader_type, scores, total, cost_paise)
   values ('88888888-8888-4888-8888-000000000001', 'deterministic', '{}'::jsonb, 4, 120);`,
);
await allows(
  "a deterministic grading at zero cost",
  `insert into public.gradings (submission_id, grader_type, scores, total)
   values ('88888888-8888-4888-8888-000000000001', 'deterministic', '{"returns_expected_rows":3}'::jsonb, 4);`,
);

// docs/LEGAL.md §3.1: only document_verified outcomes may ever be published.
await rejects(
  "publish consent on a self-reported outcome",
  `insert into public.outcomes (enrollment_id, event, source, publish_consent_at)
   values ('${ENROL_A}', 'offer', 'self_reported', now());`,
);
await allows(
  "publish consent on a document-verified outcome",
  `insert into public.outcomes (enrollment_id, event, source, publish_consent_at)
   values ('${ENROL_A}', 'offer', 'document_verified', now());`,
);

await rejects(
  "a public profile with no published_at",
  `insert into public.public_profiles (slug, enrollment_id, visibility)
   values ('asha-r', '${ENROL_A}', 'public');`,
);
await allows(
  "a private profile by default",
  `insert into public.public_profiles (slug, enrollment_id)
   values ('asha-r', '${ENROL_A}');`,
);

// The reviewer-facing view must not expose who wrote the work.
const queueCols = await db.query(`
  select column_name from information_schema.columns
  where table_schema='public' and table_name='peer_review_queue'`);
const leaked = queueCols.rows
  .map((r) => r.column_name)
  .filter((c) => /enrollment|user_id|reviewer/.test(c));
record(
  leaked.length === 0,
  "peer_review_queue exposes no column identifying the author",
  leaked.join(", "),
);
console.log("\n── data isolation between students ─────────────────────────");
// Everything above runs as the owner, which bypasses RLS entirely. These
// assertions switch to the `authenticated` role so the policies actually
// apply — otherwise "RLS is enabled" is a fact about the catalog and not
// about who can read whose work.
{
  await db.exec(`
    grant usage on schema public to authenticated;
    grant select, insert, update on all tables in schema public to authenticated;
    insert into public.submissions (id, enrollment_id, assignment_id, week_no, payload)
      values ('88888888-8888-4888-8888-000000000002', '${ENROL_B}', '${ASSIGN_ID}', 1, '{"sql":"select 2"}'::jsonb);
  `);

  const asUser = async (uid, sql) => {
    await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}';`);
    try {
      return await db.query(sql);
    } finally {
      await db.exec("rollback;");
    }
  };

  const mine = await asUser(USER_1, "select id from public.submissions");
  record(
    mine.rows.length === 1,
    "a student sees only their own submission",
    `saw ${mine.rows.length}, expected 1`,
  );

  const theirs = await asUser(
    USER_1,
    `select id from public.submissions where enrollment_id = '${ENROL_B}'`,
  );
  record(
    theirs.rows.length === 0,
    "a student cannot read another student's submission",
    `leaked ${theirs.rows.length} row(s)`,
  );

  const otherConsents = await asUser(USER_2, "select purpose from public.consents");
  record(
    otherConsents.rows.length === 0,
    "a student cannot read another student's consents",
    `leaked ${otherConsents.rows.length} row(s)`,
  );

  // The waitlist has an insert policy and deliberately no select policy: the
  // anon key is public, so a readable waitlist is a downloadable phone list.
  const waitlist = await asUser(USER_1, "select phone from public.waitlist_signups");
  record(
    waitlist.rows.length === 0,
    "the waitlist phone list is not readable by a signed-in user",
    `leaked ${waitlist.rows.length} row(s)`,
  );

  // Published curriculum is meant to be readable by everyone.
  const tracks = await asUser(USER_1, "select slug from public.tracks");
  record(tracks.rows.length > 0, "published curriculum is still readable while signed in");

  // ── submission storage ────────────────────────────────────────────────
  // The bucket is private and the only thing standing between one student's
  // uploaded dataset and another's is a path convention plus two policies.
  // That is exactly the kind of claim that needs firing rather than reading.
  await db.exec(`
    grant usage on schema storage to authenticated;
    grant select, insert on storage.objects to authenticated;
  `);

  const bucket = await db.query(
    `select public, file_size_limit from storage.buckets where id = 'submissions'`,
  );
  record(
    bucket.rows[0]?.public === false,
    "the submissions bucket exists and is private",
    `public=${bucket.rows[0]?.public}`,
  );

  const asUserWrite = async (uid, sql) => {
    await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}';`);
    try {
      await db.query(sql);
      return null;
    } catch (e) {
      return e.message.split("\n")[0];
    } finally {
      await db.exec("rollback;");
    }
  };

  const ownFolder = await asUserWrite(
    USER_1,
    `insert into storage.objects (bucket_id, name)
     values ('submissions', '${USER_1}/${ASSIGN_ID}/cleaned.csv')`,
  );
  record(ownFolder === null, "an enrolled student may upload into their own folder", ownFolder);

  const otherFolder = await asUserWrite(
    USER_1,
    `insert into storage.objects (bucket_id, name)
     values ('submissions', '${USER_2}/${ASSIGN_ID}/cleaned.csv')`,
  );
  record(
    otherFolder !== null,
    "a student cannot upload into another student's folder",
    "the insert succeeded",
  );

  // Not enrolled means not uploading — signing up costs one SMS, and without
  // this the bucket is free storage for anyone who can receive it.
  const notEnrolled = "55555555-5555-4555-8555-000000000003";
  await db.exec(`
    insert into auth.users (id, phone) values ('${notEnrolled}', '+919876543213');
    insert into public.profiles (id, phone, is_adult_confirmed)
      values ('${notEnrolled}', '+919876543213', true);
  `);
  const unenrolled = await asUserWrite(
    notEnrolled,
    `insert into storage.objects (bucket_id, name)
     values ('submissions', '${notEnrolled}/x/cleaned.csv')`,
  );
  record(
    unenrolled !== null,
    "an account with no active enrolment cannot upload at all",
    "the insert succeeded",
  );

  await db.exec(`
    insert into storage.objects (bucket_id, name)
      values ('submissions', '${USER_2}/${ASSIGN_ID}/theirs.csv');
  `);
  const readTheirs = await asUser(
    USER_1,
    `select name from storage.objects where bucket_id = 'submissions'`,
  );
  record(
    readTheirs.rows.every((r) => String(r.name).startsWith(USER_1)),
    "a student cannot read another student's uploaded file",
    readTheirs.rows.map((r) => r.name).join(", "),
  );
}


console.log("\n── the weekly loop ─────────────────────────────────────────");
// Allocation, peer grades, readiness and rollover are plpgsql, which means
// static reading proves nothing about them at all. Everything below fires the
// function and checks the rows it left behind.
{
  const USER_3 = "55555555-5555-4555-8555-000000000004";
  const ENROL_C = "77777777-7777-4777-8777-00000000000c";
  const SUB_1 = "88888888-8888-4888-8888-000000000001"; // ENROL_A
  const SUB_2 = "88888888-8888-4888-8888-000000000002"; // ENROL_B

  // A ring of two can only give one review each; a ring of three gives two.
  const two = await db.query(`select public.allocate_peer_reviews('${ASSIGN_ID}') as n`);
  const reviewersOfTwo = await db.query(`
    select submission_id, count(*)::int as n from public.peer_reviews
    where submission_id in ('${SUB_1}', '${SUB_2}') group by submission_id`);
  record(
    reviewersOfTwo.rows.length === 2 && reviewersOfTwo.rows.every((r) => r.n === 1),
    "a cohort of two allocates one reviewer each, not two",
    `allocated ${two.rows[0].n}; ${JSON.stringify(reviewersOfTwo.rows)}`,
  );

  await db.exec(`
    insert into auth.users (id, phone) values ('${USER_3}', '+919876543214');
    insert into public.profiles (id, phone, is_adult_confirmed)
      values ('${USER_3}', '+919876543214', true);
    insert into public.enrollments (id, cohort_id, user_id)
      values ('${ENROL_C}', '${COHORT}', '${USER_3}');
    insert into public.submissions (id, enrollment_id, assignment_id, week_no, payload)
      values ('88888888-8888-4888-8888-000000000003', '${ENROL_C}', '${ASSIGN_ID}', 1, '{"sql":"select 3"}'::jsonb);
  `);
  await db.query(`select public.allocate_peer_reviews('${ASSIGN_ID}')`);

  const perSubmission = await db.query(`
    select count(*)::int as n from public.peer_reviews group by submission_id`);
  record(
    perSubmission.rows.length === 3 && perSubmission.rows.every((r) => r.n === 2),
    "every submission ends up with exactly two reviewers",
    JSON.stringify(perSubmission.rows),
  );

  // A ring hands out as many reviews as it receives. Any allocation that does
  // not is one where somebody carries someone else's week.
  const perReviewer = await db.query(`
    select count(*)::int as n from public.peer_reviews group by reviewer_enrollment_id`);
  record(
    perReviewer.rows.length === 3 && perReviewer.rows.every((r) => r.n === 2),
    "and every student is asked to review exactly two",
    JSON.stringify(perReviewer.rows),
  );

  const selfReview = await db.query(`
    select count(*)::int as n from public.peer_reviews pr
    join public.submissions s on s.id = pr.submission_id
    where s.enrollment_id = pr.reviewer_enrollment_id`);
  record(selfReview.rows[0].n === 0, "nobody was allocated their own work");

  // Re-running must not disturb reviews already assigned or written.
  const again = await db.query(`select public.allocate_peer_reviews('${ASSIGN_ID}') as n`);
  record(Number(again.rows[0].n) === 0, "re-allocating allocates nothing new");

  // ── what a reviewer may see ──────────────────────────────────────────────
  const asUser = async (uid, sql) => {
    await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}';`);
    try {
      return await db.query(sql);
    } finally {
      await db.exec("rollback;");
    }
  };

  const queue = await asUser(USER_1, `select peer_review_id from public.peer_review_queue`);
  record(
    queue.rows.length === 2,
    "a reviewer can actually read their queue (the view is not invoker-rights)",
    `saw ${queue.rows.length}, expected 2`,
  );

  const strangerQueue = await asUser(
    "55555555-5555-4555-8555-000000000003",
    `select peer_review_id from public.peer_review_queue`,
  );
  record(
    strangerQueue.rows.length === 0,
    "someone with no allocation sees an empty queue, not everyone's",
    `leaked ${strangerQueue.rows.length} row(s)`,
  );

  // The whole point of the definer view: reviewers still have no route to
  // `submissions`, so there is no column anywhere that names the author.
  const throughTable = await asUser(
    USER_1,
    `select id from public.submissions where enrollment_id <> '${ENROL_A}'`,
  );
  record(
    throughTable.rows.length === 0,
    "a reviewer still cannot read the submissions table directly",
    `leaked ${throughTable.rows.length} row(s)`,
  );

  // ── a review, once written, is fixed ─────────────────────────────────────
  const mine = await db.query(`
    select id, submission_id from public.peer_reviews
    where reviewer_enrollment_id = '${ENROL_A}' limit 1`);
  const REVIEW = mine.rows[0].id;

  await rejects(
    "a reviewer moving their own deadline",
    `update public.peer_reviews set due_at = now() + interval '30 days' where id = '${REVIEW}';`,
  );
  await rejects(
    "a reviewer re-pointing a review at another submission",
    `update public.peer_reviews set submission_id = '${SUB_1}' where id = '${REVIEW}';`,
  );

  await allows(
    "submitting a review",
    `update public.peer_reviews
       set status = 'submitted',
           scores = '{"returns_expected_rows": 3, "no_cartesian": 1, "readable": 0}'::jsonb,
           feedback = 'Correct, but select * makes it hard to follow.'
     where id = '${REVIEW}';`,
  );

  const peerGrade = await db.query(`
    select total, feedback from public.gradings
    where grader_type = 'peer' and submission_id = '${mine.rows[0].submission_id}'`);
  record(
    peerGrade.rows.length === 1 && Number(peerGrade.rows[0].total) === 4,
    "a submitted review becomes an anonymous grading row totalled in SQL",
    JSON.stringify(peerGrade.rows),
  );

  await rejects(
    "re-submitting a review that was already submitted",
    `update public.peer_reviews set scores = '{"readable": 1}'::jsonb where id = '${REVIEW}';`,
  );

  // ── readiness ────────────────────────────────────────────────────────────
  // ENROL_A: one of the path's two assignments submitted (50), one
  // deterministic grade of 4 against a rubric worth 5 (80), one of two
  // reviews written (50). 0.4·50 + 0.4·80 + 0.2·50 = 62.
  const readiness = await db.query(`select public.compute_readiness('${ENROL_A}') as overall`);
  record(
    Number(readiness.rows[0].overall) === 62,
    "readiness weights submission, attainment and reviewing 40/40/20",
    `got ${readiness.rows[0].overall}, expected 62`,
  );

  const breakdown = await db.query(`
    select breakdown from public.readiness_scores
    where enrollment_id = '${ENROL_A}' order by computed_at desc limit 1`);
  const b = breakdown.rows[0].breakdown;
  record(
    Number(b.submitted?.of) === 2 && Number(b.attainment?.of) === 5,
    "the breakdown records what each component was out of",
    JSON.stringify(b),
  );

  // Recomputing in the same transaction must not collide on
  // unique (enrollment_id, computed_at) — hence clock_timestamp().
  await allows(
    "recomputing a cohort's readiness in one transaction",
    `select public.compute_cohort_readiness('${COHORT}');`,
  );

  // A peer being generous must not move the author's readiness. If it does,
  // the number is a popularity score.
  const before = await db.query(`select public.compute_readiness('${ENROL_B}') as o`);
  await db.exec(`
    update public.peer_reviews
       set status = 'submitted', scores = '{"returns_expected_rows": 3, "no_cartesian": 1, "readable": 1}'::jsonb
     where submission_id = '${SUB_2}' and status = 'pending';`);
  const after = await db.query(`select public.compute_readiness('${ENROL_B}') as o`);
  record(
    Number(before.rows[0].o) === Number(after.rows[0].o),
    "peer scores received do not move the author's readiness",
    `${before.rows[0].o} → ${after.rows[0].o}`,
  );

  // ── rollover ─────────────────────────────────────────────────────────────
  const C_PLANNED = "66666666-6666-4666-8666-00000000000a";
  const C_OPEN = "66666666-6666-4666-8666-00000000000b";
  const C_RUNNING = "66666666-6666-4666-8666-00000000000c";
  const C_EARLY = "66666666-6666-4666-8666-00000000000d";
  const USER_4 = "55555555-5555-4555-8555-000000000005";

  await db.exec(`
    insert into public.cohorts (id, path_id, mode, starts_on, ends_on, capacity, status) values
      ('${C_PLANNED}', '${PATH_ID}', 'public', current_date + 7,  current_date + 49, 20, 'planned'),
      ('${C_EARLY}',   '${PATH_ID}', 'public', current_date + 60, current_date + 102, 20, 'planned'),
      ('${C_OPEN}',    '${PATH_ID}', 'public', current_date - 1,  current_date + 41, 20, 'open'),
      ('${C_RUNNING}', '${PATH_ID}', 'public', current_date - 50, current_date - 1,  20, 'running');
    insert into auth.users (id, phone) values ('${USER_4}', '+919876543215');
    insert into public.profiles (id, phone, is_adult_confirmed)
      values ('${USER_4}', '+919876543215', true);
    insert into public.enrollments (cohort_id, user_id) values ('${C_RUNNING}', '${USER_4}');
  `);

  await db.query(`select * from public.roll_cohorts()`);
  const statuses = await db.query(`
    select id, status from public.cohorts
    where id in ('${C_PLANNED}', '${C_EARLY}', '${C_OPEN}', '${C_RUNNING}')`);
  const status = Object.fromEntries(statuses.rows.map((r) => [r.id, r.status]));
  record(status[C_PLANNED] === "open", "a cohort inside the enrolment window opens", status[C_PLANNED]);
  record(status[C_EARLY] === "planned", "one outside it stays planned", status[C_EARLY]);
  record(status[C_OPEN] === "running", "a cohort whose start date passed starts", status[C_OPEN]);
  record(status[C_RUNNING] === "finished", "a cohort past its end date finishes", status[C_RUNNING]);

  const completed = await db.query(`
    select status, completed_at from public.enrollments where cohort_id = '${C_RUNNING}'`);
  record(
    completed.rows[0]?.status === "completed" && completed.rows[0]?.completed_at !== null,
    "and its students are marked completed, by the calendar and not by hand",
    JSON.stringify(completed.rows),
  );

  const noop = await db.query(`select * from public.roll_cohorts()`);
  record(noop.rows.length === 0, "a second rollover the same day changes nothing", `${noop.rows.length} row(s)`);

  // ── these are privileged operations ──────────────────────────────────────
  // Every function above reads rows belonging to other students. A student who
  // could call one could allocate themselves a review of anyone's work, or
  // write their own readiness score.
  const callable = await db.query(`
    select p.proname from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('allocate_peer_reviews', 'compute_readiness',
                        'compute_cohort_readiness', 'roll_cohorts')
      and has_function_privilege('authenticated', p.oid, 'execute')`);
  record(
    callable.rows.length === 0,
    "no signed-in user can call the loop functions directly",
    callable.rows.map((r) => r.proname).join(", "),
  );
}

console.log("\n── RLS ─────────────────────────────────────────────────────");
const noRls = await db.query(`
  select c.relname from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
  order by c.relname`);
record(
  noRls.rows.length === 0,
  "every public table has RLS enabled",
  noRls.rows.map((r) => r.relname).join(", "),
);

// Cost ledgers, audit logs and crawler output are correctly unreachable from
// any client: RLS on with no policy denies everyone, and the service role
// bypasses RLS. The exemption is read from the table comment so it has to be
// declared in the schema, not inferred from a table that simply forgot one.
const noPolicy = await db.query(`
  select c.relname from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid)
    and coalesce(obj_description(c.oid, 'pg_class'), '') not ilike '%service-role only%'
  order by c.relname`);
record(
  noPolicy.rows.length === 0,
  "every table with RLS has a policy, or is declared service-role only",
  noPolicy.rows.map((r) => r.relname).join(", "),
);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f.label}${f.detail ? `: ${f.detail}` : ""}`);
  process.exit(1);
}
