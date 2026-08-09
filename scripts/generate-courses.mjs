/**
 * Emits SQL for ten additional tracks.
 *
 *   node scripts/generate-courses.mjs > supabase/.bundle/courses.sql
 *
 * Written as a generator rather than hand-rolled SQL so that the shape is
 * identical across ten tracks and the constraints are satisfied by
 * construction, not by proofreading. Every rule the curriculum migration
 * enforces is encoded here:
 *
 *   - a path is created as a DRAFT, filled, and published LAST. The
 *     immutability triggers reject inserts into a published path, so any
 *     other order fails.
 *   - modules, resources and assignments are addressed by their natural keys
 *     (path+week, module+position, module+kind) rather than generated ids,
 *     so the script needs no uuid bookkeeping and is safe to re-read.
 *   - resources carry a URL and our own title. There is nowhere here to put
 *     what the page says, and that is Law 2, not an omission.
 *
 * Every external_url in this file was checked to return 200 before it was
 * added. A dead link in a published path is a support ticket from a student
 * who thinks they did something wrong.
 */

/** Shared rubrics. Created if absent, reused by name if already there. */
const RUBRICS = [
  {
    name: "sql-correctness-v1",
    max: 5,
    criteria: [
      { key: "returns_expected_rows", label: "Returns the expected result set", weight: 3 },
      { key: "no_cartesian", label: "No accidental cross join", weight: 1 },
      { key: "readable", label: "Aliases and formatting a reviewer can follow", weight: 1 },
    ],
  },
  {
    name: "written-finding-v1",
    max: 7,
    criteria: [
      { key: "answers_question", label: "Answers the question actually asked", weight: 3 },
      { key: "states_caveats", label: "States what would change the conclusion", weight: 2 },
      { key: "evidence", label: "Every number is traceable to a query", weight: 2 },
    ],
  },
  {
    name: "working-software-v1",
    max: 8,
    criteria: [
      { key: "runs_from_clean", label: "Runs from a clean clone with the documented steps", weight: 3 },
      { key: "does_what_it_claims", label: "Does what the README says it does", weight: 3 },
      { key: "readable", label: "A reviewer can find where a change would go", weight: 2 },
    ],
  },
  {
    name: "api-contract-v1",
    max: 7,
    criteria: [
      { key: "documented", label: "Every endpoint documented with request and response", weight: 2 },
      { key: "status_codes", label: "Correct status codes, including the failure cases", weight: 3 },
      { key: "validation", label: "Rejects bad input instead of storing it", weight: 2 },
    ],
  },
  {
    name: "test-suite-v1",
    max: 6,
    criteria: [
      { key: "covers_failure", label: "Tests the failure paths, not only the happy one", weight: 3 },
      { key: "deterministic", label: "Passes twice in a row without edits", weight: 2 },
      { key: "readable", label: "A failure message says what broke", weight: 1 },
    ],
  },
  {
    name: "walkthrough-v1",
    max: 5,
    criteria: [
      { key: "under_five_minutes", label: "Makes the point in under five minutes", weight: 2 },
      { key: "explains_why", label: "Explains a decision, not only what was built", weight: 2 },
      { key: "audible", label: "Audible, with the screen readable at 720p", weight: 1 },
    ],
  },
];

const TRACKS = [
  {
    slug: "backend-node-fresher",
    title: "Backend Engineer — Node.js",
    summary:
      "Six weeks building one HTTP service properly: routing, validation, a real database, auth, tests, and a deploy someone else can run.",
    weeks: [
      ["HTTP, and what a server actually does", "Explain a request end to end — method, status, headers, body — without hand-waving."],
      ["Routing and input validation", "Reject bad input at the edge and return a status code that tells the caller why."],
      ["Talking to a database", "Model one domain in SQL and query it from Node without string-concatenating user input."],
      ["Authentication that is not a toy", "Issue and verify a session, and explain what an attacker can and cannot do with it."],
      ["Tests that catch regressions", "Write tests for the failure paths, and make them pass twice in a row."],
      ["Deploy and defend it", "Ship it, then walk someone through the design decision you are least sure about."],
    ],
    resources: [
      [1, "docs", "https://developer.mozilla.org/en-US/docs/Web/HTTP", "MDN — HTTP"],
      [2, "docs", "https://expressjs.com/en/guide/routing.html", "Express — routing guide"],
      [3, "docs", "https://nodejs.org/docs/latest/api/", "Node.js API reference"],
    ],
    assignments: [
      [2, "artifact_link", "api-contract-v1", 2, "A repository with a running HTTP service: at least four endpoints, one of which rejects invalid input with a 4xx and a useful message."],
      [5, "artifact_link", "test-suite-v1", 2, "The same service with a test suite. At least half the tests must cover something failing."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: show the service working, then explain the design decision you are least confident about and what would change your mind."],
    ],
  },
  {
    slug: "frontend-react-fresher",
    title: "Frontend Engineer — React",
    summary:
      "Six weeks building one interface that works on a slow phone: state, forms, data fetching, accessibility, and a deploy you can share.",
    weeks: [
      ["The browser, before the framework", "Explain what the browser does with your HTML and CSS before any JavaScript runs."],
      ["Components and state", "Model a screen as state plus a render, and say where each piece of state belongs."],
      ["Forms that do not lose work", "Validate, show errors next to the field, and never silently drop what someone typed."],
      ["Fetching, loading and failure", "Handle the three states every network call has, including the one people forget."],
      ["Accessibility and the slow phone", "Make it usable with a keyboard, a screen reader, and a 3G connection."],
      ["Ship it and explain it", "Deploy, then walk through one thing you rewrote and why."],
    ],
    resources: [
      [1, "docs", "https://developer.mozilla.org/en-US/docs/Web/CSS", "MDN — CSS"],
      [2, "docs", "https://react.dev/learn", "React — Learn"],
      [4, "docs", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", "MDN — Fetch API"],
    ],
    assignments: [
      [3, "artifact_link", "working-software-v1", 2, "A deployed interface with at least one form that validates, shows errors inline, and keeps input on a failed submit."],
      [5, "artifact_link", "written-finding-v1", 2, "A short audit of your own interface: what breaks with a keyboard only, and what you changed."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes on one component you rewrote, and what the first version got wrong."],
    ],
  },
  {
    slug: "python-backend-fresher",
    title: "Backend Engineer — Python",
    summary:
      "Six weeks from a script to a service: typed request handling, a real schema, background work, tests, and a deploy with an honest README.",
    weeks: [
      ["Python that other people can read", "Write a module with types and docstrings a reviewer can follow without asking you."],
      ["From script to service", "Turn a function into an HTTP endpoint with validated input and a documented response."],
      ["The database layer", "Design a schema, migrate it, and query it without writing SQL by string concatenation."],
      ["Work that happens later", "Move something slow off the request path and explain what happens if it fails."],
      ["Tests and fixtures", "Write tests that set up their own data and do not depend on each other."],
      ["Package and hand over", "Deploy, document, and defend one trade-off out loud."],
    ],
    resources: [
      [1, "docs", "https://docs.python.org/3/tutorial/", "The Python tutorial"],
      [2, "docs", "https://fastapi.tiangolo.com/tutorial/", "FastAPI — tutorial"],
      [3, "docs", "https://docs.djangoproject.com/en/stable/intro/tutorial01/", "Django — writing your first app"],
    ],
    assignments: [
      [2, "artifact_link", "api-contract-v1", 2, "A service with at least four endpoints and a documented contract for each, including what it returns when the input is wrong."],
      [5, "artifact_link", "test-suite-v1", 2, "A test suite that creates its own fixtures and passes on a clean checkout."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the slow thing you moved off the request path, and what happens when it fails."],
    ],
  },
  {
    slug: "sql-database-fresher",
    title: "Database Engineer — SQL",
    summary:
      "Six weeks of query work on messy data: joins, window functions, indexes, transactions, and explaining a query plan to someone who did not write it.",
    weeks: [
      ["Joins against a real schema", "Answer a question that spans four tables without producing a cross product."],
      ["Aggregation and window functions", "Compute a running total and a per-group rank in SQL rather than in a spreadsheet."],
      ["Modelling and normalisation", "Design tables for a domain and defend where you stopped normalising."],
      ["Indexes and the query plan", "Read an EXPLAIN and say why the planner chose what it chose."],
      ["Transactions and constraints", "Make an invalid state unrepresentable rather than merely discouraged."],
      ["Explain a query out loud", "Walk a reviewer through a query they have never seen."],
    ],
    resources: [
      [1, "docs", "https://www.postgresql.org/docs/current/tutorial.html", "PostgreSQL — tutorial"],
      [2, "docs", "https://www.postgresql.org/docs/current/tutorial-window.html", "PostgreSQL — window functions"],
      [4, "docs", "https://www.postgresql.org/docs/current/indexes.html", "PostgreSQL — indexes"],
    ],
    assignments: [
      [1, "sql", "sql-correctness-v1", 1, "Return the ten customers with the highest lifetime revenue, with their city, ordered by revenue descending."],
      [4, "artifact_link", "written-finding-v1", 2, "Take one slow query, add an index, and write up the before and after plan with timings."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes explaining one query and the plan the database chose for it."],
    ],
  },
  {
    slug: "data-engineer-fresher",
    title: "Data Engineer",
    summary:
      "Six weeks building one pipeline that runs on a schedule, fails loudly, and produces a table someone else can trust.",
    weeks: [
      ["Where data comes from", "Pull from a file, an API and a database, and describe how each one fails."],
      ["Cleaning and shape", "Turn a messy extract into a tidy table and document every assumption you made."],
      ["Loading and idempotency", "Make a load you can run twice without doubling the rows."],
      ["Orchestration", "Put it on a schedule with retries, and decide what should page a human."],
      ["Testing data, not just code", "Assert on the data itself: row counts, nulls, and the ranges that should never move."],
      ["Hand the table over", "Document the table so someone can use it without asking you."],
    ],
    resources: [
      [2, "article", "https://vita.had.co.nz/papers/tidy-data.pdf", "Tidy Data (Wickham)"],
      [4, "docs", "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", "Apache Airflow — tutorial"],
      [5, "docs", "https://docs.getdbt.com/docs/introduction", "dbt — introduction"],
    ],
    assignments: [
      [3, "artifact_link", "working-software-v1", 2, "A pipeline that can be run twice in a row without changing the output. Show the second run."],
      [5, "artifact_link", "test-suite-v1", 2, "Data tests that fail loudly on a deliberately corrupted input. Include the failing output."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: what breaks this pipeline at 3am, and how the person on call would know."],
    ],
  },
  {
    slug: "devops-fresher",
    title: "DevOps Engineer",
    summary:
      "Six weeks turning one application into something that builds, deploys and recovers without you: containers, CI, config, and a runbook.",
    weeks: [
      ["Containers, honestly", "Build an image that runs the same on your machine and someone else's."],
      ["Build pipelines", "Make a pipeline that fails on a real problem and not on flakiness."],
      ["Configuration and secrets", "Separate config from code and explain where each secret lives and who can read it."],
      ["Deploy and roll back", "Ship a change, break it deliberately, and roll it back in under five minutes."],
      ["Observability", "Add logs and one metric that would actually tell you the service is down."],
      ["Write the runbook", "Document the failure you caused and how the next person fixes it."],
    ],
    resources: [
      [1, "docs", "https://docs.docker.com/get-started/", "Docker — get started"],
      [2, "docs", "https://docs.github.com/en/actions", "GitHub Actions — documentation"],
      [4, "docs", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "Kubernetes basics"],
    ],
    assignments: [
      [2, "artifact_link", "working-software-v1", 2, "A repository whose pipeline builds and tests on every push. Link a run that failed for a real reason."],
      [6, "file", "written-finding-v1", 2, "A runbook for one failure you caused on purpose: symptom, diagnosis, fix, and how to prevent it."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: break it and roll it back on camera."],
    ],
  },
  {
    slug: "qa-automation-fresher",
    title: "QA Automation Engineer",
    summary:
      "Six weeks writing tests that find real bugs: test design, browser automation, API testing, flakiness, and a report a developer will act on.",
    weeks: [
      ["What to test, and what not to", "Turn a feature into a list of cases ordered by what would hurt most if it broke."],
      ["Automating the browser", "Automate a user journey that survives the page changing slightly."],
      ["Testing the API underneath", "Test the contract directly, including the responses nobody documented."],
      ["Flakiness", "Take a flaky test, find the actual race, and fix the test rather than retrying it."],
      ["Finding a real bug", "Break something on purpose in a real open-source project and write the case that catches it."],
      ["Report it well", "Write a bug report a developer can reproduce without replying to ask questions."],
    ],
    resources: [
      [2, "docs", "https://playwright.dev/docs/intro", "Playwright — getting started"],
      [3, "docs", "https://swagger.io/specification/", "OpenAPI specification"],
      [4, "docs", "https://docs.pytest.org/en/stable/", "pytest — documentation"],
    ],
    assignments: [
      [2, "artifact_link", "test-suite-v1", 2, "An automated journey through a real site of your choosing, passing twice in a row on a clean run."],
      [5, "artifact_link", "written-finding-v1", 2, "One reproducible bug: steps, expected, actual, environment, and the automated test that catches it."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the flaky test, the race you found, and why a retry would have hidden it."],
    ],
  },
  {
    slug: "android-kotlin-fresher",
    title: "Android Engineer — Kotlin",
    summary:
      "Six weeks building one Android app that behaves on a mid-range phone: state, lists, storage, network failure, and a signed build.",
    weeks: [
      ["Kotlin worth writing", "Write Kotlin that uses the language rather than Java with different punctuation."],
      ["Screens and state", "Build a screen that survives rotation and process death without losing what the user typed."],
      ["Lists and performance", "Render a long list that stays smooth on a phone with four gigabytes of RAM."],
      ["Storage and offline", "Keep working when the network does not, and reconcile when it returns."],
      ["Network failure as a feature", "Handle timeouts and errors as designed states, not as crashes."],
      ["Ship a build", "Produce a signed build someone can install, and explain one thing you cut."],
    ],
    resources: [
      [1, "docs", "https://kotlinlang.org/docs/getting-started.html", "Kotlin — getting started"],
      [2, "docs", "https://developer.android.com/courses/android-basics-compose/course", "Android Basics with Compose"],
      [4, "docs", "https://www.sqlite.org/lang.html", "SQLite — SQL reference"],
    ],
    assignments: [
      [3, "artifact_link", "working-software-v1", 2, "An app that shows a list from a real API and keeps working with the network switched off."],
      [5, "artifact_link", "written-finding-v1", 2, "A short note on what your app does on a slow connection, with screenshots of each state."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes on the phone: show it working offline, then explain one feature you cut and why."],
    ],
  },
  {
    slug: "cloud-aws-fresher",
    title: "Cloud Engineer — AWS",
    summary:
      "Six weeks running one small system on AWS: compute, storage, networking, identity, cost, and an architecture diagram that matches reality.",
    weeks: [
      ["The account and the bill", "Set up an account safely and explain what each line of the bill is for."],
      ["Compute and storage", "Run something and store something, and say what happens when each one fails."],
      ["Networking, slowly", "Explain how a request reaches your service, and what is between it and the internet."],
      ["Identity and least privilege", "Give a service the smallest set of permissions that lets it work."],
      ["Cost and limits", "Put a ceiling on spend and explain what happens when it is reached."],
      ["Draw it as it is", "Produce an architecture diagram that matches what is actually deployed."],
    ],
    resources: [
      [2, "docs", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html", "Amazon S3 — user guide"],
      [4, "docs", "https://owasp.org/www-project-top-ten/", "OWASP Top Ten"],
      [5, "docs", "https://redis.io/docs/latest/develop/", "Redis — developer docs"],
    ],
    assignments: [
      [3, "artifact_link", "working-software-v1", 2, "A deployed service with a public URL, and a note on which permissions it holds and why each is needed."],
      [5, "artifact_link", "written-finding-v1", 2, "A cost breakdown for your system at ten users and at ten thousand, with the assumptions stated."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes on the diagram, including the part you would redesign first."],
    ],
  },
  {
    slug: "business-analyst-fresher",
    title: "Business Analyst",
    summary:
      "Six weeks turning vague requests into decisions: requirements, process mapping, SQL for your own answers, a dashboard, and a recommendation with a number on it.",
    weeks: [
      ["The question behind the request", "Turn a vague ask into a question that has a checkable answer."],
      ["Requirements people can build from", "Write requirements with acceptance criteria a developer would not need to interpret."],
      ["Process mapping", "Map a real process and mark where it actually loses time."],
      ["Answer it yourself in SQL", "Get your own numbers instead of waiting for someone to pull them."],
      ["A dashboard that answers one question", "Build something a manager can read in thirty seconds."],
      ["Recommend, with the caveats", "Make a recommendation and state what would change your mind."],
    ],
    resources: [
      [4, "docs", "https://www.postgresql.org/docs/current/tutorial.html", "PostgreSQL — tutorial"],
      [4, "dataset", "https://github.com/devrimgunduz/pagila", "Pagila sample database"],
      [2, "article", "https://vita.had.co.nz/papers/tidy-data.pdf", "Tidy Data (Wickham)"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A requirements document for one feature, with acceptance criteria and the questions you had to ask to write it."],
      [4, "sql", "sql-correctness-v1", 1, "Return monthly revenue per category for the last twelve months, including months with no sales."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the recommendation, the number behind it, and what would change your mind."],
    ],
  },
];

// ── emit ─────────────────────────────────────────────────────────────────────
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const out = [];

out.push("-- Jintu — ten additional tracks.");
out.push("-- Generated by scripts/generate-courses.mjs. Do not hand-edit.");
out.push("--");
out.push("-- Requires only the curriculum migration (20260809020000).");
out.push("-- Safe to run once: it is a single transaction, so a re-run after the");
out.push("-- paths are published fails as a whole and changes nothing — the");
out.push("-- immutability triggers reject writes into a published path by design.");
out.push("");
out.push("begin;");
out.push("");

out.push("-- Rubrics are shared across tracks and reused if they already exist.");
for (const r of RUBRICS) {
  out.push(
    `insert into public.rubrics (name, criteria, max_score) values (${q(r.name)}, ${q(
      JSON.stringify(r.criteria),
    )}::jsonb, ${r.max}) on conflict (name) do nothing;`,
  );
}
out.push("");

let n = 0;
for (const t of TRACKS) {
  n += 1;
  const tid = `c0000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const pid = `c1000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const mod = (w) =>
    `(select id from public.modules where path_id = '${pid}' and week_no = ${w})`;

  out.push(`-- ${"─".repeat(72)}`);
  out.push(`-- ${n}. ${t.title}`);
  out.push(`-- ${"─".repeat(72)}`);
  out.push(
    `insert into public.tracks (id, slug, title, summary, is_published) values\n  ('${tid}', ${q(
      t.slug,
    )}, ${q(t.title)}, ${q(t.summary)}, true) on conflict (slug) do nothing;`,
  );
  // Draft first. Publishing happens at the end of this track's block.
  out.push(
    `insert into public.paths (id, track_id, version, status) values\n  ('${pid}', '${tid}', 1, 'draft') on conflict (track_id, version) do nothing;`,
  );

  out.push(`insert into public.modules (path_id, week_no, title, objective) values`);
  out.push(
    t.weeks
      .map(([title, objective], i) => `  ('${pid}', ${i + 1}, ${q(title)}, ${q(objective)})`)
      .join(",\n") + "\n  on conflict (path_id, week_no) do nothing;",
  );

  // Position is per module, so count them as we go.
  const posByWeek = new Map();
  out.push(
    `insert into public.resources (module_id, kind, provider, external_url, title, position) values`,
  );
  out.push(
    t.resources
      .map(([week, kind, url, title]) => {
        const p = posByWeek.get(week) ?? 0;
        posByWeek.set(week, p + 1);
        return `  (${mod(week)}, ${q(kind)}, 'web', ${q(url)}, ${q(title)}, ${p})`;
      })
      .join(",\n") + "\n  on conflict (module_id, position) do nothing;",
  );

  out.push(`insert into public.assignments (module_id, kind, spec, rubric_id, weight) values`);
  out.push(
    t.assignments
      .map(
        ([week, kind, rubric, weight, prompt]) =>
          `  (${mod(week)}, ${q(kind)}, ${q(JSON.stringify({ prompt }))}::jsonb,\n   (select id from public.rubrics where name = ${q(rubric)}), ${weight})`,
      )
      .join(",\n") + "\n  on conflict (module_id, kind) do nothing;",
  );

  out.push(`-- Publish last: everything above is now frozen.`);
  out.push(
    `update public.paths set status = 'published', published_at = now()\n  where id = '${pid}' and status = 'draft';`,
  );
  out.push("");
}

out.push("commit;");
process.stdout.write(out.join("\n") + "\n");
