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
        title: "Setup and the basics",
        summary:
          "Environment set up, first script computing something real from your dataset's numbers.",
        learningObjectives: [
          "Install Python; VS Code or Jupyter; venv",
          "Variables and types: int, float, str, bool",
          "Arithmetic, string operations, f-strings",
        ],
        whyToday:
          "Python's setup is the second place people quit, after PostgreSQL. Getting a virtual environment right today prevents a month of confusing import errors that feel like your fault.",
        principle:
          "One virtual environment per project. Installing globally works until two projects want different versions, and then nothing works and the cause is invisible.",
        commonMistake:
          "Skipping the venv because it seems like ceremony. Six weeks later a pip install upgrades a package a different script depended on, and both are now broken with no record of what changed.",
        challenge:
          "Set up a venv, install one package, and write a script that computes something real from your own dataset's numbers — not a tutorial's. Then deactivate, reactivate, and confirm the package is still there.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "The venv",
            detail:
              "A per-project directory holding that project's packages. Activate it before installing anything, and record what you installed in requirements.txt.",
          },
          {
            title: "The four types",
            detail:
              "int, float, str, bool. Python infers them, which is convenient and means a number read from a file is a string until you convert it.",
          },
          {
            title: "f-strings",
            detail:
              "f\"total: {value:,.2f}\" formats inline. The format spec after the colon handles thousands separators and decimal places without a helper.",
          },
          {
            title: "Notebook or script",
            detail:
              "Notebooks for exploring, scripts for anything that will be re-run. Notebook state is invisible and out-of-order execution produces results nobody can reproduce.",
          },
        ],
        checks: [
          {
            question: "Why use a virtual environment?",
            answer:
              "It isolates a project's package versions, so installing for one project cannot break another.",
          },
          {
            question: "When is a notebook the wrong tool?",
            answer:
              "For anything re-run or shared. Hidden state and out-of-order execution make results hard to reproduce.",
          },
          {
            question: "What does the part after the colon in an f-string do?",
            answer:
              "Formats the value — thousands separators, decimal places, alignment — without a separate formatting call.",
          },
        ],
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
        title: "Data structures",
        summary: "A list of dicts is the shape most data arrives in.",
        learningObjectives: [
          "Lists: indexing, slicing, methods",
          "Tuples and immutability; dictionaries: keys, values, items, get",
          "Sets and deduplication",
          "Represent ten rows of your dataset as a list of dicts and query it",
        ],
        whyToday:
          "A list of dicts is what a CSV, a JSON API response and a database cursor all look like in Python. Recognising that one shape makes the next three weeks easier.",
        principle:
          "A list of dicts is the shape most data arrives in. Learn to walk it before reaching for a library that hides it.",
        commonMistake:
          "Using `d[key]` on data that might not have the key. It raises and kills the script on row 40,000; `d.get(key, default)` returns the default and keeps going.",
        challenge:
          "Represent ten rows of your dataset as a list of dicts and answer three questions about it with plain loops: a filtered count, a grouped total, and the distinct values of one field.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "Lists",
            detail:
              "Ordered, mutable, indexed from zero. Slicing with [a:b] excludes b, which is the off-by-one everybody meets once.",
          },
          {
            title: "Dicts",
            detail:
              "Key to value. .get() with a default is the safe accessor; .items() is how you loop over both at once.",
          },
          {
            title: "Tuples",
            detail:
              "Immutable, so usable as dict keys. Useful for a composite key — (region, month) — which is exactly a GROUP BY on two columns.",
          },
          {
            title: "Sets",
            detail:
              "Unordered, unique, and membership testing is fast. Deduplication and 'is this in that' are both one line.",
          },
        ],
        checks: [
          {
            question: "Why prefer d.get(key, default) over d[key]?",
            answer:
              "A missing key raises with d[key] and stops the script. .get returns the default instead.",
          },
          {
            question: "Why can a tuple be a dict key when a list cannot?",
            answer:
              "Tuples are immutable and therefore hashable; lists can change, so their hash would not be stable.",
          },
          {
            question: "What is a set good for here?",
            answer:
              "Deduplication and fast membership tests — the Python equivalent of DISTINCT and IN.",
          },
        ],
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
        title: "Control flow",
        summary:
          "If you are writing a triple-nested loop over data, a library already solved it faster.",
        learningObjectives: [
          "if / elif / else; comparison and logical operators",
          "for over lists, dicts, ranges; while",
          "break, continue, enumerate, zip",
          "A grouped total over a list of dicts, without pandas",
        ],
        whyToday:
          "You need loops to understand what pandas does for you, and you need to know when to stop writing them. Both halves land today.",
        principle:
          "If you are writing a triple-nested loop over data, a library already solved it faster. Write the loop once to understand it, then stop.",
        commonMistake:
          "Modifying a list while looping over it. Elements get skipped silently because the index advances past items that shifted down — no error, wrong answer.",
        challenge:
          "Compute a grouped total over a list of dicts using only loops and a dict — no pandas. Then look at how much code it took. That is the code pandas replaces in week 9.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "Looping properly",
            detail:
              "for over the collection itself, not over range(len(x)). enumerate when you need the index, zip when you need two collections in step.",
          },
          {
            title: "The accumulator pattern",
            detail:
              "An empty dict, one pass, adding to totals[key]. This is GROUP BY written out, and seeing it once makes groupby obvious.",
          },
          {
            title: "break and continue",
            detail:
              "break leaves the loop, continue skips to the next iteration. Both are fine; deeply nested ones are the smell.",
          },
          {
            title: "Do not mutate while iterating",
            detail:
              "Removing items during a loop skips elements. Build a new list instead — usually a comprehension, which is tomorrow.",
          },
        ],
        checks: [
          {
            question: "What goes wrong when you remove items from a list you are looping over?",
            answer:
              "Items get skipped, because the index advances while the remaining elements shift down. No error is raised.",
          },
          {
            question: "What does enumerate give you?",
            answer: "The index alongside each element, so you do not loop over range(len(x)).",
          },
          {
            question: "Describe the accumulator pattern.",
            answer:
              "Start with an empty dict, loop once, add each row's value to the entry for its key. It is GROUP BY written by hand.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Automate the Boring Stuff — chapter 2, flow control",
            url: "https://automatetheboringstuff.com/2e/chapter2/",
            sourceName: "Automate the Boring Stuff (Al Sweigart)",
          },
        ],
      },
      {
        title: "Functions and comprehensions",
        summary: "Refactor yesterday's loops into three functions and two comprehensions.",
        learningObjectives: [
          "def, parameters, defaults, return, scope",
          "Docstrings; type hints briefly",
          "List and dict comprehensions; conditional comprehensions",
          "lambda, where it is genuinely useful",
        ],
        whyToday:
          "Yesterday's loops work and cannot be reused. Today turns them into named things you can test and call twice, which is the difference between a script and a tool.",
        principle:
          "A function that does one thing and returns a value can be tested. A function that prints and modifies globals cannot.",
        commonMistake:
          "Using a mutable default argument — `def f(rows=[])`. The list is created once at definition and shared between every call, so state leaks between invocations in a way that looks impossible.",
        challenge:
          "Refactor yesterday's loops into three functions and two comprehensions. Every function must return something and print nothing. Then call one of them twice and confirm the second call is unaffected by the first.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Return, do not print",
            detail:
              "A function that returns can be composed, tested and reused. One that prints can only be watched.",
          },
          {
            title: "The mutable default trap",
            detail:
              "Default arguments are evaluated once at definition. A list or dict default is shared across calls. Use None and create inside.",
          },
          {
            title: "Comprehensions",
            detail:
              "[f(x) for x in xs if cond] replaces the build-a-list loop. Readable up to one condition and one transform; past that, write the loop.",
          },
          {
            title: "Docstrings and hints",
            detail:
              "One line saying what it returns. Type hints are optional and pay off most on the functions somebody else will call.",
          },
        ],
        checks: [
          {
            question: "Why is `def f(rows=[])` dangerous?",
            answer:
              "The default list is created once at definition and shared across all calls, so mutations persist between them.",
          },
          {
            question: "Why should a function return rather than print?",
            answer:
              "A returned value can be composed, tested and reused. Printing can only be observed.",
          },
          {
            question: "When is a comprehension the wrong choice?",
            answer:
              "Once it needs more than one condition or a nested loop — at that point a plain loop is more readable.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Automate the Boring Stuff — chapter 3, functions",
            url: "https://automatetheboringstuff.com/2e/chapter3/",
            sourceName: "Automate the Boring Stuff (Al Sweigart)",
          },
        ],
      },
      {
        title: "Files, errors and modules",
        summary: "A script that dies on one bad row is a script you will babysit forever.",
        learningObjectives: [
          "open and context managers; csv and json modules",
          "try / except / finally; raising",
          "pip, requirements.txt, pathlib",
          "Read a CSV, survive a malformed row, write a cleaned CSV",
        ],
        whyToday:
          "Real files have bad rows. A script that stops on the first one is a script you supervise; a script that logs it and continues is one you can schedule.",
        principle:
          "A script that dies on one bad row is a script you will babysit forever. Catch the row, record it, keep going.",
        commonMistake:
          "A bare `except:` that swallows everything. It catches your typos and interrupts alongside the malformed row, so a broken script reports success.",
        challenge:
          "Read a CSV containing at least one deliberately malformed row, survive it, log which row failed and why, and write a cleaned CSV. The log matters as much as the output.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Context managers",
            detail:
              "`with open(...) as f` closes the file even on an exception. There is no reason to open a file any other way.",
          },
          {
            title: "Catch narrowly",
            detail:
              "`except ValueError` catches the parse failure you expected. A bare except also catches your own bugs and hides them.",
          },
          {
            title: "Log the skipped rows",
            detail:
              "A row silently dropped is data loss. Record the row number and the reason, and report a count at the end.",
          },
          {
            title: "requirements.txt",
            detail:
              "`pip freeze > requirements.txt` records the environment so somebody else can recreate it. Commit it; never commit the venv.",
          },
          {
            title: "pathlib",
            detail:
              "Path objects rather than string concatenation. Works on Windows and Linux without thinking about slashes.",
          },
        ],
        checks: [
          {
            question: "What is wrong with a bare except?",
            answer:
              "It catches everything, including your own bugs and keyboard interrupts, so failures are hidden and the script reports success.",
          },
          {
            question: "Why use `with open(...)`?",
            answer: "The file is closed even if an exception is raised inside the block.",
          },
          {
            question: "What must accompany a skipped bad row?",
            answer:
              "A log entry with the row and the reason, plus a count at the end. Silent dropping is undetected data loss.",
          },
        ],
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
        title: "Git and GitHub",
        summary: "Your GitHub is your portfolio whether you intended it to be or not.",
        learningObjectives: [
          "init, add, commit, status, log, diff",
          "Branching and merging, lightly",
          "Remotes, push, pull; a README that explains a project",
          ".gitignore — never commit data or credentials",
        ],
        whyToday:
          "From today every artefact in this roadmap can be version-controlled and shown. That matters more than it sounds: your GitHub is what a recruiter opens first.",
        principle:
          "Your GitHub is your portfolio whether you intended it to be or not. Commit accordingly.",
        commonMistake:
          "Committing the data file and the credentials. Both are permanent — a later deletion does not remove them from history, and a leaked key must be rotated rather than deleted.",
        challenge:
          "Put one of your earlier artefacts under version control with a .gitignore that excludes data and secrets, a README explaining what it does, and at least three commits with messages a stranger could follow.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The core loop",
            detail:
              "status, add, commit, push. Check status before and after every step until it is automatic.",
          },
          {
            title: ".gitignore first",
            detail:
              "Write it before the first commit. Anything committed once stays in history even after deletion.",
          },
          {
            title: "Commit messages",
            detail:
              "Say what changed and why. 'update' tells nobody anything, including you in March.",
          },
          {
            title: "The README is the portfolio",
            detail:
              "What the project does, how to run it, what you found. Most repository visitors read only this.",
          },
          {
            title: "Secrets are permanent",
            detail:
              "A committed key must be rotated, not deleted. Removing it from the current files does not remove it from history.",
          },
        ],
        checks: [
          {
            question: "Why must .gitignore come before the first commit?",
            answer: "Anything committed once remains in history even if deleted later.",
          },
          {
            question: "What do you do about a credential you accidentally committed?",
            answer:
              "Rotate it. Deleting the file does not remove it from the repository's history.",
          },
          {
            question: "What should a project README contain?",
            answer:
              "What the project does, how to run it, and what you found. It is what most visitors read instead of the code.",
          },
        ],
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
        title: "Arrays",
        summary: "Why arrays beat lists for numbers.",
        learningObjectives: [
          "dtype; creating arrays; shape, reshape, ndim",
          "Indexing, slicing, boolean masking, fancy indexing",
          "Load a numeric column and filter it with a mask",
        ],
        whyToday:
          "pandas is built on NumPy, and the things that confuse people about pandas — dtypes, masks, broadcasting — are NumPy behaviours. Three days here makes three weeks easier.",
        principle:
          "An array has one dtype for every element. That constraint is what makes it fast and what makes a stray string turn a numeric column into objects.",
        commonMistake:
          "Not checking dtype after loading. One non-numeric value forces the whole array to object, arithmetic silently becomes slow Python, and nothing announces it.",
        challenge:
          "Load a numeric column into an array, check its dtype, filter it with a boolean mask, and confirm the mask itself is an array of booleans rather than a list. Then introduce one bad value and watch the dtype change.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "One dtype",
            detail:
              "Every element the same type, stored contiguously. That is where the speed comes from, and why a mixed column falls back to object.",
          },
          {
            title: "Shape and reshape",
            detail:
              "shape is a tuple of dimensions. reshape rearranges without copying where it can — and -1 means 'work this one out'.",
          },
          {
            title: "Boolean masking",
            detail:
              "`arr[arr > 10]` — the comparison produces an array of booleans and indexing with it selects. This is exactly a WHERE clause.",
          },
          {
            title: "Views versus copies",
            detail:
              "Slicing returns a view sharing memory; fancy indexing returns a copy. Modifying a view changes the original, which surprises people once.",
          },
        ],
        checks: [
          {
            question: "What forces an array to object dtype?",
            answer:
              "Any element that does not fit the common numeric type — typically one stray string. Arithmetic then falls back to slow Python.",
          },
          {
            question: "What does a boolean mask do?",
            answer:
              "A comparison produces an array of booleans; indexing with it selects the rows where it is true — the equivalent of WHERE.",
          },
          {
            question: "What is the difference between a slice and fancy indexing?",
            answer:
              "A slice is a view sharing memory with the original; fancy indexing returns a copy.",
          },
        ],
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
        title: "Vectorised operations",
        summary: "In analysis code, a visible loop over rows is usually a mistake.",
        learningObjectives: [
          "Element-wise arithmetic; broadcasting rules",
          "Aggregations with axis; np.where; np.select",
          "Rewrite a loop as a vectorised operation and time both",
        ],
        whyToday:
          "The habit formed today — reach for an array operation before a loop — is what separates analysis code that runs in a second from the same code that runs in four minutes.",
        principle:
          "In analysis code, a visible loop over rows is usually a mistake. The vectorised version is shorter and often a hundred times faster.",
        commonMistake:
          "Assuming broadcasting will do what you meant. Shapes that happen to be compatible produce a valid result of the wrong shape, and the error surfaces three steps later as a size mismatch.",
        challenge:
          "Rewrite one of your loops as a vectorised operation and time both on at least a hundred thousand rows. Write the two numbers down — the ratio is more persuasive than any explanation.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Element-wise by default",
            detail:
              "Arithmetic between arrays applies element by element. No loop, and the work happens in compiled code.",
          },
          {
            title: "Broadcasting rules",
            detail:
              "Dimensions are compared from the right; each must match or be 1. A (3,1) and a (1,4) produce a (3,4), which is either exactly what you wanted or a bug.",
          },
          {
            title: "axis",
            detail:
              "axis=0 collapses rows, axis=1 collapses columns. Getting it backwards is the most common NumPy error and produces a plausible wrong shape.",
          },
          {
            title: "np.where and np.select",
            detail:
              "Vectorised if/else and vectorised CASE. Directly what day 27 did in SQL, and the honest replacement for a conditional loop.",
          },
        ],
        checks: [
          {
            question: "State the broadcasting rule.",
            answer:
              "Compare shapes from the right; each dimension must be equal or one of them must be 1.",
          },
          {
            question: "What does axis=0 mean for an aggregation?",
            answer: "It collapses down the rows, producing one value per column.",
          },
          {
            question: "What is np.select the equivalent of?",
            answer:
              "A SQL CASE expression — several conditions, each with a result, applied vectorised.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Broadcasting",
            url: "https://numpy.org/doc/stable/user/basics.broadcasting.html",
            sourceName: "NumPy documentation",
            editorNote: "The rules, with diagrams — read before timing your rewrite.",
          },
        ],
      },
      {
        title: "Series and DataFrames",
        summary:
          "Load your dataset with correct types on the first attempt — no post-hoc casting.",
        learningObjectives: [
          "Series vs DataFrame; the index and why it matters",
          "read_csv with dtype, parse_dates, na_values, thousands",
          "head, info, describe, shape, dtypes, memory_usage",
        ],
        whyToday:
          "Loading data correctly on the first attempt saves the whole cleaning module from being about undoing a bad load. read_csv's arguments are the highest-value thing in pandas.",
        principle:
          "Load your dataset with correct types on the first attempt. Post-hoc casting works less often than people assume, and never for a date already parsed wrongly.",
        commonMistake:
          "Letting read_csv infer everything. Indian numbers with thousands separators become strings, dd/mm dates become the wrong day, and 'NA' becomes text rather than null.",
        challenge:
          "Load your dataset with explicit dtype, parse_dates, na_values and thousands arguments so that info() shows the right type for every column on the first read. No astype afterwards.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Series and DataFrame",
            detail:
              "A Series is one column plus an index. A DataFrame is a dict of Series sharing one index. Most confusion comes from forgetting the index exists.",
          },
          {
            title: "The index matters",
            detail:
              "Operations align on it. Two Series with different indexes produce nulls where they do not overlap — a silent behaviour with no equivalent in SQL.",
          },
          {
            title: "read_csv properly",
            detail:
              "dtype for known types, parse_dates with dayfirst, na_values for the sentinel strings, thousands for separators. Four arguments that prevent most cleaning.",
          },
          {
            title: "The first four calls",
            detail:
              "shape, info, describe, head. In that order, every time. info is the one that shows you the types were wrong.",
          },
        ],
        checks: [
          {
            question: "What is the relationship between a Series and a DataFrame?",
            answer:
              "A DataFrame is a collection of Series sharing a single index; a Series is one column plus that index.",
          },
          {
            question: "What happens when you combine two Series with different indexes?",
            answer:
              "They align on the index and produce nulls where the indexes do not overlap — silently.",
          },
          {
            question: "Which read_csv arguments prevent most later cleaning?",
            answer: "dtype, parse_dates (with dayfirst), na_values and thousands.",
          },
        ],
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
        title: "Selecting and filtering",
        summary: "Chained assignment is the source of most silent pandas bugs. Use .loc.",
        learningObjectives: [
          "loc vs iloc — label vs position",
          "Boolean masks; & and | and the parentheses rule",
          "query(), isin(), between()",
          "SettingWithCopyWarning: trigger it once, then fix it properly",
        ],
        whyToday:
          "SettingWithCopyWarning is the single most-ignored warning in data work, and ignoring it means edits that silently do nothing. Meet it deliberately today rather than at 11pm in week 12.",
        principle:
          "Chained assignment is the source of most silent pandas bugs. Use .loc for anything that writes.",
        commonMistake:
          "`df[df.x > 0]['y'] = 1`. The first bracket may return a copy, so the assignment lands on the copy and the original is unchanged — with only a warning, which people learn to ignore.",
        challenge:
          "Trigger SettingWithCopyWarning deliberately, confirm the original frame did not change, then fix it with a single .loc assignment. Once you have seen it do nothing, you will not ignore the warning again.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "loc versus iloc",
            detail:
              "loc takes labels and its slices include the endpoint. iloc takes positions and excludes it. The inconsistency is real; memorise it.",
          },
          {
            title: "The parentheses rule",
            detail:
              "`(df.a > 1) & (df.b < 2)`. & and | bind tighter than comparison, so omitting the parentheses is a syntax error or worse.",
          },
          {
            title: "One .loc, not two brackets",
            detail:
              "`df.loc[mask, 'y'] = 1` writes to the original. Two chained brackets may write to a temporary copy.",
          },
          {
            title: "query()",
            detail:
              "String-based filtering that reads well for long conditions. Slower on small frames, clearer on complicated ones.",
          },
        ],
        checks: [
          {
            question: "Why does chained assignment fail silently?",
            answer:
              "The first indexing operation may return a copy, so the assignment writes to the copy and the original frame is unchanged.",
          },
          {
            question: "How do loc and iloc differ on slices?",
            answer:
              "loc uses labels and includes the endpoint; iloc uses positions and excludes it.",
          },
          {
            question: "Why do boolean masks need parentheses?",
            answer:
              "& and | bind more tightly than the comparison operators, so the expression parses wrongly without them.",
          },
          {
            question:
              "Your pandas code assigns a value and the dataframe is unchanged. What happened?",
            answer:
              "Chained assignment. `df[mask]['col'] = x` — the first indexing operation returned a copy, so the write landed on the temporary and the original is untouched. pandas raises SettingWithCopyWarning, which most people have learned to ignore. The fix is a single .loc: `df.loc[mask, 'col'] = x`.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Indexing and selecting data",
            url: "https://pandas.pydata.org/docs/user_guide/indexing.html",
            sourceName: "pandas documentation",
            editorNote:
              "The loc/iloc section and the chained-assignment warning explained by its authors.",
          },
        ],
      },
      {
        title: "Missing data",
        summary: "Every null you fill is a decision. Write it down or you will not remember it.",
        learningObjectives: [
          "isna, notna, nulls per column",
          "dropna with how, thresh, subset",
          "fillna: value, ffill, bfill, group means",
          "When imputation is dishonest and flagging is better",
        ],
        whyToday:
          "Every choice about a null changes a number somebody will act on. Today is about making those choices explicitly and writing them down, which almost nobody does.",
        principle:
          "Every null you fill is a decision. Write it down or you will not remember it — and neither will the person reading your chart.",
        commonMistake:
          "Filling nulls with zero because it makes the arithmetic work. A missing measurement is not a measurement of zero, and the mean now includes values that were never observed.",
        challenge:
          "For every column with nulls in your dataset, write one line: what the null means, what you did about it, and why. Then implement exactly that. The document is the deliverable, not the code.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Count first",
            detail:
              "isna().sum() per column, as a proportion. A column that is 80% null is a different problem from one that is 2% null.",
          },
          {
            title: "Why is it missing",
            detail:
              "Missing at random is safe to impute. Missing because of the value — high earners declining to answer — makes imputation actively misleading.",
          },
          {
            title: "The fill options",
            detail:
              "A constant, forward or backward fill for time series, a group mean. Each carries an assumption; ffill in particular assumes the last value persisted.",
          },
          {
            title: "Flagging beats filling",
            detail:
              "Add a was_missing boolean and leave the null. The information is preserved and any downstream model or chart can account for it.",
          },
          {
            title: "Zero is a value",
            detail:
              "Filling with zero changes means, sums and every distribution statistic. It is occasionally right and usually not.",
          },
        ],
        checks: [
          {
            question: "When is imputation actively misleading?",
            answer:
              "When the value is missing because of what it would have been — the missingness carries information, so filling it erases the pattern.",
          },
          {
            question: "Why is flagging often better than filling?",
            answer:
              "It preserves the fact that the value was unknown, so downstream work can account for it rather than treating it as observed.",
          },
          {
            question: "What does forward fill assume?",
            answer: "That the last observed value persisted until the next observation.",
          },
          {
            question: "A column is 30% null. What do you do?",
            answer:
              "First ask why it is missing, because that decides everything. If it is missing at random, imputation is defensible — a group median rather than an overall mean, and add a was_missing flag so downstream work knows. If it is missing because of what the value would have been, imputing erases the pattern and flagging is the honest choice. If the column is not load-bearing for the question, say so and exclude it. Whatever you choose, write it in the caveats.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Working with missing data",
            url: "https://pandas.pydata.org/docs/user_guide/missing_data.html",
            sourceName: "pandas documentation",
          },
        ],
      },
      {
        title: "Types, strings and duplicates",
        summary:
          "dayfirst=True exists because the world does not agree on dates. Indian data usually needs it.",
        learningObjectives: [
          "astype; to_numeric with errors; to_datetime with format and dayfirst",
          "Category dtype and the memory it saves",
          ".str accessor: strip, lower, replace, contains, extract",
          "duplicated and drop_duplicates with subset and keep",
        ],
        whyToday:
          "The Indian date problem returns, in Python this time, and pandas has a specific argument for it. So does the thousands separator. Both are one keyword each.",
        principle:
          "dayfirst=True exists because the world does not agree on dates. Indian data usually needs it, and omitting it corrupts a third of the rows silently.",
        commonMistake:
          "Using drop_duplicates() with no subset. It only removes rows identical in every column, so near-duplicates differing by a timestamp survive and the count looks deduplicated.",
        challenge:
          "Convert a dd/mm date column correctly, a thousands-separated number column correctly, and deduplicate on a real business key with subset and keep. Then count how many rows drop_duplicates() with no arguments would have removed — usually zero.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "to_datetime",
            detail:
              "format= if you know it, dayfirst=True if you do not. errors='coerce' turns failures into NaT, which you can then count rather than crash on.",
          },
          {
            title: "to_numeric",
            detail:
              "errors='coerce' again. Convert, then count the resulting nulls — that count is how many values were not numbers.",
          },
          {
            title: "Category dtype",
            detail:
              "For low-cardinality strings — region, status. Large memory saving and faster grouping, at the cost of some operations behaving differently.",
          },
          {
            title: "The .str accessor",
            detail:
              "strip, lower, replace, contains, extract. Vectorised string operations; extract with a capture group replaces most manual parsing.",
          },
          {
            title: "Deduplicate on a key",
            detail:
              "subset names the business key, keep decides which survives. Sort first so 'first' means something deliberate.",
          },
        ],
        checks: [
          {
            question: "What does errors='coerce' do?",
            answer:
              "Turns unparseable values into NaT or NaN instead of raising, so you can count and inspect the failures.",
          },
          {
            question: "Why is drop_duplicates() with no subset usually not enough?",
            answer:
              "It requires every column to match. Real duplicates typically differ in a timestamp or an id and survive.",
          },
          {
            question: "When is category dtype worth using?",
            answer:
              "For low-cardinality repeated strings, where it saves substantial memory and speeds up grouping.",
          },
          {
            question:
              "You load an Indian sales CSV and roughly a third of the dates are wrong. What happened?",
            answer:
              "The dates are dd/mm and were parsed as mm/dd. Days 1 to 12 are valid under both readings so they convert silently to the wrong date; 13 to 31 either error or coerce to NaT. That is why it is a third rather than everything, and why it is easy to miss. Fix with dayfirst=True or an explicit format, and re-load rather than trying to repair after the fact.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Working with text data",
            url: "https://pandas.pydata.org/docs/user_guide/text.html",
            sourceName: "pandas documentation",
            editorNote: "The .str accessor end to end; dates live in to_datetime's own page.",
          },
        ],
      },
      {
        title: "Outliers and validation",
        summary: "Domain-impossible values and statistical outliers are different problems.",
        learningObjectives: [
          "describe and quantiles; IQR; z-scores",
          "Cross-field validation: return before purchase, negative quantities",
          "An audit function that returns a dataframe of every problem found",
        ],
        whyToday:
          "An outlier is either an error or the most interesting row in the dataset, and the two require opposite responses. Telling them apart is a judgement the statistics cannot make for you.",
        principle:
          "Domain-impossible values and statistical outliers are different problems. One is a data error to fix; the other may be the finding.",
        commonMistake:
          "Removing everything beyond three standard deviations as a cleaning step. On a skewed distribution that discards a large slice of legitimate high-value customers, and the analysis is then about the customers who did not matter.",
        challenge:
          "Write an audit function that returns a dataframe of every problem found: out-of-range values, cross-field contradictions, statistical outliers by IQR — one row per problem, with the column and the reason. Run it on a dataset you have not cleaned.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Impossible versus unusual",
            detail:
              "A negative age is impossible and must be fixed. An order fifty times the median is unusual and might be the largest customer.",
          },
          {
            title: "IQR versus z-score",
            detail:
              "IQR is robust to skew; z-scores assume roughly normal data and are themselves distorted by the outliers they are meant to find.",
          },
          {
            title: "Cross-field validation",
            detail:
              "A return before the purchase, a delivery before the order, a discount above the price. Individually valid fields, jointly impossible.",
          },
          {
            title: "Return, do not drop",
            detail:
              "The audit produces a report. Deciding what to remove is a separate, documented step — never a side effect of the check.",
          },
        ],
        checks: [
          {
            question: "Why is IQR preferred to z-scores on skewed data?",
            answer:
              "It is based on quartiles and is robust to skew; z-scores assume approximate normality and are themselves distorted by outliers.",
          },
          {
            question: "Give an example of a cross-field contradiction.",
            answer:
              "A return date earlier than the purchase date — each field is individually valid and the pair is impossible.",
          },
          {
            question: "Why should an audit report rather than delete?",
            answer:
              "Deleting is a judgement that must be deliberate and documented, not a side effect of detection.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Statistics (scipy.stats) tutorial",
            url: "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
            sourceName: "SciPy documentation",
            editorNote: "The z-score and describe sections back today's audit function.",
          },
        ],
      },
      {
        title: "groupby",
        summary: "transform is the pandas answer to a window function.",
        learningObjectives: [
          "Split-apply-combine as a mental model",
          "agg with one function, several, a dict per column",
          "transform for group values on original rows; filter for whole groups",
          "Recreate three SQL GROUP BY queries and confirm identical numbers",
        ],
        whyToday:
          "This is the day pandas connects to the eight weeks of SQL behind it. Recreating three GROUP BY queries and getting identical numbers is the proof that both mental models are the same one.",
        principle:
          "transform is the pandas answer to a window function. agg collapses; transform returns a value per original row.",
        commonMistake:
          "Using apply where agg or transform would do. apply is slow, its return shape is unpredictable, and it hides whether you meant to collapse or to broadcast.",
        challenge:
          "Recreate three of your SQL GROUP BY queries in pandas and confirm the numbers match exactly. Then use transform to add a group total to every row — the query you wrote with PARTITION BY on day 43.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Split, apply, combine",
            detail:
              "Split rows into groups, apply a function to each, combine the results. The same three steps SQL's GROUP BY performs.",
          },
          {
            title: "agg",
            detail:
              "One function, a list of functions, or a dict mapping columns to functions. The dict form is how you sum one column and count another in one pass.",
          },
          {
            title: "transform",
            detail:
              "Returns a result aligned to the original rows rather than one row per group. Exactly PARTITION BY.",
          },
          {
            title: "filter",
            detail:
              "Keeps or drops whole groups by a predicate on the group — the equivalent of HAVING.",
          },
          {
            title: "Nulls are dropped",
            detail:
              "groupby excludes null keys by default, unlike SQL's GROUP BY which gives them their own group. dropna=False restores the SQL behaviour.",
          },
        ],
        checks: [
          {
            question: "What is the difference between agg and transform?",
            answer:
              "agg returns one row per group; transform returns a value for every original row — the equivalent of a window function.",
          },
          {
            question: "What is groupby's filter equivalent to in SQL?",
            answer:
              "HAVING — it keeps or discards whole groups based on a group-level condition.",
          },
          {
            question: "How does pandas groupby treat null keys by default?",
            answer:
              "It drops them, unlike SQL which puts them in their own group. dropna=False changes it.",
          },
          {
            question: "What is the pandas equivalent of a SQL window function?",
            answer:
              "groupby().transform(). agg collapses to one row per group like GROUP BY; transform returns a value aligned to every original row, which is what PARTITION BY does. groupby().filter() is the HAVING equivalent, keeping or dropping whole groups.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question:
              "Your pandas groupby gives different totals from the equivalent SQL query. Where would you look?",
            answer:
              "Null keys. pandas groupby drops rows with a null grouping key by default; SQL's GROUP BY gives them their own group. Pass dropna=False to match. After that, check dtypes — a numeric column read as text sums differently — and check for whitespace or case differences in string keys.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
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
        title: "Reshaping",
        summary: "Tidy data: each variable a column, each observation a row.",
        learningObjectives: [
          "pivot_table with values, index, columns, aggfunc, margins",
          "melt for wide→long; stack and unstack",
          "Pivot then melt back and confirm you recover the original",
        ],
        whyToday:
          "Tidy data is the shape every plotting library and every model expects, and week 3's unpivot returns here under a different name. Recognising it as the same operation is the point.",
        principle:
          "Each variable a column, each observation a row. Almost every reshaping problem is a dataset that is not in that form yet.",
        commonMistake:
          "Using pivot when the data has duplicate index/column pairs. pivot raises; pivot_table silently aggregates with mean, which produces a plausible number nobody asked for.",
        challenge:
          "Pivot a long table to wide, then melt it back, and confirm you recover the original exactly. If you do not, find which column the round trip lost — usually the index.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Tidy data",
            detail:
              "One variable per column, one observation per row, one table per kind of thing. Hadley Wickham's formulation, and the reason melt exists.",
          },
          {
            title: "pivot_table",
            detail:
              "values, index, columns, aggfunc. margins=True adds totals. It aggregates, which is both its advantage over pivot and its trap.",
          },
          {
            title: "melt",
            detail:
              "Wide to long. id_vars are the columns to keep; everything else becomes variable/value pairs — the direct equivalent of Power Query's unpivot.",
          },
          {
            title: "stack and unstack",
            detail:
              "Move a level between the index and the columns. Powerful with a MultiIndex and confusing without one.",
          },
        ],
        checks: [
          {
            question: "State the tidy-data rule.",
            answer:
              "Each variable is a column, each observation is a row, each table is one kind of thing.",
          },
          {
            question: "What is the danger of pivot_table over pivot?",
            answer:
              "It silently aggregates duplicates with mean by default, where pivot would raise and tell you they exist.",
          },
          {
            question: "What does melt do?",
            answer:
              "Converts wide to long — keeping id_vars and turning the remaining columns into variable/value pairs.",
          },
          {
            question: "What is tidy data, and why does it matter in practice?",
            answer:
              "Each variable a column, each observation a row, each table one kind of thing. It matters because every plotting library, every groupby and every model expects that shape — so most reshaping work is converting a human-readable wide layout into it with melt.",
            kind: "interview",
            difficulty: "easy",
          },
        ],
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
        title: "Merging",
        summary:
          "validate='one_to_many' turns a silent fan-out into a loud error. Use it every time.",
        learningObjectives: [
          "merge with how, on, suffixes",
          "indicator=True to see where each row came from",
          "validate= to assert cardinality — the guardrail almost nobody uses",
          "concat for stacking; join on index",
        ],
        whyToday:
          "The row-count check you have done manually since week 3 can be an assertion the library enforces. validate= is the single most useful argument almost nobody uses.",
        principle:
          "validate='one_to_many' turns a silent fan-out into a loud error. Use it every time — the cost is one keyword.",
        commonMistake:
          "Merging without checking cardinality and without indicator. A duplicated key inflates every total, and there is no error, no warning and no obvious symptom.",
        challenge:
          "Merge two frames with validate= set correctly and indicator=True. Then deliberately duplicate a key on the right and confirm validate raises rather than silently producing more rows.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "merge",
            detail:
              "how for the join type, on for the key, suffixes for the name clashes. The same six joins as SQL, with the same semantics.",
          },
          {
            title: "validate",
            detail:
              "'one_to_one', 'one_to_many', 'many_to_one'. Asserts the cardinality and raises if it does not hold. The assertion you were making mentally, made real.",
          },
          {
            title: "indicator",
            detail:
              "Adds a _merge column saying left_only, right_only or both. Instantly answers what matched and what did not.",
          },
          {
            title: "concat versus merge",
            detail:
              "concat stacks along an axis; merge joins on keys. concat aligns on the index, which produces surprising nulls if the indexes differ.",
          },
        ],
        checks: [
          {
            question: "What does validate='one_to_many' do?",
            answer:
              "Asserts each key appears once on the left and may repeat on the right, raising if the data violates it.",
          },
          {
            question: "What does indicator=True add?",
            answer:
              "A _merge column recording whether each row came from the left, the right, or both.",
          },
          {
            question: "What surprises people about concat?",
            answer:
              "It aligns on the index, so frames with different indexes produce unexpected nulls or duplicated rows.",
          },
          {
            question: "How do you prevent a merge from silently duplicating rows?",
            answer:
              "Pass validate='one_to_many' — or whichever cardinality you expect — and pandas raises instead of quietly fanning out. Add indicator=True to see which side each row came from. It is one keyword and almost nobody uses it, which is why inflated totals are such a common bug.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Merge, join, concatenate and compare",
            url: "https://pandas.pydata.org/docs/user_guide/merging.html",
            sourceName: "pandas documentation",
            editorNote: "validate= is documented here and almost nowhere else people read.",
          },
        ],
      },
      {
        title: "Time series in pandas",
        summary: "Monthly resample, 3-month rolling average, month-on-month change.",
        learningObjectives: [
          "DatetimeIndex; resample to D/W/M/Q",
          "rolling, expanding, shift for period-over-period",
          "Gaps and reindexing to a full date range",
        ],
        whyToday:
          "Every reporting request is a time series, and pandas has purpose-built machinery for it that is much shorter than doing it by hand — provided the index is a DatetimeIndex.",
        principle:
          "resample needs a DatetimeIndex. Almost every 'resample does not work' is a date column that is still a string or still a column.",
        commonMistake:
          "Resampling data with gaps and reading the result as continuous. Missing periods appear as absent rather than zero, exactly as in SQL, and a rolling average over them silently spans a longer window.",
        challenge:
          "Produce a monthly resample, a three-month rolling average and a month-on-month change from one frame. Then reindex to a full date range and confirm the gaps became zeros rather than disappearing.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "DatetimeIndex",
            detail:
              "Set the date as the index with a real datetime dtype. Everything else in this day depends on that one step.",
          },
          {
            title: "resample",
            detail:
              "Groupby for time — D, W, M, Q. Needs an aggregation, and the label conventions for week and month ends catch people once.",
          },
          {
            title: "rolling and expanding",
            detail:
              "rolling is a fixed window, expanding is everything so far. rolling counts rows, so missing days widen the real window.",
          },
          {
            title: "shift",
            detail:
              "The pandas LAG. Period-over-period change is a shift and a subtraction, with the first row null as always.",
          },
          {
            title: "Reindex to fill gaps",
            detail:
              "Build the complete date range and reindex onto it, filling with zero. The pandas equivalent of the generate_series spine.",
          },
        ],
        checks: [
          {
            question: "What does resample require?",
            answer: "A DatetimeIndex — a real datetime dtype set as the frame's index.",
          },
          {
            question: "What is shift the equivalent of in SQL?",
            answer: "LAG or LEAD, depending on direction.",
          },
          {
            question: "How do you make missing periods appear as zero?",
            answer:
              "Reindex onto a complete date range and fill the introduced nulls — the equivalent of a generate_series spine.",
          },
          {
            question: "resample raises an error on your dataframe. Why?",
            answer:
              "It needs a DatetimeIndex. The date is probably still a column, or still a string dtype. Convert with to_datetime and set it as the index. Nearly every 'resample does not work' is one of those two.",
            kind: "interview",
            difficulty: "easy",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Time series / date functionality",
            url: "https://pandas.pydata.org/docs/user_guide/timeseries.html",
            sourceName: "pandas documentation",
            editorNote: "resample and rolling — the two sections today uses.",
          },
        ],
      },
      {
        title: "A repeatable EDA workflow",
        summary:
          "A repeatable first hour on any dataset is worth more than any single clever technique.",
        learningObjectives: [
          "The checklist: shape, types, nulls, duplicates, distributions, correlations, outliers",
          "Written as a reusable function or notebook template",
          "Run it on a brand-new Kaggle dataset you have not seen",
        ],
        whyToday:
          "Everything from days 61 to 69 becomes one function today. The value is not any single check but never having to remember the list again.",
        principle:
          "A repeatable first hour on any dataset is worth more than any single clever technique. Write it once and run it on everything.",
        commonMistake:
          "Building the checklist against the dataset you already know. It then encodes that dataset's quirks — run it on something unseen before believing it is general.",
        challenge:
          "Write the checklist as a reusable function or notebook template — shape, types, nulls, duplicates, distributions, correlations, outliers — then run it unmodified on a brand-new Kaggle dataset you have never opened. Fix whatever it failed to handle.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The seven checks",
            detail:
              "Shape, dtypes, nulls per column, duplicate keys, distribution of each numeric, correlations, and outliers. In that order, because each informs the next.",
          },
          {
            title: "Make it a function",
            detail:
              "Take a dataframe, return a report. Not a notebook you copy and edit — a thing you call.",
          },
          {
            title: "Test it on the unfamiliar",
            detail:
              "A checklist tuned on a known dataset silently assumes its shape. New data is the only test.",
          },
          {
            title: "It is a portfolio piece",
            detail:
              "A tidy, general EDA function is a small, real, showable artefact — and unusually it is one an interviewer can read in a minute.",
          },
        ],
        checks: [
          {
            question: "What belongs in the first-hour checklist?",
            answer:
              "Shape, dtypes, nulls per column, duplicates, distributions, correlations and outliers.",
          },
          {
            question: "Why test the checklist on an unfamiliar dataset?",
            answer:
              "Built against known data it encodes that data's quirks; only unseen data shows whether it generalises.",
          },
          {
            question: "Why a function rather than a notebook to copy?",
            answer:
              "A function is called unchanged and improves in one place. A copied notebook diverges immediately.",
          },
        ],
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
        title: "Matplotlib fundamentals",
        summary: "Recreate one chart from a news article using your own data.",
        learningObjectives: [
          "Figure and axes; the object-oriented interface vs pyplot",
          "Line, bar, scatter, histogram",
          "Labels, titles, legends, ticks, annotation",
          "Subplots; saving at sensible DPI",
        ],
        whyToday:
          "seaborn is built on matplotlib, and every seaborn chart you will ever need to adjust is adjusted through matplotlib. One day of the substrate saves a lot of guessing.",
        principle:
          "Use the object-oriented interface — fig, ax — not the pyplot state machine. With more than one chart, the state machine stops being predictable.",
        commonMistake:
          "Building charts with plt calls that act on whichever figure is current. Add a subplot and the calls land on the wrong axes, and the fix is not obvious from the output.",
        challenge:
          "Recreate one chart from a news article using your own data, built with fig and ax: labelled axes, a title stating the finding rather than the variable, and one annotation pointing at the thing you want noticed.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Figure and axes",
            detail:
              "The figure is the canvas; each axes is one plot on it. `fig, ax = plt.subplots()` and then call methods on ax.",
          },
          {
            title: "The four charts",
            detail:
              "Line for trend, bar for comparison, scatter for relationship, histogram for distribution. Most work is one of these four.",
          },
          {
            title: "Titles that say something",
            detail:
              "'Revenue fell 18% after March' beats 'Revenue by month'. The title is the only part everybody reads.",
          },
          {
            title: "Annotation",
            detail:
              "One arrow at the point that matters does more than a paragraph of caption, and it survives being screenshotted into a deck.",
          },
          {
            title: "Saving",
            detail:
              "savefig with dpi and bbox_inches='tight'. The default crops labels, which is why exported charts look wrong.",
          },
        ],
        checks: [
          {
            question: "Why prefer the object-oriented interface?",
            answer:
              "pyplot calls act on whichever figure is current, which becomes unpredictable with multiple subplots. fig and ax are explicit.",
          },
          {
            question: "What makes a good chart title?",
            answer:
              "A statement of the finding, not a description of the axes. It is the part everybody reads.",
          },
          {
            question: "Why does an exported chart often have cropped labels?",
            answer:
              "savefig's default bounding box cuts them. bbox_inches='tight' includes them.",
          },
        ],
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
        title: "Seaborn",
        summary: "Six charts, each answering a different question about your dataset.",
        learningObjectives: [
          "Distribution: histplot, kdeplot, ecdfplot",
          "Categorical: boxplot, violinplot, barplot, countplot",
          "Relational: scatterplot, lineplot with hue/size/style",
          "heatmap for correlations; colour-blind-safe palettes",
        ],
        whyToday:
          "seaborn produces a good chart in one line where matplotlib needs ten, and its defaults are statistically thoughtful. Today is about knowing which of its families answers which question.",
        principle:
          "Pick the chart family from the question — distribution, category, or relationship. The library is organised that way for a reason.",
        commonMistake:
          "Reaching for barplot when the question is about distribution. A bar of means hides the spread entirely, and two very different distributions produce identical bars.",
        challenge:
          "Make six charts, each answering a different question about your dataset: one distribution, two categorical, two relational, and a correlation heatmap. Write the question above each one before drawing it.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Distribution",
            detail:
              "histplot for shape, kdeplot for a smoothed version, ecdfplot when you need percentiles read off directly. ecdf is under-used and the most honest of the three.",
          },
          {
            title: "Categorical",
            detail:
              "boxplot and violinplot show spread; barplot shows a mean with a confidence interval; countplot counts rows. A bar hides everything a box shows.",
          },
          {
            title: "Relational",
            detail:
              "scatterplot and lineplot, with hue, size and style adding dimensions. Three encodings is usually one too many.",
          },
          {
            title: "Colour-blind-safe palettes",
            detail:
              "About one man in twelve cannot distinguish red from green. Use a safe palette by default rather than as an accommodation.",
          },
          {
            title: "It returns an axes",
            detail:
              "Every seaborn function returns a matplotlib axes, so yesterday's adjustments all apply.",
          },
        ],
        checks: [
          {
            question: "What does a barplot of means hide?",
            answer:
              "The distribution. Two groups with identical means and very different spreads produce the same bar.",
          },
          {
            question: "When is an ECDF plot the right choice?",
            answer:
              "When you want percentiles read directly off the chart, without the smoothing assumptions of a KDE.",
          },
          {
            question: "Why does seaborn compose with matplotlib?",
            answer:
              "Its functions return a matplotlib axes, so every matplotlib adjustment applies to a seaborn chart.",
          },
        ],
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
        title: "Choosing the right chart",
        summary: "The chart's job is the fastest honest path to the point. Nothing else.",
        learningObjectives: [
          "Comparison, trend, distribution, relationship, part-to-whole — a default chart for each",
          "Why pie charts fail past three slices; why dual axes mislead",
          "Truncated axes: the line between emphasis and deception",
          "Improve three of yesterday's charts; one line each on what changed",
        ],
        whyToday:
          "Two days of drawing, one day of judgement. This is the day that separates charts that inform from charts that are merely correct, and it is the skill that shows in an interview portfolio.",
        principle:
          "The chart's job is the fastest honest path to the point. Nothing else — not beauty, not completeness, not the number of dimensions encoded.",
        commonMistake:
          "A dual-axis chart to show two series 'together'. The crossing point is entirely determined by the two scales you chose, so the visual relationship is manufactured rather than observed.",
        challenge:
          "Improve three of yesterday's charts and write one line under each on what changed and why. Then take one and deliberately make it misleading with a truncated axis — see how easy it was.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Five questions, five defaults",
            detail:
              "Comparison → bar. Trend → line. Distribution → histogram or box. Relationship → scatter. Part-to-whole → stacked bar, and rarely a pie.",
          },
          {
            title: "Why pies fail",
            detail:
              "People compare angles badly. Past three slices a bar chart is strictly easier to read, and ordering it adds information a pie cannot.",
          },
          {
            title: "Dual axes",
            detail:
              "The two scales are arbitrary, so the apparent relationship is a choice. Use two stacked charts sharing an x-axis instead.",
          },
          {
            title: "Truncated axes",
            detail:
              "Legitimate when small variation is the subject, deceptive when magnitude is. The test is whether the reader would agree with the choice if told about it.",
          },
          {
            title: "Declutter",
            detail:
              "Remove gridlines, borders and legends that repeat what labels say. Every element that does not carry information competes with one that does.",
          },
        ],
        checks: [
          {
            question: "Why are dual-axis charts misleading?",
            answer:
              "The relationship between the two series depends entirely on the arbitrary scales chosen, so any crossing point is manufactured.",
          },
          {
            question: "When is a truncated axis acceptable?",
            answer:
              "When small variation is the subject and the reader, told about the truncation, would agree it helps. Not when magnitude is the point.",
          },
          {
            question: "What is the default chart for part-to-whole?",
            answer: "A stacked or grouped bar. A pie only works up to about three slices.",
          },
          {
            question:
              "A stakeholder asks for a dual-axis chart showing revenue and conversion rate. What do you say?",
            answer:
              "That the apparent relationship would be an artefact of the two scales I picked — I can make the lines cross wherever I like. I would offer two stacked charts sharing an x-axis instead, which shows the same two series honestly and is no harder to read. If they still want it, I would build it and note the scaling choice on the chart. It is worth explaining rather than refusing.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
        title: "Review and visual EDA build",
        summary:
          "The deliverable day: raw data in, five charts out, a written finding under each.",
        learningObjectives: [
          "One notebook: load, clean, five charts, five findings",
        ],
        whyToday:
          "The module deliverable, and the third portfolio artefact. A notebook that goes from raw file to five findings is a complete piece of work rather than an exercise.",
        principle:
          "A chart without a written finding under it is a picture. The sentence is the deliverable; the chart is the evidence for it.",
        commonMistake:
          "Producing five charts and letting them speak for themselves. They do not — different readers take different things from the same chart, and none of them is necessarily your point.",
        challenge:
          "One notebook: load raw data, clean it, produce five charts, and write a finding under each in one or two sentences. If you cannot write the sentence, the chart was not worth making — replace it.",
        challengeMinutes: 60,
        estMinutes: 70,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Raw in, findings out",
            detail:
              "The notebook starts from the unmodified file. A notebook starting from cleaned data hides the part reviewers most want to see.",
          },
          {
            title: "Five findings",
            detail:
              "One or two sentences each, stating what the chart shows and why it matters. Written under the chart, not in a summary at the end.",
          },
          {
            title: "The chart-without-a-sentence test",
            detail:
              "If no sentence comes, the chart has no point and should be cut. This removes about a third of most first drafts.",
          },
          {
            title: "Keep it",
            detail:
              "Third portfolio artefact, after the Power Query refresh file and the SQL analysis. Week 13 assembles all of them.",
          },
        ],
        checks: [
          {
            question: "Why must the notebook start from raw data?",
            answer:
              "The cleaning is the part reviewers most want to see, and starting from a cleaned file hides the reasoning.",
          },
          {
            question: "What is the test for whether a chart earns its place?",
            answer: "Whether you can write a one-sentence finding under it. If not, cut it.",
          },
          {
            question: "Where does the finding belong?",
            answer: "Directly under its chart, not collected in a summary at the end.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Seaborn tutorial",
            url: "https://seaborn.pydata.org/tutorial.html",
            sourceName: "seaborn documentation",
            editorNote: "The gallery is the menu for the five charts the deliverable wants.",
          },
        ],
      },
    ],
  },
];
