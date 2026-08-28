/**
 * Data analyst, modules 1–4 (weeks 1–3, days 1–20): orientation,
 * spreadsheets, logic & lookups, Power Query. Day numbers live in titles;
 * module membership follows the owner's module table.
 *
 * Sourcing rule for videos named by channel: the channel URL ships with an
 * editor note saying which video to search for. A specific video id appears
 * ONLY where it was verified via oEmbed with a matching title — never
 * guessed. Video URLs rot faster than anything else.
 */
export default [
  {
    title: "How data work actually works",
    weekRange: "Week 1",
    objective:
      "Say what the job is, where the analyst sits in the toolchain, and read a dataset before touching it.",
    nodes: [
      {
        title: "What a data analyst actually does",
        summary:
          "The job is turning a vague question into an answerable one. The tools are downstream of that.",
        learningObjectives: [
          "The four questions analysts answer: what happened, why, what will happen, what should we do",
          "Analyst vs data scientist vs data engineer vs BI developer in Indian job postings",
          "The shape of a real request: someone asks a vague question, you make it answerable",
          "Read three live analyst job descriptions and note every tool named",
        ],
        whyToday:
          "Ninety days is a long commitment to a job you have only seen described in adverts. Today is for finding out what the work is, so the rest of the roadmap is a decision rather than a drift.",
        principle:
          "The job is turning a vague question into an answerable one. Everything technical is downstream of that translation, and the translation is the part nobody can automate.",
        commonMistake:
          "Learning the tool list from job adverts and treating that as the curriculum. The adverts list what the last analyst used; the skill is knowing which question the tool was for.",
        challenge:
          "Open three live analyst job descriptions in your city. Write down every tool each names, then write the actual business question the role exists to answer. The tool lists will differ wildly and the questions will barely differ at all.",
        challengeMinutes: 30,
        estMinutes: 50,
        points: 25,
        difficulty: "intro",
        topics: [
          {
            title: "The four questions",
            detail:
              "Descriptive (what happened), diagnostic (why), predictive (what will happen), prescriptive (what should we do). Most analyst work is the first two, and pretending otherwise sets up disappointment.",
          },
          {
            title: "Where the boundaries are",
            detail:
              "Data engineers move and model data, analysts answer questions with it, data scientists build models, BI developers build the reporting layer. Indian job titles mix these freely, so read the responsibilities not the title.",
          },
          {
            title: "The shape of a real request",
            detail:
              "'Why are sales down?' is not answerable. 'Which region and product category account for the year-on-year decline in units, last quarter?' is. Getting from the first to the second is the job.",
          },
          {
            title: "The unglamorous majority",
            detail:
              "Most of the week is finding data, checking it, and explaining a number to somebody who does not trust it. The analysis itself is often the shortest part.",
          },
        ],
        checks: [
          {
            question: "What are the four kinds of question analysts answer?",
            answer:
              "Descriptive (what happened), diagnostic (why), predictive (what will happen) and prescriptive (what should we do). Most day-to-day work is the first two.",
          },
          {
            question: "What makes a request answerable?",
            answer:
              "A named metric, a named population and a named time window. 'Why are sales down' has none of the three.",
          },
          {
            question: "Why read responsibilities rather than job titles?",
            answer:
              "Titles are used inconsistently — the same title covers engineering, reporting and analysis at different companies. The responsibility list says what the work actually is.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "How I Would Learn to be a Data Analyst",
            url: "https://www.youtube.com/watch?v=TFFzNjWkhDk",
            sourceName: "Luke Barousse (YouTube)",
            youtubeVideoId: "TFFzNjWkhDk",
            durationSec: 851,
            estSizeMb: 108,
            editorNote:
              "Fourteen minutes on what the job is and the order to learn it in. Watch it before deciding to commit ninety-one days.",
          },
        ],
      },
      {
        title: "The analyst's toolchain and how it fits together",
        summary:
          "You will spend more time on messy inputs than on clever analysis. Plan for that.",
        learningObjectives: [
          "Where data lives: source systems → warehouse → BI layer, and where you sit",
          "Why SQL is the centre of gravity and everything else is optional around it",
          "Spreadsheet vs SQL vs Python vs BI tool — what each is genuinely best at",
          "File formats you will meet: CSV, TSV, XLSX, JSON, Parquet",
        ],
        whyToday:
          "Knowing where each tool sits stops you learning them in a panic later. It also explains the order of this roadmap: spreadsheets, then SQL, then Python, because that is the order of leverage.",
        principle:
          "SQL is the centre of gravity. Everything else is optional around it — you can be employed knowing only SQL and a spreadsheet, and you cannot be employed knowing everything except SQL.",
        commonMistake:
          "Starting with Python because it feels like the serious choice. Most analyst work reaches for SQL and a spreadsheet, and a Python-first learner is often slower at the actual job for the first year.",
        challenge:
          "Draw the path one number takes to reach a dashboard in a company you know: which system creates it, where it lands, who transforms it, who reads it. Mark where an analyst touches it. Most people are surprised how late that is.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "intro",
        topics: [
          {
            title: "The pipeline",
            detail:
              "Source systems produce data, a warehouse stores it, a transformation layer shapes it, a BI tool presents it. Analysts usually sit at the last two stages and inherit whatever the first two produced.",
          },
          {
            title: "What each tool is best at",
            detail:
              "Spreadsheets for small, exploratory and shareable. SQL for anything in a database. Python for repetition, statistics and anything a spreadsheet cannot hold. BI tools for things other people will read weekly.",
          },
          {
            title: "File formats",
            detail:
              "CSV is universal and lossy about types. XLSX carries formatting and formulas. JSON is nested. Parquet is columnar, compressed and typed — increasingly what you will actually be handed.",
          },
          {
            title: "Messy inputs dominate",
            detail:
              "Plan for the cleaning to take longer than the analysis. Weeks 3 and 8 of this roadmap exist because of that, not as filler.",
          },
        ],
        checks: [
          {
            question: "Why is SQL described as the centre of gravity?",
            answer:
              "It is the one tool present in nearly every analyst role. You can be hired knowing SQL and a spreadsheet; you cannot be hired knowing everything except SQL.",
          },
          {
            question: "What does CSV lose that Parquet keeps?",
            answer:
              "Types. Everything in a CSV is text until something guesses; Parquet stores the schema and is columnar and compressed as well.",
          },
          {
            question: "When is a spreadsheet the right tool?",
            answer:
              "Small, exploratory work and anything that has to be handed to a non-technical person. It stops being right at volume or when the work must be repeatable.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "FREE Data Analyst Bootcamp!!",
            url: "https://www.youtube.com/watch?v=rGx1QNdYzvs",
            sourceName: "Alex The Analyst (YouTube)",
            youtubeVideoId: "rGx1QNdYzvs",
            durationSec: 412,
            estSizeMb: 52,
            editorNote:
              "The seven-minute overview of his bootcamp, not the twenty-eight-hour compilation — this is the map, and his channel has the rest sequenced.",
          },
          {
            type: "tool",
            title: "Kaggle Learn course index",
            url: "https://www.kaggle.com/learn",
            sourceName: "Kaggle",
            editorNote: "Note which free courses map to which stage of this roadmap.",
          },
        ],
      },
      {
        title: "Reading a dataset before you touch it",
        summary: "If you cannot say what one row means, you cannot analyse the table.",
        learningObjectives: [
          "Rows, columns, granularity — \"what does one row mean here?\" is always the first question",
          "Data types, and why a number stored as text ruins a SUM silently",
          "Nulls: missing, unknown, not-applicable and zero are four different things",
          "Primary key intuition: what makes a row unique",
        ],
        whyToday:
          "Every analysis error worth worrying about is a misunderstanding of the data, not a mistake in the arithmetic. Building the habit of reading first costs ten minutes and prevents the whole category.",
        principle:
          "If you cannot say what one row means, you cannot analyse the table. Granularity is the first question and it is answered by looking, not by assuming.",
        commonMistake:
          "Summing a column stored as text and getting zero with no error, or summing a column that is already a total and double-counting. Both look like a working formula.",
        challenge:
          "Pick a dataset from Kaggle. Before any analysis, write four lines: what one row means, which column or combination makes it unique, which columns are stored as the wrong type, and what a null means in each column that has them. Keep it — you will want it in week 8.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 40,
        difficulty: "intro",
        topics: [
          {
            title: "Granularity",
            detail:
              "One row is one what? One order, one order line, one customer per day? Aggregates are wrong whenever this is wrong, and the numbers still look plausible.",
          },
          {
            title: "Types that lie",
            detail:
              "A number stored as text sums to zero silently. A date stored as text sorts alphabetically, so 1 April precedes 2 January. Neither raises an error.",
          },
          {
            title: "Four kinds of empty",
            detail:
              "Missing (we do not know), unknown (we asked and they would not say), not-applicable (the question does not apply) and zero (a real measured value). Collapsing them into one loses the distinction that matters.",
          },
          {
            title: "The key",
            detail:
              "What combination of columns is unique per row? If nothing is, either the grain is different from what you think or the table has duplicates.",
          },
        ],
        checks: [
          {
            question: "What is the first question to ask of any table?",
            answer: "What does one row mean — the grain. Every aggregate depends on the answer.",
          },
          {
            question: "Why is a number stored as text dangerous rather than merely annoying?",
            answer:
              "SUM ignores it and returns a plausible smaller number with no error. The failure is silent.",
          },
          {
            question: "Name the four things a blank cell might mean.",
            answer:
              "Missing, unknown, not-applicable, or a genuine zero. They call for different handling and are usually stored identically.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "The Quartz guide to bad data",
            url: "https://github.com/Quartz/bad-data-guide",
            sourceName: "Quartz",
            editorNote: "Sections 1 and 2 today; the rest of it will be useful all year.",
          },
          {
            type: "tool",
            title: "Kaggle Datasets",
            url: "https://www.kaggle.com/datasets",
            sourceName: "Kaggle",
            editorNote:
              "Pick one dataset and describe it: one row means what, which column is the key.",
          },
        ],
      },
    ],
  },
  {
    title: "Spreadsheet foundations",
    weekRange: "Weeks 1–2",
    objective:
      "Navigate without the mouse, aggregate with conditions, clean text with formulas, and handle dates that lie.",
    nodes: [
      {
        title: "Navigation, structure and the habits that compound",
        summary: "Mouse-driven analysis does not scale past a few hundred rows.",
        learningObjectives: [
          "Keyboard navigation: Ctrl+arrows, Ctrl+Shift+arrows, F2, F4",
          "Absolute vs relative references — why F4 is the most-used key in analysis",
          "Named ranges, freeze panes, split windows",
          "Tables (Ctrl+T) and structured references — almost always convert the range",
        ],
        whyToday:
          "The habits set on the first spreadsheet day are the ones you keep for the next three months. Ctrl+arrow and F4 are small, and they compound over every day that follows.",
        principle:
          "Mouse-driven analysis does not scale past a few hundred rows. Every action you can do from the keyboard is one you will still be doing at fifty thousand.",
        commonMistake:
          "Working on a plain range instead of converting to a Table. Formulas then do not extend to new rows, references break when the data grows, and every downstream pivot needs re-pointing.",
        challenge:
          "Take any dataset and do five things without touching the mouse: jump to the last row, select a whole column of data, edit a formula in place, toggle a reference to absolute, and convert the range to a Table. Time yourself, then do it again tomorrow.",
        challengeMinutes: 30,
        estMinutes: 50,
        points: 25,
        difficulty: "intro",
        topics: [
          {
            title: "The four keys",
            detail:
              "Ctrl+arrow jumps to the edge of a block, Ctrl+Shift+arrow selects to it, F2 edits in place, F4 cycles reference absoluteness. These four cover most of what a mouse was doing.",
          },
          {
            title: "Absolute vs relative",
            detail:
              "A1 moves when copied, $A$1 does not, $A1 and A$1 lock one axis. Getting this wrong is the most common cause of a formula that works in one cell and not the next.",
          },
          {
            title: "Tables",
            detail:
              "Ctrl+T. Formulas auto-fill to new rows, references become readable names, and anything built on the table grows with it. Almost always convert.",
          },
          {
            title: "Named ranges and freezing",
            detail:
              "Names make a formula readable to somebody else. Freeze panes keeps the headers visible, which is how you avoid analysing the wrong column.",
          },
        ],
        checks: [
          {
            question: "What does F4 do while editing a formula?",
            answer:
              "Cycles the reference between relative, fully absolute and each half-locked form — A1, $A$1, A$1, $A1.",
          },
          {
            question: "Why convert a range to a Table?",
            answer:
              "Formulas extend to new rows automatically, references become structured names, and everything built on it grows with the data.",
          },
          {
            question: "What does Ctrl+Shift+arrow do?",
            answer:
              "Selects from the current cell to the edge of the contiguous block of data in that direction.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Excel Tables",
            url: "https://exceljet.net/articles/excel-tables",
            sourceName: "ExcelJet",
            editorNote: "Why a table beats a range, in ten minutes.",
          },
          {
            type: "read",
            title: "Excel keyboard shortcuts",
            url: "https://exceljet.net/keyboard-shortcuts",
            sourceName: "ExcelJet",
            editorNote: "Keep open; learn five per day, not fifty at once.",
          },
          {
            type: "video",
            title: "Excel Shortcuts You SHOULD Know!",
            url: "https://www.youtube.com/watch?v=Xe4U_-o_EWw",
            sourceName: "Leila Gharani (YouTube)",
            youtubeVideoId: "Xe4U_-o_EWw",
            durationSec: 527,
            estSizeMb: 67,
            editorNote:
              "Learn five of these today, not fifty. The ExcelJet pages above cover Tables; this covers the keyboard half of the day.",
          },
        ],
      },
      {
        title: "Core formulas and the aggregation family",
        summary:
          "Hardcode a criterion into a formula and you have built something nobody can change.",
        learningObjectives: [
          "SUM, AVERAGE, COUNT, COUNTA, MIN, MAX, MEDIAN — and when AVERAGE misleads",
          "SUMIFS, COUNTIFS, AVERAGEIFS with multiple criteria",
          "Wildcards in criteria; criteria as cell references, not typed literals",
          "ROUND family, and why floating point surprises you",
        ],
        whyToday:
          "Conditional aggregation is the single most-used skill in spreadsheet analysis, and it is the direct ancestor of GROUP BY in week 5. Learning it properly now means SQL feels familiar rather than new.",
        principle:
          "Hardcode a criterion into a formula and you have built something nobody can change. Point the criterion at a cell and the sheet becomes a tool instead of a snapshot.",
        commonMistake:
          "Reporting an average on a skewed distribution. One large order pulls the mean somewhere no actual order sits, and the median would have told the truth in the same number of keystrokes.",
        challenge:
          "Do ten conditional aggregations on a real dataset; at least two must use three criteria at once. Every criterion must reference a cell, not a typed literal — then change the cell and watch the whole sheet respond.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "The counting family",
            detail:
              "COUNT counts numbers, COUNTA counts anything non-empty, COUNTBLANK counts the gaps. Using the wrong one is how row counts quietly disagree.",
          },
          {
            title: "The IFS functions",
            detail:
              "SUMIFS, COUNTIFS and AVERAGEIFS take criteria pairs. The plural forms handle one criterion perfectly well, so there is no reason to learn SUMIF separately.",
          },
          {
            title: "Criteria as references",
            detail:
              "Point at a cell rather than typing \"North\". The formula then documents itself and somebody else can change the question without editing formulas.",
          },
          {
            title: "When AVERAGE misleads",
            detail:
              "Skewed data — order values, salaries, session lengths. The mean sits where nothing is. Report the median alongside it, always.",
          },
          {
            title: "Floating point",
            detail:
              "0.1 + 0.2 is not exactly 0.3 in any spreadsheet or programming language. ROUND at the point of display, never in the middle of a calculation chain.",
          },
        ],
        checks: [
          {
            question: "What is the difference between COUNT and COUNTA?",
            answer:
              "COUNT counts numeric values only; COUNTA counts every non-empty cell including text.",
          },
          {
            question: "Why point a criterion at a cell rather than typing it?",
            answer:
              "The sheet becomes reusable — somebody can change the question without editing formulas, and the criterion is visible rather than buried.",
          },
          {
            question: "When does AVERAGE mislead, and what do you do?",
            answer:
              "On skewed distributions, where the mean sits where no real observation is. Report the median alongside it.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "SUMIFS function",
            url: "https://exceljet.net/functions/sumifs-function",
            sourceName: "ExcelJet",
          },
          {
            type: "read",
            title: "COUNTIFS function",
            url: "https://exceljet.net/functions/countifs-function",
            sourceName: "ExcelJet",
            editorNote: "Do ten conditional aggregations; two must use three criteria at once.",
          },
        ],
      },
      {
        title: "Text functions and cleaning inside a sheet",
        summary:
          "If you cannot re-run your cleaning on next month's file, you have not cleaned anything.",
        learningObjectives: [
          "LEFT, RIGHT, MID, LEN, FIND vs SEARCH, TRIM, CLEAN",
          "TEXTBEFORE, TEXTAFTER, TEXTSPLIT, TEXTJOIN",
          "SUBSTITUTE vs REPLACE; PROPER, UPPER, LOWER",
          "Text-to-columns and Flash Fill — and when each is the wrong tool",
        ],
        whyToday:
          "Real data arrives dirty and the temptation is to fix it by hand. Doing it with formulas today is what makes week 3's Power Query feel like the obvious next step rather than an unnecessary tool.",
        principle:
          "If you cannot re-run your cleaning on next month's file, you have not cleaned anything — you have edited a copy.",
        commonMistake:
          "Fixing values by typing over them. It works, it is invisible, it is unrepeatable, and nobody including you will remember which cells were touched.",
        challenge:
          "Take a messy name or address column and split it into components using formulas only — no manual edits, no Flash Fill. Then paste in a second batch of raw values and confirm your formulas handle them without intervention.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "The extraction set",
            detail:
              "LEFT, RIGHT and MID take positions; LEN measures; FIND and SEARCH locate. FIND is case-sensitive and SEARCH accepts wildcards — that is the whole difference.",
          },
          {
            title: "The modern text functions",
            detail:
              "TEXTBEFORE, TEXTAFTER and TEXTSPLIT do in one step what nested FIND and MID used to. Use them where your version has them.",
          },
          {
            title: "TRIM and CLEAN",
            detail:
              "TRIM removes extra spaces, CLEAN removes non-printing characters. Run both on anything that came out of a PDF or a web page before comparing it to anything.",
          },
          {
            title: "Flash Fill's trap",
            detail:
              "It infers a pattern from your examples and produces static values. Excellent for a one-off, useless for anything that will be refreshed, and it fails silently on rows that break the pattern.",
          },
        ],
        checks: [
          {
            question: "What separates FIND from SEARCH?",
            answer:
              "FIND is case-sensitive and takes no wildcards; SEARCH is case-insensitive and accepts them.",
          },
          {
            question: "Why is Flash Fill the wrong tool for a recurring report?",
            answer:
              "It produces static values from an inferred pattern, so it does not re-run on new data and fails silently on rows that do not match.",
          },
          {
            question: "What do TRIM and CLEAN each remove?",
            answer:
              "TRIM removes leading, trailing and repeated spaces; CLEAN removes non-printing characters.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Text function reference",
            url: "https://exceljet.net/functions",
            sourceName: "ExcelJet",
            editorNote:
              "The text category. Split a messy name column with formulas only — no manual edits.",
          },
        ],
      },
      {
        title: "Review",
        summary:
          "Redo three exercises from days 4–6 from memory, then clear your review cards. No new material on day seven — spaced review is what stops week 3 evaporating by week 9.",
        learningObjectives: [
          "Redo three exercises from this week without notes",
          "Write every function you used this week and what it does, from memory",
        ],
        whyToday:
          "Six days on, one day off. Nothing new today, because the material from days 4 to 6 is at the point where it either consolidates or evaporates — and retrieving it from memory is what decides which.",
        principle:
          "Retrieval beats review. Redoing an exercise from memory builds a durable memory; re-reading your notes builds only the feeling of one.",
        commonMistake:
          "Skipping the review day because it feels like it is not progress. Week 3 evaporating by week 9 is the cost, and it is invisible until you are the person who cannot remember SUMIFS in an interview.",
        challenge:
          "Redo three exercises from days 4 to 6 without notes, then write out every function you used this week and what it does — again from memory. Only after that, check what you missed.",
        challengeMinutes: 30,
        estMinutes: 30,
        points: 15,
        difficulty: "core",
        topics: [
          {
            title: "Retrieve, do not re-read",
            detail:
              "Close the notes first. The effort of recalling is the thing that consolidates; recognising a formula when you see it is not the same as being able to produce it.",
          },
          {
            title: "What to redo",
            detail:
              "Three exercises, from memory, from the week just gone. Pick the ones you found hardest rather than the ones you enjoyed.",
          },
          {
            title: "Write the function list",
            detail:
              "Every function used this week, with what it does, from memory. The gaps in that list are your actual revision plan.",
          },
        ],
        checks: [
          {
            question: "Which three keys do most spreadsheet navigation?",
            answer:
              "Ctrl+arrow to jump to the edge of a block, Ctrl+Shift+arrow to select to it, F2 to edit in place. F4 for reference locking makes four.",
          },
          {
            question: "Which conditional aggregation handles three criteria at once?",
            answer:
              "SUMIFS, COUNTIFS and AVERAGEIFS all take repeated range/criteria pairs — three or more is no different from one.",
          },
          {
            question:
              "Which text functions would you use to split 'Kumar, Anjali' into two columns?",
            answer:
              "TEXTBEFORE and TEXTAFTER on the comma, or FIND to locate it with LEFT and MID either side. TRIM the results.",
          },
        ],
        resources: [],
      },
      {
        title: "Dates, times and the arithmetic that goes wrong",
        summary:
          "A date column with mixed formats is a data quality bug, not a formatting preference.",
        learningObjectives: [
          "Dates as serial numbers — why a date sometimes shows as 45231",
          "TODAY, NOW, DATE, YEAR, MONTH, DAY, WEEKDAY",
          "DATEDIF, EDATE, EOMONTH, WORKDAY, NETWORKDAYS",
          "dd/mm/yyyy vs mm/dd/yyyy — the single most common Indian-dataset trap",
        ],
        whyToday:
          "Dates are where Indian datasets break most often, and the failure is silent — 03/04/2026 is valid in two calendars and means two different days. Today is the day that stops costing you.",
        principle:
          "A date column with mixed formats is a data quality bug, not a formatting preference. Fix the data, never the display.",
        commonMistake:
          "Changing the cell format and believing the date changed. Formatting alters what you see; the underlying serial number is untouched, and a text date is not affected at all.",
        challenge:
          "Build three columns on a real dataset: tenure in months, the month-end for each date, and working days between two dates. Then take a dd/mm column, import it as mm/dd, and find how many rows are silently wrong rather than error-flagged.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Dates are numbers",
            detail:
              "A date is a serial count of days from an epoch; time is the fractional part. That is why a date sometimes displays as 45231 and why date arithmetic works at all.",
          },
          {
            title: "The Indian trap",
            detail:
              "dd/mm/yyyy versus mm/dd/yyyy. Days 1 to 12 parse as valid dates in both readings, so roughly a third of rows convert silently and wrongly — no error anywhere.",
          },
          {
            title: "The working set",
            detail:
              "DATEDIF for elapsed periods, EDATE and EOMONTH for month arithmetic, WORKDAY and NETWORKDAYS for business days with a holiday list.",
          },
          {
            title: "Text that looks like a date",
            detail:
              "Left-aligned by default and immune to date functions. If a date column sorts alphabetically, it is text, and no format change will fix it.",
          },
        ],
        checks: [
          {
            question: "Why does a date sometimes appear as 45231?",
            answer:
              "Dates are stored as a serial number of days from an epoch. 45231 is the unformatted underlying value.",
          },
          {
            question: "Why is the dd/mm versus mm/dd ambiguity so dangerous?",
            answer:
              "Days 1 to 12 are valid under both readings, so those rows convert silently to the wrong date while the rest may error — the corruption is partial and invisible.",
          },
          {
            question: "How can you tell a date column is really text?",
            answer:
              "It left-aligns by default, ignores date functions, and sorts alphabetically rather than chronologically.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Date and time functions",
            url: "https://exceljet.net/functions",
            sourceName: "ExcelJet",
            editorNote:
              "The date & time category. Build tenure-in-months, month-end and working-days columns.",
          },
        ],
      },
      {
        title: "Conditional formatting and visual audit",
        summary: "Use colour to find problems, not to decorate.",
        learningObjectives: [
          "Highlight rules, top/bottom, data bars, colour scales",
          "Custom formula rules — the only ones that scale",
          "Finding duplicates, blanks and outliers visually",
          "Formatting whole rows from one cell's value",
        ],
        whyToday:
          "Scanning ten thousand rows for problems is impossible; making the problems colour themselves is not. This is the fastest data-quality check in the tool.",
        principle:
          "Use colour to find problems, not to decorate. A rule that highlights an anomaly earns its place; a rule that makes the sheet pretty costs performance and attention.",
        commonMistake:
          "Applying dozens of overlapping rules until the sheet is a rainbow. Everything is highlighted, so nothing is, and the file slows noticeably on large ranges.",
        challenge:
          "Write three custom formula rules on a real dataset: one that highlights an entire row from a single cell's value, one that finds duplicates on a two-column key, and one that flags a value outside an expected range. The formula rules are the only ones that scale.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Built-in rules",
            detail:
              "Highlight-cell and top/bottom rules cover the common cases in two clicks. Data bars and colour scales are for seeing distribution at a glance, not for decoration.",
          },
          {
            title: "Custom formula rules",
            detail:
              "The only ones that scale. Write a formula that returns TRUE for the top-left cell of the range and let relative references do the rest.",
          },
          {
            title: "Whole-row formatting",
            detail:
              "Lock the column with a $ and leave the row relative — $D2 rather than D2. Getting that wrong is why the highlight lands on one cell instead of the row.",
          },
          {
            title: "Finding the problems",
            detail:
              "Duplicates on a key, blanks in a required column, values outside a plausible range, dates in the future. Four rules that catch most real data faults.",
          },
        ],
        checks: [
          {
            question: "What makes a custom formula rule scale where built-in rules do not?",
            answer:
              "It can express any condition, including ones spanning several columns, and one rule covers the whole range through relative references.",
          },
          {
            question: "How do you format an entire row from one column's value?",
            answer:
              "Lock the column in the rule's formula and leave the row relative — $D2 rather than D2 — with the rule applied to the full row range.",
          },
          {
            question: "What is the cost of too many rules?",
            answer:
              "Recalculation slows on large ranges, and visually everything highlighted means nothing stands out.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Chandoo — Excel dashboards and formatting",
            url: "https://chandoo.org/wp/",
            sourceName: "Chandoo",
            editorNote: "Search the site for conditional formatting with formulas.",
          },
        ],
      },
      {
        title: "Sorting, filtering and data validation",
        summary: "Stop bad data at entry and you will not clean it later.",
        learningObjectives: [
          "Multi-level sort; custom sort orders",
          "AutoFilter, filter by colour, advanced filter",
          "Data validation: lists, ranges, dates, custom formulas",
          "Dependent dropdowns",
        ],
        whyToday:
          "The three tools that separate a sheet somebody else can use from one only you can. Validation in particular is the only thing on this list that prevents bad data rather than finding it.",
        principle:
          "Stop bad data at entry and you will not clean it later. Validation is the cheapest data-quality control that exists.",
        commonMistake:
          "Sorting one column without extending the selection. The column reorders and every other column stays put, so every row is now a different record — and there is no error and often no undo left by the time it is noticed.",
        challenge:
          "Build an entry form with three validated fields, one of which depends on another — pick a state, and the city list narrows. Then try to type an invalid value into each and confirm it is refused.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The sorting hazard",
            detail:
              "Sorting a single column detaches it from its row. Always sort the whole table — another reason day 4 said to convert to a Table, which makes this impossible.",
          },
          {
            title: "Filtering",
            detail:
              "AutoFilter for the common case, filter by colour to pair with yesterday's rules, and Advanced Filter when the criteria live in a range.",
          },
          {
            title: "Validation types",
            detail:
              "List, whole number, decimal, date, text length, and custom formula. The custom formula case covers everything the others cannot express.",
          },
          {
            title: "Dependent dropdowns",
            detail:
              "The second list's source is an INDIRECT or FILTER over the first choice. Fiddly to build once and immediately obvious to whoever uses the sheet.",
          },
          {
            title: "Validation is not a lock",
            detail:
              "It blocks typing, not pasting. A pasted value bypasses it silently, so validation reduces bad data rather than eliminating it.",
          },
        ],
        checks: [
          {
            question: "What happens if you sort one column of a range?",
            answer:
              "That column reorders while the others stay, so every row becomes a mixture of different records. There is no error.",
          },
          {
            question: "What does data validation not stop?",
            answer:
              "Pasted values. It intercepts typed entry only, so invalid data can still arrive by paste.",
          },
          {
            question: "How is a dependent dropdown built?",
            answer:
              "The second list's source is a formula — INDIRECT or FILTER — that narrows based on the first field's selection.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Apply data validation to cells",
            url:
              "https://support.microsoft.com/en-us/office/apply-data-validation-to-cells-29fecbcc-d1b9-42c1-9d76-eff3ce5f7249",
            sourceName: "Microsoft Support",
            editorNote:
              "Build an entry form with three validated fields, one dependent on another.",
          },
        ],
      },
    ],
  },
  {
    title: "Spreadsheet logic & lookups",
    weekRange: "Week 2",
    objective:
      "Encode business rules with logical functions, look anything up without fear, and let dynamic arrays do the reporting.",
    nodes: [
      {
        title: "Logical functions",
        summary: "IFERROR that hides a real problem is worse than the error.",
        learningObjectives: [
          "IF, nested IF, and the point where nesting becomes unreadable",
          "IFS, SWITCH, AND, OR, NOT",
          "IFERROR, IFNA, ISBLANK, ISNUMBER — error handling that reveals rather than hides",
          "Boolean arithmetic: multiplying TRUE/FALSE instead of nesting",
        ],
        whyToday:
          "Business rules — tiers, bands, eligibility — are logic, and encoding them badly is how a sheet becomes unmaintainable. Today is about writing the rule so somebody else can change it.",
        principle:
          "IFERROR that hides a real problem is worse than the error. Handle the error you expected; let the one you did not expect show itself.",
        commonMistake:
          "Wrapping a whole formula in IFERROR to make a sheet look clean. A genuine lookup failure, a typo in a range and a division by zero all now return the same blank, and the sheet reports confidently wrong numbers.",
        challenge:
          "Build a five-tier banding two ways: nested IF, and a lookup table with approximate match. Then hand both to somebody and ask them to add a sixth tier. The one they can do without help is the one to keep.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Where nesting breaks",
            detail:
              "About three levels. Past that, IFS or SWITCH reads better, and a lookup table reads better still because the rule becomes data anybody can edit.",
          },
          {
            title: "IFS and SWITCH",
            detail:
              "IFS takes condition/result pairs in order and returns the first match. SWITCH compares one expression against exact values. Neither nests.",
          },
          {
            title: "Targeted error handling",
            detail:
              "IFNA catches only 'not found', which is usually the error you actually expected from a lookup. IFERROR catches everything including your own mistakes.",
          },
          {
            title: "Boolean arithmetic",
            detail:
              "TRUE is 1 and FALSE is 0, so multiplying conditions is an AND and adding them is an OR. Compact, and worth knowing when reading somebody else's array formula.",
          },
        ],
        checks: [
          {
            question: "Why is IFERROR often the wrong choice?",
            answer:
              "It catches every error including bugs in your own formula, so real problems return the same blank as expected ones. IFNA is usually what was meant.",
          },
          {
            question: "At what point should nested IFs become something else?",
            answer:
              "About three levels. Beyond that use IFS or SWITCH, or better, move the rule into a lookup table.",
          },
          {
            question: "What does multiplying two conditions do?",
            answer:
              "Acts as an AND — TRUE is 1 and FALSE is 0, so the product is 1 only when both hold.",
          },
        ],
        resources: [
          {
            type: "video",
            title:
              "Excel IF Formula: Simple to Advanced (multiple criteria, nested IF, AND, OR functions)",
            url: "https://www.youtube.com/watch?v=KkTaQ5OjAGc",
            sourceName: "Leila Gharani (YouTube)",
            youtubeVideoId: "KkTaQ5OjAGc",
            durationSec: 923,
            estSizeMb: 117,
            editorNote:
              "Build the five-tier banding both ways as she goes, then pick the one you would hand to somebody else.",
          },
        ],
      },
      {
        title: "Lookups",
        summary: "If you are nesting VLOOKUPs you have outgrown VLOOKUP.",
        learningObjectives: [
          "VLOOKUP exact vs approximate — why the fourth argument ruins careers",
          "INDEX/MATCH and left-lookups; two-way lookup",
          "XLOOKUP: if_not_found, match modes, search modes",
          "Approximate match for banding: tax slabs, discount tiers",
        ],
        whyToday:
          "Joining two tables is the most common real task in analysis, and the spreadsheet version is the direct ancestor of week 6's SQL joins. Doing it fluently here makes joins feel like a rename.",
        principle:
          "If you are nesting VLOOKUPs you have outgrown VLOOKUP. INDEX/MATCH or XLOOKUP does the same job without the fragility.",
        commonMistake:
          "Leaving VLOOKUP's fourth argument off. It defaults to approximate match, which on unsorted data returns a confidently wrong value from a nearby row rather than an error.",
        challenge:
          "Do ten lookups against a second table. Then deliberately break one with the wrong match mode, look at the result, and confirm it is a plausible wrong answer rather than an error. That is what makes the default dangerous.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "VLOOKUP's three faults",
            detail:
              "It cannot look left, it breaks when a column is inserted, and its fourth argument defaults to approximate. Know it because you will read it, not because you should write it.",
          },
          {
            title: "INDEX/MATCH",
            detail:
              "INDEX returns from a range by position, MATCH finds the position. Works in any direction, survives column insertion, and is available in every version.",
          },
          {
            title: "XLOOKUP",
            detail:
              "One function, an if_not_found argument built in, exact match by default, and it searches in either direction. The right default where the version supports it.",
          },
          {
            title: "Approximate match, used deliberately",
            detail:
              "Genuinely the right tool for banding — tax slabs, discount tiers, grade boundaries — against a sorted table. That is the case the default was designed for.",
          },
        ],
        checks: [
          {
            question: "What does VLOOKUP's fourth argument default to, and why does it matter?",
            answer:
              "Approximate match. On unsorted data it returns a value from a nearby row rather than an error, so the mistake is silent.",
          },
          {
            question: "What can INDEX/MATCH do that VLOOKUP cannot?",
            answer:
              "Look to the left of the key, and survive a column being inserted in the middle of the table.",
          },
          {
            question: "When is approximate match the right choice?",
            answer:
              "Banding against a sorted table of boundaries — tax slabs, discount tiers, grades.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "XLOOKUP function",
            url: "https://exceljet.net/functions/xlookup-function",
            sourceName: "ExcelJet",
            editorNote:
              "Ten lookups against a second table; break one deliberately with the wrong match mode and fix it.",
          },
        ],
      },
      {
        title: "Dynamic arrays",
        summary: "A formula that replaces a manual monthly step pays for itself forever.",
        learningObjectives: [
          "Spill behaviour and the # operator",
          "FILTER, SORT, SORTBY, UNIQUE, SEQUENCE",
          "Combining FILTER with SORT and UNIQUE for live mini-reports",
          "LET for readability; LAMBDA if your version has it",
        ],
        whyToday:
          "This is where a spreadsheet stops being a grid of values and becomes something closer to a query. FILTER and UNIQUE are SQL's WHERE and DISTINCT, three weeks early.",
        principle:
          "A formula that replaces a manual monthly step pays for itself forever. The manual step will otherwise be done wrong at least once.",
        commonMistake:
          "Writing a spill formula into a range that already has something below it. The whole thing returns #SPILL! and the cause — one stray value three rows down — is invisible until you look.",
        challenge:
          "Build a one-formula summary: unique categories, sorted by total value, filtered to this year. Then add a row to the source data and watch it update with nothing else touched.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Spilling",
            detail:
              "One formula returns a whole range. Reference the whole result with the # operator, so downstream formulas grow with it automatically.",
          },
          {
            title: "The core five",
            detail:
              "FILTER selects rows, UNIQUE deduplicates, SORT and SORTBY order, SEQUENCE generates. Nested, they replace most manual report assembly.",
          },
          {
            title: "LET",
            detail:
              "Names intermediate results inside a formula. Turns an unreadable nest into something with steps, and it evaluates each name once so it is often faster too.",
          },
          {
            title: "#SPILL!",
            detail:
              "Something is blocking the output range. Usually one leftover value, often invisible because it is a space rather than text.",
          },
        ],
        checks: [
          {
            question: "What does the # operator do?",
            answer:
              "References the entire spilled range from a dynamic-array formula, so downstream formulas resize with it.",
          },
          {
            question: "What causes #SPILL!?",
            answer:
              "Something occupies a cell in the range the formula needs to fill — often a stray space.",
          },
          {
            question: "What does LET give you?",
            answer:
              "Named intermediate values inside one formula, making it readable and evaluating each name once rather than repeatedly.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "Excel Dynamic Arrays (How they will change EVERYTHING!)",
            url: "https://www.youtube.com/watch?v=2USJsIyIzvo",
            sourceName: "Leila Gharani (YouTube)",
            youtubeVideoId: "2USJsIyIzvo",
            durationSec: 421,
            estSizeMb: 53,
            editorNote:
              "Spill behaviour and the # operator in seven minutes. Then build the one-formula summary: unique categories sorted by total value.",
          },
        ],
      },
      {
        title: "Review and first mini-build",
        summary:
          "Build a one-page summary sheet: five conditional aggregations, one lookup table, one dynamic-array list. Then clear review cards.",
        learningObjectives: [
          "One-page summary sheet of your dataset",
          "Five conditional aggregations, one lookup table, one dynamic-array list",
        ],
        whyToday:
          "The week's material only counts if it assembles into something. A one-page summary sheet is the smallest artefact that requires all of it at once.",
        principle:
          "Build something small that uses everything. A build finds the gaps that re-reading hides, and it finds them in twenty minutes.",
        commonMistake:
          "Making the build too large. A dashboard with fifteen views does not get finished; a one-page summary does, and it exercises exactly the same skills.",
        challenge:
          "One page: five conditional aggregations, one lookup against a second table, one dynamic-array list. Every criterion pointing at a cell. Then clear your review cards.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "One page, three techniques",
            detail:
              "Conditional aggregation, a lookup, and a spilled list. If all three work together on real data, the week landed.",
          },
          {
            title: "Make it parameterised",
            detail:
              "Criteria in cells at the top, everything below responding. That is the difference between a summary and a tool.",
          },
          {
            title: "Then review",
            detail:
              "Clear the cards after the build, not before. The build shows you which cards you actually need.",
          },
        ],
        checks: [
          {
            question: "Which function returns only the distinct values in a range?",
            answer: "UNIQUE, which spills the deduplicated list.",
          },
          {
            question: "Which lookup handles a not-found case without wrapping in IFNA?",
            answer: "XLOOKUP, via its built-in if_not_found argument.",
          },
          {
            question: "Why should criteria live in cells rather than in the formulas?",
            answer:
              "The sheet becomes reusable and self-documenting — the question can change without anybody editing a formula.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "Power Query & the ETL mindset",
    weekRange: "Week 3",
    objective:
      "Record cleaning as a replayable recipe: import anything, reshape it, merge it, and refresh next month with one click.",
    deliverable:
      "An Excel file where replacing the source data updates every number with one refresh.",
    nodes: [
      {
        title: "Why ETL exists",
        summary: "If a cleaning step is not in a query, it will be forgotten next month.",
        learningObjectives: [
          "Extract, transform, load — and why doing it by hand is the mistake this module cures",
          "Query steps as a recorded, replayable recipe",
          "The Applied Steps pane; renaming steps so future-you can read them",
          "Refresh: swap the source file, everything re-runs",
        ],
        whyToday:
          "Last week's cleaning was formulas in a sheet, which works until the file is replaced. Today reframes cleaning as a recorded recipe, which is the idea the entire rest of the data world is built on.",
        principle:
          "If a cleaning step is not in a query, it will be forgotten next month. Recording it is the difference between a process and a memory.",
        commonMistake:
          "Leaving the Applied Steps named 'Changed Type1', 'Removed Columns2'. Six months later nobody including you can tell what the pipeline does or which step to change.",
        challenge:
          "Take a cleaning job you did with formulas last week and redo it as query steps. Rename every step to say what it does in words. Then swap in a different source file and watch it re-run.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Extract, transform, load",
            detail:
              "Get the data, shape it, put it somewhere useful. The same three stages whether the tool is Power Query, Python or a warehouse pipeline.",
          },
          {
            title: "Steps are the recipe",
            detail:
              "Every click is recorded as a step and replayed in order on refresh. The query is the documentation, provided the steps are named.",
          },
          {
            title: "Naming steps",
            detail:
              "'Split customer name on comma' beats 'Split Column by Delimiter'. Future-you reading the pane is the entire audience.",
          },
          {
            title: "Refresh",
            detail:
              "Point at a new file, hit refresh, everything re-runs. This is the payoff and the reason the manual approach is a false economy.",
          },
        ],
        checks: [
          {
            question: "What do the three letters of ETL stand for?",
            answer:
              "Extract, transform, load — get the data, shape it, deliver it somewhere useful.",
          },
          {
            question: "What makes a query self-documenting?",
            answer:
              "Renamed Applied Steps that say what each does in words. The default names describe the button pressed, not the intent.",
          },
          {
            question: "Why is cleaning in formulas weaker than cleaning in a query?",
            answer:
              "Formulas live in the copy of the file. A query re-runs on whatever source you point it at.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "What is Power Query?",
            url: "https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query",
            sourceName: "Microsoft Learn",
          },
          {
            type: "video",
            title: "Power Query for Beginners: Clean, Fold & Load Fast",
            url: "https://www.youtube.com/watch?v=Hq7KhCR4K_0",
            sourceName: "Guy in a Cube (YouTube)",
            youtubeVideoId: "Hq7KhCR4K_0",
            durationSec: 918,
            estSizeMb: 116,
            editorNote:
              "Fifteen minutes covering the Applied Steps pane and refresh — the two ideas the whole module rests on.",
          },
        ],
      },
      {
        title: "Importing from everywhere",
        summary: "Any report you rebuild monthly should be a folder query.",
        learningObjectives: [
          "From CSV, Excel, folder, web page, JSON",
          "Combining a folder of monthly files into one table — the highest-value trick in the tool",
          "Handling changing headers and extra columns between files",
        ],
        whyToday:
          "The folder query is the highest-value single trick in this tool. Any report rebuilt monthly by opening twelve files becomes one refresh, permanently.",
        principle:
          "Any report you rebuild monthly should be a folder query. Drop next month's file in the folder and the report is already updated.",
        commonMistake:
          "Assuming every file in the folder has identical columns. One month's export gains a column, the combine step silently produces nulls or errors, and the total is wrong rather than missing.",
        challenge:
          "Make three same-shaped CSVs, load the folder, and combine them into one table. Then add a fourth with an extra column and a renamed header, and work out what your query does about it.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Sources",
            detail:
              "CSV, Excel, folder, web page, JSON, database. The folder connector is the one that changes how you work.",
          },
          {
            title: "How combine works",
            detail:
              "It builds a sample query from the first file and applies it to every other. Which is why file two differing from file one is the failure mode.",
          },
          {
            title: "Changing headers",
            detail:
              "Promote headers before combining, and consider a step that selects columns by name rather than position so an added column is ignored rather than fatal.",
          },
          {
            title: "Keep the filename",
            detail:
              "The combine step can carry the source filename as a column. Free provenance, and the fastest way to trace one bad row back to one bad file.",
          },
        ],
        checks: [
          {
            question: "How does the folder combine step handle the files?",
            answer:
              "It derives a transformation from a sample file and applies it to every file in the folder.",
          },
          {
            question: "What breaks a folder query?",
            answer:
              "Files whose shape differs — an added, removed or renamed column relative to the sample.",
          },
          {
            question: "Why keep the source filename as a column?",
            answer:
              "Provenance. It lets you trace any row back to the file it came from, which is how you find one bad export among twelve.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "The Power Query user interface",
            url: "https://learn.microsoft.com/en-us/power-query/power-query-ui",
            sourceName: "Microsoft Learn",
            editorNote: "Make three same-shaped CSVs, load the folder, combine into one table.",
          },
        ],
      },
      {
        title: "Transformations",
        summary:
          "\"Change type with locale\" solves more Indian data problems than any other single button.",
        learningObjectives: [
          "Change type — and change type WITH LOCALE, the fix for Indian dates",
          "Split column by delimiter, characters, position",
          "Replace values, fill down/up, trim, clean, remove duplicates",
          "Add column: from examples, custom, conditional, index",
        ],
        whyToday:
          "This is the day the Indian-date problem gets solved properly. 'Change type with locale' is one menu item and it fixes more real datasets than anything else in the tool.",
        principle:
          "Change type WITH LOCALE, not just change type. Telling the parser which calendar the text was written in is the difference between correct dates and silently swapped ones.",
        commonMistake:
          "Using plain 'Change Type' on a dd/mm date column. It parses with the machine's locale, so days 1 to 12 swap silently and days 13 to 31 error — a partially corrupted column that looks mostly fine.",
        challenge:
          "Clean one deliberately messy CSV end to end using only query steps: types with locale, a split, a fill down, trimmed text and a conditional column. No manual edits anywhere.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Change type with locale",
            detail:
              "Specifies which convention the source text uses. The single most useful command in the tool for anybody working with Indian or European data.",
          },
          {
            title: "Splitting",
            detail:
              "By delimiter, by character count, by position, and by transition from digit to letter. The last one solves surprisingly many real columns.",
          },
          {
            title: "Fill down",
            detail:
              "For the merged-cell exports where a category appears once and then blanks. One click, and it is the step people otherwise do by hand for an hour.",
          },
          {
            title: "Add column from examples",
            detail:
              "Type what you want for two rows and it infers the transformation — but read the M code it generated before trusting it.",
          },
        ],
        checks: [
          {
            question: "What does 'with locale' add to a type change?",
            answer:
              "It tells the parser which regional convention the source text uses, so dd/mm is read as dd/mm regardless of the machine's settings.",
          },
          {
            question: "What is fill down for?",
            answer:
              "Exports where a value appears once at the top of a group and the rest are blank — it propagates the value down the group.",
          },
          {
            question: "What should you do after using 'column from examples'?",
            answer:
              "Read the generated M code. The inference is a guess from two rows and may not generalise.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Power Query documentation",
            url: "https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query",
            sourceName: "Microsoft Learn",
            editorNote: "Clean one deliberately messy CSV end to end using only query steps.",
          },
        ],
      },
      {
        title: "Reshaping",
        summary: "Most spreadsheets are wide for humans; almost all analysis wants long.",
        learningObjectives: [
          "Unpivot — turning a wide monthly report into a tidy long table",
          "Pivot column, and when it is right",
          "Group by: sum, count, min, max, all rows",
          "Transpose; promote and demote headers",
        ],
        whyToday:
          "Nearly every spreadsheet you are handed is wide because humans read it that way, and nearly every analysis needs it long. Unpivot is the one-click bridge and it is not obvious.",
        principle:
          "Most spreadsheets are wide for humans; almost all analysis wants long. One row per observation is the shape everything downstream expects.",
        commonMistake:
          "Unpivoting by selecting the month columns. Next month adds a column and it is not in the selection, so it is silently left behind. Select the key columns and use 'unpivot other columns' instead.",
        challenge:
          "Unpivot a wide sales-by-month table into tidy form. Then add a thirteenth month column to the source, refresh, and confirm your query picked it up. If it did not, you selected the wrong way round.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Wide versus long",
            detail:
              "Wide has a column per period; long has one row per observation with the period as a value. Long is what pivots, charts and SQL all want.",
          },
          {
            title: "Unpivot other columns",
            detail:
              "Select the columns to keep, then unpivot the rest. Future columns are then included automatically — the version that survives next month.",
          },
          {
            title: "Group by",
            detail:
              "Sum, count, min, max, and 'all rows' which keeps the underlying table nested for later expansion. The direct ancestor of SQL's GROUP BY.",
          },
          {
            title: "Headers",
            detail:
              "Promote and demote headers. Reports with two header rows need a demote, a merge and a promote — fiddly, and the reason the source should be fixed upstream.",
          },
        ],
        checks: [
          {
            question: "Why unpivot 'other columns' rather than selecting the value columns?",
            answer:
              "New columns added later are then included automatically. Selecting the value columns silently excludes anything added afterwards.",
          },
          {
            question: "What does long format mean?",
            answer:
              "One row per observation, with what was a column heading now a value in a column — the shape pivots, charts and SQL expect.",
          },
          {
            question: "What does 'all rows' give you in a Group By?",
            answer:
              "The underlying rows of each group kept as a nested table, expandable later rather than aggregated away.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "To Pivot or Unpivot? That is the question!",
            url: "https://www.youtube.com/watch?v=li0c6R6UpCw",
            sourceName: "Guy in a Cube (YouTube)",
            youtubeVideoId: "li0c6R6UpCw",
            durationSec: 378,
            estSizeMb: 48,
            editorNote:
              "Six minutes, and it covers both directions. Unpivot a wide sales-by-month table into tidy form straight afterwards.",
          },
        ],
      },
      {
        title: "Merging and appending",
        summary: "Check the row count after every merge. If it grew, your key is not unique.",
        learningObjectives: [
          "Merge queries: inner, left/right/full outer, anti joins",
          "Anti join as \"what is in A but not B\" — the quiet workhorse",
          "Append for stacking the same shape",
          "Expanding merged columns without exploding row counts",
        ],
        whyToday:
          "This is the join, three weeks before SQL calls it that. Learning the six join kinds visually here means week 6 is about syntax rather than concepts.",
        principle:
          "Check the row count after every merge. If it grew, your key is not unique — and every total downstream is now inflated.",
        commonMistake:
          "Expanding a merged column without noticing the row count changed. One-to-many becomes duplication, every sum is multiplied, and the numbers stay plausible.",
        challenge:
          "Merge two tables and record the row count before and after. Then deliberately merge on a non-unique key and record it again. Finally use an anti join to list what is in A and missing from B.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The six kinds",
            detail:
              "Inner, left outer, right outer, full outer, left anti, right anti. The two anti joins are the ones no spreadsheet formula does well.",
          },
          {
            title: "Anti join",
            detail:
              "What is in A but not B. Reconciliation, missing-record hunts and 'which customers never ordered' are all this one operation.",
          },
          {
            title: "Merge versus append",
            detail:
              "Merge adds columns by matching a key; append stacks rows of the same shape. Different problems, and the names are easy to swap.",
          },
          {
            title: "The row-count check",
            detail:
              "Count before, count after. Growth means duplication on the key side, and it is the single most common silent error in this tool.",
          },
        ],
        checks: [
          {
            question: "What does an anti join return?",
            answer:
              "Rows in the first table with no match in the second — 'what is in A but not B'.",
          },
          {
            question: "What is the difference between merge and append?",
            answer:
              "Merge adds columns by matching on a key; append stacks rows from tables of the same shape.",
          },
          {
            question: "What does a row count increasing after a merge tell you?",
            answer:
              "The key is not unique on the joined side, so rows have been duplicated and every downstream aggregate is inflated.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Merge queries overview",
            url: "https://learn.microsoft.com/en-us/power-query/merge-queries-overview",
            sourceName: "Microsoft Learn",
            editorNote: "All six join kinds, including the anti joins this day is really about.",
          },
        ],
      },
      {
        title: "Build day: the auto-refreshing report",
        summary:
          "One pipeline: import a folder → clean types → unpivot → merge a lookup → group → load to a pivot. Swap in a new month's file and every number updates with one refresh.",
        learningObjectives: [
          "A single Power Query pipeline end to end",
          "Prove the refresh: replace the source file, confirm every number updates",
        ],
        whyToday:
          "Everything in the module assembles into one pipeline today. The refresh test at the end is the proof — if swapping the source file updates every number, the week worked.",
        principle:
          "The deliverable is the refresh, not the report. A report you can rebuild in one click is a different kind of object from one you rebuilt by hand.",
        commonMistake:
          "Doing one step manually in the middle 'just this once'. The pipeline then produces the right answer today and the wrong one on every refresh after, with nothing to indicate which.",
        challenge:
          "One pipeline: import a folder, clean types with locale, unpivot, merge a lookup, group, load to a pivot. Then replace the source file with a new month's data and confirm every number updates. If any did not, find the manual step.",
        challengeMinutes: 80,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The full chain",
            detail:
              "Folder import, type changes with locale, unpivot, merge, group by, load. Six stages, each one a day from this module.",
          },
          {
            title: "Load destination",
            detail:
              "Load to a table or straight to a pivot. Loading the cleaned query and building the pivot on it keeps the two concerns separate.",
          },
          {
            title: "Prove the refresh",
            detail:
              "Swap the source and check every number moved. Any number that did not is downstream of something you did by hand.",
          },
          {
            title: "Keep it",
            detail:
              "This file is the first portfolio artefact in the roadmap. A one-click refreshing report is a concrete thing to show somebody.",
          },
        ],
        checks: [
          {
            question: "What is the actual test that the pipeline works?",
            answer:
              "Replacing the source file and confirming every number updates on refresh. A correct number today proves nothing.",
          },
          {
            question: "Why keep the cleaning query separate from the pivot?",
            answer:
              "The cleaning is reusable and testable on its own, and the presentation can change without touching the transformation.",
          },
          {
            question: "What does a number that fails to update indicate?",
            answer: "There is a manual step upstream of it that the refresh does not re-run.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "The Power Query user interface",
            url: "https://learn.microsoft.com/en-us/power-query/power-query-ui",
            sourceName: "Microsoft Learn",
            editorNote:
              "Keep open while assembling the pipeline; every pane you need is named here.",
          },
        ],
      },
    ],
  },
];
