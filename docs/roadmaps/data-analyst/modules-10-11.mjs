/**
 * Data analyst, modules 10–11 (weeks 6–7, days 43–52): window functions,
 * then schema design, EXPLAIN and data quality.
 */
export default [
  {
    title: "SQL — window functions",
    weekRange: "Weeks 6–7",
    objective:
      "Keep the row, see the neighbours: ranking, frames, LAG/LEAD and a full cohort retention table from raw transactions.",
    nodes: [
      {
        title: "Day 43 — The window concept",
        summary: "GROUP BY collapses rows. OVER keeps them and adds context.",
        learningObjectives: [
          "OVER() — a row keeps its identity while seeing its neighbours",
          "PARTITION BY vs GROUP BY: the hardest idea in the module",
          "ORDER BY inside OVER",
          "SUM OVER, AVG OVER, COUNT OVER; each row with its group total and share",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL tutorial — window functions",
            url: "https://www.postgresql.org/docs/current/tutorial-window.html",
            sourceName: "PostgreSQL documentation",
          },
          {
            type: "video",
            title: "Alex The Analyst — window functions",
            url: "https://www.youtube.com/@AlexTheAnalyst",
            sourceName: "Alex The Analyst (YouTube)",
            editorNote: "Search the channel for his window functions video.",
          },
        ],
      },
      {
        title: "Day 44 — Ranking",
        summary:
          "If ties are possible and you used ROW_NUMBER, you have made a silent arbitrary choice.",
        learningObjectives: [
          "ROW_NUMBER, RANK, DENSE_RANK — what each does with ties",
          "NTILE for quartiles and deciles",
          "Top-N per group: the most-asked SQL interview pattern",
          "Deduplicating with ROW_NUMBER",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "tool",
            title: "DataLemur — ranking questions",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
            editorNote: "Top three products per category, three ways, explaining each tie behaviour.",
          },
        ],
      },
      {
        title: "Day 45 — Frames",
        summary: "The default frame is RANGE, not ROWS. That difference has broken many dashboards.",
        learningObjectives: [
          "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — the running total",
          "Moving averages with n PRECEDING",
          "RANGE vs ROWS and how ties change the answer",
          "Running total, 7-day moving average, cumulative % of total",
        ],
        estMinutes: 60,
        points: 35,
        difficulty: "stretch",
        resources: [],
      },
      {
        title: "Day 46 — Positional functions",
        summary: "LAST_VALUE without an explicit frame returns the current row. Almost nobody wants that.",
        learningObjectives: [
          "LAG and LEAD with offsets and defaults",
          "Period-over-period growth; month-on-month change",
          "FIRST_VALUE, LAST_VALUE and the frame trap",
          "Gaps-and-islands: consecutive streaks",
        ],
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        resources: [],
      },
      {
        title: "Day 47 — Cohort retention end to end",
        summary: "The hardest part of retention is defining the cohort, not writing the window function.",
        learningObjectives: [
          "Assign each customer a cohort month from first purchase",
          "Activity by months-since-first-purchase",
          "Build the retention triangle",
          "Sanity-check cohort sizes against a simple count",
        ],
        estMinutes: 70,
        points: 35,
        difficulty: "stretch",
        resources: [],
      },
      {
        title: "Day 48 — Window practice block",
        summary: "Twenty window-function problems from DataLemur or StrataScratch.",
        learningObjectives: ["Twenty window problems under light time pressure"],
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "tool",
            title: "StrataScratch",
            url: "https://www.stratascratch.com/",
            sourceName: "StrataScratch",
          },
        ],
      },
    ],
  },
  {
    title: "Schema design & performance",
    weekRange: "Week 7",
    objective:
      "Read a query plan without fear, organise analysis into layers, and run quality checks before anyone questions your number.",
    deliverable: "A commented .sql file with an end-to-end analysis plus a short written finding.",
    nodes: [
      {
        title: "Day 49 — Indexes and why queries are slow",
        summary: "Measure before optimising. Intuition about query speed is usually wrong.",
        learningObjectives: [
          "What an index is; B-tree basics without the theory",
          "When an index helps and when it does not",
          "EXPLAIN and EXPLAIN ANALYZE — reading a plan",
          "Sequential vs index scan; the row-estimate line",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL — using EXPLAIN",
            url: "https://www.postgresql.org/docs/current/using-explain.html",
            sourceName: "PostgreSQL documentation",
            editorNote: "EXPLAIN your slowest query, add an index, measure the difference.",
          },
        ],
      },
      {
        title: "Day 50 — Views, materialised views and query organisation",
        summary: "Structure an analysis into layers: raw → cleaned → aggregated.",
        learningObjectives: [
          "CREATE VIEW for reusable logic — when it helps, when it hides cost",
          "Materialised views and refresh",
          "Turn the cohort query into a view and use it three ways",
        ],
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        resources: [],
      },
      {
        title: "Day 51 — Data quality checks in SQL",
        summary: "Run your quality checks before your analysis, not after someone questions your number.",
        learningObjectives: [
          "Duplicates with GROUP BY … HAVING COUNT(*) > 1",
          "Orphan foreign keys with anti-joins",
          "Range checks, impossible dates, negative quantities",
          "A reusable data-quality query set — eight checks, documented",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [],
      },
      {
        title: "Day 52 — Review and SQL capstone",
        summary:
          "One end-to-end SQL analysis of a real business question: CTEs, joins, aggregation and at least one window function, delivered as a commented .sql file with a written finding.",
        learningObjectives: [
          "An end-to-end analysis using the whole SQL toolkit",
          "A commented .sql file plus a short written finding",
        ],
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        resources: [],
      },
    ],
  },
];
