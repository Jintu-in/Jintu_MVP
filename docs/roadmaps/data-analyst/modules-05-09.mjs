/**
 * Data analyst, modules 5–9 (weeks 3–6, days 21–42): relational thinking
 * and core SQL — retrieving, joining, aggregating, subqueries and CTEs.
 */
export default [
  {
    title: "Relational thinking",
    weekRange: "Weeks 3–4",
    objective:
      "Understand why databases exist, draw the tables behind an app, and load real data into PostgreSQL with constraints.",
    nodes: [
      {
        title: "Day 21 — Review",
        summary: "Week 3 closes with review only: redo the Power Query pipeline steps from memory and clear your cards.",
        learningObjectives: [
          "Re-run the week's Power Query work without notes",
          "Clear review cards",
        ],
        estMinutes: 30,
        points: 15,
        difficulty: "core",
        resources: [],
      },
      {
        title: "Day 22 — Why databases exist",
        summary: "Every many-to-many relationship hides a table nobody has drawn yet.",
        learningObjectives: [
          "The problems a spreadsheet cannot solve: concurrency, size, integrity, related entities",
          "Tables, rows, columns — how it differs from a sheet",
          "Primary keys, foreign keys, composite keys",
          "One-to-many and many-to-many; why a join table exists",
        ],
        estMinutes: 45,
        points: 25,
        difficulty: "intro",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL tutorial — concepts",
            url: "https://www.postgresql.org/docs/current/tutorial-concepts.html",
            sourceName: "PostgreSQL documentation",
            editorNote:
              "Then draw the tables behind a food-delivery app on paper: customers, restaurants, orders, order items. Mark the keys.",
          },
        ],
      },
      {
        title: "Day 23 — Normalisation, plainly",
        summary: "Normalise to store, denormalise to analyse.",
        learningObjectives: [
          "1NF, 2NF, 3NF through one badly-designed table being fixed step by step",
          "What denormalisation is for — analytics does it deliberately",
          "Star schema: fact and dimension tables",
        ],
        estMinutes: 50,
        points: 25,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "freeCodeCamp — database design and normalisation",
            url: "https://www.youtube.com/@freecodecamp",
            sourceName: "freeCodeCamp.org (YouTube)",
            editorNote: "Search the channel for \"database normalization\" and pick the current course.",
          },
        ],
      },
      {
        title: "Day 24 — Setting up and loading data",
        summary: "This is the day most people quit. Budget extra time and finish it.",
        learningObjectives: [
          "Install PostgreSQL; a GUI client (DBeaver or pgAdmin)",
          "CREATE DATABASE, CREATE TABLE; the core data types",
          "Constraints: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT",
          "Loading a CSV with COPY or the client's import",
        ],
        estMinutes: 60,
        points: 40,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL — getting started",
            url: "https://www.postgresql.org/docs/current/tutorial-start.html",
            sourceName: "PostgreSQL documentation",
          },
          {
            type: "tool",
            title: "PostgreSQL downloads",
            url: "https://www.postgresql.org/download/",
            sourceName: "PostgreSQL",
          },
          {
            type: "tool",
            title: "DBeaver",
            url: "https://dbeaver.io/",
            sourceName: "DBeaver",
            editorNote: "Create a database, three linked tables with constraints, and load real data.",
          },
        ],
      },
    ],
  },
  {
    title: "SQL — retrieving and filtering",
    weekRange: "Week 4",
    objective:
      "SELECT, filter and band rows — and format every query as though a colleague will read it, because one will.",
    nodes: [
      {
        title: "Day 25 — SELECT",
        summary: "Format every query as though a colleague will read it, because one will.",
        learningObjectives: [
          "SELECT, FROM, aliases with AS",
          "DISTINCT; LIMIT and OFFSET; ORDER BY with multiple keys and NULLS FIRST/LAST",
          "Expressions in the select list",
          "Comments and formatting conventions that make queries reviewable",
        ],
        estMinutes: 50,
        points: 25,
        difficulty: "intro",
        resources: [
          {
            type: "tool",
            title: "SQLBolt — lessons 1–3",
            url: "https://sqlbolt.com/lesson/select_queries_introduction",
            sourceName: "SQLBolt",
          },
          {
            type: "tool",
            title: "pgexercises — basic",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
            editorNote: "Twelve SELECT queries on your own loaded data afterwards.",
          },
        ],
      },
      {
        title: "Day 26 — WHERE and predicates",
        summary:
          "NULL is not a value. It is the absence of one, and it infects every comparison it touches.",
        learningObjectives: [
          "Comparisons; AND, OR, NOT and precedence",
          "IN, BETWEEN, LIKE, ILIKE, wildcards",
          "IS NULL and three-valued logic — why NOT IN with nulls is silently wrong",
          "COALESCE, NULLIF",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "tool",
            title: "SQLBolt — lessons 4–6",
            url: "https://sqlbolt.com/",
            sourceName: "SQLBolt",
            editorNote:
              "Fifteen filtering queries; write one NOT IN against a nullable column and explain the result.",
          },
        ],
      },
      {
        title: "Day 27 — CASE and conditional logic",
        summary: "CASE is how business rules enter SQL. Write them once, comment them well.",
        learningObjectives: [
          "CASE WHEN, searched and simple forms",
          "CASE inside SELECT for banding and labelling",
          "CASE inside ORDER BY for custom sort orders",
          "Nested CASE — and when to stop",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Mode SQL tutorial — CASE",
            url: "https://mode.com/sql-tutorial/sql-case",
            sourceName: "Mode SQL tutorial",
          },
          {
            type: "tool",
            title: "DataLemur — free questions",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
            editorNote: "Band your customers into five tiers with CASE, then custom-sort them.",
          },
        ],
      },
      {
        title: "Day 28 — Review and practice block",
        summary: "Twenty mixed SELECT/WHERE/CASE problems, then clear review cards.",
        learningObjectives: [
          "Twenty mixed problems from SQLZoo or pgexercises",
          "Clear review cards",
        ],
        estMinutes: 60,
        points: 35,
        difficulty: "core",
        resources: [
          {
            type: "tool",
            title: "SQLZoo",
            url: "https://sqlzoo.net/wiki/SQL_Tutorial",
            sourceName: "SQLZoo",
          },
        ],
      },
    ],
  },
  {
    title: "SQL — joining",
    weekRange: "Week 5",
    objective:
      "Join with intent: inner, outer, anti, cross and self — and check the row count after every one.",
    nodes: [
      {
        title: "Day 29 — INNER JOIN",
        summary:
          "Check the row count after every join. A join that multiplies rows is the most common silent bug in analysis.",
        learningObjectives: [
          "The mental model: matching rows on a condition",
          "ON vs WHERE; aliases; qualifying ambiguous columns",
          "Joining on multiple conditions",
          "Row-count sanity before and after",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL tutorial — joins between tables",
            url: "https://www.postgresql.org/docs/current/tutorial-join.html",
            sourceName: "PostgreSQL documentation",
          },
          {
            type: "tool",
            title: "pgexercises — joins",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
            editorNote: "Ten inner joins across your three tables.",
          },
        ],
      },
      {
        title: "Day 30 — LEFT and RIGHT JOIN",
        summary:
          "A condition in ON filters before joining; in WHERE it filters after. That is not a style choice.",
        learningObjectives: [
          "LEFT JOIN as the default choice in analysis",
          "Nulls an outer join introduces, and handling them",
          "The anti-join pattern: LEFT JOIN … WHERE right.key IS NULL",
          "Customers with no orders three ways: anti-join, NOT IN, NOT EXISTS",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Mode SQL tutorial — joins",
            url: "https://mode.com/sql-tutorial/sql-joins",
            sourceName: "Mode SQL tutorial",
          },
        ],
      },
      {
        title: "Day 31 — FULL OUTER, CROSS, SELF",
        summary: "The only cross join you want is the one you meant.",
        learningObjectives: [
          "FULL OUTER JOIN for reconciliation between two systems",
          "CROSS JOIN deliberately: date spines, all combinations",
          "SELF JOIN: employee/manager, comparing rows within one table",
          "Build a gap-free reporting grid with generate_series × categories",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "read",
                    title: "SQL joins",
                    url: "https://mode.com/sql-tutorial/sql-joins",
                    sourceName: "Mode SQL tutorial",
                    editorNote: "Re-read the outer-join half before attempting FULL OUTER reconciliation."
          },
          {
                    type: "tool",
                    title: "pgexercises — joins",
                    url: "https://pgexercises.com/",
                    sourceName: "pgexercises"
          }
        ],
      },
      {
        title: "Day 32 — Multi-table joins",
        summary: "If your total went up after adding a join, you are double-counting.",
        learningObjectives: [
          "Chaining four and five tables; join order and readability",
          "Fan-out: joining one-to-many then aggregating double-counts",
          "Joining to a subquery",
          "Verify a five-table total against a simpler two-table version",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "tool",
                    title: "pgexercises — joins and subqueries",
                    url: "https://pgexercises.com/",
                    sourceName: "pgexercises",
                    editorNote: "The multi-table questions; verify totals against simpler versions."
          },
          {
                    type: "tool",
                    title: "DataLemur — join questions",
                    url: "https://datalemur.com/questions",
                    sourceName: "DataLemur"
          }
        ],
      },
      {
        title: "Day 33 — Set operations",
        summary: "UNION deduplicates and costs a sort. If you do not need it, do not pay for it.",
        learningObjectives: [
          "UNION vs UNION ALL — why UNION ALL is usually what you want",
          "INTERSECT, EXCEPT",
          "Column count and type compatibility rules",
        ],
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "tool",
            title: "SQLZoo — set operations",
            url: "https://sqlzoo.net/wiki/SQL_Tutorial",
            sourceName: "SQLZoo",
          },
        ],
      },
      {
        title: "Day 34 — Join practice block",
        summary:
          "Twenty-five join problems. Keep one query you are proud of and one you found hard, with notes on why.",
        learningObjectives: [
          "Twenty-five join problems from DataLemur, StrataScratch or SQLZoo",
        ],
        estMinutes: 70,
        points: 40,
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
    title: "SQL — aggregation",
    weekRange: "Weeks 5–6",
    objective:
      "Group, filter groups, pivot with conditional aggregation, and build gap-free time series.",
    nodes: [
      {
        title: "Day 35 — GROUP BY",
        summary: "COUNT(*) counts rows. COUNT(column) counts non-nulls. Confusing them changes the answer.",
        learningObjectives: [
          "COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column)",
          "SUM, AVG, MIN, MAX; grouping by multiple columns",
          "Every non-aggregated SELECT column must be in GROUP BY — and why",
          "Grouping by an expression",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Mode SQL tutorial — GROUP BY",
            url: "https://mode.com/sql-tutorial/sql-group-by",
            sourceName: "Mode SQL tutorial",
          },
          {
            type: "tool",
            title: "pgexercises — aggregates",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
          },
        ],
      },
      {
        title: "Day 36 — HAVING and filter order",
        summary: "Learn the logical execution order once and half of SQL's surprises disappear.",
        learningObjectives: [
          "HAVING vs WHERE",
          "Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
          "Why a SELECT alias works in ORDER BY but not WHERE",
        ],
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Mode SQL tutorial — HAVING",
            url: "https://mode.com/sql-tutorial/sql-having",
            sourceName: "Mode SQL tutorial",
          },
        ],
      },
      {
        title: "Day 37 — Conditional aggregation",
        summary: "Conditional aggregation is how you pivot without leaving the database.",
        learningObjectives: [
          "SUM(CASE WHEN … THEN 1 ELSE 0 END) — pivoting inside SQL",
          "FILTER (WHERE …) in PostgreSQL",
          "One row per group, one column per category",
          "Percentage-of-total within a group",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "read",
                    title: "Mode SQL tutorial — CASE",
                    url: "https://mode.com/sql-tutorial/sql-case",
                    sourceName: "Mode SQL tutorial",
                    editorNote: "CASE inside SUM is the whole trick; this page plus GROUP BY is the day."
          },
          {
                    type: "doc",
                    title: "Aggregate functions tutorial",
                    url: "https://www.postgresql.org/docs/current/tutorial-agg.html",
                    sourceName: "PostgreSQL documentation"
          }
        ],
      },
      {
        title: "Day 38 — Working with dates in SQL",
        summary: "A time series with missing months is a chart that lies.",
        learningObjectives: [
          "DATE_TRUNC for month/week/quarter grouping",
          "EXTRACT, AGE, INTERVAL arithmetic",
          "Generating a date series; filling gaps",
          "Store UTC, display local",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL — date/time functions",
            url: "https://www.postgresql.org/docs/current/functions-datetime.html",
            sourceName: "PostgreSQL documentation",
            editorNote: "Build a gap-free monthly revenue series including zero-sale months.",
          },
        ],
      },
      {
        title: "Day 39 — Aggregation practice block",
        summary: "Twenty aggregation problems; at least five using conditional aggregation.",
        learningObjectives: ["Twenty aggregation problems, five conditional"],
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "tool",
            title: "DataLemur — aggregation questions",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
          },
        ],
      },
    ],
  },
  {
    title: "SQL — subqueries & CTEs",
    weekRange: "Week 6",
    objective:
      "Nest when useful, chain CTEs when readable, and know which of the three shapes answers a question best.",
    nodes: [
      {
        title: "Day 40 — Subqueries",
        summary: "A correlated subquery runs once per row. Sometimes that is fine. Know when it is not.",
        learningObjectives: [
          "Scalar subqueries; IN, EXISTS, ANY, ALL",
          "Correlated subqueries and their cost",
          "Derived tables — subqueries in FROM",
          "One question three ways: subquery, join, EXISTS — compared with EXPLAIN",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "read",
            title: "Mode SQL tutorial — subqueries",
            url: "https://mode.com/sql-tutorial/sql-sub-queries",
            sourceName: "Mode SQL tutorial",
          },
        ],
      },
      {
        title: "Day 41 — CTEs",
        summary: "A CTE chain is a paragraph. A nested subquery is a run-on sentence.",
        learningObjectives: [
          "WITH clauses; chaining and naming CTEs as steps in an argument",
          "Rewriting a nested mess as a readable chain",
          "Recursive CTEs: org charts, category trees, date generation",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "PostgreSQL — WITH queries",
            url: "https://www.postgresql.org/docs/current/queries-with.html",
            sourceName: "PostgreSQL documentation",
            editorNote: "Rewrite your ugliest query so far as a chain someone else could follow.",
          },
        ],
      },
      {
        title: "Day 42 — Review",
        summary: "Close the module and the week: redo the hardest problems, clear review cards.",
        learningObjectives: ["Review the module's patterns", "Clear review cards"],
        estMinutes: 40,
        points: 30,
        difficulty: "core",
        resources: [],
      },
    ],
  },
];
