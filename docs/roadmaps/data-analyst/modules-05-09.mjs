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
        title: "Review",
        summary:
          "Week 3 closes with review only: redo the Power Query pipeline steps from memory and clear your cards.",
        learningObjectives: [
          "Re-run the week's Power Query work without notes",
          "Clear review cards",
        ],
        whyToday:
          "Week 3 built a pipeline with a lot of clicking. Clicking is easy to follow and hard to remember, so today rebuilds it from memory before the details fade.",
        principle:
          "If you cannot rebuild the pipeline without the notes, you learned the buttons rather than the method.",
        commonMistake:
          "Reopening last week's file and reading the Applied Steps. Recognising the steps is not the same as being able to produce them, and only one of those survives to week 9.",
        challenge:
          "Rebuild the week's Power Query work on a fresh file, from memory, without opening the old one. Then compare against it and note only what you missed.",
        challengeMinutes: 30,
        estMinutes: 30,
        points: 15,
        difficulty: "core",
        topics: [
          {
            title: "Rebuild, do not reread",
            detail:
              "Start from a blank query. The steps you cannot recall are the ones that were never learned, and they are cheap to fix today.",
          },
          {
            title: "The chain to recall",
            detail:
              "Import, promote headers, change type with locale, split, unpivot, merge, group, load. If any of the eight is missing, that is the revision.",
          },
          {
            title: "Then clear the cards",
            detail:
              "Review after the rebuild, so the cards you clear are the ones the rebuild proved you needed.",
          },
        ],
        checks: [
          {
            question: "Which single Power Query command fixes most Indian date columns?",
            answer:
              "Change type with locale — it tells the parser the source uses dd/mm rather than the machine's convention.",
          },
          {
            question: "Why unpivot 'other columns' rather than selecting the value columns?",
            answer:
              "New columns are then included automatically on refresh, instead of being silently left out.",
          },
          {
            question: "What must you check after every merge?",
            answer:
              "The row count. If it grew, the key is not unique and every downstream total is inflated.",
          },
        ],
        resources: [],
      },
      {
        title: "Why databases exist",
        summary: "Every many-to-many relationship hides a table nobody has drawn yet.",
        learningObjectives: [
          "The problems a spreadsheet cannot solve: concurrency, size, integrity, related entities",
          "Tables, rows, columns — how it differs from a sheet",
          "Primary keys, foreign keys, composite keys",
          "One-to-many and many-to-many; why a join table exists",
        ],
        whyToday:
          "Six weeks of SQL start here, and they go better if you know what problem the database was invented to solve. Otherwise tables look like sheets with worse ergonomics.",
        principle:
          "Every many-to-many relationship hides a table nobody has drawn yet. Finding that table is most of what data modelling is.",
        commonMistake:
          "Modelling a many-to-many as repeated columns — product1, product2, product3. It works for three and breaks at four, and no query can aggregate across it.",
        challenge:
          "Draw the tables behind a food-delivery app on paper: customers, restaurants, orders, order items. Mark every key. Then find the many-to-many you did not draw a table for — there is at least one.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 25,
        difficulty: "intro",
        topics: [
          {
            title: "What a sheet cannot do",
            detail:
              "Concurrent writers, tens of millions of rows, enforced integrity, and relationships between entities. Each is a reason the database exists.",
          },
          {
            title: "Keys",
            detail:
              "A primary key identifies a row. A foreign key points at one and the database enforces that the target exists. A composite key needs more than one column to be unique.",
          },
          {
            title: "One-to-many",
            detail:
              "One customer, many orders. The foreign key lives on the many side — orders carry customer_id, not the other way round.",
          },
          {
            title: "Many-to-many needs a table",
            detail:
              "Orders and products relate both ways, so a third table — order_items — holds the pair plus anything about the pairing, like quantity and price.",
          },
        ],
        checks: [
          {
            question: "Where does the foreign key live in a one-to-many relationship?",
            answer:
              "On the many side. Orders carry customer_id; the customer row holds nothing about its orders.",
          },
          {
            question: "How is a many-to-many represented?",
            answer:
              "With a third table holding one row per pairing, plus any attributes of the pairing itself such as quantity or price.",
          },
          {
            question: "What is a composite key?",
            answer:
              "A key made of more than one column, needed when no single column is unique per row.",
          },
          {
            question:
              "Design the tables behind a food-delivery app. Walk me through your schema.",
            answer:
              "Customers, restaurants, orders and order_items at minimum, with menu_items. Orders carry customer_id and restaurant_id as foreign keys — the many side holds the key. Orders to menu items is many-to-many, so order_items is the join table, and it holds quantity and the price at time of order rather than pointing at the current menu price, because prices change and an old order must still total correctly. Naming that last point unprompted is the part that distinguishes the answer.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
        title: "Normalisation, plainly",
        summary: "Normalise to store, denormalise to analyse.",
        learningObjectives: [
          "1NF, 2NF, 3NF through one badly-designed table being fixed step by step",
          "What denormalisation is for — analytics does it deliberately",
          "Star schema: fact and dimension tables",
        ],
        whyToday:
          "You will read normalised schemas for the rest of your career and build denormalised ones for analysis. Knowing the difference is what stops you complaining about a design that is correct.",
        principle:
          "Normalise to store, denormalise to analyse. Both are right; they optimise for different things and the mistake is applying either everywhere.",
        commonMistake:
          "Treating normalisation as a virtue rather than a trade-off. A fully normalised analytical query joins eleven tables and nobody can read it — the warehouse denormalises on purpose.",
        challenge:
          "Take one badly-designed wide table and normalise it step by step to third normal form, writing down which rule each step satisfies. Then denormalise it into a star schema and say what each version is better at.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The three forms, plainly",
            detail:
              "1NF: one value per cell. 2NF: no column depending on part of a composite key. 3NF: no column depending on another non-key column.",
          },
          {
            title: "What it buys",
            detail:
              "One fact stored once, so an update cannot leave two copies disagreeing. That is the whole argument.",
          },
          {
            title: "What it costs",
            detail:
              "Joins. Every fact split across tables must be rejoined to be read, and analytical queries read far more than they write.",
          },
          {
            title: "Star schema",
            detail:
              "One fact table of measurements surrounded by dimension tables describing them. Deliberately denormalised, and the standard shape for analytics.",
          },
        ],
        checks: [
          {
            question: "State third normal form in one sentence.",
            answer:
              "No non-key column depends on another non-key column — every column describes the key and nothing else.",
          },
          {
            question: "Why do analytical schemas denormalise deliberately?",
            answer:
              "Reads dominate writes, and joins are the cost of normalisation. A star schema trades storage and update-safety for query simplicity and speed.",
          },
          {
            question: "What is in a fact table versus a dimension table?",
            answer:
              "Facts hold the measurements and the keys; dimensions hold the descriptive attributes you group and filter by.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "freeCodeCamp — database design and normalisation",
            url: "https://www.youtube.com/@freecodecamp",
            sourceName: "freeCodeCamp.org (YouTube)",
            editorNote:
              "Search the channel for \"database normalization\" and pick the current course.",
          },
        ],
      },
      {
        title: "Setting up and loading data",
        summary: "This is the day most people quit. Budget extra time and finish it.",
        learningObjectives: [
          "Install PostgreSQL; a GUI client (DBeaver or pgAdmin)",
          "CREATE DATABASE, CREATE TABLE; the core data types",
          "Constraints: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT",
          "Loading a CSV with COPY or the client's import",
        ],
        whyToday:
          "This is the day most people quit — installation problems feel like failure rather than setup. Budget extra time, expect friction, and finish it, because every remaining SQL day depends on it.",
        principle:
          "Constraints belong in the table definition. A rule enforced by the database cannot be bypassed by the next person or the next import.",
        commonMistake:
          "Loading every column as text to make the import succeed. It always works and it postpones every type problem to the queries, where they are harder to find and impossible to fix once.",
        challenge:
          "Create a database, three linked tables with real constraints — primary keys, a foreign key, a NOT NULL and a CHECK — and load real data. Then deliberately try to insert a row that violates each constraint and confirm the database refuses.",
        challengeMinutes: 55,
        estMinutes: 60,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "Expect friction",
            detail:
              "Ports, passwords, path variables. It is setup, not aptitude, and it is a one-time cost — allow twice the time you think.",
          },
          {
            title: "The core types",
            detail:
              "integer, numeric for money, text, date, timestamptz, boolean. Use numeric rather than float for anything financial — float cannot represent 0.10 exactly.",
          },
          {
            title: "Constraints",
            detail:
              "NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT. Each is a fact about the data the database will refuse to break.",
          },
          {
            title: "Loading",
            detail:
              "COPY is fast and strict; the client's import wizard is forgiving and slower. Strict is better — it tells you about the bad rows.",
          },
          {
            title: "A GUI helps",
            detail:
              "DBeaver or pgAdmin. Seeing the schema and the data at once removes most of the early confusion.",
          },
        ],
        checks: [
          {
            question: "Why use numeric rather than a float for money?",
            answer:
              "Floating point cannot represent decimal fractions exactly, so sums drift. numeric stores the value precisely.",
          },
          {
            question: "What is wrong with importing every column as text?",
            answer:
              "The import always succeeds and every type problem moves into the queries, where it is harder to detect and must be fixed repeatedly.",
          },
          {
            question: "Why prefer COPY's strictness to a forgiving import?",
            answer:
              "It fails on bad rows and tells you which. A forgiving import silently accepts or mangles them.",
          },
        ],
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
            editorNote:
              "Create a database, three linked tables with constraints, and load real data.",
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
        title: "SELECT",
        summary: "Format every query as though a colleague will read it, because one will.",
        learningObjectives: [
          "SELECT, FROM, aliases with AS",
          "DISTINCT; LIMIT and OFFSET; ORDER BY with multiple keys and NULLS FIRST/LAST",
          "Expressions in the select list",
          "Comments and formatting conventions that make queries reviewable",
        ],
        whyToday:
          "The first query is trivial; the habits set with it are not. Formatting and aliasing conventions adopted today are the ones every query for six weeks will inherit.",
        principle:
          "Format every query as though a colleague will read it, because one will — and it will most often be you, three months later, at speed.",
        commonMistake:
          "Writing SELECT * in anything that will be kept. Column order and count then change under you, the query returns data nobody asked for, and it is slower for no benefit.",
        challenge:
          "Write twelve SELECT queries against your own loaded data. Every one named with aliases, formatted across lines, and no SELECT *. Then re-read the ugliest one and reformat it until it reads top to bottom.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 25,
        difficulty: "intro",
        topics: [
          {
            title: "Formatting conventions",
            detail:
              "Keywords on their own lines, one column per line past three, consistent case. Arbitrary rules that pay off the moment a query is thirty lines long.",
          },
          {
            title: "ORDER BY and nulls",
            detail:
              "Multiple keys sort in order. NULLS FIRST and NULLS LAST matter because PostgreSQL sorts nulls last ascending — which is not what everybody assumes.",
          },
          {
            title: "LIMIT and OFFSET",
            detail:
              "LIMIT for exploring, and always with ORDER BY — without it the rows returned are whatever the engine produced first and can differ between runs.",
          },
          {
            title: "DISTINCT is a smell",
            detail:
              "Usually it hides a join that duplicated rows. Ask why the duplicates exist before deduplicating them away.",
          },
        ],
        checks: [
          {
            question: "Why is LIMIT without ORDER BY unreliable?",
            answer:
              "Row order is not guaranteed, so the same query can return different rows on different runs.",
          },
          {
            question: "Why avoid SELECT * in a saved query?",
            answer:
              "The result changes when the table changes, it returns columns nobody needs, and it is slower for no benefit.",
          },
          {
            question: "What does DISTINCT often indicate?",
            answer:
              "A join that duplicated rows. The duplicates are usually the real problem rather than something to remove.",
          },
        ],
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
        title: "WHERE and predicates",
        summary:
          "NULL is not a value. It is the absence of one, and it infects every comparison it touches.",
        learningObjectives: [
          "Comparisons; AND, OR, NOT and precedence",
          "IN, BETWEEN, LIKE, ILIKE, wildcards",
          "IS NULL and three-valued logic — why NOT IN with nulls is silently wrong",
          "COALESCE, NULLIF",
        ],
        whyToday:
          "Three-valued logic is the concept that makes SQL behave unlike every other language you know, and NOT IN with a null is the trap that catches people for years. Meet it deliberately today.",
        principle:
          "NULL is not a value; it is the absence of one. Every comparison with it returns unknown, not false — and unknown is not the same as false.",
        commonMistake:
          "Using NOT IN against a subquery that can return a null. The whole predicate becomes unknown and the query returns zero rows, correctly and uselessly, with no error.",
        challenge:
          "Write fifteen filtering queries. Include one NOT IN against a nullable column, look at the empty result, and write down the explanation in your own words. Then fix it with NOT EXISTS.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Three-valued logic",
            detail:
              "True, false, unknown. Anything compared to NULL is unknown, and WHERE keeps only rows that are true — so unknown behaves like false, except when negated.",
          },
          {
            title: "Why NOT IN breaks",
            detail:
              "`x NOT IN (1, 2, NULL)` asks whether x differs from all three. It cannot know it differs from NULL, so the answer is unknown, so no row qualifies.",
          },
          {
            title: "IS NULL",
            detail:
              "The only way to test for null. `= NULL` is always unknown and matches nothing, which is why it fails silently.",
          },
          {
            title: "LIKE and ILIKE",
            detail:
              "ILIKE is case-insensitive and PostgreSQL-specific. A leading wildcard prevents index use, which matters once tables are large.",
          },
          {
            title: "COALESCE and NULLIF",
            detail:
              "COALESCE returns the first non-null argument. NULLIF turns a specific value into null — useful for turning empty strings into real nulls.",
          },
        ],
        checks: [
          {
            question: "Why does NOT IN with a null return no rows?",
            answer:
              "The comparison against NULL evaluates to unknown, so the whole predicate is never true and no row passes the WHERE.",
          },
          {
            question: "Why does `WHERE x = NULL` match nothing?",
            answer:
              "Equality with NULL is unknown rather than true. IS NULL is the only test that works.",
          },
          {
            question: "What does NULLIF do?",
            answer:
              "Returns null when its two arguments are equal — commonly used to turn empty strings into genuine nulls.",
          },
          {
            question:
              "A query using NOT IN with a subquery returns zero rows, but you can see rows that should qualify. What is happening?",
            answer:
              "The subquery returns at least one NULL. `x NOT IN (1, 2, NULL)` asks whether x differs from every element; the comparison against NULL is unknown, so the whole predicate is never true and no row passes. Fix it with NOT EXISTS, or filter the nulls out of the subquery. The tell is that the query returns exactly zero rows rather than too few.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
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
        title: "CASE and conditional logic",
        summary: "CASE is how business rules enter SQL. Write them once, comment them well.",
        learningObjectives: [
          "CASE WHEN, searched and simple forms",
          "CASE inside SELECT for banding and labelling",
          "CASE inside ORDER BY for custom sort orders",
          "Nested CASE — and when to stop",
        ],
        whyToday:
          "Business rules have to live somewhere, and CASE is where they enter SQL. It is also the mechanism behind day 37's pivot, so it earns its place twice.",
        principle:
          "CASE is how business rules enter SQL. Write them once, comment them well, and put the boundary values where somebody can find them.",
        commonMistake:
          "Overlapping or gapped bands. CASE returns the first matching branch, so `WHEN x > 100 ... WHEN x > 50` looks like two tiers and behaves like one — and a gap returns null silently.",
        challenge:
          "Band your customers into five tiers with CASE, then custom-sort them by tier using CASE inside ORDER BY. Deliberately leave a gap in the boundaries and find the rows that fall through it.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Two forms",
            detail:
              "Simple CASE compares one expression to values; searched CASE takes full conditions. Searched is more flexible and the one worth defaulting to.",
          },
          {
            title: "First match wins",
            detail:
              "Branches are evaluated in order. Order boundaries from most to least specific, or an earlier broad branch swallows the later ones.",
          },
          {
            title: "Always ELSE",
            detail:
              "Without it, unmatched rows return null. An explicit ELSE — even ELSE 'unclassified' — makes the gap visible instead of silent.",
          },
          {
            title: "CASE in ORDER BY",
            detail:
              "How you get a custom sort that is not alphabetical — high, medium, low in that order rather than high, low, medium.",
          },
        ],
        checks: [
          {
            question: "Which CASE branch wins when two conditions both match?",
            answer: "The first one written. Evaluation stops at the first true branch.",
          },
          {
            question: "What happens to a row matching no branch and no ELSE?",
            answer:
              "It returns null — silently, which is why an explicit ELSE is worth writing.",
          },
          {
            question: "How do you sort by a custom order like high/medium/low?",
            answer: "Put a CASE expression in ORDER BY mapping each label to a sort position.",
          },
        ],
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
        title: "Review and practice block",
        summary: "Twenty mixed SELECT/WHERE/CASE problems, then clear review cards.",
        learningObjectives: [
          "Twenty mixed problems from SQLZoo or pgexercises",
          "Clear review cards",
        ],
        whyToday:
          "Three days of SELECT, WHERE and CASE need volume to become automatic. Twenty mixed problems is the smallest number that forces recall rather than pattern-matching from the last example.",
        principle:
          "Mixed practice beats blocked practice. Twenty problems of one type teaches the type; twenty mixed problems teaches you to recognise which type you are looking at.",
        commonMistake:
          "Looking at the solution when stuck after thirty seconds. The struggle is the mechanism — take five minutes, write a wrong answer, then look.",
        challenge:
          "Twenty mixed problems from SQLZoo or pgexercises, no more than five minutes each before checking. Then clear your review cards. Note which of the three topics you reached for slowest.",
        challengeMinutes: 50,
        estMinutes: 60,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Mixed, not blocked",
            detail:
              "Shuffle the topics. Knowing the lesson you are on gives away the answer, which is why practising by chapter overstates how much you know.",
          },
          {
            title: "Time-box each one",
            detail:
              "Five minutes, then look. Long enough to struggle productively, short enough that twenty problems fit in an evening.",
          },
          {
            title: "Note the slow one",
            detail:
              "Whichever of SELECT, WHERE or CASE you reached for slowest is next week's revision. Write it down.",
          },
        ],
        checks: [
          {
            question:
              "What does `WHERE status NOT IN (SELECT s FROM t)` return if the subquery yields a null?",
            answer:
              "No rows. The comparison becomes unknown and never true, so nothing passes the filter.",
          },
          {
            question: "How do you produce a custom, non-alphabetical sort order?",
            answer: "A CASE expression inside ORDER BY mapping each value to a position.",
          },
          {
            question: "Why should LIMIT always be paired with ORDER BY?",
            answer:
              "Without an explicit order the rows returned are arbitrary and can change between runs.",
          },
        ],
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
        title: "INNER JOIN",
        summary:
          "Check the row count after every join. A join that multiplies rows is the most common silent bug in analysis.",
        learningObjectives: [
          "The mental model: matching rows on a condition",
          "ON vs WHERE; aliases; qualifying ambiguous columns",
          "Joining on multiple conditions",
          "Row-count sanity before and after",
        ],
        whyToday:
          "Joins are the centre of SQL, and the row-count habit taught today is the one that prevents the most expensive class of silent error in analysis.",
        principle:
          "Check the row count after every join. A join that multiplies rows is the most common silent bug in analysis, and every total downstream inherits it.",
        commonMistake:
          "Assuming the join key is unique because it looks like an id. One duplicate in the joined table doubles those rows, the total rises, and nothing errors.",
        challenge:
          "Write ten inner joins across your three tables. For each, record the row count before and after. Then deliberately introduce a duplicate on the key side and watch the total change without any warning.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The mental model",
            detail:
              "For each row on the left, find rows on the right that satisfy the condition, and emit one output row per match. No match, no output row.",
          },
          {
            title: "ON versus WHERE",
            detail:
              "For an inner join they are equivalent. For an outer join they are not — which is tomorrow's lesson and the reason to put join conditions in ON from the start.",
          },
          {
            title: "Aliases",
            detail:
              "Short, meaningful, and used to qualify every column once more than one table is in play. Ambiguous column errors are the cheapest kind to prevent.",
          },
          {
            title: "The row-count check",
            detail:
              "Count the left table, count the result. Equal means one-to-one or one-to-zero-or-one; larger means fan-out and every aggregate needs rechecking.",
          },
        ],
        checks: [
          {
            question: "What does an inner join do with an unmatched row?",
            answer: "Drops it. Only rows satisfying the condition on both sides appear.",
          },
          {
            question: "When are ON and WHERE equivalent?",
            answer:
              "For inner joins only. For outer joins ON filters before the join and WHERE filters after, which changes the result.",
          },
          {
            question: "What does the result having more rows than the left table tell you?",
            answer:
              "The join key is not unique on the right, so rows fanned out and every downstream aggregate is inflated.",
          },
          {
            question:
              "You join orders to customers and the row count goes up. What went wrong and how do you find it?",
            answer:
              "The customer side is not unique on the join key — duplicates in the dimension table, or the key is not what you assumed. Find it with GROUP BY on the key HAVING COUNT(*) > 1 against the customers table. Until that is resolved every aggregate over the joined result is inflated by the duplication factor, and the numbers will still look plausible.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
        title: "LEFT and RIGHT JOIN",
        summary:
          "A condition in ON filters before joining; in WHERE it filters after. That is not a style choice.",
        learningObjectives: [
          "LEFT JOIN as the default choice in analysis",
          "Nulls an outer join introduces, and handling them",
          "The anti-join pattern: LEFT JOIN … WHERE right.key IS NULL",
          "Customers with no orders three ways: anti-join, NOT IN, NOT EXISTS",
        ],
        whyToday:
          "The anti-join pattern learned today answers a question that comes up constantly — which of these has none of those — and the ON-versus-WHERE distinction becomes load-bearing the moment a join goes outer.",
        principle:
          "A condition in ON filters before joining; in WHERE it filters after. That is not a style choice — on an outer join it silently converts it back to an inner join.",
        commonMistake:
          "Putting a condition on the right table in WHERE after a LEFT JOIN. Unmatched rows have null there, the condition rejects them, and the outer join has quietly become an inner one.",
        challenge:
          "Find customers with no orders three ways: LEFT JOIN with IS NULL, NOT IN, and NOT EXISTS. Confirm all three agree. Then add a null to the key column and find which two stop agreeing.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "LEFT as the default",
            detail:
              "In analysis you usually want to keep everything on the left and see what matched. Starting from LEFT and tightening to INNER is safer than the reverse.",
          },
          {
            title: "The nulls it introduces",
            detail:
              "Unmatched rows carry nulls in every right-hand column. Aggregates skip them, COUNT(right.col) undercounts, and COALESCE is usually needed.",
          },
          {
            title: "The anti-join",
            detail:
              "LEFT JOIN then WHERE the right key IS NULL. The standard way to ask what is missing, and it is index-friendly.",
          },
          {
            title: "Three ways, one answer",
            detail:
              "Anti-join, NOT IN and NOT EXISTS answer the same question. NOT EXISTS is the one that stays correct when nulls are present.",
          },
        ],
        checks: [
          {
            question:
              "What happens if you filter a right-table column in WHERE after a LEFT JOIN?",
            answer:
              "Unmatched rows have null there and fail the condition, so the outer join effectively becomes an inner join.",
          },
          {
            question: "Write the anti-join pattern.",
            answer:
              "LEFT JOIN the second table, then WHERE the right-hand key IS NULL — rows on the left with no match.",
          },
          {
            question: "Which of NOT IN and NOT EXISTS survives nulls?",
            answer: "NOT EXISTS. NOT IN returns no rows when the subquery contains a null.",
          },
          {
            question:
              "What is the difference between putting a condition in ON versus WHERE on a LEFT JOIN?",
            answer:
              "ON filters which rows are eligible to match before the join; WHERE filters the result afterwards. On a LEFT JOIN a condition on the right table in WHERE rejects the unmatched rows, because their right-side columns are NULL — so the outer join silently becomes an inner join. On an INNER JOIN the two are equivalent.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
          {
            question: "Find customers who have never placed an order. Three ways.",
            answer:
              "LEFT JOIN orders and filter WHERE orders.customer_id IS NULL; NOT EXISTS with a correlated subquery; or NOT IN against a subquery of customer ids. The first two are safe. NOT IN breaks if the subquery can return NULL, so NOT EXISTS is the one to reach for by default.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
        ],
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
        title: "FULL OUTER, CROSS, SELF",
        summary: "The only cross join you want is the one you meant.",
        learningObjectives: [
          "FULL OUTER JOIN for reconciliation between two systems",
          "CROSS JOIN deliberately: date spines, all combinations",
          "SELF JOIN: employee/manager, comparing rows within one table",
          "Build a gap-free reporting grid with generate_series × categories",
        ],
        whyToday:
          "Three joins that look exotic and each answer a real recurring question — reconciling two systems, building a gap-free grid, and comparing rows within one table.",
        principle:
          "The only cross join you want is the one you meant. Every accidental one is a missing join condition, and the row count says so immediately.",
        commonMistake:
          "Producing a cross join by forgetting a join condition in an old-style comma-separated FROM. The result is every row against every row, and on two thousand-row tables that is four million.",
        challenge:
          "Build a gap-free reporting grid: generate_series of months cross-joined with your categories, then left-joined to actual data. Every month-category pair appears, with zero where there were no sales.",
        challengeMinutes: 45,
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "FULL OUTER for reconciliation",
            detail:
              "Keeps unmatched rows from both sides, so one query shows what is only in A, only in B, and in both. The standard tool for comparing two systems.",
          },
          {
            title: "CROSS JOIN deliberately",
            detail:
              "Every combination. Legitimate for date spines and for generating a complete grid before filling it — which is exactly today's challenge.",
          },
          {
            title: "SELF JOIN",
            detail:
              "A table joined to itself under two aliases. Employee to manager, this row to the previous one, comparing records within one table.",
          },
          {
            title: "The date spine",
            detail:
              "generate_series produces every period whether or not data exists. Left-joining actual data to the spine is how a chart stops lying by omission.",
          },
        ],
        checks: [
          {
            question: "What is a FULL OUTER JOIN good for?",
            answer: "Reconciliation — one query showing rows only in A, only in B, and in both.",
          },
          {
            question: "Why build a date spine?",
            answer:
              "So periods with no data appear as zero rather than being missing. A time series with absent months is a chart that misleads.",
          },
          {
            question: "What is a self join?",
            answer:
              "A table joined to itself under two aliases, to relate rows within one table — employee to manager, or a row to its predecessor.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "SQL joins",
            url: "https://mode.com/sql-tutorial/sql-joins",
            sourceName: "Mode SQL tutorial",
            editorNote:
              "Re-read the outer-join half before attempting FULL OUTER reconciliation.",
          },
          {
            type: "tool",
            title: "pgexercises — joins",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
          },
        ],
      },
      {
        title: "Multi-table joins",
        summary: "If your total went up after adding a join, you are double-counting.",
        learningObjectives: [
          "Chaining four and five tables; join order and readability",
          "Fan-out: joining one-to-many then aggregating double-counts",
          "Joining to a subquery",
          "Verify a five-table total against a simpler two-table version",
        ],
        whyToday:
          "Real questions need four or five tables, and fan-out — the thing that quietly doubles a total — only appears once more than two are involved.",
        principle:
          "If your total went up after adding a join, you are double-counting. The new table matched more than once per row, and the sum multiplied.",
        commonMistake:
          "Joining a one-to-many table before aggregating. Every parent row repeats once per child, so summing a parent-level column counts it as many times as there are children.",
        challenge:
          "Chain five tables to answer one question, then verify the total against a simpler two-table version of the same question. If they differ, find the fan-out — it will be a join to a table with more than one row per key.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Fan-out",
            detail:
              "Joining one-to-many repeats the one side. Any sum of a one-side column afterwards is multiplied by the number of matches.",
          },
          {
            title: "Aggregate first",
            detail:
              "Roll the many side up to one row per key in a subquery or CTE, then join. The fan-out disappears and the total is right.",
          },
          {
            title: "Verify against something simpler",
            detail:
              "Compute the same total a second, cruder way. Two methods agreeing is the only cheap evidence a five-table query is correct.",
          },
          {
            title: "Readability",
            detail:
              "Join order does not change the result but does change legibility. Start from the table whose grain you want and work outward.",
          },
        ],
        checks: [
          {
            question: "What is fan-out?",
            answer:
              "A one-to-many join repeating the one-side rows, so any subsequent sum of a one-side column is multiplied.",
          },
          {
            question: "How do you avoid it?",
            answer:
              "Aggregate the many side to one row per key first, in a subquery or CTE, then join that.",
          },
          {
            question: "How do you gain confidence in a five-table total?",
            answer: "Compute it a second, simpler way and check the two agree.",
          },
          {
            question:
              "Your revenue total is higher after joining a fifth table than it was with four. Why?",
            answer:
              "Fan-out. The fifth join matched more than one row per existing row, duplicating them, so summing a column from the original grain now counts it multiple times. Fix by aggregating the many side to one row per key in a CTE before joining, and verify by computing the same total from the simpler query.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "tool",
            title: "pgexercises — joins and subqueries",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
            editorNote: "The multi-table questions; verify totals against simpler versions.",
          },
          {
            type: "tool",
            title: "DataLemur — join questions",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
          },
        ],
      },
      {
        title: "Set operations",
        summary:
          "UNION deduplicates and costs a sort. If you do not need it, do not pay for it.",
        learningObjectives: [
          "UNION vs UNION ALL — why UNION ALL is usually what you want",
          "INTERSECT, EXCEPT",
          "Column count and type compatibility rules",
        ],
        whyToday:
          "Stacking two result sets is a different operation from joining them, and choosing UNION when UNION ALL would do is a cost people pay for years without noticing.",
        principle:
          "UNION deduplicates and pays for a sort to do it. If you do not need deduplication, do not pay for it — UNION ALL is what you usually meant.",
        commonMistake:
          "Reaching for UNION by default. On large result sets the deduplication sort dominates the query, and it also silently removes legitimate duplicate rows you wanted counted.",
        challenge:
          "Write the same stacking query with UNION and UNION ALL, compare the row counts, and compare the plans with EXPLAIN. Then use EXCEPT to find what one query returns that the other does not.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "UNION versus UNION ALL",
            detail:
              "UNION removes duplicate rows across the whole result and sorts to do it. UNION ALL concatenates. The second is cheaper and usually correct.",
          },
          {
            title: "INTERSECT and EXCEPT",
            detail:
              "Rows in both, and rows in the first but not the second. EXCEPT is a readable alternative to an anti-join when you are comparing whole result sets.",
          },
          {
            title: "Compatibility rules",
            detail:
              "Same number of columns, compatible types, positional matching. Column names come from the first query, which surprises people.",
          },
          {
            title: "Set ops versus joins",
            detail:
              "Joins combine columns; set operations combine rows. Reaching for the wrong one is usually a sign the question was not stated clearly.",
          },
        ],
        checks: [
          {
            question: "What does UNION do that UNION ALL does not?",
            answer:
              "Removes duplicate rows, which requires a sort over the whole result and costs accordingly.",
          },
          {
            question: "How are columns matched between the two queries?",
            answer:
              "By position, not by name, and the types must be compatible. The result takes its column names from the first query.",
          },
          {
            question: "What does EXCEPT return?",
            answer: "Rows returned by the first query that the second does not return.",
          },
          {
            question: "When would you use UNION ALL rather than UNION?",
            answer:
              "Almost always. UNION deduplicates across the whole result, which requires a sort and is expensive at scale, and it silently removes legitimate duplicate rows. Use UNION only when removing duplicates is the actual intent.",
            kind: "interview",
            difficulty: "easy",
          },
        ],
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
        title: "Join practice block",
        summary:
          "Twenty-five join problems. Keep one query you are proud of and one you found hard, with notes on why.",
        learningObjectives: [
          "Twenty-five join problems from DataLemur, StrataScratch or SQLZoo",
        ],
        whyToday:
          "Five days of join theory needs volume before it becomes reflex. Twenty-five problems is where the pattern recognition starts doing the work instead of the reasoning.",
        principle:
          "Keep the query you found hard, with a note on why. That note is worth more in three months than the query is.",
        commonMistake:
          "Practising only on tidy tutorial schemas. Real joins go wrong because of duplicate keys and nulls, and platform datasets are clean — so check row counts even where you know they are fine.",
        challenge:
          "Twenty-five join problems across DataLemur, StrataScratch or SQLZoo. Keep one query you are proud of and one you found hard, each with two lines on why. Those two go in your portfolio notes.",
        challengeMinutes: 60,
        estMinutes: 70,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "Volume is the point",
            detail:
              "Joins are recognised rather than derived once you have done enough. Twenty-five is roughly where that starts.",
          },
          {
            title: "Keep two",
            detail:
              "One you are proud of, one that beat you. The second is the more useful and the one people skip keeping.",
          },
          {
            title: "Row counts anyway",
            detail:
              "Practice datasets are clean, so the habit has to be deliberate here. It will not be optional on real data.",
          },
        ],
        checks: [
          {
            question: "Which join keeps every row from both sides?",
            answer: "FULL OUTER JOIN, filling nulls where either side has no match.",
          },
          {
            question: "How do you stop a one-to-many join inflating a total?",
            answer: "Aggregate the many side to one row per key before joining it.",
          },
          {
            question: "Which construct reliably answers 'in A but not in B' with nulls present?",
            answer:
              "NOT EXISTS, or a LEFT JOIN with IS NULL. NOT IN breaks when the subquery contains a null.",
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
    title: "SQL — aggregation",
    weekRange: "Weeks 5–6",
    objective:
      "Group, filter groups, pivot with conditional aggregation, and build gap-free time series.",
    nodes: [
      {
        title: "GROUP BY",
        summary:
          "COUNT(*) counts rows. COUNT(column) counts non-nulls. Confusing them changes the answer.",
        learningObjectives: [
          "COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column)",
          "SUM, AVG, MIN, MAX; grouping by multiple columns",
          "Every non-aggregated SELECT column must be in GROUP BY — and why",
          "Grouping by an expression",
        ],
        whyToday:
          "Aggregation is what turns rows into answers, and the COUNT distinction taught today changes numbers people report to executives without ever raising an error.",
        principle:
          "COUNT(*) counts rows. COUNT(column) counts non-nulls. Confusing them changes the answer and nothing warns you.",
        commonMistake:
          "Counting a column from an outer-joined table to count matches. Unmatched rows are null there, so the count is right by accident sometimes and wrong the rest of the time.",
        challenge:
          "On one grouped query, produce COUNT(*), COUNT(a nullable column) and COUNT(DISTINCT that column) side by side. Explain each difference. Then group by an expression rather than a column.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The three counts",
            detail:
              "COUNT(*) counts rows including all-null ones. COUNT(col) skips nulls. COUNT(DISTINCT col) skips nulls and duplicates. Three different numbers from one column.",
          },
          {
            title: "The grouping rule",
            detail:
              "Every non-aggregated column in SELECT must appear in GROUP BY, because the engine has no way to choose which row's value to show for a group.",
          },
          {
            title: "Grouping by an expression",
            detail:
              "GROUP BY date_trunc('month', ordered_at) groups by something not stored. Repeat the expression or reference it by position.",
          },
          {
            title: "Nulls form a group",
            detail:
              "GROUP BY puts all nulls into one group rather than discarding them — the opposite of how the aggregate functions treat them.",
          },
        ],
        checks: [
          {
            question: "How do COUNT(*) and COUNT(column) differ?",
            answer:
              "COUNT(*) counts every row; COUNT(column) counts only rows where that column is not null.",
          },
          {
            question: "Why must non-aggregated select columns appear in GROUP BY?",
            answer:
              "A group has many rows, so the engine cannot pick which row's value to display unless the column defines the group.",
          },
          {
            question: "What does GROUP BY do with nulls?",
            answer:
              "Collects them into a single group, unlike aggregate functions which skip them.",
          },
          {
            question:
              "What is the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column)?",
            answer:
              "COUNT(*) counts rows. COUNT(column) counts rows where that column is not null. COUNT(DISTINCT column) counts distinct non-null values. The distinction matters most after an outer join, where counting a right-side column undercounts because unmatched rows are null there.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
        ],
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
        title: "HAVING and filter order",
        summary: "Learn the logical execution order once and half of SQL's surprises disappear.",
        learningObjectives: [
          "HAVING vs WHERE",
          "Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
          "Why a SELECT alias works in ORDER BY but not WHERE",
        ],
        whyToday:
          "One diagram — the logical execution order — explains a whole family of confusing errors, including why an alias works in one clause and not another. Learn it once today.",
        principle:
          "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. Learn the logical order once and half of SQL's surprises disappear.",
        commonMistake:
          "Putting an aggregate in WHERE. WHERE runs before grouping, so the aggregate does not exist yet — and the error message rarely says that plainly.",
        challenge:
          "Write one query filtering rows before grouping and groups after, in the same statement. Then try to use a SELECT alias in WHERE, watch it fail, and use it in ORDER BY, where it works. Explain both from the order.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The order",
            detail:
              "FROM and joins, then WHERE, then GROUP BY, then HAVING, then SELECT, then ORDER BY, then LIMIT. Logical order, not necessarily execution order.",
          },
          {
            title: "WHERE versus HAVING",
            detail:
              "WHERE filters rows before they are grouped; HAVING filters groups after aggregation. Filtering early is also cheaper.",
          },
          {
            title: "Why aliases behave oddly",
            detail:
              "SELECT runs after WHERE and before ORDER BY. So an alias defined in SELECT is unavailable to WHERE and available to ORDER BY.",
          },
          {
            title: "Filter early",
            detail:
              "Anything that can go in WHERE should. Fewer rows reach the grouping, and the query is faster for free.",
          },
        ],
        checks: [
          {
            question: "State the logical clause order.",
            answer: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.",
          },
          {
            question: "Why can ORDER BY use a SELECT alias when WHERE cannot?",
            answer:
              "SELECT is evaluated after WHERE and before ORDER BY, so the alias does not exist yet for WHERE.",
          },
          {
            question: "Where does a condition on an aggregate belong?",
            answer: "HAVING, because the aggregate does not exist until after grouping.",
          },
          {
            question: "Why can you use a SELECT alias in ORDER BY but not in WHERE?",
            answer:
              "Logical evaluation order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. WHERE runs before SELECT so the alias does not exist yet; ORDER BY runs after, so it does. The same order explains why an aggregate belongs in HAVING rather than WHERE.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
        title: "Conditional aggregation",
        summary: "Conditional aggregation is how you pivot without leaving the database.",
        learningObjectives: [
          "SUM(CASE WHEN … THEN 1 ELSE 0 END) — pivoting inside SQL",
          "FILTER (WHERE …) in PostgreSQL",
          "One row per group, one column per category",
          "Percentage-of-total within a group",
        ],
        whyToday:
          "This is the technique that turns SQL into a reporting tool — one row per group, one column per category, no export to a spreadsheet in between.",
        principle:
          "Conditional aggregation is how you pivot without leaving the database. CASE inside SUM is the whole trick.",
        commonMistake:
          "Writing `COUNT(CASE WHEN x THEN 1 ELSE 0 END)` and getting the total row count. COUNT counts non-nulls and zero is not null — it must be `ELSE NULL`, or use SUM instead.",
        challenge:
          "Produce a table with one row per region and one column per product category, using SUM with CASE. Then rewrite it with PostgreSQL's FILTER clause and decide which you would rather read.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "The pattern",
            detail:
              "SUM(CASE WHEN condition THEN value ELSE 0 END), one per output column. Each column counts or sums only the rows matching its condition.",
          },
          {
            title: "The COUNT trap",
            detail:
              "COUNT ignores nulls, not zeros. `COUNT(CASE WHEN … THEN 1 ELSE 0 END)` counts everything. Use SUM, or make the ELSE branch NULL.",
          },
          {
            title: "FILTER",
            detail:
              "PostgreSQL's `COUNT(*) FILTER (WHERE condition)` says the same thing far more readably. Not portable, and worth it where you are on PostgreSQL.",
          },
          {
            title: "Percentage of total",
            detail:
              "Divide the conditional sum by the unconditional one, and cast to numeric — integer division silently returns zero.",
          },
        ],
        checks: [
          {
            question: "Why does COUNT(CASE WHEN … THEN 1 ELSE 0 END) count every row?",
            answer:
              "COUNT skips nulls, not zeros. The ELSE 0 is a value, so every row counts. Use SUM or ELSE NULL.",
          },
          {
            question: "What is the FILTER clause?",
            answer:
              "PostgreSQL syntax attaching a condition directly to an aggregate — a more readable equivalent of the CASE pattern.",
          },
          {
            question: "What catches people computing a percentage of total?",
            answer:
              "Integer division, which truncates to zero. Cast to numeric before dividing.",
          },
          {
            question:
              "Produce one row per region with a column per product category, without leaving SQL.",
            answer:
              "Conditional aggregation: GROUP BY region, with SUM(CASE WHEN category = 'x' THEN amount ELSE 0 END) as one column per category — or COUNT(*) FILTER (WHERE ...) in PostgreSQL. The trap is COUNT(CASE WHEN ... THEN 1 ELSE 0 END), which counts every row because COUNT skips nulls rather than zeros.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Mode SQL tutorial — CASE",
            url: "https://mode.com/sql-tutorial/sql-case",
            sourceName: "Mode SQL tutorial",
            editorNote:
              "CASE inside SUM is the whole trick; this page plus GROUP BY is the day.",
          },
          {
            type: "doc",
            title: "Aggregate functions tutorial",
            url: "https://www.postgresql.org/docs/current/tutorial-agg.html",
            sourceName: "PostgreSQL documentation",
          },
        ],
      },
      {
        title: "Working with dates in SQL",
        summary: "A time series with missing months is a chart that lies.",
        learningObjectives: [
          "DATE_TRUNC for month/week/quarter grouping",
          "EXTRACT, AGE, INTERVAL arithmetic",
          "Generating a date series; filling gaps",
          "Store UTC, display local",
        ],
        whyToday:
          "Almost every report is a time series, and almost every naive time series is missing its empty periods. Today builds the gap-free version, which is a visibly different chart.",
        principle:
          "A time series with missing months is a chart that lies. Absent periods read as continuity, not as zero.",
        commonMistake:
          "Grouping by month and charting the result. Months with no sales simply do not appear, so the line connects across the gap and the decline is invisible.",
        challenge:
          "Build a gap-free monthly revenue series that includes zero-sale months, using generate_series left-joined to your aggregate. Then chart both versions and look at the difference.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "DATE_TRUNC",
            detail:
              "Rounds a timestamp down to month, week, quarter or day. The standard way to group a time series, and it keeps the result a date.",
          },
          {
            title: "EXTRACT and AGE",
            detail:
              "EXTRACT pulls a part out as a number — useful for grouping by month-of-year across years. AGE gives an interval between two timestamps.",
          },
          {
            title: "Filling gaps",
            detail:
              "generate_series produces every period; LEFT JOIN the aggregate onto it and COALESCE the nulls to zero.",
          },
          {
            title: "Store UTC, display local",
            detail:
              "timestamptz stores an instant. Convert at the edge for display. Storing local times makes any cross-timezone comparison unreliable.",
          },
          {
            title: "Week boundaries",
            detail:
              "DATE_TRUNC('week') starts Monday in PostgreSQL. If the business counts weeks from Sunday, the numbers will disagree with theirs and both will be right.",
          },
        ],
        checks: [
          {
            question: "What does DATE_TRUNC do?",
            answer:
              "Rounds a timestamp down to the start of the given unit — month, week, quarter — returning a date or timestamp.",
          },
          {
            question: "How do you include periods with no data?",
            answer:
              "Generate the full set of periods with generate_series, LEFT JOIN the aggregate, and COALESCE nulls to zero.",
          },
          {
            question: "Why store timestamps in UTC?",
            answer:
              "It stores an unambiguous instant. Local times make comparison across timezones and daylight-saving changes unreliable.",
          },
          {
            question:
              "Your monthly revenue chart skips months with no sales. How do you fix it in SQL?",
            answer:
              "Generate the full set of months with generate_series, LEFT JOIN the aggregated data onto it, and COALESCE the nulls to zero. Grouping alone can only produce months that exist in the data, so absent months read as continuity on the chart rather than as zero.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
        title: "Aggregation practice block",
        summary: "Twenty aggregation problems; at least five using conditional aggregation.",
        learningObjectives: [
          "Twenty aggregation problems, five conditional",
        ],
        whyToday:
          "Aggregation is the most-used SQL skill in an analyst's week. Twenty problems now is what makes it automatic before window functions add another layer on top.",
        principle:
          "Practise the conditional-aggregation pivot deliberately. It is the one pattern people know exists and still cannot write under time pressure.",
        commonMistake:
          "Doing twenty problems that are all GROUP BY with SUM. The five conditional ones are the point — they are the ones that appear in interviews.",
        challenge:
          "Twenty aggregation problems, at least five using conditional aggregation. Write one from memory with no reference open at the end — that is the real test.",
        challengeMinutes: 50,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Five must be conditional",
            detail:
              "The pivot pattern is the differentiator. Straight GROUP BY is comfortable and does not need the practice.",
          },
          {
            title: "Include a HAVING",
            detail:
              "Filtering groups is a separate reflex from filtering rows, and it is the one people forget exists under pressure.",
          },
          {
            title: "One from memory",
            detail:
              "Close everything and write a full grouped query with a conditional column. If it does not come out, the practice was recognition rather than recall.",
          },
        ],
        checks: [
          {
            question: "Which clause filters groups rather than rows?",
            answer: "HAVING, which runs after GROUP BY and can reference aggregates.",
          },
          {
            question: "Write the shape of a conditional aggregation column.",
            answer:
              "SUM(CASE WHEN condition THEN value ELSE 0 END), or COUNT(*) FILTER (WHERE condition) in PostgreSQL.",
          },
          {
            question: "How do you count distinct non-null values in a group?",
            answer: "COUNT(DISTINCT column), which skips both nulls and repeats.",
          },
        ],
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
        title: "Subqueries",
        summary:
          "A correlated subquery runs once per row. Sometimes that is fine. Know when it is not.",
        learningObjectives: [
          "Scalar subqueries; IN, EXISTS, ANY, ALL",
          "Correlated subqueries and their cost",
          "Derived tables — subqueries in FROM",
          "One question three ways: subquery, join, EXISTS — compared with EXPLAIN",
        ],
        whyToday:
          "Subqueries are the first construct where the same answer has three shapes with very different costs. Comparing them under EXPLAIN is how the cost stops being abstract.",
        principle:
          "A correlated subquery runs once per row. Sometimes that is fine. Know when it is not, and know how to tell from the plan.",
        commonMistake:
          "Writing a correlated subquery in the SELECT list over a large table. It executes per row, so a query that is instant on a thousand rows takes minutes on a million and nothing about the SQL looks different.",
        challenge:
          "Answer one question three ways — subquery, join and EXISTS — and compare all three with EXPLAIN. Write down which was fastest and whether you would have guessed it.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Scalar subqueries",
            detail:
              "Return exactly one value, usable anywhere a value is. Returning more than one row is a runtime error rather than a silent problem.",
          },
          {
            title: "Correlated versus uncorrelated",
            detail:
              "An uncorrelated subquery runs once. A correlated one references the outer row and runs per row, which is the cost that surprises people.",
          },
          {
            title: "EXISTS",
            detail:
              "Stops at the first match rather than building a full result. Usually the right choice for 'is there any', and it handles nulls correctly.",
          },
          {
            title: "Derived tables",
            detail:
              "A subquery in FROM, which must be aliased. Fine, and usually clearer as a CTE — which is tomorrow.",
          },
        ],
        checks: [
          {
            question: "What makes a subquery correlated?",
            answer:
              "It references a column from the outer query, so it must be re-evaluated for every outer row.",
          },
          {
            question: "Why prefer EXISTS for an existence check?",
            answer:
              "It short-circuits at the first match and behaves correctly with nulls, unlike IN and NOT IN.",
          },
          {
            question: "What must a subquery in FROM have?",
            answer: "An alias. A derived table cannot be referenced without one.",
          },
          {
            question:
              "A query is instant in development and takes minutes in production with the same code. What would you look at?",
            answer:
              "Data volume interacting with a correlated subquery or a missing index. A correlated subquery executes once per outer row, so it scales linearly with rows while development data hides it. Run EXPLAIN ANALYZE and compare estimated against actual row counts; a large gap points at stale statistics or a bad plan.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
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
        title: "CTEs",
        summary: "A CTE chain is a paragraph. A nested subquery is a run-on sentence.",
        learningObjectives: [
          "WITH clauses; chaining and naming CTEs as steps in an argument",
          "Rewriting a nested mess as a readable chain",
          "Recursive CTEs: org charts, category trees, date generation",
        ],
        whyToday:
          "Every query you write from here can be readable or unreadable, and the CTE is the single largest lever on which. It is also how you will present work to other people.",
        principle:
          "A CTE chain is a paragraph. A nested subquery is a run-on sentence. Name each step after what it produces.",
        commonMistake:
          "Naming CTEs cte1, cte2, temp. The structure is then present and the meaning is not, which is most of the benefit thrown away.",
        challenge:
          "Take your ugliest query so far and rewrite it as a CTE chain somebody else could follow, with every CTE named after what it produces. Then read both aloud — that is the actual test.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "WITH",
            detail:
              "Names a query and uses it below. Several can be chained, each referring to the previous, so the query reads as numbered steps.",
          },
          {
            title: "Naming",
            detail:
              "monthly_revenue, active_customers, ranked_orders. The name should say what the result is, so the final SELECT reads like a sentence.",
          },
          {
            title: "Recursive CTEs",
            detail:
              "WITH RECURSIVE walks a hierarchy — org charts, category trees, generated series. An anchor query plus a step that references the CTE itself.",
          },
          {
            title: "Not always free",
            detail:
              "PostgreSQL may materialise a CTE rather than inlining it. Usually fine; check EXPLAIN if a rewritten query got slower.",
          },
        ],
        checks: [
          {
            question: "What does a CTE give you over a nested subquery?",
            answer:
              "Readability — named steps in order rather than nesting, and the name documents what each step produces.",
          },
          {
            question: "What are the two parts of a recursive CTE?",
            answer:
              "An anchor query producing the starting rows, and a recursive term that references the CTE to produce the next level.",
          },
          {
            question: "Is a CTE always free?",
            answer:
              "No. It may be materialised rather than inlined, which can change the plan. Check EXPLAIN if performance changes.",
          },
          {
            question: "When would you use a CTE rather than a subquery?",
            answer:
              "For readability whenever the query has more than one logical step — each CTE names a step so the query reads top to bottom, and a step can be referenced twice. Recursive traversal of a hierarchy requires one. The caveat is that a CTE may be materialised rather than inlined, so check EXPLAIN if a rewrite changed performance.",
            kind: "interview",
            difficulty: "easy",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "PostgreSQL — WITH queries",
            url: "https://www.postgresql.org/docs/current/queries-with.html",
            sourceName: "PostgreSQL documentation",
            editorNote:
              "Rewrite your ugliest query so far as a chain someone else could follow.",
          },
        ],
      },
      {
        title: "Review",
        summary: "Close the module and the week: redo the hardest problems, clear review cards.",
        learningObjectives: [
          "Review the module's patterns",
          "Clear review cards",
        ],
        whyToday:
          "Six weeks in, and SQL is now the largest thing you know. Today consolidates it before window functions add a genuinely harder layer on top of it.",
        principle:
          "Redo the problems you found hardest, not the ones you enjoyed. Comfort is not where the learning is left.",
        commonMistake:
          "Reviewing by re-reading the queries you wrote. Open a blank editor instead — a query you can read is not a query you can write.",
        challenge:
          "Redo the hardest problems from the last two weeks in a blank editor, no references. Then clear your review cards. Anything you could not produce goes on tomorrow's list, not into the void.",
        challengeMinutes: 40,
        estMinutes: 40,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Blank editor",
            detail:
              "No references, no previous file open. Reading your own correct query feels like knowing it and is not the same thing.",
          },
          {
            title: "The hard ones",
            detail:
              "Multi-table joins with fan-out, conditional aggregation, and NOT EXISTS. Those three are where the errors were.",
          },
          {
            title: "Write down the gaps",
            detail:
              "Anything you could not produce becomes an explicit item, not a vague intention to revisit.",
          },
        ],
        checks: [
          {
            question: "What runs once per outer row?",
            answer:
              "A correlated subquery, because it references the outer row and must be re-evaluated.",
          },
          {
            question: "Where does a filter on an aggregate belong?",
            answer: "HAVING — the aggregate does not exist until after GROUP BY.",
          },
          {
            question: "How do you keep zero-value periods in a monthly series?",
            answer:
              "Generate the periods with generate_series, LEFT JOIN the aggregate and COALESCE to zero.",
          },
        ],
        resources: [],
      },
    ],
  },
];
