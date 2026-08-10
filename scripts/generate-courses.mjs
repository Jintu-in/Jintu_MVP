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

// Roles that are not engineering. The sprint shape is the same — six weeks,
// six artifacts, a rubric published up front — because the thing being sold
// is evidence of work, and that is not specific to writing code.
TRACKS.push(
  {
    slug: "product-manager-fresher",
    title: "Associate Product Manager",
    summary:
      "Six weeks producing what a PM is actually judged on: a written problem, a spec engineers can build from, a launch plan, and a decision you can defend.",
    weeks: [
      ["The problem, before the feature", "Write the problem down so that two people would recognise the same thing."],
      ["Talking to users without leading them", "Run five conversations and separate what people said from what you hoped."],
      ["A spec someone can build from", "Write acceptance criteria a developer would not have to interpret."],
      ["Prioritising out loud", "Rank a backlog and defend the thing you chose not to do."],
      ["Measuring the thing you shipped", "Define one metric that would tell you this was a mistake."],
      ["Say no, in writing", "Turn down a request in a way the requester still respects."],
    ],
    resources: [
      [1, "article", "https://www.atlassian.com/agile/product-management", "Atlassian — product management"],
      [2, "article", "https://www.nngroup.com/articles/ten-usability-heuristics/", "Nielsen Norman — ten usability heuristics"],
      [5, "docs", "https://support.google.com/analytics/answer/9304153", "GA4 — set up analytics"],
    ],
    assignments: [
      [3, "artifact_link", "written-finding-v1", 2, "A one-page spec for a real feature in a product you use, with acceptance criteria and the three questions you would need answered before work starts."],
      [4, "artifact_link", "written-finding-v1", 2, "A prioritised backlog of eight items with the reasoning for the bottom two, not the top two."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the request you declined, why, and what would change your mind."],
    ],
  },
  {
    slug: "ux-designer-fresher",
    title: "UX Designer",
    summary:
      "Six weeks of design that survives contact with a user: flows, a usable prototype, an accessibility pass, and a redesign you can justify.",
    weeks: [
      ["Flows before screens", "Map what someone is trying to finish, not what screens exist."],
      ["Heuristics as a checklist", "Review a real product against ten heuristics and rank what you found."],
      ["Prototyping enough to test", "Build the smallest thing that answers the question you actually have."],
      ["Testing with five people", "Watch five people use it and separate what they did from what they said."],
      ["Accessibility as a requirement", "Pass a keyboard-only run and meet contrast on every piece of text."],
      ["Defend the redesign", "Show the before and after and name the trade-off you accepted."],
    ],
    resources: [
      [2, "article", "https://www.nngroup.com/articles/ten-usability-heuristics/", "Nielsen Norman — ten usability heuristics"],
      [3, "docs", "https://help.figma.com/hc/en-us", "Figma — help centre"],
      [5, "docs", "https://www.w3.org/WAI/WCAG22/quickref/", "W3C — WCAG 2.2 quick reference"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A heuristic review of one real product: at least eight findings, each with severity and the heuristic it breaks."],
      [4, "artifact_link", "working-software-v1", 2, "A clickable prototype plus notes from five sessions, including the thing everyone got stuck on."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes on the redesign: what you changed after testing, and what you deliberately left alone."],
    ],
  },
  {
    slug: "digital-marketing-fresher",
    title: "Digital Marketing Analyst",
    summary:
      "Six weeks of marketing you can measure: a technical site audit, analytics that answer a question, a campaign, and a report with a number in it.",
    weeks: [
      ["How search actually sees a page", "Audit a real site and list what a crawler cannot reach."],
      ["Content that answers the query", "Write for the question someone typed, not the keyword you want to rank for."],
      ["Analytics that answer a question", "Set up tracking that could change a decision, and skip the rest."],
      ["Running a small campaign", "Spend a small budget deliberately and state the hypothesis first."],
      ["Attribution, honestly", "Explain what your numbers cannot tell you about what caused what."],
      ["Report it to someone busy", "One page: what you did, what happened, what you would do next."],
    ],
    resources: [
      [1, "docs", "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", "Google — SEO starter guide"],
      [1, "docs", "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data", "Google — structured data"],
      [3, "docs", "https://support.google.com/analytics/answer/9304153", "GA4 — set up analytics"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A technical audit of a real site: findings ranked by impact, each with the evidence you used."],
      [5, "artifact_link", "written-finding-v1", 2, "A campaign write-up stating the hypothesis, the spend, the result, and what the numbers cannot prove."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the number you would report to a founder, and the caveat you would say out loud."],
    ],
  },
  {
    slug: "machine-learning-fresher",
    title: "Machine Learning Engineer",
    summary:
      "Six weeks from a notebook to something that runs: a real dataset, an honest baseline, a model you can explain, and an evaluation that would catch you being wrong.",
    weeks: [
      ["The dataset, and what is wrong with it", "Describe a real dataset's biases and gaps before modelling anything."],
      ["A baseline worth beating", "Build the dumbest model that works, and record its score."],
      ["Features and leakage", "Find the leak that makes your score look better than it is."],
      ["Evaluation that would catch you", "Choose a metric that punishes the failure you care about."],
      ["Explaining a prediction", "Explain one prediction to someone who does not trust the model."],
      ["Serve it", "Put it behind an interface someone else can call."],
    ],
    resources: [
      [1, "docs", "https://numpy.org/doc/stable/user/absolute_beginners.html", "NumPy — absolute beginner's guide"],
      [2, "docs", "https://scikit-learn.org/stable/getting_started.html", "scikit-learn — getting started"],
      [4, "docs", "https://developers.google.com/machine-learning/crash-course", "Google — Machine Learning Crash Course"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A notebook with a baseline and its score, plus a paragraph on what would make this dataset unsuitable."],
      [4, "artifact_link", "working-software-v1", 2, "A model that beats the baseline, with the evaluation and the leak you checked for."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: explain one prediction, and say where you would not trust this model."],
    ],
  },
  {
    slug: "security-analyst-fresher",
    title: "Security Analyst",
    summary:
      "Six weeks of finding and reporting real weaknesses: threat modelling, a hands-on assessment of software you are allowed to test, and a report someone will act on.",
    weeks: [
      ["Threat modelling a small system", "Describe who would attack this, and what they would get."],
      ["The common ten, concretely", "Reproduce three classic weaknesses in a deliberately vulnerable app."],
      ["Testing methodically", "Work through a checklist instead of poking at what you already know."],
      ["Secrets, identity and blast radius", "Reduce what one leaked credential would cost."],
      ["Reporting so it gets fixed", "Write a finding with impact, reproduction and a fix a developer can apply."],
      ["Disclose responsibly", "Explain why scope and permission are the difference between research and an offence."],
    ],
    resources: [
      [2, "docs", "https://owasp.org/www-project-top-ten/", "OWASP Top Ten"],
      [3, "docs", "https://owasp.org/www-project-web-security-testing-guide/", "OWASP Web Security Testing Guide"],
      [4, "docs", "https://cheatsheetseries.owasp.org/", "OWASP Cheat Sheet Series"],
    ],
    assignments: [
      [3, "artifact_link", "written-finding-v1", 2, "An assessment of a deliberately vulnerable application you are permitted to test. Three findings with reproduction steps."],
      [5, "artifact_link", "written-finding-v1", 2, "One finding written as a report: impact, reproduction, suggested fix, and how you would verify the fix."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the finding, and why you tested only what you had permission to test."],
    ],
  },
  {
    slug: "technical-writer-fresher",
    title: "Technical Writer",
    summary:
      "Six weeks producing documentation people finish reading: a task-based guide, an API reference, a rewrite of something bad, and evidence it worked.",
    weeks: [
      ["Who is reading, and what for", "Separate a tutorial from a reference and stop writing both at once."],
      ["A guide someone can finish", "Write a task guide and watch one person complete it without help."],
      ["Documenting an interface", "Document endpoints so a developer never has to read the source."],
      ["Editing for the reader", "Cut a page by a third without losing anything the reader needed."],
      ["Working with engineers", "Get a technical review without becoming a bottleneck."],
      ["Show it worked", "Test your own docs on someone and report what they got stuck on."],
    ],
    resources: [
      [1, "docs", "https://diataxis.fr/", "Diátaxis — a documentation framework"],
      [2, "docs", "https://www.writethedocs.org/guide/", "Write the Docs — guide"],
      [4, "docs", "https://developers.google.com/style", "Google — developer documentation style guide"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A task guide for real software, plus notes from watching one person follow it start to finish."],
      [4, "artifact_link", "written-finding-v1", 2, "A rewrite of a page of existing documentation, with the original alongside and the reason for each cut."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: what your reader got stuck on, and the edit that fixed it."],
    ],
  },
  {
    slug: "finance-analyst-fresher",
    title: "Finance Analyst",
    summary:
      "Six weeks of analysis with a number at the end: reading a real filing, building a model, checking your own assumptions, and a recommendation you can defend.",
    weeks: [
      ["Reading a real filing", "Find the three numbers that matter in a published annual report."],
      ["A model that is not a guess", "Build a forecast where every assumption is a named, changeable cell."],
      ["Getting your own data", "Pull the numbers yourself instead of waiting for someone to send them."],
      ["Sensitivity and being wrong", "Show which assumption breaks the conclusion first."],
      ["Presenting to someone sceptical", "Make the case in one page with the risk stated up front."],
      ["Defend the recommendation", "Answer the hardest question about your own model."],
    ],
    resources: [
      [1, "docs", "https://www.sebi.gov.in/", "SEBI — Securities and Exchange Board of India"],
      [1, "docs", "https://www.rbi.org.in/", "Reserve Bank of India"],
      [3, "docs", "https://pandas.pydata.org/docs/user_guide/index.html", "pandas — user guide"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A three-year forecast for a listed company, with every assumption in its own labelled cell and sourced from the filing."],
      [4, "artifact_link", "written-finding-v1", 2, "A sensitivity analysis showing which single assumption moves the conclusion most."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the recommendation, and the assumption you are least comfortable with."],
    ],
  },
  {
    slug: "support-engineer-fresher",
    title: "Support Engineer",
    summary:
      "Six weeks of the work support actually does: reproducing a bug from a vague report, reading logs, writing a fix or an escalation, and measuring whether it helped.",
    weeks: [
      ["Reproducing from a vague report", "Turn 'it does not work' into steps someone else can follow."],
      ["Reading the request and response", "Diagnose a failure from a status code and a header, not a guess."],
      ["Logs and evidence", "Find the line that proves what happened, and say what it does not prove."],
      ["Escalating well", "Write a handover an engineer can act on without asking you anything."],
      ["Documenting the answer once", "Turn a repeated question into a page and stop answering it."],
      ["Measure whether it helped", "Pick a metric that would show your fix worked, and check it."],
    ],
    resources: [
      [2, "docs", "https://developer.mozilla.org/en-US/docs/Web/HTTP", "MDN — HTTP"],
      [4, "article", "https://www.atlassian.com/incident-management/kpis/common-metrics", "Atlassian — incident metrics"],
      [5, "docs", "https://developers.google.com/style", "Google — developer documentation style guide"],
    ],
    assignments: [
      [2, "artifact_link", "written-finding-v1", 2, "A reproduction of a real reported bug in an open-source project: steps, expected, actual, environment."],
      [4, "artifact_link", "written-finding-v1", 2, "An escalation write-up for that bug, containing everything an engineer needs and nothing they do not."],
      [6, "recording", "walkthrough-v1", 1, "Five minutes: the repeated question you documented, and how you would know the page worked."],
    ],
  },
);

// ── emit ─────────────────────────────────────────────────────────────────────
//
// Every track is one plpgsql block that can be run any number of times.
//
// The rule that shapes this: a PUBLISHED path is immutable. That is not an
// obstacle to work around — it is what stops curriculum being rewritten under
// a cohort that is mid-sprint, and the triggers enforce it whatever this
// script does. So "runs without error every time" means the block detects
// that its work is already done and returns, rather than attempting a write
// the database is right to refuse.
//
// What that buys, per track:
//
//   first run      creates the track, fills the path, publishes it
//   second run     sees a published path, skips, raises a notice
//   interrupted    sees a draft path, fills in what is missing, publishes
//
// Track metadata IS updated on re-run. `tracks` carries no immutability
// trigger, so a corrected title or summary should propagate — that is the one
// place an upsert is both safe and useful.
//
// Rubrics are inserted and never updated. Changing the criteria of a rubric
// that published work was already graded against would silently restate what
// a past score meant, so a rubric change is a new rubric with a new name.
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const out = [];

out.push("-- Jintu — additional tracks.");
out.push("-- Generated by scripts/generate-courses.mjs. Do not hand-edit.");
out.push("--");
out.push("-- Idempotent: safe to run any number of times.");
out.push("--   * a track that is already published is skipped, not rewritten");
out.push("--   * a half-finished run is completed on the next run");
out.push("--   * track titles and summaries are refreshed; rubrics are never");
out.push("--     altered once created, because past grades were given against them");
out.push("--");
out.push("-- Requires only the curriculum migration (20260809020000).");
out.push("");
out.push("begin;");
out.push("");

/*
  --propose: emit the demotion instead of the courses.

  Eighteen of these tracks shipped as published six-week courses carrying
  three resources and three artifacts apiece. Spread across six weeks that is
  a sketch, not a course, and it meant every visitor who clicked past the one
  finished track found the product unfinished.

  The fix is not to delete them — the titles and summaries are good, and
  knowing that people want an Android track is worth having. It is to move
  them to `is_proposed`, where they render a vote page instead of a
  curriculum (migration 20260810000000).

  The slug list is TRACKS above rather than a second list written by hand,
  because a hand-written copy is how you end up demoting a course you
  finished, or leaving one published that you meant to demote.
*/
if (process.argv.includes("--propose")) {
  const KEEP = new Set(["data-analyst-fresher"]);
  const demote = TRACKS.map((t) => t.slug).filter((s) => !KEEP.has(s));

  const lines = [
    "-- Demote unbuilt courses to proposals. Generated by",
    "-- scripts/generate-courses.mjs --propose. Safe to run repeatedly.",
    "--",
    `-- Kept as a real course: ${[...KEEP].join(", ")}.`,
    "-- Everything else becomes a vote page until it is actually written.",
    "--",
    "-- Paths and modules are left exactly as they are. RLS gates them on",
    "-- tracks.is_published, so clearing that hides the whole curriculum",
    "-- without deleting a row — and republishing is one update away.",
    "",
    "begin;",
    "",
    "update public.tracks",
    "   set is_published = false,",
    "       is_proposed  = true",
    " where slug in (",
    demote.map((s) => `         ${q(s)}`).join(",\n"),
    "       )",
    "   and (is_published or not is_proposed);",
    "",
    "commit;",
    "",
  ];
  process.stdout.write(lines.join("\n"));
  process.exit(0);
}

out.push("-- Shared rubrics. Created once; never modified afterwards.");
for (const r of RUBRICS) {
  out.push(
    `insert into public.rubrics (name, criteria, max_score) values (${q(r.name)}, ${q(
      JSON.stringify(r.criteria),
    )}::jsonb, ${r.max}) on conflict (name) do nothing;`,
  );
}
out.push("");

for (const t of TRACKS) {
  const posByWeek = new Map();
  const resourceRows = t.resources.map(([week, kind, url, title]) => {
    const p = posByWeek.get(week) ?? 0;
    posByWeek.set(week, p + 1);
    return `    (${week}, ${q(kind)}, ${q(url)}, ${q(title)}, ${p})`;
  });

  const assignmentRows = t.assignments.map(([week, kind, rubric, weight, prompt]) => {
    return `    (${week}, ${q(kind)}, ${q(JSON.stringify({ prompt }))}, ${q(rubric)}, ${weight})`;
  });

  out.push(`-- ${"─".repeat(72)}`);
  out.push(`-- ${t.title}`);
  out.push(`-- ${"─".repeat(72)}`);
  out.push(`do $track$`);
  out.push(`declare`);
  out.push(`  v_track uuid;`);
  out.push(`  v_path  uuid;`);
  out.push(`  v_state text;`);
  out.push(`begin`);
  out.push(`  -- Metadata is safe to refresh: tracks carry no immutability trigger.`);
  out.push(`  insert into public.tracks (slug, title, summary, is_published)`);
  out.push(`  values (${q(t.slug)}, ${q(t.title)}, ${q(t.summary)}, true)`);
  out.push(`  on conflict (slug) do update set`);
  out.push(`    title = excluded.title,`);
  out.push(`    summary = excluded.summary,`);
  out.push(`    is_published = excluded.is_published;`);
  out.push("");
  out.push(`  -- Resolved by slug, never by a hardcoded id: a track created by hand`);
  out.push(`  -- would have a different id and every foreign key below would break.`);
  out.push(`  select id into v_track from public.tracks where slug = ${q(t.slug)};`);
  out.push("");
  out.push(`  insert into public.paths (track_id, version, status)`);
  out.push(`  values (v_track, 1, 'draft')`);
  out.push(`  on conflict (track_id, version) do nothing;`);
  out.push("");
  out.push(`  select id, status into v_path, v_state`);
  out.push(`  from public.paths where track_id = v_track and version = 1;`);
  out.push("");
  out.push(`  if v_state <> 'draft' then`);
  out.push(`    -- Already published. Content is frozen by design; a change means a`);
  out.push(`    -- new version, not an edit. Nothing to do.`);
  out.push(`    raise notice ${q(`${t.slug}: already published, skipped`)};`);
  out.push(`    return;`);
  out.push(`  end if;`);
  out.push("");
  out.push(`  insert into public.modules (path_id, week_no, title, objective) values`);
  out.push(
    t.weeks
      .map(([title, objective], i) => `    (v_path, ${i + 1}, ${q(title)}, ${q(objective)})`)
      .join(",\n") + "\n  on conflict (path_id, week_no) do nothing;",
  );
  out.push("");
  out.push(`  insert into public.resources (module_id, kind, provider, external_url, title, position)`);
  out.push(`  select m.id, x.kind, 'web', x.url, x.title, x.position`);
  out.push(`  from (values`);
  out.push(resourceRows.join(",\n"));
  out.push(`  ) as x(week, kind, url, title, position)`);
  out.push(`  join public.modules m on m.path_id = v_path and m.week_no = x.week`);
  out.push(`  on conflict (module_id, position) do nothing;`);
  out.push("");
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
  out.push(`  -- Publish last. Everything above is frozen from here.`);
  out.push(`  update public.paths set status = 'published', published_at = now()`);
  out.push(`  where id = v_path;`);
  out.push("");
  out.push(`  raise notice ${q(`${t.slug}: created and published`)};`);
  out.push(`end $track$;`);
  out.push("");
}

out.push("commit;");
process.stdout.write(out.join("\n") + "\n");
