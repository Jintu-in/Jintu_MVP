/**
 * Excel that actually gets used at work — twenty days, four weeks.
 *
 * The roadmap that takes Jintu outside developers. Accounts, operations,
 * admin, sales and HR all live in this tool, all of them self-taught, and
 * almost nobody sequences it. Five days a week at 40–55 minutes.
 *
 * Deliberately NOT an extraction of the data-analyst spreadsheet modules.
 * Those seventeen days exist (modules 2–4) but they are aimed at somebody on
 * their way to SQL and Python, so they treat the spreadsheet as a stepping
 * stone. This is written for the person whose job IS the spreadsheet, and it
 * ends somewhere different: a workbook a colleague can open and trust,
 * rather than a dataset ready for pandas. Where the two overlap in subject
 * they do not overlap in framing, and both link to the same free sources.
 *
 * Sourcing: ExcelJET is the best free function reference there is and forms
 * the spine. Microsoft Learn covers Power Query and Power Pivot properly and
 * costs nothing. Nothing here is behind a signup or a paywall.
 *
 * Tool note: every technique here works in Excel and, except where a day
 * says otherwise, in Google Sheets and LibreOffice Calc. That matters — a
 * lot of the audience does not have a paid Microsoft licence.
 */
export default {
  slug: "excel-at-work",
  title: "Excel that actually gets used at work",
  summary:
    "Twenty days from formulas that break to a workbook a colleague can open, trust and update — for the people whose job is the spreadsheet, not the ones passing through it.",
  subjectTags: ["excel", "spreadsheets", "power-query", "pivot-tables", "data-cleaning", "reporting"],
  category: "foundations",
  difficulty: "beginner",
  estimatedWeeks: 4,
  licenseNote: null,

  modules: [
    {
      title: "Formulas that do not break",
      weekRange: "Week 1",
      objective:
        "Write formulas that survive being copied, sorted and handed to somebody else.",
      deliverable: "A calculation sheet with no hard-coded numbers inside any formula.",
      estHours: 4,
      nodes: [
        {
          title: "What a spreadsheet is actually for",
          summary:
            "A grid of values and the rules between them. Nearly every workbook disaster comes from mixing those two up.",
          learningObjectives: [
            "Separate inputs, calculations and outputs in a workbook",
            "Say why a number typed inside a formula is a future bug",
            "Set up a sheet whose assumptions are all in one place",
          ],
          whyToday:
            "Most people learn Excel by copying what the person before them did, which is how a workbook ends up with 0.18 typed into forty formulas and nobody knowing it was the GST rate. The layout decision you make on day one determines whether the workbook is maintainable at all.",
          principle:
            "Every number a human chose belongs in a cell of its own, with a label next to it. Formulas reference; they do not contain.",
          commonMistake:
            "Typing a rate, a threshold or a date directly into a formula. It is invisible, it is duplicated, and when it changes somebody has to find every copy. The fix costs one cell.",
          challenge:
            "Take any calculation you do at work — a commission, a discount, a tax — and build it three times: once with the numbers typed into the formulas, once with them in labelled input cells, and once more after changing one assumption. Time how long the change takes in each version.",
          challengeMinutes: 25,
          estMinutes: 45,
          points: 25,
          difficulty: "intro",
          topics: [
            {
              title: "Inputs, calculations, outputs",
              detail:
                "Three areas, ideally three sheets. Inputs are the only cells anyone types into, calculations are all formula, outputs are what gets shown. Colour-coding inputs is the oldest convention in finance and it still works.",
            },
            {
              title: "Hard-coding is the original sin",
              detail:
                "A literal inside a formula cannot be found, audited or changed in one place. If a number came from a decision rather than a calculation, it is an input.",
            },
            {
              title: "One row per thing",
              detail:
                "A sheet where each row is one record and each column one attribute can be sorted, filtered and pivoted. A sheet laid out like a printed report can only be looked at.",
            },
            {
              title: "The formula bar tells the truth",
              detail:
                "A cell shows a result; the bar shows how it got there. Reading the bar before trusting a number is the single habit that separates careful users from everyone else.",
            },
          ],
          checks: [
            {
              question: "Where should a tax rate live, and why?",
              answer:
                "In one labelled input cell that every formula references. Typed into formulas it is invisible, duplicated, and impossible to change reliably when the rate does.",
            },
            {
              question: "What makes a sheet pivotable?",
              answer:
                "One row per record, one column per attribute, no blank rows and no merged cells. Report-shaped layouts cannot be pivoted, filtered or sorted.",
            },
            {
              question: "Why read the formula bar rather than the cell?",
              answer:
                "The cell shows a result, which may be right by accident. The bar shows the logic, which is what you are actually checking.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "What is a formula",
              url: "https://exceljet.net/glossary/formula",
              sourceName: "ExcelJet",
              editorNote:
                "Short, and the definition of a reference in it is what day 2 builds on. Follow the links out of it for operators and precedence.",
            },
            {
              type: "doc",
              title: "Overview of formulas in Excel",
              url: "https://support.microsoft.com/en-us/office/overview-of-formulas-in-excel-ecfdc708-9162-49e8-b993-c311f47ca173",
              sourceName: "Microsoft Support",
              editorNote: "Reference rather than reading. Bookmark it; you will come back for syntax.",
            },
          ],
        },
        {
          title: "Relative, absolute and mixed references",
          summary:
            "The dollar signs. Four days of confusion for most people, and one afternoon if somebody explains what they lock.",
          learningObjectives: [
            "Predict what a formula becomes when copied down and across",
            "Choose between A1, $A$1, $A1 and A$1 deliberately",
            "Build a multiplication-table-shaped calculation with one formula",
          ],
          whyToday:
            "This is the concept that decides whether you can copy a formula or must retype it forty times. It is also the one most self-taught users have never had explained and work around by hand.",
          principle:
            "A reference is relative by default because a formula describes a relationship, not an address. The dollar sign is how you say 'this part is an address'.",
          commonMistake:
            "Pressing F4 until it works. It does work, eventually, but you learn nothing and the next formula is the same guessing game. Decide what should move before you type it.",
          challenge:
            "Build a price grid: products down the side, quantities across the top, one formula in the top-left cell that fills the entire grid correctly when copied. If you need more than one formula, the reference locking is wrong.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Relative — A1",
              detail:
                "Moves with the formula. Copy it one row down and it points one row down. This is what you want for 'the cell beside this one'.",
            },
            {
              title: "Absolute — $A$1",
              detail:
                "Never moves. This is what an input cell needs, so every copy of the formula reads the same assumption.",
            },
            {
              title: "Mixed — $A1 and A$1",
              detail:
                "Lock the column or the row, not both. $A1 keeps the column while the row moves; A$1 the reverse. Grids and cross-tabs need exactly this and nothing else does it.",
            },
            {
              title: "F4 cycles them",
              detail:
                "With the cursor on a reference, F4 steps through all four forms. Useful once you know which one you want — a slot machine before that.",
            },
            {
              title: "Named ranges",
              detail:
                "Name a cell GST_RATE and the formula reads `=Amount*GST_RATE`. Names are absolute by default and make a formula legible to somebody who did not write it.",
            },
          ],
          checks: [
            {
              question: "You copy `=A1*$B$1` from C1 to C2. What does it become?",
              answer:
                "`=A2*$B$1`. The relative reference moves down a row; the absolute one does not move at all.",
            },
            {
              question: "When do you need a mixed reference?",
              answer:
                "When copying in both directions and only one axis should follow — a grid where the row headers stay in one column and the column headers stay in one row.",
            },
            {
              question: "What advantage does a named range have over $B$1?",
              answer:
                "It says what the number means. `=Amount*GST_RATE` can be read and checked by someone who has never seen the workbook; `=A2*$B$1` cannot.",
            },
            {
              question:
                "A colleague's workbook returns wrong totals after they inserted a row. What would you look at first?",
              answer:
                "Whether formulas use relative references into a range whose boundaries moved, and whether any ranges were hard-coded rather than named or structured. Inserting a row inside a SUM range extends it; inserting one just outside does not, which is the classic silent error.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Absolute reference",
              url: "https://exceljet.net/glossary/absolute-reference",
              sourceName: "ExcelJet",
              editorNote:
                "Read this and the relative and mixed entries it links to. Three short pages, and between them the whole of today.",
            },
            {
              type: "doc",
              title: "Define and use names in formulas",
              url: "https://support.microsoft.com/en-us/office/define-and-use-names-in-formulas-4d0f13ac-53b7-422e-afd2-abd7ff379c64",
              sourceName: "Microsoft Support",
              editorNote: "For the last topic. Naming inputs is the cheapest readability win in Excel.",
            },
          ],
        },
        {
          title: "IF, and the logic beneath it",
          summary:
            "Conditions, AND, OR, NOT — and why nested IFs past three levels are a sign you want a lookup instead.",
          learningObjectives: [
            "Write an IF with a condition that is genuinely boolean",
            "Combine conditions with AND and OR",
            "Recognise when a nest of IFs should be a lookup table",
          ],
          whyToday:
            "IF is the first formula that makes a spreadsheet feel like a program, and the first that gets abused. Knowing where its limit is saves rewriting later.",
          principle:
            "An IF encodes a rule. If the rule has more than three branches, it belongs in a table where somebody can read and edit it.",
          commonMistake:
            "Nesting seven IFs for grade bands or commission tiers. It works and it is unmaintainable — nobody can check it, and changing a threshold means surgery. A two-column table plus a lookup is readable and editable by anyone.",
          challenge:
            "Write a commission calculation with four tiers twice: once as nested IFs, once as a lookup table. Then change a threshold in both and note which took longer and which you would rather hand to a colleague.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "IF, and what counts as TRUE",
              detail:
                "`=IF(test, then, else)`. The test is any expression evaluating to TRUE or FALSE. Non-zero numbers count as TRUE, which causes surprises when a blank cell is compared to zero.",
            },
            {
              title: "AND, OR, NOT",
              detail:
                "`AND(a,b)` needs both, `OR(a,b)` needs either. They return TRUE/FALSE and can be used on their own — you do not need an IF wrapped round them to get a boolean column.",
            },
            {
              title: "IFS and SWITCH",
              detail:
                "`IFS` takes condition/result pairs without nesting; `SWITCH` compares one value against several. Both are more readable than a nest, and both still lose to a lookup table past a handful of branches.",
            },
            {
              title: "IFERROR",
              detail:
                "Wraps a formula and substitutes a value when it errors. Use it to catch expected errors — a missing lookup — never to hide errors you have not diagnosed.",
            },
          ],
          checks: [
            {
              question: "When should nested IFs become a lookup table?",
              answer:
                "Past about three branches. A table can be read, checked and edited by someone who does not write formulas; a nest cannot.",
            },
            {
              question: "What is the danger of wrapping everything in IFERROR?",
              answer:
                "It hides errors you have not understood. A #REF! caused by a deleted column silently becomes a blank, and the wrong number looks fine.",
            },
            {
              question: "Do you need IF to produce a TRUE/FALSE column?",
              answer:
                "No. A comparison or an AND/OR already returns TRUE or FALSE; `=IF(A1>10,TRUE,FALSE)` is just `=A1>10`.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Nested IF function example",
              url: "https://exceljet.net/formulas/nested-if-function-example",
              sourceName: "ExcelJet",
              editorNote:
                "Shows the nest and then the alternative, which is exactly today's argument.",
            },
            {
              type: "read",
              title: "IFERROR function",
              url: "https://exceljet.net/functions/iferror-function",
              sourceName: "ExcelJet",
              editorNote: "Note the warning about masking genuine errors — that is the part that matters.",
            },
          ],
        },
        {
          title: "Lookups: XLOOKUP, INDEX/MATCH and why VLOOKUP hurts",
          summary:
            "Pulling a value from another table. The single most used feature in business spreadsheets and the most commonly got wrong.",
          learningObjectives: [
            "Write an XLOOKUP with an explicit not-found result",
            "Write the same lookup as INDEX/MATCH",
            "Explain why VLOOKUP breaks when a column is inserted",
          ],
          whyToday:
            "This is the day the spreadsheet stops being one table. Almost every real task — matching invoices to customers, prices to SKUs — is a lookup, and the wrong choice here breaks silently months later.",
          principle:
            "A lookup should say what to do when it finds nothing. A lookup that returns #N/A into a total is a wrong number pretending to be an error.",
          commonMistake:
            "VLOOKUP with a hard-coded column number. Insert a column into the source table and every one of them now returns the wrong field — no error, just different data. XLOOKUP and INDEX/MATCH reference the column itself and survive it.",
          challenge:
            "Build two tables and join them three ways: VLOOKUP, INDEX/MATCH, and XLOOKUP with a not-found message. Then insert a column into the middle of the source table and see which of the three still works.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "XLOOKUP",
              detail:
                "`XLOOKUP(what, where, return, if_not_found)`. Searches any direction, takes an explicit not-found value, and defaults to exact match. Excel 2021 and 365 only — Sheets has it too, older Excel does not.",
            },
            {
              title: "INDEX/MATCH",
              detail:
                "`INDEX(return_range, MATCH(what, lookup_range, 0))`. Works in every version ever shipped, survives inserted columns, and is the answer when XLOOKUP is not available.",
            },
            {
              title: "Why VLOOKUP breaks",
              detail:
                "Its third argument is a column number counted from the left of the range. Insert a column and the count is wrong but the formula still runs, so the failure is silent.",
            },
            {
              title: "Exact versus approximate match",
              detail:
                "VLOOKUP's fourth argument defaults to approximate, which is almost never what anyone wants. Omitting it on unsorted data returns confidently wrong answers.",
            },
            {
              title: "Handling not-found",
              detail:
                "#N/A is correct and informative; propagating it into a SUM is not. Decide per lookup whether missing means zero, blank, or a message a human should see.",
            },
          ],
          checks: [
            {
              question: "Why does inserting a column break VLOOKUP but not INDEX/MATCH?",
              answer:
                "VLOOKUP counts columns by position from the left of its range; INDEX/MATCH references the return column directly, so it moves with the insert.",
            },
            {
              question: "What is the danger of VLOOKUP's default match mode?",
              answer:
                "It defaults to approximate match, which on unsorted data returns whatever it lands near — a wrong answer with no error.",
            },
            {
              question: "Why give XLOOKUP a not-found argument?",
              answer:
                "So the sheet says what missing means. Without it you get #N/A, which propagates into every total that touches the cell.",
            },
            {
              question:
                "A monthly report's totals changed but nobody edited a formula. Where do you look?",
              answer:
                "At lookups with positional column references after a source-table change, at approximate-match lookups against newly unsorted data, at ranges that did not extend when rows were appended, and at whether IFERROR is masking failures. All four are silent, which is why the totals moved without an error appearing.",
              kind: "interview",
              difficulty: "hard",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "XLOOKUP function",
              url: "https://exceljet.net/functions/xlookup-function",
              sourceName: "ExcelJet",
              editorNote: "Read the examples for the not-found argument; most tutorials omit it entirely.",
            },
            {
              type: "read",
              title: "INDEX and MATCH",
              url: "https://exceljet.net/articles/index-and-match",
              sourceName: "ExcelJet",
              editorNote:
                "The version to learn if your workplace is on older Excel — and still worth knowing if it is not.",
            },
          ],
        },
        {
          title: "Auditing a formula you did not write",
          summary:
            "Trace precedents, evaluate step by step, and find the cell that is lying to you.",
          learningObjectives: [
            "Trace which cells feed a result and which depend on it",
            "Step through a nested formula one evaluation at a time",
            "Find and interpret each error value",
          ],
          whyToday:
            "You will inherit far more spreadsheets than you build. The tools for reading somebody else's are built into Excel and almost nobody knows they exist.",
          principle:
            "A number you cannot trace is a rumour. Before you use it in a decision, follow it back to an input.",
          commonMistake:
            "Fixing the symptom — overtyping a wrong result with the right number. The formula is still wrong, it is now invisible, and next month it is wrong again with nobody watching.",
          challenge:
            "Find a spreadsheet you did not write. Pick its most important output, use Trace Precedents repeatedly until you reach cells that are typed rather than calculated, and draw the chain on paper. Note every hard-coded number you pass on the way.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Trace Precedents and Dependents",
              detail:
                "Arrows showing what a cell reads and what reads it. Repeated tracing walks the whole dependency chain back to inputs.",
            },
            {
              title: "Evaluate Formula",
              detail:
                "Steps through a nested formula one evaluation at a time, showing each intermediate result. This is how you find which branch of an IF is firing.",
            },
            {
              title: "Show Formulas",
              detail:
                "Ctrl+` displays every formula instead of results. The fastest way to spot a hard-coded value sitting among calculated cells.",
            },
            {
              title: "What each error means",
              detail:
                "#REF! a deleted reference; #VALUE! wrong type; #DIV/0! division by zero; #N/A a lookup found nothing; #NAME? a misspelled function or an undefined name. Each points at a different mistake.",
            },
          ],
          checks: [
            {
              question: "What does #REF! tell you?",
              answer:
                "That a cell the formula pointed at no longer exists — usually a deleted row, column or sheet. The reference is gone, not merely empty.",
            },
            {
              question: "When would you use Evaluate Formula over Trace Precedents?",
              answer:
                "When the inputs are right but the answer is wrong, so you need to see which part of the logic misfires rather than where the values came from.",
            },
            {
              question: "Why is overtyping a wrong result the worst fix?",
              answer:
                "It leaves the broken formula in place, hides that it is broken, and turns a calculated cell into a hard-coded one nobody will notice.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Detect errors in formulas",
              url: "https://support.microsoft.com/en-us/office/detect-errors-in-formulas-3a8acca5-1d61-4702-80e0-99a36a2822c1",
              sourceName: "Microsoft Support",
              editorNote: "Covers tracing, Evaluate Formula, and what each error value means.",
            },
            {
              type: "read",
              title: "Excel formula errors",
              url: "https://exceljet.net/articles/excel-formula-errors",
              sourceName: "ExcelJet",
              editorNote: "One page, all the error values, with the cause of each. Print it.",
            },
          ],
        },
      ],
    },

    {
      title: "Cleaning data somebody else produced",
      weekRange: "Week 2",
      objective: "Turn an exported mess into a table you can calculate on.",
      deliverable: "A cleaning routine you can re-run when next month's export arrives.",
      estHours: 4,
      nodes: [
        {
          title: "Text functions that do the boring work",
          summary:
            "TRIM, CLEAN, LEFT, RIGHT, MID, TEXTSPLIT — the tools for data that arrived in the wrong shape.",
          learningObjectives: [
            "Strip invisible characters that break a lookup",
            "Split one column into several without retyping",
            "Rejoin fields with TEXTJOIN and CONCAT",
          ],
          whyToday:
            "Almost no real data arrives clean. The half hour you spend on text functions today is a half hour you stop spending every month.",
          principle:
            "If you are about to retype a column, stop. Retyping is not faster and it cannot be repeated next month.",
          commonMistake:
            "A lookup returning #N/A for values that look identical. Almost always a trailing space or a non-breaking space from a web export. TRIM and CLEAN before concluding the data is wrong.",
          challenge:
            "Take a column of full names with inconsistent spacing and capitalisation and produce clean first-name and surname columns using formulas only — no manual edits. Then paste a fresh messy column in and confirm it still works.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "TRIM and CLEAN",
              detail:
                "TRIM removes leading, trailing and repeated spaces; CLEAN strips non-printing characters. Run both on anything from a web page or a PDF before matching on it.",
            },
            {
              title: "LEFT, RIGHT, MID, LEN, FIND",
              detail:
                "The classic toolkit: take from the start, the end or the middle, measure a length, locate a character. Combined they extract almost anything from a consistent format.",
            },
            {
              title: "TEXTSPLIT and Text to Columns",
              detail:
                "TEXTSPLIT (365) splits by delimiter into a dynamic array. Text to Columns does it once as a manual step — fine for a one-off, useless for a monthly routine.",
            },
            {
              title: "TEXTJOIN and CONCAT",
              detail:
                "Rejoin with a delimiter, optionally skipping blanks. TEXTJOIN's ignore-empty argument is the difference between 'Kumar, , Delhi' and 'Kumar, Delhi'.",
            },
            {
              title: "The non-breaking space",
              detail:
                "CHAR(160), common in anything copied from a web page. TRIM does not remove it. `SUBSTITUTE(A1, CHAR(160), \" \")` first, then TRIM — this one costs people whole afternoons.",
            },
          ],
          checks: [
            {
              question: "Two cells look identical but a lookup fails. First thing to check?",
              answer:
                "Invisible characters — a trailing space or a non-breaking space. TRIM, and substitute CHAR(160) before trimming if the data came from the web.",
            },
            {
              question: "What does TRIM not remove?",
              answer:
                "Non-breaking spaces, CHAR(160), and other non-printing characters. Those need SUBSTITUTE and CLEAN.",
            },
            {
              question: "Why prefer TEXTSPLIT to Text to Columns?",
              answer:
                "TEXTSPLIT is a formula, so it recalculates when new data arrives. Text to Columns is a one-time manual operation you must repeat by hand.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "TRIM function",
              url: "https://exceljet.net/functions/trim-function",
              sourceName: "ExcelJet",
              editorNote: "Read the note on non-breaking spaces — that is the case that actually bites.",
            },
            {
              type: "read",
              title: "Excel text functions",
              url: "https://exceljet.net/functions",
              sourceName: "ExcelJet",
              editorNote:
                "Filter the list to Text. Skim all of them once so you know what exists; you will look up the syntax when you need it.",
            },
          ],
        },
        {
          title: "Dates and numbers that are secretly text",
          summary:
            "Why a column of dates will not sort, and why a total of numbers comes to zero.",
          learningObjectives: [
            "Tell a real date from text that looks like one",
            "Convert text to dates and numbers reliably",
            "Say what a date actually is in a spreadsheet",
          ],
          whyToday:
            "This is the most common data problem in the world and the one that produces the most confidently wrong reports. A total that silently excludes half its rows is worse than an error.",
          principle:
            "A date is a number with a costume on. Sorting, filtering and arithmetic all work on the number — if they misbehave, you have text.",
          commonMistake:
            "Widening the column, seeing the dates line up, and concluding they are fine. Alignment is the actual clue: numbers and dates go right by default, text goes left. A left-aligned date is text.",
          challenge:
            "Take an export with dates as text — a CSV from any system will do — and convert the column to real dates. Then prove it: sort it, filter to a range, and subtract two of them to get a number of days.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "The serial number",
              detail:
                "Excel counts days from 1 January 1900. Today is a five-digit integer; a time is the fraction after the decimal point. Format the cell as General and you will see it.",
            },
            {
              title: "Alignment is the tell",
              detail:
                "Default alignment is right for numbers and dates, left for text. Before investigating anything else, look at which side the values sit on.",
            },
            {
              title: "DATEVALUE and VALUE",
              detail:
                "Convert text to a date serial or a number. Both depend on your locale, which is why 03/04/2026 imports differently in Mumbai and in Chicago.",
            },
            {
              title: "Date arithmetic",
              detail:
                "Subtract two dates for days between. EDATE adds months, EOMONTH gives month end, NETWORKDAYS excludes weekends and a holiday list.",
            },
            {
              title: "The DD/MM versus MM/DD trap",
              detail:
                "An import will silently reinterpret dates where the day is 12 or under and leave the rest as text. The symptom is a column that is half dates and half text — and the dates are wrong.",
            },
          ],
          checks: [
            {
              question: "How can you tell at a glance that a date column is text?",
              answer:
                "It is left-aligned. Real dates and numbers align right by default, so alignment is the fastest diagnostic.",
            },
            {
              question: "What is a date, underneath?",
              answer:
                "An integer counting days from a fixed epoch, with time as the fractional part. Formatting is only how it is displayed.",
            },
            {
              question: "Why is a half-converted date column especially dangerous?",
              answer:
                "Because the converted half may have been read as MM/DD rather than DD/MM, so those rows are silently wrong dates while the rest are visibly text.",
            },
            {
              question:
                "A report totals £48,000 but the finance team says it should be £71,000. What do you check?",
              answer:
                "Whether some values are text rather than numbers — SUM ignores text silently. Check alignment, use COUNT against COUNTA to see how many entries are numeric, and look for currency symbols, thousands separators or trailing spaces that came in with an export.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Format numbers as dates or times",
              url: "https://support.microsoft.com/en-us/office/format-numbers-as-dates-or-times-418bd3fe-0577-47c8-8caa-b4d30c528309",
              sourceName: "Microsoft Support",
              editorNote:
                "The part to read is where it explains that formatting changes display and not the underlying serial number. That distinction is the whole day.",
            },
            {
              type: "doc",
              title: "DATEVALUE function",
              url: "https://exceljet.net/functions/datevalue-function",
              sourceName: "ExcelJet",
              editorNote:
                "The conversion that repeats reliably, unlike Text to Columns. Note the locale warning — it is the cause of the DD/MM trap above.",
            },
          ],
        },
        {
          title: "Finding what is wrong: duplicates, blanks and outliers",
          summary:
            "Before you calculate anything, count what you have and check it is what you think.",
          learningObjectives: [
            "Count rows, blanks and distinct values",
            "Find duplicates without deleting anything yet",
            "Spot values outside a plausible range",
          ],
          whyToday:
            "Every wrong report starts with an unexamined dataset. Five minutes of counting first is the highest-return habit in this roadmap.",
          principle:
            "Count before you calculate. A total is only meaningful once you know how many rows it covers and how many it silently skipped.",
          commonMistake:
            "Using Remove Duplicates immediately. It deletes without telling you what it took, and 'duplicate' by all columns is rarely the definition you meant. Flag them first, look, then decide.",
          challenge:
            "Take any dataset and produce a summary block above it: total rows, blanks per column, distinct values in the key column, minimum and maximum of every numeric column. Then find at least one thing in it you did not expect.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "COUNT, COUNTA, COUNTBLANK",
              detail:
                "COUNT counts numbers only, COUNTA counts anything non-empty, COUNTBLANK counts empties. COUNT against COUNTA on the same column instantly reveals numbers stored as text.",
            },
            {
              title: "Flagging duplicates rather than deleting",
              detail:
                "`COUNTIF(range, cell)>1` marks them in a helper column. Now you can see how many, in which rows, and whether they are genuinely the same record.",
            },
            {
              title: "UNIQUE and COUNTIF",
              detail:
                "UNIQUE (365) lists distinct values as a spilled array; COUNTIF beside it gives frequencies. A frequency table exposes 'Mumbai', 'mumbai' and 'Mumbai ' as three cities.",
            },
            {
              title: "Range checks",
              detail:
                "MIN and MAX on every numeric column, every time. A negative quantity or an age of 200 is found in seconds and would otherwise survive into a report.",
            },
            {
              title: "Conditional formatting as an audit tool",
              detail:
                "Highlight duplicates, blanks or out-of-range values in place. Looking at where problems cluster in the sheet often tells you which import went wrong.",
            },
          ],
          checks: [
            {
              question: "What does COUNT versus COUNTA on a numeric column reveal?",
              answer:
                "The difference is entries that are not numbers — usually numbers stored as text, which every arithmetic function will silently skip.",
            },
            {
              question: "Why flag duplicates before removing them?",
              answer:
                "Because Remove Duplicates deletes without reporting what it took, and duplication by every column is rarely the definition you intended.",
            },
            {
              question: "Name the fastest check for impossible values.",
              answer:
                "MIN and MAX on each numeric column. Negative quantities, zero prices and absurd ages show up immediately.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "COUNTIF function",
              url: "https://exceljet.net/functions/countif-function",
              sourceName: "ExcelJet",
              editorNote: "The duplicate-flagging pattern is in the examples near the bottom.",
            },
            {
              type: "doc",
              title: "Filter for unique values or remove duplicate values",
              url: "https://support.microsoft.com/en-us/office/filter-for-unique-values-or-remove-duplicate-values-ccf664b0-81d6-449b-bbe1-8daaec1e83c2",
              sourceName: "Microsoft Support",
              editorNote:
                "Note the difference between filtering for unique and removing duplicates — the first is reversible.",
            },
          ],
        },
        {
          title: "Tables, and why they are not just formatting",
          summary:
            "Ctrl+T. Ranges that grow by themselves, formulas that read like sentences, and no more $A$2:$A$5000.",
          learningObjectives: [
            "Convert a range to a table and use structured references",
            "Explain why a table fixes ranges that do not extend",
            "Set up a table that feeds a pivot without re-pointing it",
          ],
          whyToday:
            "One keystroke that eliminates a whole class of silent errors. Most people think it is a colour scheme.",
          principle:
            "A table knows where it ends. Every range that does not is a bug waiting for the next row of data.",
          commonMistake:
            "Writing formulas against A2:A5000 to leave room. Rows 4000 to 5000 are blank now, and when row 5001 arrives the formula silently ignores it — no error, just a total that is quietly short.",
          challenge:
            "Take a dataset with formulas and a pivot pointing at a fixed range. Convert it to a table, rewrite the formulas with structured references, then paste 50 new rows on the end. Everything should update with no re-pointing at all.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "What Ctrl+T does",
              detail:
                "Defines a named object with headers, a body that grows and shrinks, and automatic filter buttons. The banding is the least of it.",
            },
            {
              title: "Structured references",
              detail:
                "`=SUM(Sales[Amount])` instead of `=SUM(D2:D5000)`. Readable, and it always covers exactly the rows that exist.",
            },
            {
              title: "Automatic expansion",
              detail:
                "Type in the row below and the table absorbs it — formulas, formatting and any pivot pointed at it all follow.",
            },
            {
              title: "Total rows and slicers",
              detail:
                "A toggleable total row with per-column functions, and slicers as visible filters somebody else can operate without knowing Excel.",
            },
            {
              title: "Name the table",
              detail:
                "Table1 tells nobody anything. Rename it to Sales or Invoices and every formula referencing it becomes self-documenting.",
            },
          ],
          checks: [
            {
              question: "What breaks when you write formulas against a fixed range?",
              answer:
                "New rows outside the range are silently excluded. No error appears; the total is simply wrong.",
            },
            {
              question: "What is a structured reference?",
              answer:
                "A reference by table and column name — `Sales[Amount]` — that resolves to whatever rows the table currently holds.",
            },
            {
              question: "How does a table help a pivot?",
              answer:
                "The pivot's source grows with the table, so refreshing picks up new rows without anyone re-pointing the source range.",
            },
            {
              question: "Why would you convert a range to a table before building a report on it?",
              answer:
                "So every downstream object — formulas, pivots, charts, Power Query — tracks the real extent of the data. It removes the whole class of errors where the data grew and something reading it did not.",
              kind: "interview",
              difficulty: "easy",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Overview of Excel tables",
              url: "https://support.microsoft.com/en-us/office/overview-of-excel-tables-7ab0bb7d-3a9e-4b56-a3c9-6c94334e492c",
              sourceName: "Microsoft Support",
              editorNote: "What a table is and what it changes. Short.",
            },
            {
              type: "read",
              title: "Excel tables",
              url: "https://exceljet.net/articles/excel-tables",
              sourceName: "ExcelJet",
              editorNote:
                "The structured-reference syntax, which is the part worth learning properly today.",
            },
          ],
        },
        {
          title: "Power Query: cleaning that repeats itself",
          summary:
            "Record the cleaning once, and next month's file goes through the same steps with one refresh.",
          learningObjectives: [
            "Import a file and apply a sequence of transformation steps",
            "Re-run the whole sequence against a new file",
            "Say why this replaces the manual clean you did in week 2",
          ],
          whyToday:
            "Everything in this module so far was manual. Today it becomes a routine — and this is the single largest time saving available to anyone who receives the same report every month.",
          principle:
            "If you will do this cleaning again, record it. A list of steps you can re-run is worth more than a clean sheet you produced by hand.",
          commonMistake:
            "Editing the loaded output instead of the query. Those edits vanish on the next refresh, and it is genuinely confusing the first time. Every change belongs in a step.",
          challenge:
            "Import a messy CSV through Power Query. Promote headers, set types, trim text, remove blank rows and split a column — all as steps. Then replace the source file with a differently-messy version of the same export and refresh. It should just work.",
          challengeMinutes: 40,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "The Applied Steps list",
              detail:
                "Every action becomes a named, reorderable, editable step. It is a recipe, and it is the whole reason Power Query exists.",
            },
            {
              title: "Set types early, then never again",
              detail:
                "Assigning column types once at the start prevents the text-that-looks-like-a-number problem from week 2 recurring at all.",
            },
            {
              title: "Unpivot",
              detail:
                "Turns a report-shaped table — months across the top — into one row per record. It is one right-click and it is the step that makes report exports pivotable.",
            },
            {
              title: "Merge and append",
              detail:
                "Merge joins two tables on a key, the way a lookup does but for whole tables. Append stacks files with the same shape — twelve monthly exports into one table.",
            },
            {
              title: "Where it lives",
              detail:
                "Built into Excel for Windows since 2016, and into Power BI. Excel for Mac support is partial and lags, which is worth knowing before you build a team process on it.",
            },
          ],
          checks: [
            {
              question: "Why edit the query rather than the loaded table?",
              answer:
                "Because a refresh regenerates the output from the steps. Anything typed into the output is discarded.",
            },
            {
              question: "What does unpivot do, and when do you need it?",
              answer:
                "Turns columns into rows — months spread across the top become one row per month. You need it whenever an export is laid out for reading rather than for analysis.",
            },
            {
              question: "How does Power Query change monthly reporting?",
              answer:
                "The cleaning becomes a recorded sequence, so next month is a refresh rather than an hour of repeating the same manual steps.",
            },
            {
              question: "When would you reach for Power Query over formulas?",
              answer:
                "When the work is shaping rather than calculating, when it will repeat on new files, or when the source needs joining, appending or unpivoting before it is usable. Formulas compute within a table; Power Query builds the table.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "What is Power Query?",
              url: "https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query",
              sourceName: "Microsoft Learn",
              editorNote: "The concept and the Applied Steps model, before you touch the interface.",
            },
            {
              type: "doc",
              title: "Unpivot columns",
              url: "https://learn.microsoft.com/en-us/power-query/unpivot-column",
              sourceName: "Microsoft Learn",
              editorNote:
                "The one transformation worth reading about in advance — it is not obvious until you have seen it.",
            },
          ],
        },
      ],
    },

    {
      title: "Summarising, and saying something true",
      weekRange: "Week 3",
      objective: "Answer a real question with a pivot table and a chart that does not mislead.",
      deliverable: "A one-page summary of a real dataset with the question stated on it.",
      estHours: 4,
      nodes: [
        {
          title: "SUMIFS, COUNTIFS, AVERAGEIFS",
          summary: "Totals with conditions. Most reporting questions are one of these three.",
          learningObjectives: [
            "Total a column filtered by one or several criteria",
            "Use wildcards and comparison operators in criteria",
            "Choose between a formula and a pivot for a given question",
          ],
          whyToday:
            "These three answer most of what anyone asks a spreadsheet: how much, how many, on average — for this subset. They also live in cells, so they update in place, which a pivot does not.",
          principle:
            "Criteria belong in cells, not in the formula. Then the reader can change the question without editing anything.",
          commonMistake:
            "Typing criteria as literals — `SUMIFS(..., \"Mumbai\")`. Point at a cell containing Mumbai instead, and the same formula answers the question for any city the reader types.",
          challenge:
            "Build a small dashboard block: one dataset and four SUMIFS/COUNTIFS answering four questions, with every criterion in its own labelled cell. Change two criteria and watch the whole block re-answer.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Argument order",
              detail:
                "SUMIFS puts the sum range first, then criteria pairs. SUMIF puts it last. That inconsistency is a genuine wart in Excel — prefer SUMIFS always, even with one condition.",
            },
            {
              title: "Criteria syntax",
              detail:
                "`\">100\"`, `\"<>\"&B1`, `\"Mum*\"`. Operators and wildcards go inside the string; a cell reference is concatenated with &, which is the fiddly part.",
            },
            {
              title: "Dates as criteria",
              detail:
                "`\">=\"&DATE(2026,4,1)` rather than a typed date string. Typed dates in criteria are interpreted by locale and fail silently on somebody else's machine.",
            },
            {
              title: "Formula or pivot",
              detail:
                "A formula for a number that sits in a report and updates live. A pivot for exploring — when you do not yet know which breakdown you want.",
            },
          ],
          checks: [
            {
              question: "Why prefer SUMIFS even with a single condition?",
              answer:
                "Consistent argument order — sum range first — and it extends to more criteria without rewriting. SUMIF's reversed order is a standing source of errors.",
            },
            {
              question: "How do you use a cell's value in a criterion with an operator?",
              answer:
                "Concatenate: `\">=\"&B1`. The operator is a string and the value comes from the cell.",
            },
            {
              question: "When is a pivot the better tool?",
              answer:
                "When exploring — you want to try several breakdowns quickly. A formula is better for a fixed number that must sit in a report and update automatically.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "SUMIFS function",
              url: "https://exceljet.net/functions/sumifs-function",
              sourceName: "ExcelJet",
              editorNote: "The criteria-syntax examples are the reference you will keep returning to.",
            },
            {
              type: "read",
              title: "Excel COUNTIFS function",
              url: "https://exceljet.net/functions/countifs-function",
              sourceName: "ExcelJet",
              editorNote: "Same criteria rules; skim once and note the date-criteria example.",
            },
          ],
        },
        {
          title: "Pivot tables, properly",
          summary:
            "Drag fields, get an answer. The fastest way to explore a dataset and the fastest way to mislead yourself.",
          learningObjectives: [
            "Build a pivot from a table and reshape it in seconds",
            "Change the summary function and the number format",
            "Group dates and values into meaningful buckets",
          ],
          whyToday:
            "Everything in week 2 was preparation for this. A pivot answers in seconds a question that takes ten formulas — and it is the feature that makes non-technical colleagues trust a spreadsheet.",
          principle:
            "A pivot answers exactly the question its layout asks. Before reading the numbers, say out loud what question the current arrangement is answering.",
          commonMistake:
            "Reading Count where you meant Sum. Excel defaults to Count when a column contains any text, so a column with one stray text cell silently summarises as a row count — and the number looks plausible.",
          challenge:
            "Take a dataset with dates, a category and an amount. Build three pivots answering three different questions, group the dates by month, and write the question above each one in a cell. If you cannot write the question, the pivot is not finished.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "The four areas",
              detail:
                "Rows and Columns define the grid, Values what is summarised, Filters what is excluded. Every pivot is a choice about which field goes where.",
            },
            {
              title: "The summary function",
              detail:
                "Sum, Count, Average, Max, Distinct Count. Check it every time — the default depends on the data type and Count-when-you-meant-Sum is the classic silent error.",
            },
            {
              title: "Grouping",
              detail:
                "Right-click a date field to group by month, quarter or year; group numbers into bands. This turns 400 rows of transactions into twelve rows anybody can read.",
            },
            {
              title: "Show Values As",
              detail:
                "Percentage of total, running total, difference from previous. The most useful feature in pivots and the most buried — it is a right-click away.",
            },
            {
              title: "Refresh is not automatic",
              detail:
                "A pivot shows a cached snapshot. Add rows to the source and the pivot does not change until refreshed — which is how a stale number reaches a meeting.",
            },
          ],
          checks: [
            {
              question: "Why does a pivot sometimes show Count when you wanted Sum?",
              answer:
                "Because the value column contains something non-numeric — often one text cell or a blank formatted as text — so Excel defaults to Count.",
            },
            {
              question: "What does Show Values As give you?",
              answer:
                "Derived views of the same numbers — percentage of total, running total, difference from the previous period — without writing a formula.",
            },
            {
              question: "Why can a pivot be out of date?",
              answer:
                "It reads a cached copy of the source. Until you refresh, new or changed rows are not reflected.",
            },
            {
              question:
                "Someone shows you a pivot and says revenue is down 12%. What do you ask before agreeing?",
              answer:
                "What the summary function is, whether the source range covers all the data, when it was last refreshed, whether any filter is applied, and whether the two periods are comparable — same length, same categories, same currency treatment. Any of those explains a 12% move on its own.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Create a PivotTable to analyze worksheet data",
              url: "https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-bfe9-40a9-a8e9-f99134456576",
              sourceName: "Microsoft Support",
              editorNote: "The mechanics. Build one alongside it rather than reading it through.",
            },
            {
              type: "read",
              title: "Pivot table tips",
              url: "https://exceljet.net/articles/pivot-table-tips",
              sourceName: "ExcelJet",
              editorNote:
                "Grouping and Show Values As are in here. These are the two features that make pivots worth learning properly.",
            },
          ],
        },
        {
          title: "Charts that do not mislead",
          summary:
            "Four chart types cover nearly everything. Most chart mistakes are choosing the wrong one, or a truncated axis.",
          learningObjectives: [
            "Choose a chart type from the question being asked",
            "Say when a zero baseline is required and when it is not",
            "Strip a chart down to what carries information",
          ],
          whyToday:
            "A chart is an argument. Making one that supports a claim the data does not is easy to do accidentally, and this is where most people do it.",
          principle:
            "Pick the chart from the question. Comparison is a bar, change over time is a line, composition is a stacked bar — and almost nothing is a pie.",
          commonMistake:
            "A bar chart with a truncated y-axis. It makes a 3% difference look like a doubling, and it is the most common misleading chart in business — usually made by accident, since Excel sometimes does it by default.",
          challenge:
            "Take one dataset and chart it twice: once honestly, once with a truncated axis and a 3-D effect. Put them side by side. Then delete every element from the honest one that does not carry information and see how much is left.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Four types cover it",
              detail:
                "Bar for comparing categories, line for change over time, scatter for relationships between two numbers, stacked bar for composition. Pie only for a handful of parts of one whole, and rarely even then.",
            },
            {
              title: "The zero baseline",
              detail:
                "Bars encode value by length, so they must start at zero or the lengths lie. Lines encode by position, so a non-zero axis is legitimate — but say so.",
            },
            {
              title: "Removing chartjunk",
              detail:
                "Gridlines, borders, 3-D, gradients, shadows, redundant legends. Delete anything that would not change what a reader concludes.",
            },
            {
              title: "Label directly",
              detail:
                "A label at the end of a line beats a legend the eye has to travel to. It is a two-minute change and it makes a chart readable at a glance.",
            },
            {
              title: "Sort before charting",
              detail:
                "Categories in alphabetical order are almost never the useful order. Sorting by value is usually the whole insight.",
            },
          ],
          checks: [
            {
              question: "Why must a bar chart start at zero?",
              answer:
                "Because a bar communicates its value by length. Truncating the axis makes the lengths misrepresent the ratios between values.",
            },
            {
              question: "When is a non-zero axis acceptable?",
              answer:
                "On a line chart, where position rather than length carries the meaning — provided the axis is clearly labelled.",
            },
            {
              question: "What should you delete from a default Excel chart?",
              answer:
                "Anything that does not change what a reader concludes: gridlines, borders, 3-D effects, shadows, and legends replaceable by direct labels.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Create a chart from start to finish",
              url: "https://support.microsoft.com/en-us/office/create-a-chart-from-start-to-finish-0baf399e-dd61-4e18-8a73-b3fd5d5680c2",
              sourceName: "Microsoft Support",
              editorNote:
                "Mechanics, and the section on choosing a type. Ignore the styling advice — the topics above disagree with most of it.",
            },
            {
              type: "doc",
              title: "Available chart types in Office",
              url: "https://support.microsoft.com/en-us/office/available-chart-types-in-office-a6187218-807e-4103-9e0a-27cdb19afb90",
              sourceName: "Microsoft Support",
              editorNote:
                "Reference for the less common types. Skim; you will use four of them for the rest of your career.",
            },
          ],
        },
        {
          title: "Conditional formatting that means something",
          summary:
            "Colour as data, not decoration. Rules that make an exception visible without anyone reading a number.",
          learningObjectives: [
            "Write a formula-driven rule that highlights whole rows",
            "Use data bars and colour scales where they help",
            "Say why three colours are usually two too many",
          ],
          whyToday:
            "A well-formatted sheet answers 'is anything wrong?' before anyone reads it. A badly formatted one is a rainbow nobody trusts.",
          principle:
            "Colour should mark the exception. If most of the sheet is coloured, nothing is highlighted.",
          commonMistake:
            "Formatting cells manually to mark status. It looks identical to a rule and is invisible to filtering, sorting and every future reader — and it does not update when the value does.",
          challenge:
            "Take a tracker and add three rules: overdue rows highlighted entirely, values outside a plausible range flagged, and duplicates in the key column marked. Use a formula rule for at least the first, and no manual fills anywhere.",
          challengeMinutes: 30,
          estMinutes: 45,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Rules, not fills",
              detail:
                "A rule re-evaluates as data changes; a manual fill does not. Manual colour is a note to yourself that will be wrong by next week.",
            },
            {
              title: "Formula rules and the anchor",
              detail:
                "To highlight a whole row on one column's value, use a rule like `=$D2=\"Overdue\"` applied to the row range. The `$` on the column and not the row is what makes it work — this is day 2's mixed reference, earning its keep.",
            },
            {
              title: "Data bars and colour scales",
              detail:
                "In-cell magnitude without a chart. Excellent for one numeric column; noise when applied to a whole grid.",
            },
            {
              title: "Restraint",
              detail:
                "One or two colours with a stated meaning. Traffic lights on every column produce a sheet nobody can read and everybody stops trusting.",
            },
          ],
          checks: [
            {
              question: "Why use a rule rather than filling a cell yellow?",
              answer:
                "A rule re-evaluates when the data changes; a manual fill is a static decoration that quickly becomes wrong.",
            },
            {
              question: "How do you highlight an entire row based on one column?",
              answer:
                "A formula rule applied to the row range, with the column locked and the row relative — `=$D2=\"Overdue\"`.",
            },
            {
              question: "What is the failure mode of enthusiastic conditional formatting?",
              answer:
                "Everything is coloured, so nothing stands out, and readers stop believing any of it means anything.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Use conditional formatting to highlight information",
              url: "https://support.microsoft.com/en-us/office/use-conditional-formatting-to-highlight-information-fed60dfa-1d3f-4e13-9ecb-f1951ff89d7f",
              sourceName: "Microsoft Support",
              editorNote: "The mechanics, including managing rules once you have several.",
            },
            {
              type: "read",
              title: "Conditional formatting with formulas",
              url: "https://exceljet.net/articles/conditional-formatting-with-formulas",
              sourceName: "ExcelJet",
              editorNote:
                "The whole-row highlight and why the anchoring works. This is the technique worth the day.",
            },
          ],
        },
        {
          title: "Dynamic arrays: FILTER, SORT, UNIQUE",
          summary:
            "Formulas that return whole ranges. They replace a surprising amount of manual work — where your Excel version has them.",
          learningObjectives: [
            "Return a filtered table with one formula",
            "Chain SORT, FILTER and UNIQUE together",
            "Say what a spill range is and what blocks one",
          ],
          whyToday:
            "This is the newest genuinely useful thing in Excel. One formula now does what used to need a pivot, a helper column and a manual sort — and it updates live.",
          principle:
            "If the answer is a list rather than a number, there is probably one formula that returns the whole list.",
          commonMistake:
            "Not noticing #SPILL!. It means the result needs room the sheet does not have — usually one stray value below the formula. The formula is right; the space is not.",
          challenge:
            "Build a mini report where a dropdown picks a category and a FILTER formula returns the matching rows, sorted by amount, with the distinct categories in the dropdown produced by UNIQUE. No pivot, no manual refresh.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "Spilling",
              detail:
                "A formula returning multiple values fills the cells below and to the right automatically. The spill range has a blue border and is referenced with `A1#`.",
            },
            {
              title: "FILTER",
              detail:
                "`FILTER(array, include, if_empty)`. The third argument matters — without it an empty result is #CALC!, which looks like a broken formula rather than 'nothing matched'.",
            },
            {
              title: "SORT and SORTBY",
              detail:
                "SORT orders by a column of the array; SORTBY orders by a separate array. Both live, so they reorder as data changes.",
            },
            {
              title: "UNIQUE",
              detail:
                "Distinct values as a spilled list. Feed it into a dropdown's source and the dropdown maintains itself.",
            },
            {
              title: "Availability",
              detail:
                "Microsoft 365 and Excel 2021 onwards, and Google Sheets. Excel 2019 and earlier do not have them at all — check before building a shared workbook on them.",
            },
          ],
          checks: [
            {
              question: "What does #SPILL! mean?",
              answer:
                "The formula's result needs cells that are not empty. Clear the blocking cells and it spills — the formula itself is fine.",
            },
            {
              question: "Why give FILTER its third argument?",
              answer:
                "Without it, a result with no matches returns #CALC!, which reads as an error rather than as 'nothing matched'.",
            },
            {
              question: "How do you reference a whole spill range?",
              answer:
                "With the hash operator — `A1#` refers to whatever the formula in A1 currently spills, however many rows that is.",
            },
            {
              question: "When would you use FILTER instead of a pivot table?",
              answer:
                "When you want live rows rather than an aggregate, when the output must update without a refresh, or when it feeds another formula. A pivot is better for exploring and for grouped summaries; FILTER is better as a component of a live report.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "read",
              title: "FILTER function",
              url: "https://exceljet.net/functions/filter-function",
              sourceName: "ExcelJet",
              editorNote: "Work through the examples with multiple criteria — that is where it gets useful.",
            },
            {
              type: "doc",
              title: "Dynamic array formulas and spilled array behavior",
              url: "https://support.microsoft.com/en-us/office/dynamic-array-formulas-and-spilled-array-behavior-205c6b06-03ba-4151-89a1-87a7eb36e531",
              sourceName: "Microsoft Support",
              editorNote: "Spilling, the # operator, and the version requirements. Read the last part first.",
            },
          ],
        },
      ],
    },

    {
      title: "A workbook somebody else can use",
      weekRange: "Week 4",
      objective:
        "Turn a working spreadsheet into one a colleague can open, understand, update and not break.",
      deliverable: "A finished workbook with documentation, validation and a tested update path.",
      estHours: 4,
      nodes: [
        {
          title: "Data validation and protecting inputs",
          summary:
            "Stop wrong values arriving. Dropdowns, ranges and rules that make the sheet hard to misuse.",
          learningObjectives: [
            "Add a dropdown fed by a named range",
            "Restrict entries to a numeric or date range with a helpful message",
            "Protect formula cells while leaving inputs editable",
          ],
          whyToday:
            "Everything so far assumed the data is right. Today you stop it being wrong at the point of entry, which is the only place the fix is cheap.",
          principle:
            "Make the wrong entry impossible rather than detectable. Validation at entry costs one setup; cleaning costs every month.",
          commonMistake:
            "Protecting the sheet with a password nobody records. Six months later the workbook is unmaintainable and somebody rebuilds it from scratch. Protection is to prevent accidents, not to secure anything.",
          challenge:
            "Take a form-style sheet and make every input cell validated — dropdowns for categories, date ranges for dates, positive numbers for quantities, each with an input message. Then protect the sheet leaving only inputs editable, and try to break it.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "List validation",
              detail:
                "A dropdown from a range. Point it at a named range or a table column and the list maintains itself as options are added.",
            },
            {
              title: "Range and custom rules",
              detail:
                "Whole numbers between bounds, dates after today, or any formula returning TRUE. Custom rules can enforce cross-cell logic like 'end date after start date'.",
            },
            {
              title: "Input and error messages",
              detail:
                "The input message appears on selection and tells someone what is expected. Writing it is the difference between a helpful sheet and one that just says no.",
            },
            {
              title: "Sheet protection",
              detail:
                "Unlock the input cells, then protect the sheet. Formulas become read-only while data entry works normally. Excel's password is not security — it stops accidents, not people.",
            },
            {
              title: "Validation is not retroactive",
              detail:
                "Adding a rule does not check values already in the cells. Circle Invalid Data finds the ones that predate it.",
            },
          ],
          checks: [
            {
              question: "Does adding validation clean existing data?",
              answer:
                "No. It applies only to new entries. Use Circle Invalid Data to find values that were already there.",
            },
            {
              question: "How do you let people type into a protected sheet?",
              answer:
                "Unlock the input cells first — cells are locked by default and locking only takes effect once the sheet is protected.",
            },
            {
              question: "What is Excel's sheet password actually for?",
              answer:
                "Preventing accidental edits. It is trivially removable and must not be treated as security for anything confidential.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Apply data validation to cells",
              url: "https://support.microsoft.com/en-us/office/apply-data-validation-to-cells-29fecbcc-d1b9-42c1-9d76-eff3ce5f7249",
              sourceName: "Microsoft Support",
              editorNote: "All the rule types plus the input and error messages.",
            },
            {
              type: "read",
              title: "Data validation with a custom formula",
              url: "https://exceljet.net/formulas/data-validation-must-not-exist-in-list",
              sourceName: "ExcelJet",
              editorNote:
                "One worked custom rule, with the anchoring explained. Adapt the pattern rather than copying the example.",
            },
          ],
        },
        {
          title: "Structuring a workbook other people can follow",
          summary:
            "Sheet order, naming, a documentation tab, and the discipline of one purpose per sheet.",
          learningObjectives: [
            "Lay out a workbook so its structure is obvious on opening",
            "Write a documentation sheet worth reading",
            "Say why a sheet with two purposes always becomes a problem",
          ],
          whyToday:
            "The difference between a spreadsheet that survives you leaving and one that gets rebuilt is entirely structure. It costs an hour, once.",
          principle:
            "Somebody will open this without you in the room. Everything they need to understand it has to be in the file.",
          commonMistake:
            "One enormous sheet holding inputs, working, output and a bit of a different report. Nothing can be changed safely because nobody can tell what depends on what.",
          challenge:
            "Restructure a real workbook: a README sheet first, then inputs, then calculations, then outputs, one purpose per sheet, tabs named and colour-coded. Then hand it to a colleague and watch where they hesitate. Their hesitation is your documentation gap.",
          challengeMinutes: 35,
          estMinutes: 50,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "One purpose per sheet",
              detail:
                "Inputs, working, output, reference data. When one sheet does two jobs, a change for one breaks the other and nobody sees it coming.",
            },
            {
              title: "The README sheet",
              detail:
                "First tab. What this workbook is for, where the data comes from, what to update and when, who to ask. Five lines beats none, and none is what most workbooks have.",
            },
            {
              title: "Naming and tab colour",
              detail:
                "Names that say the purpose, not Sheet1. Colour-code by role — one colour for inputs, another for outputs — and the structure is visible without opening anything.",
            },
            {
              title: "Reference data belongs in its own place",
              detail:
                "Rate tables, category lists, mappings. On their own sheet, as tables, they can be updated without touching a formula.",
            },
            {
              title: "Version and date",
              detail:
                "A cell with the last-updated date and by whom. When two copies of a workbook are circulating — and they will be — this is what settles which is current.",
            },
          ],
          checks: [
            {
              question: "What goes on the first sheet?",
              answer:
                "A README: what the workbook is for, where the data comes from, what to update and when, and who to ask.",
            },
            {
              question: "Why is one purpose per sheet worth the extra tabs?",
              answer:
                "Because a sheet doing two jobs cannot be changed for one without risking the other, and the dependency is invisible.",
            },
            {
              question: "Where should a rate table live?",
              answer:
                "On a reference sheet as a table, referenced by name — so rates can be updated without editing any formula.",
            },
            {
              question:
                "You inherit a business-critical workbook nobody understands. How do you approach it?",
              answer:
                "Copy it first. Then map the outputs and trace each back to inputs, listing every hard-coded value and external link on the way. Document what you find in the file itself, add validation to the inputs, and only then change anything — one change at a time, checking the outputs each time.",
              kind: "interview",
              difficulty: "hard",
            },
          ],
          resources: [
            {
              type: "read",
              title: "The ExcelJet formula index",
              url: "https://exceljet.net/formulas",
              sourceName: "ExcelJet",
              editorNote:
                "Several hundred worked formulas grouped by task. Browse the categories matching your work — it is the reference to keep open, not to read.",
            },
            {
              type: "doc",
              title: "Manage worksheets",
              url: "https://support.microsoft.com/en-us/office/insert-or-delete-a-worksheet-19d3d21e-a3b3-4e13-a422-d1f43f1faaf2",
              sourceName: "Microsoft Support",
              editorNote: "Mechanics only — renaming, reordering, tab colour. Two minutes.",
            },
          ],
        },
        {
          title: "Sharing without chaos",
          summary:
            "Co-authoring, comments, change tracking and the reason twelve copies of the same file exist.",
          learningObjectives: [
            "Choose between a shared file and sending copies",
            "Use comments to have a discussion inside the workbook",
            "Protect a workbook's structure without stopping collaboration",
          ],
          whyToday:
            "The technical work is done; the failure mode from here is organisational. Final_v3_JK_edited.xlsx is a process problem, and there are actual tools for it.",
          principle:
            "One file, one place, one version. Every copy is a fork somebody will eventually try to merge by hand.",
          commonMistake:
            "Emailing the workbook for input. Three people edit three copies and someone spends an afternoon reconciling them, badly. A link to one file makes the problem structurally impossible.",
          challenge:
            "Put a workbook somewhere shared, invite one person, and both edit at once. Leave a comment, resolve it, and look at version history. Then write down what your team's actual rule should be, and where it will be written down.",
          challengeMinutes: 25,
          estMinutes: 40,
          points: 25,
          difficulty: "core",
          topics: [
            {
              title: "Co-authoring",
              detail:
                "Several people in one file at once, on OneDrive or SharePoint, with each person's selection visible. Requires the file to live in the cloud, not on a network drive.",
            },
            {
              title: "Comments and notes",
              detail:
                "Threaded comments are a conversation with a resolve button; notes are a sticky label. Use comments for anything expecting a reply.",
            },
            {
              title: "Version history",
              detail:
                "Cloud-stored files keep previous versions you can open and restore. This is the answer to 'it was right on Tuesday'.",
            },
            {
              title: "Protecting structure",
              detail:
                "Workbook protection stops sheets being added, deleted, renamed or reordered while still allowing editing. Different from sheet protection and often what you actually want.",
            },
            {
              title: "When copies are correct",
              detail:
                "A month-end snapshot should be a copy — frozen, dated, and never edited again. The rule is one live file, plus deliberate frozen archives.",
            },
          ],
          checks: [
            {
              question: "What does co-authoring require?",
              answer:
                "The file stored in OneDrive or SharePoint. A shared network drive does not support it.",
            },
            {
              question: "Comment or note?",
              answer:
                "A comment for anything expecting a reply — it threads and can be resolved. A note for a static annotation.",
            },
            {
              question: "When is making a copy the right thing to do?",
              answer:
                "For a deliberate frozen snapshot — a month-end archive that must never change again. Not for collecting edits.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Collaborate on Excel workbooks at the same time",
              url: "https://support.microsoft.com/en-us/office/collaborate-on-excel-workbooks-at-the-same-time-with-co-authoring-7152aa8b-b791-414c-a3bb-3024e46fb104",
              sourceName: "Microsoft Support",
              editorNote: "Requirements and limits. Read the limits — some features disable co-authoring.",
            },
            {
              type: "doc",
              title: "Protect a workbook",
              url: "https://support.microsoft.com/en-us/office/protect-a-workbook-7e365a4d-3e89-4616-84ca-1931257c1517",
              sourceName: "Microsoft Support",
              editorNote: "Workbook structure protection, as distinct from sheet protection.",
            },
          ],
        },
        {
          title: "Speed: what makes a workbook slow",
          summary:
            "Volatile functions, whole-column references and array formulas over a million rows.",
          learningObjectives: [
            "Name the functions that recalculate on every change",
            "Replace whole-column references with table columns",
            "Diagnose a slow workbook rather than guessing",
          ],
          whyToday:
            "A workbook that takes eight seconds per keystroke stops being used. The causes are few and specific, and every one of them is fixable in an afternoon.",
          principle:
            "Slowness is almost always one of three things: volatile functions, references that are far bigger than the data, or a file that has been copied into itself for years.",
          commonMistake:
            "`=SUM(A:A)` on a hundred sheets. It looks tidy and asks Excel to consider a million rows every recalculation. A table column covers exactly the rows that exist.",
          challenge:
            "Find or build a slow workbook. Count its volatile functions, its whole-column references and its conditional formatting rules. Fix the biggest category and time the recalculation before and after.",
          challengeMinutes: 30,
          estMinutes: 45,
          points: 30,
          difficulty: "stretch",
          topics: [
            {
              title: "Volatile functions",
              detail:
                "NOW, TODAY, RAND, OFFSET, INDIRECT and INFO recalculate on every change anywhere in the workbook, and so does everything depending on them. A few are fine; hundreds are not.",
            },
            {
              title: "Whole-column references",
              detail:
                "A:A is 1,048,576 rows. Most functions optimise for it, some do not, and inside SUMPRODUCT or an array formula it is genuinely a million-row operation.",
            },
            {
              title: "INDIRECT and OFFSET",
              detail:
                "Both volatile and both defeat Excel's dependency tracking, so it cannot tell what needs recalculating. INDEX usually does the same job without either problem.",
            },
            {
              title: "Conditional formatting accumulates",
              detail:
                "Copying rows duplicates rules until one sheet has thousands of overlapping ranges. Manage Rules will show you; the count is often shocking.",
            },
            {
              title: "File size and format",
              detail:
                "Formatting applied to entire columns, unused-but-formatted cells stretching to row 900,000, and old .xls files all bloat a workbook. Ctrl+End showing a cell far past your data is the diagnostic.",
            },
          ],
          checks: [
            {
              question: "What makes a function volatile, and why does it matter?",
              answer:
                "It recalculates on every change anywhere in the workbook rather than only when its inputs change. Everything depending on it recalculates too, so the cost multiplies.",
            },
            {
              question: "Why avoid A:A in formulas?",
              answer:
                "It refers to over a million rows. Some functions optimise for it; in array contexts it is a genuine million-row operation on every recalculation.",
            },
            {
              question: "What does Ctrl+End tell you?",
              answer:
                "The last cell Excel thinks is used. If it is far beyond your data, formatting or stray content is inflating the file and slowing everything down.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Volatile functions",
              url: "https://exceljet.net/glossary/volatile-function",
              sourceName: "ExcelJet",
              editorNote: "The list and what volatility costs. Short, and worth remembering.",
            },
            {
              type: "doc",
              title: "Improving calculation performance",
              url: "https://learn.microsoft.com/en-us/office/vba/excel/concepts/excel-performance/excel-improving-calculation-performance",
              sourceName: "Microsoft Learn",
              editorNote:
                "The most thorough treatment of the calculation engine anywhere. Read the sections on references and on volatile functions; skip the VBA.",
            },
          ],
        },
        {
          title: "Build the thing: a report you would actually send",
          summary:
            "One dataset, one question, one page. Everything from the last four weeks, used once, properly.",
          learningObjectives: [
            "Take a raw export to a finished report in one session",
            "State the question the report answers, on the report",
            "Hand it over so somebody else can update it next month",
          ],
          whyToday:
            "Last day. Techniques you have practised separately are only useful once you can run the whole sequence — clean, structure, summarise, present, document — in one go.",
          principle:
            "A report is finished when someone else can update it next month without asking you a question.",
          commonMistake:
            "Making it beautiful before making it correct. Formatting a report whose numbers you have not audited is polishing something you have not checked, and the polish makes people trust it more.",
          challenge:
            "Take a real export from your work or any open dataset. Clean it in Power Query, structure it as a table, summarise it with a pivot, chart the one thing that matters, add a README sheet, and validate the inputs. State the question at the top. Then give it to somebody and ask them to update it — do not help.",
          challengeMinutes: 60,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "The sequence",
              detail:
                "Question first, then clean, then structure, then summarise, then present, then document. Skipping to presentation is the commonest way to produce a beautiful wrong answer.",
            },
            {
              title: "State the question on the page",
              detail:
                "One sentence at the top saying what this answers and over what period. It stops the report being read as an answer to a question it was never asked.",
            },
            {
              title: "Say where the numbers came from",
              detail:
                "Source system, extract date, any rows excluded and why. This is the difference between a report and an assertion.",
            },
            {
              title: "The update path",
              detail:
                "Write down what to replace and what to refresh, in order. If it is more than five steps, simplify the workbook rather than the instructions.",
            },
            {
              title: "The handover test",
              detail:
                "Somebody else updates it while you say nothing. Every question they ask is a defect — in the documentation, the structure, or both.",
            },
          ],
          checks: [
            {
              question: "What is the correct order of work?",
              answer:
                "Question, clean, structure, summarise, present, document. Presenting before auditing produces a polished wrong answer that people believe.",
            },
            {
              question: "Why state the question on the report?",
              answer:
                "So it is not read as the answer to a different question. It also forces you to have one, which is the actual discipline.",
            },
            {
              question: "When is a report genuinely finished?",
              answer:
                "When someone else can update it next month without asking you anything. Until then it is a report only you can run.",
            },
            {
              question: "How do you make a recurring report sustainable?",
              answer:
                "Automate the shaping in Power Query so refresh replaces manual steps, keep source data in tables so ranges track themselves, put every assumption in labelled input cells, validate the inputs, and document the update path in the file. The test is that someone else can run it.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Dynamic array formulas in Excel",
              url: "https://exceljet.net/articles/dynamic-array-formulas-in-excel",
              sourceName: "ExcelJet",
              editorNote:
                "Return to this on the last day. If the spilling behaviour now reads as obvious, week 3 landed.",
            },
            {
              type: "doc",
              title: "Import data from external data sources",
              url: "https://support.microsoft.com/en-us/office/import-data-from-external-data-sources-power-query-be4330b3-5356-486c-a168-b68e9e616f5a",
              sourceName: "Microsoft Support",
              editorNote: "For wiring the challenge's source file so next month is a refresh.",
            },
          ],
        },
      ],
    },
  ],
};
