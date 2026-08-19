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
        estMinutes: 50,
        points: 25,
        difficulty: "intro",
        resources: [
          {
            type: "video",
            title: "Luke Barousse — data analyst channel",
            url: "https://www.youtube.com/@LukeBarousse",
            sourceName: "Luke Barousse (YouTube)",
            editorNote:
              "Search the channel for his current day-in-the-life and analyst-roadmap videos — pick the newest.",
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
        estMinutes: 45,
        points: 25,
        difficulty: "intro",
        resources: [
          {
            type: "video",
            title: "Alex The Analyst — Data Analyst Bootcamp",
            url: "https://www.youtube.com/@AlexTheAnalyst",
            sourceName: "Alex The Analyst (YouTube)",
            editorNote: "The opening videos of his Data Analyst Bootcamp playlist.",
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
        estMinutes: 55,
        points: 40,
        difficulty: "intro",
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
            editorNote: "Pick one dataset and describe it: one row means what, which column is the key.",
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
        estMinutes: 50,
        points: 25,
        difficulty: "intro",
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
            title: "Leila Gharani — Excel channel",
            url: "https://www.youtube.com/@LeilaGharani",
            sourceName: "Leila Gharani (YouTube)",
            editorNote: "Search the channel for her shortcuts and Excel Tables videos.",
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
        estMinutes: 60,
        points: 30,
        difficulty: "intro",
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
        estMinutes: 60,
        points: 30,
        difficulty: "intro",
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
        estMinutes: 30,
        points: 15,
        difficulty: "core",
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
        estMinutes: 55,
        points: 30,
        difficulty: "core",
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
        estMinutes: 45,
        points: 25,
        difficulty: "core",
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
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "Apply data validation to cells",
            url: "https://support.microsoft.com/en-us/office/apply-data-validation-to-cells-29fecbcc-d1b9-42c1-9d76-eff3ce5f7249",
            sourceName: "Microsoft Support",
            editorNote: "Build an entry form with three validated fields, one dependent on another.",
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
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "Leila Gharani — IFS and nested-IF alternatives",
            url: "https://www.youtube.com/@LeilaGharani",
            sourceName: "Leila Gharani (YouTube)",
            editorNote: "Search the channel; build the five-tier banding both ways and pick one to hand over.",
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
        estMinutes: 65,
        points: 35,
        difficulty: "core",
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
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "Leila Gharani — dynamic arrays and LET",
            url: "https://www.youtube.com/@LeilaGharani",
            sourceName: "Leila Gharani (YouTube)",
            editorNote:
              "Search the channel. Build a one-formula summary: unique categories sorted by total value.",
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
        estMinutes: 60,
        points: 25,
        difficulty: "core",
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
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "What is Power Query?",
            url: "https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query",
            sourceName: "Microsoft Learn",
          },
          {
            type: "video",
            title: "Guy in a Cube — Power Query introductions",
            url: "https://www.youtube.com/@GuyInACube",
            sourceName: "Guy in a Cube (YouTube)",
            editorNote: "Search the channel for their Power Query intro — pick the current one.",
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
        estMinutes: 55,
        points: 30,
        difficulty: "core",
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
        estMinutes: 60,
        points: 30,
        difficulty: "core",
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
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "Guy in a Cube — unpivot",
            url: "https://www.youtube.com/@GuyInACube",
            sourceName: "Guy in a Cube (YouTube)",
            editorNote: "Search the channel for unpivot. Unpivot a wide sales-by-month table into tidy form.",
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
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Merge queries overview",
                    url: "https://learn.microsoft.com/en-us/power-query/merge-queries-overview",
                    sourceName: "Microsoft Learn",
                    editorNote: "All six join kinds, including the anti joins this day is really about."
          }
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
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        resources: [
          {
                    type: "doc",
                    title: "The Power Query user interface",
                    url: "https://learn.microsoft.com/en-us/power-query/power-query-ui",
                    sourceName: "Microsoft Learn",
                    editorNote: "Keep open while assembling the pipeline; every pane you need is named here."
          }
        ],
      },
    ],
  },
];
