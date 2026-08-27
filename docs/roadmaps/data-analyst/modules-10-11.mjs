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
        title: "The window concept",
        summary: "GROUP BY collapses rows. OVER keeps them and adds context.",
        learningObjectives: [
          "OVER() — a row keeps its identity while seeing its neighbours",
          "PARTITION BY vs GROUP BY: the hardest idea in the module",
          "ORDER BY inside OVER",
          "SUM OVER, AVG OVER, COUNT OVER; each row with its group total and share",
        ],
        whyToday:
          "Window functions are the line between an analyst who can produce a total and one who can produce a total alongside every row's share of it. Interviewers know this, which is why they ask.",
        principle:
          "GROUP BY collapses rows. OVER keeps them and adds context. That single sentence is the whole module.",
        commonMistake:
          "Reading PARTITION BY as a synonym for GROUP BY. They divide rows the same way and differ in what comes out — grouping returns one row per group, partitioning returns every row with its group's answer attached.",
        challenge:
          "Write one query returning every order row with three extra columns: its customer's total, its share of that total, and the customer's order count. No GROUP BY anywhere in it.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "What OVER does",
            detail:
              "Computes an aggregate across a set of rows related to the current row, and returns it on that row. Nothing is collapsed.",
          },
          {
            title: "PARTITION BY versus GROUP BY",
            detail:
              "Both divide rows into sets. GROUP BY emits one row per set; PARTITION BY emits every row with its set's value alongside. Same division, different output shape.",
          },
          {
            title: "ORDER BY inside OVER",
            detail:
              "Orders rows within the partition, which is what makes running totals and LAG possible. It also silently introduces a default frame — day 45's subject.",
          },
          {
            title: "Bare OVER()",
            detail:
              "An empty OVER() treats the whole result as one partition. `SUM(x) OVER ()` gives the grand total on every row, which is how you compute a share of total in one pass.",
          },
        ],
        checks: [
          {
            question: "What is the difference between PARTITION BY and GROUP BY?",
            answer:
              "They divide rows identically. GROUP BY returns one row per group; PARTITION BY returns every original row with the group's value attached.",
          },
          {
            question: "What does SUM(x) OVER () return?",
            answer:
              "The grand total across all rows, repeated on every row — the whole result treated as one partition.",
          },
          {
            question: "What does adding ORDER BY inside OVER change?",
            answer:
              "It orders rows within the partition, enabling running totals and positional functions — and it introduces a default frame.",
          },
          {
            question: "Explain the difference between GROUP BY and a window function.",
            answer:
              "Both divide rows into sets. GROUP BY collapses each set to one row, so the individual rows are gone. A window function computes across the set and returns the value on every original row, so you keep the detail and gain the context. If you need each order alongside its customer's total, only the window version can do it in one pass.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
        title: "Ranking",
        summary:
          "If ties are possible and you used ROW_NUMBER, you have made a silent arbitrary choice.",
        learningObjectives: [
          "ROW_NUMBER, RANK, DENSE_RANK — what each does with ties",
          "NTILE for quartiles and deciles",
          "Top-N per group: the most-asked SQL interview pattern",
          "Deduplicating with ROW_NUMBER",
        ],
        whyToday:
          "Top-N-per-group is the most-asked SQL interview pattern there is, and it has no clean answer without a ranking window function. Today is the day that question stops being hard.",
        principle:
          "If ties are possible and you used ROW_NUMBER, you have made a silent arbitrary choice about which tied row wins.",
        commonMistake:
          "Using ROW_NUMBER for a leaderboard. Two customers with identical spend get positions 1 and 2 in whatever order the engine happened to produce, and the result changes between runs.",
        challenge:
          "Produce the top three products per category three ways — ROW_NUMBER, RANK and DENSE_RANK — on data containing a deliberate tie. Explain the three different row counts you get back.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "The three functions",
            detail:
              "ROW_NUMBER always gives distinct positions. RANK gives ties the same position and skips the next. DENSE_RANK gives ties the same position and does not skip.",
          },
          {
            title: "Top-N per group",
            detail:
              "Rank within a PARTITION BY in a subquery or CTE, then filter on the rank outside. You cannot filter a window function in WHERE — it is computed after.",
          },
          {
            title: "Deduplicating",
            detail:
              "ROW_NUMBER partitioned by the key, ordered by a tiebreaker, keep where it equals 1. Here the arbitrary choice is fine because you want exactly one.",
          },
          {
            title: "NTILE",
            detail:
              "Divides rows into n roughly equal buckets — quartiles, deciles. Bucket sizes differ by one when the count does not divide evenly.",
          },
        ],
        checks: [
          {
            question: "How do RANK and DENSE_RANK differ?",
            answer:
              "Both give tied rows the same rank. RANK then skips the following positions; DENSE_RANK does not.",
          },
          {
            question: "Why can you not filter on a window function in WHERE?",
            answer:
              "Window functions are computed after WHERE. Wrap the query in a CTE or subquery and filter outside.",
          },
          {
            question: "When is ROW_NUMBER's arbitrary tie-breaking acceptable?",
            answer:
              "When you deliberately want exactly one row per key — deduplication — rather than a fair ranking.",
          },
          {
            question: "Give me the top three products by revenue within each category.",
            answer:
              "Rank inside a CTE — ROW_NUMBER or RANK OVER (PARTITION BY category ORDER BY revenue DESC) — then filter to rank <= 3 in the outer query, because a window function cannot be referenced in WHERE. Which ranking function depends on ties: ROW_NUMBER picks arbitrarily among equals, RANK returns more than three rows when the third place is tied. Say which you chose and why.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question: "How would you remove duplicate rows keeping the most recent per key?",
            answer:
              "ROW_NUMBER() OVER (PARTITION BY the business key ORDER BY the timestamp DESC), then keep where it equals 1. Here ROW_NUMBER's arbitrary tie-breaking is correct because you want exactly one row — but add a deterministic secondary sort so the result is reproducible.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "tool",
            title: "DataLemur — ranking questions",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
            editorNote:
              "Top three products per category, three ways, explaining each tie behaviour.",
          },
        ],
      },
      {
        title: "Frames",
        summary:
          "The default frame is RANGE, not ROWS. That difference has broken many dashboards.",
        learningObjectives: [
          "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — the running total",
          "Moving averages with n PRECEDING",
          "RANGE vs ROWS and how ties change the answer",
          "Running total, 7-day moving average, cumulative % of total",
        ],
        whyToday:
          "Running totals and moving averages are standard dashboard content, and the default frame quietly makes them wrong in the presence of ties. This is a real bug that ships often.",
        principle:
          "The default frame is RANGE, not ROWS. With ORDER BY present, RANGE includes every peer row with the same value — which is not what a running total usually means.",
        commonMistake:
          "Writing a running total as SUM(x) OVER (ORDER BY d) and assuming row-by-row accumulation. With two rows on the same date, both get the total including each other, and the sequence jumps.",
        challenge:
          "Compute a running total with the default frame and with ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, on data containing two rows with the same sort value. Compare them and explain the difference.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The frame clause",
            detail:
              "Defines which rows in the partition the function sees. UNBOUNDED PRECEDING to CURRENT ROW is the running total; n PRECEDING to CURRENT ROW is a moving window.",
          },
          {
            title: "ROWS versus RANGE",
            detail:
              "ROWS counts physical rows. RANGE includes all peers with the same ORDER BY value. With unique values they agree; with ties they do not.",
          },
          {
            title: "Moving averages",
            detail:
              "AVG over ROWS BETWEEN 6 PRECEDING AND CURRENT ROW is a seven-day average — provided every day exists as a row. Gaps make it a seven-row average instead.",
          },
          {
            title: "Cumulative share",
            detail:
              "A running total divided by SUM(x) OVER () gives cumulative percent of total — the Pareto curve, in one query.",
          },
        ],
        checks: [
          {
            question: "What is the default frame when ORDER BY is present?",
            answer:
              "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which includes all peer rows sharing the current row's sort value.",
          },
          {
            question: "When do ROWS and RANGE give the same answer?",
            answer: "When the ORDER BY values are unique, so no row has peers.",
          },
          {
            question: "What breaks a seven-day moving average built on ROWS?",
            answer:
              "Missing days. It averages seven rows, not seven days, so gaps silently widen the real window.",
          },
          {
            question:
              "Write a running total. Then tell me what is wrong with the obvious version.",
            answer:
              "SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). The obvious version omits the frame, which defaults to RANGE — that includes every peer row sharing the current date, so two transactions on the same day both receive the total including each other and the series jumps. With unique dates the two agree, which is why the bug survives testing.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
          {
            question:
              "How would you compute a seven-day moving average, and what could go wrong?",
            answer:
              "AVG over ROWS BETWEEN 6 PRECEDING AND CURRENT ROW, ordered by date. The failure is missing days: ROWS counts rows, not days, so gaps make it average over a longer real period. Join to a generated date spine first so every day exists as a row.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Window function processing",
            url: "https://www.postgresql.org/docs/current/functions-window.html",
            sourceName: "PostgreSQL documentation",
            editorNote: "The frame-clause reference — the RANGE vs ROWS distinction lives here.",
          },
        ],
      },
      {
        title: "Positional functions",
        summary:
          "LAST_VALUE without an explicit frame returns the current row. Almost nobody wants that.",
        learningObjectives: [
          "LAG and LEAD with offsets and defaults",
          "Period-over-period growth; month-on-month change",
          "FIRST_VALUE, LAST_VALUE and the frame trap",
          "Gaps-and-islands: consecutive streaks",
        ],
        whyToday:
          "Period-over-period change is the most requested number in business reporting, and LAG produces it in one line. The LAST_VALUE trap is included because it catches almost everybody once.",
        principle:
          "LAST_VALUE without an explicit frame returns the current row, because the default frame ends there. Almost nobody wants that.",
        commonMistake:
          "Using LAG without a default and letting the first row's null propagate. Growth for the first period becomes null, the chart starts at nothing, and the division by null spreads further than expected.",
        challenge:
          "Compute month-on-month growth with LAG, handling the first month explicitly. Then use FIRST_VALUE and LAST_VALUE on the same partition and fix LAST_VALUE with an explicit frame.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "LAG and LEAD",
            detail:
              "Reach backward or forward n rows within the partition. The third argument is the default for rows with no neighbour — usually what saves you.",
          },
          {
            title: "Period-over-period",
            detail:
              "(current - LAG(current)) / LAG(current). Cast to numeric, guard against zero, and decide what the first period should show.",
          },
          {
            title: "The LAST_VALUE trap",
            detail:
              "The default frame stops at the current row, so LAST_VALUE returns the current row. Add ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.",
          },
          {
            title: "Gaps and islands",
            detail:
              "Consecutive streaks — login streaks, uninterrupted subscriptions. Subtract a row number from a date to make consecutive runs share a constant, then group on it.",
          },
        ],
        checks: [
          {
            question: "Why does LAST_VALUE usually return the current row?",
            answer:
              "The default frame ends at the current row, so that is the last row it can see. An explicit UNBOUNDED FOLLOWING frame fixes it.",
          },
          {
            question: "What does LAG's third argument do?",
            answer:
              "Supplies a default for rows with no preceding neighbour, instead of returning null.",
          },
          {
            question: "What is the gaps-and-islands trick?",
            answer:
              "Subtracting a row number from a sequential value makes consecutive runs share a constant, which you can then group on to find streaks.",
          },
          {
            question: "Compute month-on-month growth.",
            answer:
              "Aggregate to one row per month, then (value - LAG(value) OVER (ORDER BY month)) / LAG(value) OVER (ORDER BY month). Cast to numeric to avoid integer division, guard the division when the previous month is zero, and decide explicitly what the first month shows — LAG's third argument or a COALESCE.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question: "Why does LAST_VALUE usually return the wrong answer?",
            answer:
              "Because the default frame with ORDER BY runs to the current row, so the last visible row is the current one. Add ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING, or use FIRST_VALUE with the order reversed.",
            kind: "interview",
            difficulty: "hard",
          },
          {
            question: "Find each user's longest streak of consecutive active days.",
            answer:
              "Gaps and islands. Row-number the active days per user ordered by date, then subtract that row number from the date — consecutive days produce a constant, so grouping by user and that constant gives one group per streak. COUNT per group is the streak length; take the max.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "SQL window functions",
            url: "https://mode.com/sql-tutorial/sql-window-functions",
            sourceName: "Mode SQL tutorial",
            editorNote: "The LAG/LEAD half; do the exercises with your own tables.",
          },
          {
            type: "doc",
            title: "Window function processing",
            url: "https://www.postgresql.org/docs/current/functions-window.html",
            sourceName: "PostgreSQL documentation",
          },
        ],
      },
      {
        title: "Cohort retention end to end",
        summary:
          "The hardest part of retention is defining the cohort, not writing the window function.",
        learningObjectives: [
          "Assign each customer a cohort month from first purchase",
          "Activity by months-since-first-purchase",
          "Build the retention triangle",
          "Sanity-check cohort sizes against a simple count",
        ],
        whyToday:
          "Retention is the analysis most often asked for in a product company and most often got wrong. Everything from the last five days assembles into it, and the hard part is not the SQL.",
        principle:
          "The hardest part of retention is defining the cohort, not writing the window function. Two defensible definitions give different numbers and both are correct.",
        commonMistake:
          "Computing retention as a percentage of the previous month rather than of the cohort's original size. The numbers look far better and mean something entirely different.",
        challenge:
          "Build the retention triangle: cohort month from first purchase, activity by months-since, one row per cohort. Then sanity-check every cohort size against a plain COUNT DISTINCT — if they disagree, the cohort assignment is wrong.",
        challengeMinutes: 60,
        estMinutes: 70,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Assigning the cohort",
            detail:
              "MIN(order_date) per customer, truncated to month, held as a window function so it lands on every row without a join.",
          },
          {
            title: "Months since",
            detail:
              "The difference between the activity month and the cohort month, in whole months. Month arithmetic, not day arithmetic divided by thirty.",
          },
          {
            title: "The denominator decision",
            detail:
              "Percent of original cohort size shows real decay. Percent of last period shows month-on-month churn. State which you used on the chart.",
          },
          {
            title: "Sanity-check the sizes",
            detail:
              "Each cohort's month-0 count must equal a plain distinct count of customers first ordering that month. If not, the assignment is wrong and everything after it is too.",
          },
          {
            title: "Partial cohorts",
            detail:
              "The newest cohort has had no time to churn and looks excellent. Either exclude it or mark it, or the chart tells a happy lie.",
          },
        ],
        checks: [
          {
            question: "What is the usual denominator in a retention table?",
            answer:
              "The cohort's original size at month zero. Dividing by the previous period measures something different and flatters the numbers.",
          },
          {
            question: "How do you sanity-check cohort assignment?",
            answer:
              "Each cohort's month-0 count must match a plain distinct count of customers whose first purchase was that month.",
          },
          {
            question: "Why is the newest cohort misleading?",
            answer:
              "It has had less time to churn, so it looks best. Exclude or clearly mark partial cohorts.",
          },
          {
            question: "Walk me through building a cohort retention table.",
            answer:
              "Assign each customer a cohort from the month of their first purchase — MIN over a window so it lands on every row. Compute months-since as the whole-month difference between activity month and cohort month. Count distinct customers per cohort per months-since, and divide by the cohort's month-zero size. State the denominator explicitly, and either exclude or clearly mark the newest cohorts, which have had no time to churn and always look best.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "tool",
            title: "DataLemur — window questions",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
            editorNote:
              "Search for the retention and cohort questions; they mirror this build exactly.",
          },
        ],
      },
      {
        title: "Window practice block",
        summary: "Twenty window-function problems from DataLemur or StrataScratch.",
        learningObjectives: [
          "Twenty window problems under light time pressure",
        ],
        whyToday:
          "Window functions are the highest-leverage thing in the SQL half of this roadmap for getting hired. Twenty problems under light time pressure is what converts understanding into recall.",
        principle:
          "Practise under a clock. Window syntax you can derive slowly is not the same as syntax you can produce in an interview.",
        commonMistake:
          "Practising only ranking. Frames and LAG are where the interesting questions are, and they are the ones that need the reps.",
        challenge:
          "Twenty window problems under light time pressure. Make sure at least five involve an explicit frame and five involve LAG or LEAD — not twenty variations of top-N.",
        challengeMinutes: 50,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Spread the types",
            detail:
              "Ranking, running totals, moving averages, period-over-period, gaps and islands. Five families, four problems each.",
          },
          {
            title: "Light time pressure",
            detail:
              "Enough to force recall, not so much that you guess. Around five minutes each.",
          },
          {
            title: "Say the frame out loud",
            detail:
              "For every problem, state whether you need a frame and which. That question is where most window bugs are decided.",
          },
        ],
        checks: [
          {
            question: "Which ranking function leaves no gaps after a tie?",
            answer: "DENSE_RANK.",
          },
          {
            question: "How do you get a true running total regardless of ties?",
            answer: "Specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW explicitly.",
          },
          {
            question: "How do you filter on a window function's result?",
            answer:
              "Compute it in a CTE or subquery and filter in the outer query — it cannot be referenced in WHERE.",
          },
        ],
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
    deliverable:
      "A commented .sql file with an end-to-end analysis plus a short written finding.",
    nodes: [
      {
        title: "Indexes and why queries are slow",
        summary: "Measure before optimising. Intuition about query speed is usually wrong.",
        learningObjectives: [
          "What an index is; B-tree basics without the theory",
          "When an index helps and when it does not",
          "EXPLAIN and EXPLAIN ANALYZE — reading a plan",
          "Sequential vs index scan; the row-estimate line",
        ],
        whyToday:
          "Up to now every query has been correct or incorrect. Today adds a third axis, and the discipline of measuring before optimising is what stops you adding indexes that cost and do nothing.",
        principle:
          "Measure before optimising. Intuition about query speed is usually wrong, and EXPLAIN ANALYZE is cheaper than a guess.",
        commonMistake:
          "Adding an index and declaring victory without re-measuring. The planner may not use it at all, and every write now pays for it — a pure cost with the appearance of a fix.",
        challenge:
          "EXPLAIN ANALYZE your slowest query and record the time. Add an index, run it again, record it. Then check the plan actually switched to an index scan — sometimes it does not, and the number that matters is the plan not the hope.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "What an index is",
            detail:
              "A sorted structure the engine can seek into rather than scanning. That is enough theory to use one correctly.",
          },
          {
            title: "When it does not help",
            detail:
              "Leading wildcards, functions applied to the column, and any query returning a large fraction of the table — where a sequential scan is genuinely faster.",
          },
          {
            title: "EXPLAIN versus EXPLAIN ANALYZE",
            detail:
              "EXPLAIN shows the plan the planner intends. EXPLAIN ANALYZE runs it and reports actual times and row counts. The gap between estimated and actual rows is the most diagnostic line.",
          },
          {
            title: "Reading a plan",
            detail:
              "Seq Scan means reading everything. Nested Loop over a large outer input is usually the problem. Start at the most deeply indented node.",
          },
          {
            title: "The cost of an index",
            detail:
              "Every insert, update and delete maintains it, and it occupies space. Unused indexes are a permanent tax.",
          },
        ],
        checks: [
          {
            question: "What does EXPLAIN ANALYZE add over EXPLAIN?",
            answer:
              "It executes the query and reports actual timings and row counts alongside the estimates.",
          },
          {
            question: "Name two cases where an index will not be used.",
            answer:
              "A leading wildcard in LIKE, and a function applied to the indexed column. A query returning most of the table is a third.",
          },
          {
            question: "Why is an unused index worse than no index?",
            answer: "It costs storage and slows every write while returning nothing.",
          },
          {
            question: "A dashboard query got slow. Walk me through diagnosing it.",
            answer:
              "EXPLAIN ANALYZE first — never guess. Look for sequential scans on large tables, and compare estimated against actual row counts, since a large gap means the planner is working from bad statistics. Check whether the filter is index-eligible: a leading wildcard or a function on the column prevents index use. Then consider whether the query grew a join that fans out. Add an index only after identifying the specific step, and re-measure to confirm the plan actually changed.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question: "When would adding an index make things worse?",
            answer:
              "Every write maintains it, so a write-heavy table pays continuously. It also costs storage, and if the planner never chooses it — because the query returns most of the table, or the predicate is not index-eligible — the cost buys nothing at all.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
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
        title: "Views, materialised views and query organisation",
        summary: "Structure an analysis into layers: raw → cleaned → aggregated.",
        learningObjectives: [
          "CREATE VIEW for reusable logic — when it helps, when it hides cost",
          "Materialised views and refresh",
          "Turn the cohort query into a view and use it three ways",
        ],
        whyToday:
          "Analyses grow, and the difference between one that somebody can maintain and one nobody dares touch is layering. A view is the cheapest way to impose it.",
        principle:
          "Structure an analysis into layers: raw, cleaned, aggregated. Each layer is one thing, and each can be checked on its own.",
        commonMistake:
          "Stacking views five deep. Each one looks simple and the planner expands all of them, so a two-line query executes an enormous plan and nobody can see why it is slow.",
        challenge:
          "Turn your cohort query into a view and use it three ways. Then check EXPLAIN on one of those uses and see the whole underlying query reappear in the plan.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Views are queries, not tables",
            detail:
              "A view stores the SQL, not the result. Every use re-runs it, so a slow view is slow at each of its call sites.",
          },
          {
            title: "Materialised views",
            detail:
              "Store the result and must be refreshed. Fast to read and potentially stale — the trade-off has to be a deliberate decision about freshness.",
          },
          {
            title: "Layering",
            detail:
              "Raw, cleaned, aggregated. Naming the layers means somebody can find the level at which a number went wrong.",
          },
          {
            title: "Where views hide cost",
            detail:
              "A simple-looking query over nested views expands into a large plan. Check EXPLAIN when a query is unexpectedly slow.",
          },
        ],
        checks: [
          {
            question: "What does a view store?",
            answer:
              "The query text, not the result. Every use re-executes the underlying query.",
          },
          {
            question: "What is the trade-off with a materialised view?",
            answer:
              "It stores results so reads are fast, but the data is as stale as the last refresh.",
          },
          {
            question: "Why can nested views become a performance problem?",
            answer:
              "The planner expands all of them, so a short query can produce a very large plan that is hard to attribute.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Materialized views",
            url: "https://www.postgresql.org/docs/current/rules-materializedviews.html",
            sourceName: "PostgreSQL documentation",
          },
        ],
      },
      {
        title: "Data quality checks in SQL",
        summary:
          "Run your quality checks before your analysis, not after someone questions your number.",
        learningObjectives: [
          "Duplicates with GROUP BY … HAVING COUNT(*) > 1",
          "Orphan foreign keys with anti-joins",
          "Range checks, impossible dates, negative quantities",
          "A reusable data-quality query set — eight checks, documented",
        ],
        whyToday:
          "This is the day that protects your credibility. Finding your own bad data before somebody else does is the difference between a caveat and a retraction.",
        principle:
          "Run your quality checks before your analysis, not after someone questions your number.",
        commonMistake:
          "Checking quality once at the start of a project. Data arrives continuously, so the check has to be a query you re-run, not an inspection you did in March.",
        challenge:
          "Build a reusable set of eight data-quality queries against your own schema: duplicates, orphan keys, nulls in required columns, out-of-range values, impossible dates, negative quantities, unexpected categories, and a row count against a known source. Save them as one file.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Duplicates",
            detail:
              "GROUP BY the supposed key HAVING COUNT(*) > 1. The fastest way to discover the key is not a key.",
          },
          {
            title: "Orphans",
            detail:
              "Anti-join from child to parent. Any row returned is a foreign key pointing at nothing, which means the constraint is missing.",
          },
          {
            title: "Range and plausibility",
            detail:
              "Negative quantities, future dates of birth, percentages above 100. Cheap checks that catch loading errors nothing else notices.",
          },
          {
            title: "Reconcile the total",
            detail:
              "Compare a row count or a sum against the source system. Agreement is the only evidence the load was complete.",
          },
          {
            title: "Make it a file",
            detail:
              "Eight named queries in one commented .sql file, re-runnable. Day 3's Quartz guide is now a checklist you can execute.",
          },
        ],
        checks: [
          {
            question: "How do you find duplicate keys?",
            answer: "GROUP BY the key with HAVING COUNT(*) > 1.",
          },
          {
            question: "How do you find orphan foreign keys?",
            answer: "An anti-join from child to parent — LEFT JOIN with the parent key IS NULL.",
          },
          {
            question: "Why must quality checks be re-runnable?",
            answer:
              "Data keeps arriving. A one-off inspection says nothing about the rows loaded since.",
          },
          {
            question:
              "You are handed a new table before a deadline. What do you check before trusting any number from it?",
            answer:
              "Grain first — what one row means, and whether the supposed key is unique, via GROUP BY key HAVING COUNT(*) > 1. Then nulls per column, orphan foreign keys with an anti-join, and range plausibility: negative quantities, future dates, percentages above 100. Finally reconcile a total or row count against the source system, because that is the only evidence the load was complete. Each of those is one query and together they take ten minutes.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "The Quartz guide to bad data",
            url: "https://github.com/Quartz/bad-data-guide",
            sourceName: "Quartz",
            editorNote: "Reopen from day 3 — now every entry maps to a query you can write.",
          },
        ],
      },
      {
        title: "Review and SQL capstone",
        summary:
          "One end-to-end SQL analysis of a real business question: CTEs, joins, aggregation and at least one window function, delivered as a commented .sql file with a written finding.",
        learningObjectives: [
          "An end-to-end analysis using the whole SQL toolkit",
          "A commented .sql file plus a short written finding",
        ],
        whyToday:
          "Eight weeks of SQL end here, and the deliverable is a file somebody else can read. That artefact is portfolio material and it is also the honest test of whether the eight weeks worked.",
        principle:
          "The deliverable is the finding, not the query. A correct query with no stated conclusion has not answered anybody's question.",
        commonMistake:
          "Delivering the SQL and letting the reader infer the point. The written finding is the part the business reads, and it is the part that gets you asked back.",
        challenge:
          "One end-to-end analysis of a real business question: CTEs, joins, aggregation and at least one window function, in a commented .sql file, with a short written finding at the top. Then clear your review cards.",
        challengeMinutes: 75,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Pick a real question",
            detail:
              "Something with a decision attached — which segment to focus on, where retention drops. A query with no decision behind it has no natural conclusion.",
          },
          {
            title: "Structure with CTEs",
            detail:
              "Named steps, each doing one thing. The file should read as an argument from raw data to conclusion.",
          },
          {
            title: "Comment the why",
            detail:
              "Not what the SQL does — that is visible. Why this filter, why this definition, why this cohort boundary.",
          },
          {
            title: "The finding at the top",
            detail:
              "Three or four sentences: what you found, how confident you are, what you would do about it. Written before the reader reaches any SQL.",
          },
          {
            title: "Keep it",
            detail: "This is the second portfolio artefact. Week 13 will ask for it.",
          },
        ],
        checks: [
          {
            question: "What belongs in a comment in an analysis file?",
            answer:
              "The reasoning — why this filter, why this definition. What the SQL does is already visible.",
          },
          {
            question: "What should the written finding contain?",
            answer:
              "What you found, how confident you are, and what you would do about it — in a few sentences, before the SQL.",
          },
          {
            question: "Why structure the analysis as a CTE chain?",
            answer:
              "It reads as named steps from raw data to conclusion, so a reader can follow and check each stage.",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "pgexercises",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
            editorNote: "Warm up with two hard ones before starting the capstone query.",
          },
        ],
      },
    ],
  },
];
