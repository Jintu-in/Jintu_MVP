/**
 * Data analyst, modules 12–16 (weeks 8–10, days 53–74): Python from zero,
 * NumPy, pandas cleaning and reshaping, visualisation.
 */
export default [
  {
    title: "Python for people who are not programmers",
    weekRange: "Week 8",
    objective:
      "Write small honest scripts: data structures, control flow, functions, files — and put them in version control.",
    nodes: [
      {
        title: "Day 53 — Setup and the basics",
        summary: "Environment set up, first script computing something real from your dataset's numbers.",
        learningObjectives: [
          "Install Python; VS Code or Jupyter; venv",
          "Variables and types: int, float, str, bool",
          "Arithmetic, string operations, f-strings",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        resources: [
          {
            type: "read",
            title: "Automate the Boring Stuff — chapter 1",
            url: "https://automatetheboringstuff.com/2e/chapter1/",
            sourceName: "Automate the Boring Stuff (Al Sweigart)",
          },
          {
            type: "doc",
            title: "Python in VS Code",
            url: "https://code.visualstudio.com/docs/python/python-tutorial",
            sourceName: "Visual Studio Code docs",
          },
        ],
      },
      {
        title: "Day 54 — Data structures",
        summary: "A list of dicts is the shape most data arrives in.",
        learningObjectives: [
          "Lists: indexing, slicing, methods",
          "Tuples and immutability; dictionaries: keys, values, items, get",
          "Sets and deduplication",
          "Represent ten rows of your dataset as a list of dicts and query it",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        resources: [
          {
            type: "read",
            title: "Automate the Boring Stuff — chapters 4–5",
            url: "https://automatetheboringstuff.com/2e/chapter4/",
            sourceName: "Automate the Boring Stuff (Al Sweigart)",
          },
        ],
      },
      {
        title: "Day 55 — Control flow",
        summary: "If you are writing a triple-nested loop over data, a library already solved it faster.",
        learningObjectives: [
          "if / elif / else; comparison and logical operators",
          "for over lists, dicts, ranges; while",
          "break, continue, enumerate, zip",
          "A grouped total over a list of dicts, without pandas",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        resources: [
          {
                    type: "read",
                    title: "Automate the Boring Stuff — chapter 2, flow control",
                    url: "https://automatetheboringstuff.com/2e/chapter2/",
                    sourceName: "Automate the Boring Stuff (Al Sweigart)"
          }
        ],
      },
      {
        title: "Day 56 — Functions and comprehensions",
        summary: "Refactor yesterday's loops into three functions and two comprehensions.",
        learningObjectives: [
          "def, parameters, defaults, return, scope",
          "Docstrings; type hints briefly",
          "List and dict comprehensions; conditional comprehensions",
          "lambda, where it is genuinely useful",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "read",
                    title: "Automate the Boring Stuff — chapter 3, functions",
                    url: "https://automatetheboringstuff.com/2e/chapter3/",
                    sourceName: "Automate the Boring Stuff (Al Sweigart)"
          }
        ],
      },
      {
        title: "Day 57 — Files, errors and modules",
        summary: "A script that dies on one bad row is a script you will babysit forever.",
        learningObjectives: [
          "open and context managers; csv and json modules",
          "try / except / finally; raising",
          "pip, requirements.txt, pathlib",
          "Read a CSV, survive a malformed row, write a cleaned CSV",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Automate the Boring Stuff — chapters 8–9",
            url: "https://automatetheboringstuff.com/2e/chapter8/",
            sourceName: "Automate the Boring Stuff (Al Sweigart)",
          },
        ],
      },
      {
        title: "Day 58 — Git and GitHub",
        summary: "Your GitHub is your portfolio whether you intended it to be or not.",
        learningObjectives: [
          "init, add, commit, status, log, diff",
          "Branching and merging, lightly",
          "Remotes, push, pull; a README that explains a project",
          ".gitignore — never commit data or credentials",
        ],
        estMinutes: 50,
        points: 25,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "Git and GitHub for Beginners - Crash Course",
            url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
            sourceName: "freeCodeCamp.org",
            youtubeVideoId: "RGOj5yH7evk",
            durationSec: 4140,
            estSizeMb: 520,
            editorNote: "About 69 minutes; ~520 MB on mobile data — wifi material.",
          },
          {
            type: "read",
            title: "About version control",
            url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control",
            sourceName: "Pro Git",
          },
        ],
      },
    ],
  },
  {
    title: "NumPy & vectorised thinking",
    weekRange: "Weeks 8–9",
    objective:
      "Stop looping: arrays, masks and broadcasting, and the habit of vectorising anything numeric.",
    nodes: [
      {
        title: "Day 59 — Arrays",
        summary: "Why arrays beat lists for numbers.",
        learningObjectives: [
          "dtype; creating arrays; shape, reshape, ndim",
          "Indexing, slicing, boolean masking, fancy indexing",
          "Load a numeric column and filter it with a mask",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "NumPy — the absolute basics for beginners",
            url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
            sourceName: "NumPy documentation",
          },
          {
            type: "read",
            title: "Python Data Science Handbook — NumPy",
            url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
            sourceName: "Jake VanderPlas",
            editorNote: "The NumPy chapters; free in full at the author's site.",
          },
        ],
      },
      {
        title: "Day 60 — Vectorised operations",
        summary: "In analysis code, a visible loop over rows is usually a mistake.",
        learningObjectives: [
          "Element-wise arithmetic; broadcasting rules",
          "Aggregations with axis; np.where; np.select",
          "Rewrite a loop as a vectorised operation and time both",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Broadcasting",
                    url: "https://numpy.org/doc/stable/user/basics.broadcasting.html",
                    sourceName: "NumPy documentation",
                    editorNote: "The rules, with diagrams — read before timing your rewrite."
          }
        ],
      },
      {
        title: "Day 61 — Series and DataFrames",
        summary: "Load your dataset with correct types on the first attempt — no post-hoc casting.",
        learningObjectives: [
          "Series vs DataFrame; the index and why it matters",
          "read_csv with dtype, parse_dates, na_values, thousands",
          "head, info, describe, shape, dtypes, memory_usage",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "10 minutes to pandas",
            url: "https://pandas.pydata.org/docs/user_guide/10min.html",
            sourceName: "pandas documentation",
          },
        ],
      },
    ],
  },
  {
    title: "pandas — cleaning",
    weekRange: "Week 9",
    objective:
      "Select without warnings, document every null decision, fix types and strings, and audit before analysing.",
    nodes: [
      {
        title: "Day 62 — Selecting and filtering",
        summary: "Chained assignment is the source of most silent pandas bugs. Use .loc.",
        learningObjectives: [
          "loc vs iloc — label vs position",
          "Boolean masks; & and | and the parentheses rule",
          "query(), isin(), between()",
          "SettingWithCopyWarning: trigger it once, then fix it properly",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Indexing and selecting data",
                    url: "https://pandas.pydata.org/docs/user_guide/indexing.html",
                    sourceName: "pandas documentation",
                    editorNote: "The loc/iloc section and the chained-assignment warning explained by its authors."
          }
        ],
      },
      {
        title: "Day 63 — Missing data",
        summary: "Every null you fill is a decision. Write it down or you will not remember it.",
        learningObjectives: [
          "isna, notna, nulls per column",
          "dropna with how, thresh, subset",
          "fillna: value, ffill, bfill, group means",
          "When imputation is dishonest and flagging is better",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Working with missing data",
                    url: "https://pandas.pydata.org/docs/user_guide/missing_data.html",
                    sourceName: "pandas documentation"
          }
        ],
      },
      {
        title: "Day 64 — Types, strings and duplicates",
        summary: "dayfirst=True exists because the world does not agree on dates. Indian data usually needs it.",
        learningObjectives: [
          "astype; to_numeric with errors; to_datetime with format and dayfirst",
          "Category dtype and the memory it saves",
          ".str accessor: strip, lower, replace, contains, extract",
          "duplicated and drop_duplicates with subset and keep",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Working with text data",
                    url: "https://pandas.pydata.org/docs/user_guide/text.html",
                    sourceName: "pandas documentation",
                    editorNote: "The .str accessor end to end; dates live in to_datetime's own page."
          }
        ],
      },
      {
        title: "Day 65 — Outliers and validation",
        summary: "Domain-impossible values and statistical outliers are different problems.",
        learningObjectives: [
          "describe and quantiles; IQR; z-scores",
          "Cross-field validation: return before purchase, negative quantities",
          "An audit function that returns a dataframe of every problem found",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Statistics (scipy.stats) tutorial",
                    url: "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
                    sourceName: "SciPy documentation",
                    editorNote: "The z-score and describe sections back today's audit function."
          }
        ],
      },
      {
        title: "Day 66 — groupby",
        summary: "transform is the pandas answer to a window function.",
        learningObjectives: [
          "Split-apply-combine as a mental model",
          "agg with one function, several, a dict per column",
          "transform for group values on original rows; filter for whole groups",
          "Recreate three SQL GROUP BY queries and confirm identical numbers",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Python Data Science Handbook — aggregation and grouping",
            url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
            sourceName: "Jake VanderPlas",
          },
        ],
      },
    ],
  },
  {
    title: "pandas — reshaping & joining",
    weekRange: "Weeks 9–10",
    objective:
      "Pivot, melt, merge with validation, resample time series, and turn the first hour on any dataset into a checklist.",
    nodes: [
      {
        title: "Day 67 — Reshaping",
        summary: "Tidy data: each variable a column, each observation a row.",
        learningObjectives: [
          "pivot_table with values, index, columns, aggfunc, margins",
          "melt for wide→long; stack and unstack",
          "Pivot then melt back and confirm you recover the original",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Tidy Data (sections 1–3)",
            url: "https://vita.had.co.nz/papers/tidy-data.pdf",
            sourceName: "Hadley Wickham",
          },
        ],
      },
      {
        title: "Day 68 — Merging",
        summary: "validate='one_to_many' turns a silent fan-out into a loud error. Use it every time.",
        learningObjectives: [
          "merge with how, on, suffixes",
          "indicator=True to see where each row came from",
          "validate= to assert cardinality — the guardrail almost nobody uses",
          "concat for stacking; join on index",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Merge, join, concatenate and compare",
                    url: "https://pandas.pydata.org/docs/user_guide/merging.html",
                    sourceName: "pandas documentation",
                    editorNote: "validate= is documented here and almost nowhere else people read."
          }
        ],
      },
      {
        title: "Day 69 — Time series in pandas",
        summary: "Monthly resample, 3-month rolling average, month-on-month change.",
        learningObjectives: [
          "DatetimeIndex; resample to D/W/M/Q",
          "rolling, expanding, shift for period-over-period",
          "Gaps and reindexing to a full date range",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "Time series / date functionality",
                    url: "https://pandas.pydata.org/docs/user_guide/timeseries.html",
                    sourceName: "pandas documentation",
                    editorNote: "resample and rolling — the two sections today uses."
          }
        ],
      },
      {
        title: "Day 70 — A repeatable EDA workflow",
        summary: "A repeatable first hour on any dataset is worth more than any single clever technique.",
        learningObjectives: [
          "The checklist: shape, types, nulls, duplicates, distributions, correlations, outliers",
          "Written as a reusable function or notebook template",
          "Run it on a brand-new Kaggle dataset you have not seen",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "tool",
            title: "Kaggle Datasets",
            url: "https://www.kaggle.com/datasets",
            sourceName: "Kaggle",
          },
        ],
      },
    ],
  },
  {
    title: "Visualisation in Python",
    weekRange: "Week 10",
    objective:
      "Matplotlib fundamentals, seaborn fluency, and the judgement to pick the chart the data deserves.",
    deliverable:
      "A notebook that loads raw data, cleans it, and produces five charts with a written finding under each.",
    nodes: [
      {
        title: "Day 71 — Matplotlib fundamentals",
        summary: "Recreate one chart from a news article using your own data.",
        learningObjectives: [
          "Figure and axes; the object-oriented interface vs pyplot",
          "Line, bar, scatter, histogram",
          "Labels, titles, legends, ticks, annotation",
          "Subplots; saving at sensible DPI",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "Matplotlib tutorials",
            url: "https://matplotlib.org/stable/tutorials/index.html",
            sourceName: "Matplotlib documentation",
          },
          {
            type: "read",
            title: "Python Data Science Handbook — matplotlib",
            url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
            sourceName: "Jake VanderPlas",
          },
        ],
      },
      {
        title: "Day 72 — Seaborn",
        summary: "Six charts, each answering a different question about your dataset.",
        learningObjectives: [
          "Distribution: histplot, kdeplot, ecdfplot",
          "Categorical: boxplot, violinplot, barplot, countplot",
          "Relational: scatterplot, lineplot with hue/size/style",
          "heatmap for correlations; colour-blind-safe palettes",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "doc",
            title: "Seaborn tutorial",
            url: "https://seaborn.pydata.org/tutorial.html",
            sourceName: "seaborn documentation",
          },
        ],
      },
      {
        title: "Day 73 — Choosing the right chart",
        summary: "The chart's job is the fastest honest path to the point. Nothing else.",
        learningObjectives: [
          "Comparison, trend, distribution, relationship, part-to-whole — a default chart for each",
          "Why pie charts fail past three slices; why dual axes mislead",
          "Truncated axes: the line between emphasis and deception",
          "Improve three of yesterday's charts; one line each on what changed",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "FT Visual Vocabulary",
            url: "https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary",
            sourceName: "Financial Times",
          },
          {
            type: "read",
            title: "Storytelling with Data — blog",
            url: "https://www.storytellingwithdata.com/blog",
            sourceName: "Storytelling with Data",
            editorNote: "Read any two recent posts on decluttering and chart choice.",
          },
        ],
      },
      {
        title: "Day 74 — Review and visual EDA build",
        summary:
          "The deliverable day: raw data in, five charts out, a written finding under each.",
        learningObjectives: [
          "One notebook: load, clean, five charts, five findings",
        ],
        estMinutes: 70,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "doc",
                    title: "Seaborn tutorial",
                    url: "https://seaborn.pydata.org/tutorial.html",
                    sourceName: "seaborn documentation",
                    editorNote: "The gallery is the menu for the five charts the deliverable wants."
          }
        ],
      },
    ],
  },
];
