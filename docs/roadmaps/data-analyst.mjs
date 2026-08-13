/**
 * Data analyst — starter roadmap, v1.
 *
 * Three modules and twelve nodes covering spreadsheets, SQL and dashboards:
 * the first third of the full 24-week curriculum, published first because a
 * shallow-but-real roadmap beats a deep one nobody can follow yet. Every URL
 * here resolved on 2026-08-13 (`pnpm roadmap:import docs/roadmaps/data-analyst.mjs --check`
 * re-verifies them all before any paste can publish).
 *
 * Curation rules, so the next editor keeps the bar:
 *   - one concept per node, honest minutes, nothing over a two-hour sitting
 *   - every resource free to read at its own home; no paywalls, no mirrors
 *   - editorNote says why THIS link and not the ten like it
 *   - videos carry duration AND estimated size — metered data is a rule here
 */
export default {
  slug: "data-analyst",
  title: "Data analyst",
  summary:
    "SQL, spreadsheets, dashboards and the judgement to use them — from zero to a first portfolio piece, on free content only.",
  subjectTags: ["data", "sql", "analytics", "spreadsheets"],
  difficulty: "beginner",
  estimatedWeeks: 13,
  estimatedHours: 140,
  licenseNote: null, // hand-curated link by link; nothing imported wholesale
  modules: [
    {
      title: "Foundations — spreadsheets and data thinking",
      weekRange: "Weeks 1–4",
      objective:
        "Read a messy table and say something true about it: sort, filter, pivot and summarise before any code.",
      deliverable:
        "A cleaned spreadsheet of one messy public dataset, with a one-page summary of what it says.",
      estHours: 40,
      nodes: [
        {
          title: "What a data analyst actually does",
          summary: "The day-to-day of the job, before any tooling.",
          estMinutes: 30,
          difficulty: "intro",
          resources: [
            {
              type: "read",
              title: "Data analysis",
              url: "https://en.wikipedia.org/wiki/Data_analysis",
              sourceName: "Wikipedia",
              editorNote:
                "The soberest overview of the whole discipline — read for the process diagram and vocabulary, not depth.",
            },
          ],
        },
        {
          title: "Spreadsheet fundamentals",
          summary: "Cells, formulas, references — the tool you will use every single day.",
          estMinutes: 50,
          difficulty: "intro",
          resources: [
            {
              type: "doc",
              title: "How to use Google Sheets",
              url: "https://support.google.com/docs/answer/6000292",
              sourceName: "Google Docs Editors Help",
              editorNote: "The official starting point; work through it with a sheet open beside it.",
            },
          ],
        },
        {
          title: "Pivot tables and aggregation",
          summary: "The fastest route from a thousand rows to one honest sentence.",
          estMinutes: 60,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Pivot tables in Google Sheets",
              url: "https://www.benlcollins.com/spreadsheets/pivot-tables/",
              sourceName: "Ben Collins",
              editorNote: "The clearest worked tutorial on the topic, by a Sheets specialist.",
            },
            {
              type: "doc",
              title: "Create and use pivot tables",
              url: "https://support.google.com/docs/answer/1272900",
              sourceName: "Google Docs Editors Help",
              editorNote: "The official reference to keep open while you build one.",
            },
          ],
        },
        {
          title: "Descriptive statistics",
          summary: "Mean, median, spread — and when each one lies to you.",
          estMinutes: 60,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Summarizing quantitative data",
              url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data",
              sourceName: "Khan Academy",
              editorNote: "Short exercises after every concept — do them, that is the point of the unit.",
            },
            {
              type: "read",
              title: "Descriptive statistics",
              url: "https://statisticsbyjim.com/basics/descriptive-statistics/",
              sourceName: "Statistics By Jim",
              editorNote: "Plain-English second pass; good on when the mean misleads.",
            },
          ],
        },
      ],
    },
    {
      title: "SQL — asking questions of a database",
      weekRange: "Weeks 5–9",
      objective:
        "Turn a business question into a query and a query result into an answer: select, aggregate, join, window.",
      deliverable:
        "Ten answered business questions over a sample database, as one commented .sql file.",
      estHours: 60,
      nodes: [
        {
          title: "SELECT and WHERE",
          summary: "Your first queries: choosing rows and columns.",
          estMinutes: 45,
          difficulty: "intro",
          resources: [
            {
              type: "read",
              title: "SQL lesson 1: SELECT queries",
              url: "https://sqlbolt.com/lesson/select_queries_introduction",
              sourceName: "SQLBolt",
              editorNote: "Interactive — you run every query in the page itself.",
            },
            {
              type: "doc",
              title: "Querying a table",
              url: "https://www.postgresql.org/docs/current/tutorial-select.html",
              sourceName: "PostgreSQL documentation",
              editorNote: "The real database's own tutorial, for when you want the precise version.",
            },
          ],
        },
        {
          title: "The full course, as a companion",
          summary:
            "A single long-form course covering the whole SQL arc. Watch a chapter after each node, not in one go.",
          estMinutes: 60,
          difficulty: "core",
          isOptional: true,
          resources: [
            {
              type: "video",
              title: "SQL tutorial — full database course for beginners",
              url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
              sourceName: "freeCodeCamp.org",
              youtubeVideoId: "HXV3zeQKqGY",
              durationSec: 15600,
              estSizeMb: 1950,
              editorNote:
                "Four hours twenty; nearly 2 GB on mobile data. Chapter it across the module on wifi.",
            },
          ],
        },
        {
          title: "Aggregation and GROUP BY",
          summary: "COUNT, SUM, AVG — collapsing many rows into a claim.",
          estMinutes: 60,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "SQL aggregate functions",
              url: "https://mode.com/sql-tutorial/sql-aggregate-functions",
              sourceName: "Mode SQL tutorial",
              editorNote: "Analyst-flavoured throughout — every example is a business question.",
            },
          ],
        },
        {
          title: "JOINs",
          summary: "Answering questions no single table can.",
          estMinutes: 75,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "SQL joins",
              url: "https://mode.com/sql-tutorial/sql-joins",
              sourceName: "Mode SQL tutorial",
              editorNote: "Start here for the intuition and the Venn-free explanation.",
            },
            {
              type: "doc",
              title: "Joins between tables",
              url: "https://www.postgresql.org/docs/current/tutorial-join.html",
              sourceName: "PostgreSQL documentation",
              editorNote: "The precise semantics once the intuition holds.",
            },
          ],
        },
        {
          title: "Window functions — frames",
          summary: "Running totals, ranks and moving averages without collapsing rows.",
          estMinutes: 75,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "SQL window functions",
              url: "https://mode.com/sql-tutorial/sql-window-functions",
              sourceName: "Mode SQL tutorial",
              editorNote: "The gentlest on-ramp to OVER and PARTITION BY.",
            },
            {
              type: "doc",
              title: "Window functions",
              url: "https://www.postgresql.org/docs/current/tutorial-window.html",
              sourceName: "PostgreSQL documentation",
              editorNote: "Frames explained properly — the part every tutorial skims.",
            },
          ],
        },
        {
          title: "Practice — analytical questions",
          summary: "Volume, on someone else's schema. This node repeats until it is easy.",
          estMinutes: 90,
          difficulty: "core",
          resources: [
            {
              type: "tool",
              title: "SQLBolt interactive lessons",
              url: "https://sqlbolt.com/",
              sourceName: "SQLBolt",
              editorNote: "Finish every lesson including the review sets.",
            },
            {
              type: "tool",
              title: "SQLZoo tutorial and quizzes",
              url: "https://sqlzoo.net/wiki/SQL_Tutorial",
              sourceName: "SQLZoo",
              editorNote: "Rougher edges, harder questions — good second gym.",
            },
          ],
        },
      ],
    },
    {
      title: "Visualisation and dashboards",
      weekRange: "Weeks 10–13",
      objective:
        "Choose the chart the data deserves and assemble charts into a dashboard someone else can act on.",
      deliverable:
        "A one-screen dashboard answering three questions about one dataset, with a paragraph defending each chart choice.",
      estHours: 40,
      nodes: [
        {
          title: "Choosing the right chart",
          summary: "The decision comes from the data and the question, never from taste.",
          estMinutes: 50,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "From data to viz",
              url: "https://www.data-to-viz.com/",
              sourceName: "data-to-viz.com",
              editorNote: "A decision tree from your data's shape to the chart — bookmark it permanently.",
            },
            {
              type: "read",
              title: "Visualizing amounts",
              url: "https://clauswilke.com/dataviz/visualizing-amounts.html",
              sourceName: "Fundamentals of Data Visualization (Claus Wilke)",
              editorNote: "One chapter of the best free dataviz book; read the neighbours too.",
            },
          ],
        },
        {
          title: "Dashboards in Looker Studio",
          summary: "Free, browser-based, and what a first employer most likely has.",
          estMinutes: 90,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "How to use Looker Studio",
              url: "https://support.google.com/looker-studio/answer/6283323",
              sourceName: "Looker Studio Help",
              editorNote: "The official walkthrough — build along with a sheet from module one.",
            },
            {
              type: "read",
              title: "Fundamentals of Data Visualization",
              url: "https://clauswilke.com/dataviz/",
              sourceName: "Claus Wilke",
              editorNote: "The whole book, free at the author's site; the taste this module is trying to teach.",
            },
          ],
        },
      ],
    },
  ],
};
