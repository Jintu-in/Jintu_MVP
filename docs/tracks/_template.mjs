/**
 * TRACK SPEC TEMPLATE — copy me, do not edit me in place.
 *
 *   cp docs/tracks/_template.mjs docs/tracks/my-track.mjs
 *   pnpm track:gen docs/tracks/my-track.mjs
 *   pnpm track:verify docs/tracks/my-track.mjs
 *
 * Your copy is gitignored on purpose: sql answer keys live in this file,
 * and the repository may be public. The rules the generator enforces are
 * documented in docs/AUTHORING.md — this file shows every feature once,
 * with two fully-worked weeks in the voice that works (scenario first,
 * a real person asking, stakes attached).
 */

export default {
  // ── the track ─────────────────────────────────────────────────────────
  slug: "business-analyst-fresher",          // ^[a-z0-9-]+$ — this is the URL
  title: "Business Analyst — first job",
  summary:
    "Six weeks of real BA work: pulling the numbers yourself, one honest " +
    "requirements memo, one metrics review, and a walkthrough you can " +
    "defend in an interview.",
  tier: "sprint",       // 'sprint' = machine-verified (needs ≥50% machine POINTS)
                        // 'community' = structural + peer only, never a model
  version: 1,           // bump to ship an improved edition; never edit a published one

  weeks: [
    // ── WEEK 1 — fully worked: sql artifact with an answer key ─────────
    {
      title: "The numbers behind the ask",
      objective:
        "Answer a stakeholder's revenue question straight from the database, " +
        "without waiting for the data team.",
      resources: [
        // kinds: video | article | docs | dataset | tool
        // YouTube ONLY via the official embed: give youtubeId, no URL.
        { kind: "video", title: "SELECT, WHERE, ORDER BY in 20 minutes", youtubeId: "REPLACEMEID" }, // 11 chars — swap for the real video id
        { kind: "article", title: "How analysts scope a vague request", url: "https://example.com/REPLACE" },
        { kind: "dataset", title: "The practice orders table (CSV)", url: "https://example.com/REPLACE.csv" },
      ],
      // Daily reps: 10–20 min, ONE concept, machine-checked, 10 pts each.
      // verification: 'structural' | 'executable'. checks: registry specs.
      reps: [
        { day: 1, prompt: "Write a query returning only the active customers, any columns.", verification: "structural", checks: ["non_empty", "contains_pattern:where"], points: 10 },
        { day: 2, prompt: "Order last quarter's orders by value, largest first.", verification: "structural", checks: ["non_empty", "contains_pattern:order by"], points: 10 },
        { day: 3, prompt: "Join orders to customers and select one column from each side.", verification: "structural", checks: ["non_empty", "contains_join"], points: 10 },
      ],
      artifact: {
        kind: "sql", // graded by running it — needs the key below
        prompt:
          "Day two on the job. The sales head messages you directly: \"Finance " +
          "says we did 4.2 crore last quarter. That can't be right. What do " +
          "the order records actually say, by month?\" Write the query that " +
          "settles it: one row per month, total order value, most recent first.",
        rubric: {
          name: "ba-w1-revenue-v1", // unique across the whole platform
          maxScore: 5,              // weights below MUST sum to this
          criteria: [
            { key: "returns_expected_rows", label: "Returns the expected result set", weight: 3, check: "executable", checker: "sql_diff" },
            { key: "no_cartesian", label: "No accidental cross join", weight: 1, check: "structural", checker: "sql_diff" },
            { key: "readable", label: "Aliases and formatting a reviewer can follow", weight: 1, check: "structural", checker: "sql_diff" },
          ],
        },
        // THE KEY — service-role only, never leaves this gitignored file
        // except inside the generated .bundle SQL. setup = a small fixture
        // (DDL + data); expected = exactly what the right query returns.
        answerKey: {
          setup: `
            create table orders (id int, placed_on date, amount numeric);
            insert into orders values
              (1, '2026-04-14', 120000), (2, '2026-04-29', 90000),
              (3, '2026-05-08', 210000), (4, '2026-06-19', 150000),
              (5, '2026-06-30', 60000);`,
          referenceSql: `
            select to_char(placed_on, 'YYYY-MM') as month, sum(amount) as total
            from orders group by 1 order by 1 desc;`,
          expected: {
            columns: ["month", "total"],
            rows: [["2026-06", 210000], ["2026-05", 210000], ["2026-04", 210000]],
          },
          orderMatters: true,
        },
      },
    },

    // ── WEEK 2 — fully worked: prose artifact, structural + peer rubric ─
    {
      title: "Saying what the numbers mean",
      objective:
        "Turn a query result into a one-page memo a non-technical stakeholder " +
        "acts on without calling you.",
      resources: [
        { kind: "article", title: "The pyramid principle in four paragraphs", url: "https://example.com/REPLACE" },
        { kind: "article", title: "Numbers that mislead: five honest-chart rules", url: "https://example.com/REPLACE" },
      ],
      reps: [
        { day: 1, prompt: "Rewrite this sentence for a CFO: 'the p95 latency regression correlates with the deploy'.", verification: "structural", checks: ["non_empty"], points: 10 },
        { day: 2, prompt: "Write the one-line caveat your week-1 revenue number needs.", verification: "structural", checks: ["non_empty"], points: 10 },
      ],
      artifact: {
        kind: "artifact_link", // a public link: doc, sheet, deployed page
        prompt:
          "The sales head liked your number. Now the COO wants \"the memo " +
          "version — what happened, why, and what we should watch\". Write it " +
          "on one page with sections for Findings, Method and Caveats, and " +
          "share a public link.",
        rubric: {
          name: "ba-w2-memo-v1",
          maxScore: 7,
          criteria: [
            // structural rows are machine-checkable; peer rows are the human half.
            { key: "has_sections", label: "Findings, Method and Caveats sections present", weight: 1, check: "structural", checker: "has_sections:Findings,Method,Caveats" },
            { key: "readable_link", label: "The link opens without signing in", weight: 1, check: "structural", checker: "url_reachable" },
            { key: "answers_question", label: "Answers what the COO actually asked", weight: 3, check: "peer", checker: null },
            { key: "traceable", label: "Every number names the query behind it", weight: 2, check: "peer", checker: null },
          ],
        },
        // No answerKey for artifact_link — unless it is a planted-defect
        // audit, in which case add:  codes: ["dupes", "future-dates", ...]
        // and build the dataset with `pnpm defects:dataset` (see AUTHORING §4).
      },
    },

    // ── WEEKS 3–6 — your turn. Delete this comment block when done. ────
    // Keep the arc: weeks 1–2 tool fluency → 3–4 the real mess (a
    // detectable audit belongs here) → 5 judgement → 6 the interview
    // artifact (recording + walkthrough). Every week: objective as an
    // ability, 2–4 curated resources, 2–3 reps, exactly one artifact.
  ],
};
