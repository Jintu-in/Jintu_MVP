/**
 * Emits version 2 of the Data Analyst curriculum: all six weeks finished.
 *
 *   node scripts/generate-data-analyst-v2.mjs > supabase/.bundle/data-analyst-v2.sql
 *
 * Why a new version rather than an edit. Version 1 shipped with resources on
 * three weeks out of six and artifacts on two, so /learn advertised a
 * six-week course that stopped after week four. The obvious fix is to add the
 * missing rows to the existing path — and the database refuses, correctly:
 * `modules_frozen_when_published` and its siblings raise on any write to
 * content hanging off a published path (supabase/migrations,
 * 20260809020000_curriculum.sql). "Immutable once published" is enforced, not
 * merely documented, because a student who started week 1 against one
 * syllabus should not find week 3 rewritten under them mid-sprint.
 *
 * So this builds path version 2 as a draft, fills in all six weeks, and
 * publishes it in the same transaction. getPublishedTrack() already reads the
 * highest published version, so the site switches over atomically and version
 * 1 stays intact for anyone mid-cohort.
 *
 * Re-running is safe. Every insert is guarded, and if version 2 is already
 * published the block reports that and returns without touching anything.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REFERENCE = JSON.parse(readFileSync(path.join(ROOT, "scripts", "pagila-expected.json"), "utf8"));

const TRACK = "data-analyst-fresher";

/** Single-quote escaping for SQL literals. */
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const j = (o) => q(JSON.stringify(o));

/**
 * Rubrics.
 *
 * Every rubric this file references is declared here, including the three
 * that already exist. That is not redundancy: supabase/seed.sql creates only
 * sql-correctness-v1 and written-finding-v1, while walkthrough-v1 exists on
 * the live project because a different script put it there. A script that
 * assumes some other script ran first fails as a silently dropped row — the
 * assignment insert joins rubrics by name, so a missing rubric quietly
 * produces a week with no artifact.
 *
 * `on conflict (name) do nothing` throughout, never `do update`: these are
 * cited by published paths, and rewriting one would silently change what
 * finished work was worth.
 *
 * The two new ones are for human/AI-marked artifacts. They are deliberately
 * NOT new SQL rubrics: the deterministic grader hard-codes its criteria and
 * weights (returns_expected_rows 3, no_cartesian 1, readable 1) rather than
 * reading them from the database, so any `sql` assignment carrying a
 * different rubric would publish a promise the grader does not keep.
 */
const RUBRICS = [
  // Existing — values match the live project exactly. Present so this file
  // stands alone, not to change anything.
  {
    name: "sql-correctness-v1",
    max_score: 5,
    criteria: [
      { key: "returns_expected_rows", label: "Returns the expected result set", weight: 3 },
      { key: "no_cartesian", label: "No accidental cross join", weight: 1 },
      { key: "readable", label: "Aliases and formatting a reviewer can follow", weight: 1 },
    ],
  },
  {
    name: "written-finding-v1",
    max_score: 7,
    criteria: [
      { key: "answers_question", label: "Answers the question actually asked", weight: 3 },
      { key: "states_caveats", label: "States what would change the conclusion", weight: 2 },
      { key: "evidence", label: "Every number is traceable to a query", weight: 2 },
    ],
  },
  {
    name: "walkthrough-v1",
    max_score: 5,
    criteria: [
      { key: "under_five_minutes", label: "Makes the point in under five minutes", weight: 2 },
      { key: "explains_why", label: "Explains a decision, not only what was built", weight: 2 },
      { key: "audible", label: "Audible, with the screen readable at 720p", weight: 1 },
    ],
  },
  // New.
  {
    name: "data-quality-audit-v1",
    max_score: 7,
    criteria: [
      { key: "finds_real_problems", label: "Names problems that are actually in the data", weight: 3 },
      { key: "quantifies", label: "Says how many rows each problem affects", weight: 2 },
      { key: "decides", label: "States what to drop, fix or keep — and why", weight: 2 },
    ],
  },
  {
    name: "dashboard-clarity-v1",
    max_score: 7,
    criteria: [
      { key: "reads_unaided", label: "A stranger states the main finding without being told it", weight: 3 },
      { key: "honest_scales", label: "Axes, baselines and filters do not overstate the result", weight: 2 },
      { key: "traceable", label: "Every number names the query or table behind it", weight: 2 },
    ],
  },
];

/**
 * The six weeks.
 *
 * Titles and objectives for weeks 1-6 are carried over from version 1
 * unchanged — they were already right, and the gap was never the plan, it was
 * the content underneath it.
 *
 * Every resource URL below was checked to return 200 when this was written.
 * They are all documentation, reference or open datasets rather than videos:
 * a doc page that moves leaves a redirect, and the link-health cron can see a
 * 404, but neither can tell that a tutorial video has quietly become wrong.
 */
const WEEKS = [
  {
    week: 1,
    title: "SQL that answers a question",
    objective: "Write joins and aggregates against a real schema without reaching for a tutorial.",
    resources: [
      ["docs", "https://www.postgresql.org/docs/current/tutorial-join.html", "PostgreSQL manual — joins"],
      ["dataset", "https://github.com/devrimgunduz/pagila", "Pagila sample database"],
    ],
    assignment: {
      kind: "sql",
      rubric: "sql-correctness-v1",
      weight: 1,
      spec: {
        prompt:
          "Return the ten customers with the highest lifetime rental revenue. " +
          "Columns, in this order and with these names: customer_id, first_name, " +
          "last_name, lifetime_revenue — where lifetime_revenue is the sum of " +
          "payment.amount as numeric(10,2). Order by lifetime_revenue descending, " +
          "then customer_id ascending.",
        dataset: "pagila",
        // The grader diffs the result set, so the prompt has to pin the column
        // names and the ordering. Version 1 said only "the ten customers with
        // the highest lifetime rental revenue", which is a fine question and an
        // ungradeable one: a correct answer aliasing the sum as `revenue` would
        // have been marked wrong.
        orderMatters: true,
        expected: REFERENCE.week1.expected,
      },
    },
  },
  {
    week: 2,
    title: "Window functions and cohorts",
    objective: "Compute retention and running totals in SQL rather than exporting to a spreadsheet.",
    resources: [
      ["docs", "https://www.postgresql.org/docs/current/tutorial-window.html", "PostgreSQL manual — window functions"],
      ["docs", "https://www.postgresql.org/docs/current/functions-window.html", "PostgreSQL manual — window function reference"],
      ["article", "https://mode.com/sql-tutorial/sql-window-functions/", "Mode — SQL window functions"],
    ],
    assignment: {
      kind: "sql",
      rubric: "sql-correctness-v1",
      weight: 1,
      spec: {
        prompt:
          "For each store, return the three customers who have paid the most. " +
          "Columns, in this order and with these names: store_id, customer_id, " +
          "total_paid, rank_in_store — where total_paid is the sum of " +
          "payment.amount as numeric(10,2) and rank_in_store runs 1 to 3 within " +
          "each store. Break ties on total_paid by customer_id ascending. Order " +
          "by store_id, then rank_in_store. Use a window function, not a " +
          "correlated subquery.",
        dataset: "pagila",
        orderMatters: true,
        expected: REFERENCE.week2.expected,
      },
    },
  },
  {
    week: 3,
    title: "Cleaning data you did not create",
    objective: "Find and document what is wrong with a dataset before analysing it.",
    resources: [
      ["article", "https://vita.had.co.nz/papers/tidy-data.pdf", "Tidy Data (Wickham)"],
      ["docs", "https://www.postgresql.org/docs/current/functions-string.html", "PostgreSQL manual — string functions"],
      [
        "dataset",
        "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9",
        "NYC 311 service requests — a genuinely messy public dataset",
      ],
    ],
    assignment: {
      kind: "artifact_link",
      rubric: "data-quality-audit-v1",
      weight: 1,
      spec: {
        prompt:
          "Pick one month of NYC 311 requests and write a one-page data quality " +
          "audit. For each problem you find — duplicates, impossible dates, " +
          "free-text categories, missing boroughs — say how many rows it affects " +
          "and what you would do about it. An analyst who says 'the data is messy' " +
          "has said nothing; the number is the finding.",
      },
    },
  },
  {
    week: 4,
    title: "An analysis that answers something",
    objective: "Turn a vague business question into a defensible finding with stated caveats.",
    resources: [
      ["docs", "https://developers.google.com/tech-writing/one", "Google — Technical Writing One"],
      [
        "article",
        "https://en.wikipedia.org/wiki/Simpson%27s_paradox",
        "Simpson's paradox — when the aggregate contradicts every subgroup",
      ],
    ],
    assignment: {
      kind: "artifact_link",
      rubric: "written-finding-v1",
      weight: 2,
      spec: {
        prompt: "One page: what you found, how confident you are, and what would change your mind.",
      },
    },
  },
  {
    week: 5,
    title: "A dashboard someone else can read",
    objective: "Build a dashboard that survives being handed to a stranger with no explanation.",
    resources: [
      ["tool", "https://www.metabase.com/learn/", "Metabase Learn — building and sharing dashboards"],
      ["article", "https://www.storytellingwithdata.com/blog", "Storytelling with Data — the blog archive"],
    ],
    assignment: {
      kind: "artifact_link",
      rubric: "dashboard-clarity-v1",
      weight: 2,
      spec: {
        prompt:
          "Build a dashboard for the question you answered in week 4 and send the " +
          "link to someone who has not seen your work. If they cannot tell you the " +
          "main finding within a minute, without you speaking, it is not finished. " +
          "Submit the dashboard link and one line on what your reader got wrong first.",
      },
    },
  },
  {
    week: 6,
    title: "Explaining your work out loud",
    objective: "Walk through a finding in five minutes and answer the obvious follow-up.",
    resources: [
      ["docs", "https://developers.google.com/tech-writing/two", "Google — Technical Writing Two"],
      [
        "article",
        "https://www.ted.com/playlists/574/how_to_make_a_great_presentation",
        "TED — how to make a great presentation",
      ],
    ],
    assignment: {
      kind: "recording",
      rubric: "walkthrough-v1",
      weight: 2,
      spec: {
        prompt:
          "Record five minutes walking through your week 4 finding: the question, " +
          "what you did, what you found, and what you are not sure about. Then " +
          "answer the question an interviewer always asks — 'how do you know?'",
      },
    },
  },
];

// ── emit ─────────────────────────────────────────────────────────────────────

const out = [];
out.push(`-- Data Analyst — first job: curriculum version 2, all six weeks.`);
out.push(`-- Generated by scripts/generate-data-analyst-v2.mjs. Do not edit by hand.`);
out.push(`--`);
out.push(`-- Safe to run repeatedly. Version 1 is left untouched — it is published,`);
out.push(`-- and published paths are immutable by trigger, not by convention.`);
out.push("");

out.push(`insert into public.rubrics (name, criteria, max_score) values`);
out.push(
  RUBRICS.map((r) => `  (${q(r.name)}, ${j(r.criteria)}::jsonb, ${r.max_score})`).join(",\n") +
    "\non conflict (name) do nothing;",
);
out.push("");
out.push(`-- ^ do nothing, not do update: these rubrics are cited by published paths,`);
out.push(`--   and rewriting one would silently change what finished work was worth.`);
out.push("");

out.push(`do $dav2$`);
out.push(`declare`);
out.push(`  v_track uuid;`);
out.push(`  v_path  uuid;`);
out.push(`  v_state text;`);
out.push(`begin`);
out.push(`  select id into v_track from public.tracks where slug = ${q(TRACK)};`);
out.push("");
out.push(`  if v_track is null then`);
out.push(`    raise exception ${q(`${TRACK} does not exist — run the course seed first`)};`);
out.push(`  end if;`);
out.push("");
out.push(`  insert into public.paths (track_id, version, status)`);
out.push(`  values (v_track, 2, 'draft')`);
out.push(`  on conflict (track_id, version) do nothing;`);
out.push("");
out.push(`  select id, status into v_path, v_state`);
out.push(`  from public.paths where track_id = v_track and version = 2;`);
out.push("");
out.push(`  if v_state <> 'draft' then`);
out.push(`    raise notice ${q(`${TRACK} v2: already published, nothing to do`)};`);
out.push(`    return;`);
out.push(`  end if;`);
out.push("");

out.push(`  insert into public.modules (path_id, week_no, title, objective) values`);
out.push(
  WEEKS.map((w) => `    (v_path, ${w.week}, ${q(w.title)}, ${q(w.objective)})`).join(",\n") +
    "\n  on conflict (path_id, week_no) do nothing;",
);
out.push("");

const resourceRows = WEEKS.flatMap((w) =>
  w.resources.map(
    ([kind, url, title], i) => `    (${w.week}, ${q(kind)}, ${q(url)}, ${q(title)}, ${i})`,
  ),
);
out.push(`  insert into public.resources (module_id, kind, provider, external_url, title, position)`);
out.push(`  select m.id, x.kind, 'web', x.url, x.title, x.position`);
out.push(`  from (values`);
out.push(resourceRows.join(",\n"));
out.push(`  ) as x(week, kind, url, title, position)`);
out.push(`  join public.modules m on m.path_id = v_path and m.week_no = x.week`);
out.push(`  on conflict (module_id, position) do nothing;`);
out.push("");

const assignmentRows = WEEKS.map(
  (w) =>
    `    (${w.week}, ${q(w.assignment.kind)}, ${j(w.assignment.spec)}, ${q(w.assignment.rubric)}, ${w.assignment.weight})`,
);
out.push(`  -- Joined to rubrics by name, so a missing rubric drops the row rather`);
out.push(`  -- than inserting an assignment with a null rubric nobody notices.`);
out.push(`  insert into public.assignments (module_id, kind, spec, rubric_id, weight)`);
out.push(`  select m.id, x.kind, x.spec::jsonb, r.id, x.weight`);
out.push(`  from (values`);
out.push(assignmentRows.join(",\n"));
out.push(`  ) as x(week, kind, spec, rubric, weight)`);
out.push(`  join public.modules m on m.path_id = v_path and m.week_no = x.week`);
out.push(`  join public.rubrics r on r.name = x.rubric`);
out.push(`  on conflict (module_id, kind) do nothing;`);
out.push("");

out.push(`  -- Refuse to publish a half-built version. Without this, one dropped`);
out.push(`  -- insert above would go live as another incomplete course, which is`);
out.push(`  -- the exact failure this version exists to fix.`);
out.push(`  if (select count(*) from public.modules where path_id = v_path) <> ${WEEKS.length}`);
out.push(`     or (select count(*) from public.resources r`);
out.push(`         join public.modules m on m.id = r.module_id`);
out.push(`         where m.path_id = v_path) <> ${resourceRows.length}`);
out.push(`     or (select count(*) from public.assignments a`);
out.push(`         join public.modules m on m.id = a.module_id`);
out.push(`         where m.path_id = v_path) <> ${WEEKS.length} then`);
out.push(`    raise exception ${q(`${TRACK} v2 is incomplete — expected ${WEEKS.length} modules, ${resourceRows.length} resources, ${WEEKS.length} assignments. Not publishing.`)};`);
out.push(`  end if;`);
out.push("");
out.push(`  update public.paths set status = 'published', published_at = now()`);
out.push(`  where id = v_path;`);
out.push("");
out.push(`  raise notice ${q(`${TRACK} v2: published with all ${WEEKS.length} weeks`)};`);
out.push(`end $dav2$;`);
out.push("");

process.stdout.write(out.join("\n"));
