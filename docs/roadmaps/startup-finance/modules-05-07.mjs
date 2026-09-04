/**
 * Startup finance & fundraising — modules 5–7, days 28–48.
 *
 * The deck and the model behind it, diligence from the investor's side, and
 * the SME IPO layer. Module and day titles, principles and deliverables are
 * the owner's brief verbatim (assets/Finance/roadmap-startup-finance.md).
 *
 * Module 7 anchors on BSE SME, SEBI and Zerodha Varsity. NSE Emerge belongs
 * here and is ABSENT: nseindia.com returns 403 to our link checker on every
 * path, and rule 2 forbids publishing a URL we cannot verify — the same
 * ruling as metaculus.com and cdc.gov elsewhere in the catalogue. The BSE
 * and SEBI documents cover the same framework and can be checked.
 */
export default [
  {
    title: "The pitch deck and the model behind it",
    weekRange: "Weeks 5–6",
    objective:
      "The deck investors actually read, and the model that has to survive their questions.",
    deliverable:
      "A complete driver-based operating model plus a ten-slide deck whose numbers reconcile to it exactly.",
    estHours: 8,
    nodes: [
      {
        title: "What a deck must prove, slide by slide",
        summary: "Ten slides, read in four minutes, each one answering an objection.",
        learningObjectives: [
          "Name the ten slides and the objection each one exists to answer",
          "Read a deck the way an investor does — fast, sceptical, out of order",
          "Diagnose a real deck: which objections it answers and which it dodges",
        ],
        whyToday:
          "The deck is the adviser's most-requested artefact and the most misunderstood: founders write it as a story about themselves, investors read it as a list of reasons to say no. Starting the module here fixes the frame for everything that follows.",
        principle: "Ten slides, and each one answers an objection rather than making a claim.",
        commonMistake:
          "Writing slides that assert instead of answer. 'Huge market' is a claim; the objection is 'why is this reachable by you, now?' A deck built claim-by-claim reads as marketing; built objection-by-objection it reads as evidence — and investors have seen ten thousand of the first kind.",
        challenge:
          "Take one real deck — yours, a client's, or a published one — and write next to each slide the objection it is trying to retire. Mark the slides where no objection is being answered. Those are the slides to cut or rewrite, and that margin note is the adviser's actual edit.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The canonical ten",
            detail:
              "Problem, solution, market, product, traction, model, competition, team, financials, ask. The order varies; the objections do not — each slide exists because investors reliably doubt that specific thing.",
          },
          {
            title: "How it is actually read",
            detail:
              "Minutes, not meetings; traction and team first; the rest skimmed for red flags. The deck's job is to earn the meeting, not to close the round — overloading it confuses those two jobs.",
          },
          {
            title: "The ask slide",
            detail:
              "Amount, what it buys, and what will be true when it runs out. 'Raising ₹8 crore for 18 months to reach X' is an answer; 'raising to accelerate growth' is a dodge investors read as not knowing.",
          },
          {
            title: "Claims versus evidence",
            detail:
              "Every claim on a slide should be one question away from a number in the model or a fact in the data room. Module rule: if the deck says it, day 30 makes the model prove it.",
          },
        ],
        checks: [
          {
            question: "What is each slide of a deck actually for?",
            answer:
              "Retiring a specific, predictable objection — not making a claim. Investors read decks as lists of reasons to say no.",
          },
          {
            question: "What must the ask slide contain?",
            answer:
              "The amount, what it buys, and what will be true when the money runs out — a milestone, not a mood.",
          },
          {
            question: "What is the deck's actual job in a fundraise?",
            answer:
              "Earning the meeting. The round is closed by the process and the evidence, not the PDF.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "A guide to seed fundraising",
            url: "https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising",
            sourceName: "Y Combinator",
            editorNote:
              "Re-read the materials section specifically — what investors expect to see, in their own words. Note how short the expected deck is compared to the ones founders actually send.",
          },
        ],
        concepts: [
          "pitch-deck",
        ],
      },
      {
        title: "Market sizing bottom-up",
        summary: "TAM built from units and prices you can defend, not borrowed from a report.",
        learningObjectives: [
          "Build TAM, SAM and SOM bottom-up from countable units",
          "State every assumption in the chain and its source",
          "Spot a top-down TAM in someone else's deck in under a minute",
        ],
        whyToday:
          "The market slide is where credibility is most often lost in silence. A consulting-report TAM signals that the founder has not done the work — and the bottom-up alternative is a Fermi estimate, which this catalogue already teaches; today applies it with money attached.",
        principle:
          "A TAM copied from a consulting report tells an investor you did not do the work.",
        commonMistake:
          "Starting from the biggest available number and applying percentages — 'the Indian food market is X, we take 1%'. The 1% is not an estimate, it is an admission that no estimate exists. Bottom-up starts from customers who exist and prices someone pays.",
        challenge:
          "Size one real market bottom-up: countable buyers × honest reachable fraction × realistic price, with every input written next to its source. Then find the same market's top-down number in any report and write one line on why they differ. Keep the chain — it goes in the deck on day 34.",
        challengeMinutes: 50,
        estMinutes: 70,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The chain",
            detail:
              "Units that exist (businesses, households, transactions) × the fraction genuinely addressable × price actually paid. Three numbers, each defensible alone — which is the entire advantage over one big borrowed one.",
          },
          {
            title: "TAM, SAM, SOM honestly",
            detail:
              "TAM is everyone who could ever buy; SAM is who your model can serve; SOM is who you can reach in the plan's horizon. The deck's operative number is SOM — the other two are context.",
          },
          {
            title: "Fermi discipline, priced",
            detail:
              "Bound each input above and below, take the defensible middle, and state which input moves the answer most. The thinking-under-uncertainty roadmap's estimation days are exactly this skill.",
          },
          {
            title: "Reading someone else's TAM",
            detail:
              "The tells of a borrowed number: round billions, a named consultancy, a percentage-of-market capture claim. The response is one question — 'walk me through the units'.",
          },
        ],
        checks: [
          {
            question: "What makes a bottom-up TAM more credible than a bigger top-down one?",
            answer:
              "Every link in the chain is individually checkable — units, fraction, price — so the argument can be had about specifics.",
          },
          {
            question: "Which of TAM, SAM and SOM does the plan actually run on?",
            answer:
              "SOM — the share reachable within the plan's horizon. TAM and SAM are context for it.",
          },
          {
            question: "What is the one-question audit of a market slide?",
            answer:
              "'Walk me through the units.' A borrowed number has no units to walk through.",
          },
          {
            question:
              "A deck claims a $50 billion market and a plan to capture 1%. What is wrong, and what do you ask for?",
            answer:
              "The 1% is not a plan — no mechanism in the deck produces exactly one percent of anything, and the number exists because it sounds modest while yielding $500 million. Ask for the bottom-up version: how many buyers exist, what fraction the product can actually serve and reach, at what price. If the founder cannot rebuild the market from units, the market slide is decoration — and the revenue model built on it inherits the same emptiness.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The library's market-sizing pieces show how investors want the chain presented. Read one, then notice your challenge output already matches the format — that is the point.",
          },
        ],
        concepts: [
          "market-sizing",
        ],
      },
      {
        title: "The narrative and the numbers agreeing",
        summary:
          "One story told twice — in prose and in a spreadsheet — with no daylight between.",
        learningObjectives: [
          "Cross-check every deck claim against the model that must generate it",
          "Find narrative-model contradictions fast, in your own work and others'",
          "Fix the disagreement in the right place — sometimes the deck, sometimes the model",
        ],
        whyToday:
          "This is the day the module's two halves are welded. Investors triangulate: the deck says efficient growth, the model shows CAC doubling — and the moment they find one contradiction, every other claim is re-read as suspect.",
        principle: "If the deck and the model disagree, the investor believes neither.",
        commonMistake:
          "Treating deck and model as separate documents owned by separate moods — the deck by optimism, the model by whoever built it last. They are one argument in two formats, and every number that appears in both must be the same number, from the same cell.",
        challenge:
          "Take a deck-and-model pair — yours from this module, or a client's. List every quantitative claim in the deck, and next to each, the model cell that produces it. Every claim with no cell, and every cell that contradicts a claim, goes on the fix list. Do the fixes.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The reconciliation table",
            detail:
              "Claim → source cell → match or mismatch. Mechanical, half an hour, and it catches the contradictions that kill credibility. This becomes a standing artefact: rerun it every time either document changes.",
          },
          {
            title: "Where disagreements come from",
            detail:
              "Versions drift: the deck gets updated for a meeting, the model for a question, and nobody reconciles. The fix is process, not talent — one source of truth, and the deck quotes it.",
          },
          {
            title: "Which one is wrong",
            detail:
              "When they disagree, sometimes the model is stale, sometimes the deck is inflated. Deciding which requires going back to the underlying data — the disagreement is a symptom, not the disease.",
          },
          {
            title: "The investor's triangulation",
            detail:
              "Deck versus model versus data room versus what the founder says in the room. Advisers who pre-run the triangulation control it; those who do not, discover it live.",
          },
        ],
        checks: [
          {
            question: "What happens when an investor finds one deck-model contradiction?",
            answer:
              "Every other claim gets re-read as suspect — the contradiction costs more than the specific number it involves.",
          },
          {
            question: "What is the reconciliation table?",
            answer:
              "Every quantitative deck claim mapped to the model cell that produces it, checked for match — rerun whenever either changes.",
          },
          {
            question: "Why do deck and model drift apart?",
            answer:
              "They get updated on different occasions for different audiences. The cure is one source of truth the deck quotes.",
          },
        ],
        resources: [],
        concepts: [
          "pitch-deck",
          "startup-financial-model",
        ],
      },
      {
        title: "Building a driver-based startup model",
        summary: "An operating model an investor can interrogate — drivers in, financials out.",
        learningObjectives: [
          "Structure the model: drivers → revenue build → costs → cash",
          "Choose drivers a founder actually controls and an investor can test",
          "Keep the whole model interrogable — change one driver, watch everything honest move",
        ],
        whyToday:
          "This is the module's engineering day. A blended-growth-rate model answers no questions; a driver-based one converts every investor question into a cell change — and building one is the difference between presenting a forecast and defending one.",
        principle: "A model with a blended growth rate is a model nobody can interrogate.",
        commonMistake:
          "Making revenue a row that grows by a typed percentage. Revenue must be built — leads × conversion × price, or accounts × seats × expansion — so that 'what if conversion falls' is a question the model can answer rather than an argument nobody can settle.",
        challenge:
          "Build the operating model for one business: five to eight named drivers, a revenue build from them, costs split fixed and variable, and monthly cash. Test: an investor asks 'what if CAC rises 30%?' — the answer should be one cell change and thirty seconds. If it is not, restructure until it is.",
        challengeMinutes: 70,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "What a driver is",
            detail:
              "A quantity someone controls or can evidence: sales hires, leads per rep, conversion, price, churn. Growth rate is not a driver — it is the output the drivers produce.",
          },
          {
            title: "The revenue build",
            detail:
              "Model the machine, not the result: acquisition funnel to customers, customers to revenue via price and retention. Each stage a row, each rate a named assumption with a source.",
          },
          {
            title: "Cost structure",
            detail:
              "Variable costs ride the drivers (support per customer, fees per transaction); fixed costs step with thresholds (a manager per eight reps). Headcount is the driver most models forget to link.",
          },
          {
            title: "Cash, monthly",
            detail:
              "The model's bottom line is the bank balance by month, with collection timing — because module 4's lesson stands: companies die of cash, and the model exists to show the date.",
          },
        ],
        checks: [
          {
            question: "Why is a growth rate not a driver?",
            answer:
              "Nobody controls 'growth' directly — it is the output of controllable inputs like hiring, conversion and churn. Modelling it as an input makes the model unquestionable.",
          },
          {
            question: "What is the test of an interrogable model?",
            answer:
              "Any plausible investor question — 'what if X falls 30%?' — is answerable by one cell change, immediately.",
          },
          {
            question: "What does the model's bottom line have to be?",
            answer:
              "Monthly cash with collection timing — the bank balance and the date it crosses zero.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "SUMIFS function",
            url: "https://exceljet.net/functions/sumifs-function",
            sourceName: "ExcelJet",
            editorNote:
              "The aggregation layer of every driver model — cohorts by month, costs by category. If this is not fluent, the excel-at-work roadmap's aggregation week is the prerequisite being felt.",
          },
        ],
        concepts: [
          "startup-financial-model",
          "excel-scenario-analysis",
        ],
      },
      {
        title: "Scenario and sensitivity in a fundraising model",
        summary: "Showing the downside on purpose — the credibility move almost nobody makes.",
        learningObjectives: [
          "Add base, upside and downside scenarios driven by named switches",
          "Build one-variable sensitivity on the drivers that matter",
          "Present the downside as evidence of seriousness rather than weakness",
        ],
        whyToday:
          "Yesterday's model gets its honesty layer. Every investor privately stress-tests the plan; a founder who arrives with the stress test already done changes the meeting — and Damodaran's scenario discipline from module 3 lands here in operating form.",
        principle: "Show the downside yourself. The investor will find it anyway.",
        commonMistake:
          "A downside scenario that still hits the raise. If the downside case shows the round working and the plan holding, it is not a downside — it is the base case wearing a disclaimer. The honest downside shows what breaks, when, and what management would do about it.",
        challenge:
          "Add three scenarios to yesterday's model via a switch cell — no duplicated sheets. Downside must include: slower conversion, later collections, one lost quarter. Produce the runway date under each scenario, and the one-page sensitivity: which two drivers move cash-out date most.",
        challengeMinutes: 60,
        estMinutes: 75,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "The switch architecture",
            detail:
              "One scenario cell; every scenario-varying assumption looks it up. Duplicated sheets drift within a week — the switch keeps one model telling three stories consistently.",
          },
          {
            title: "Honest downside construction",
            detail:
              "Take the three assumptions the thesis leans on hardest and impair them together — bad quarters correlate. A downside built from one impaired variable understates how failure actually arrives.",
          },
          {
            title: "Sensitivity as triage",
            detail:
              "One-variable data tables on each driver against the cash-out date. The two or three that dominate are where diligence, negotiation and management attention all belong.",
          },
          {
            title: "Presenting it",
            detail:
              "The downside slide says: here is what breaks, here is when, here is the plan. It converts the investor's private stress test into a shared conversation — which is the whole credibility move.",
          },
        ],
        checks: [
          {
            question: "What disqualifies a downside scenario?",
            answer:
              "Still working — if the round closes and the plan holds, it is a base case with a disclaimer, not a downside.",
          },
          {
            question: "Why one switch cell rather than three sheets?",
            answer:
              "Duplicated sheets drift immediately; a switch keeps one structure telling all scenarios consistently.",
          },
          {
            question: "What does sensitivity analysis triage?",
            answer:
              "Which drivers dominate the cash-out date — and therefore where diligence and management attention belong.",
          },
          {
            question:
              "A founder's model shows base, upside and downside — and the downside still reaches profitability on the current raise. Your read?",
            answer:
              "That there is no downside case in the model. A downside where the round still works and the plan holds is the base case with a disclaimer — real downsides show what breaks, when, and what management does about it. I would rebuild it by impairing the two or three assumptions the thesis leans on hardest, together, since bad quarters correlate: slower conversion, later collections, one lost quarter. The result usually moves the raise amount or the milestone — which is why the founder's version avoided it.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Living with noise: valuation in the face of uncertainty",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/probabilistic.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Damodaran on probabilistic approaches — scenarios, simulations, and when each earns its complexity. Read the scenario sections; the simulation half is optional depth.",
          },
        ],
        concepts: [
          "excel-scenario-analysis",
          "startup-financial-model",
        ],
      },
      {
        title: "The data room",
        summary: "The folder that gets diligence done in days instead of months.",
        learningObjectives: [
          "Structure a data room an investor's associate can navigate unaided",
          "Know the standard index: corporate, financial, commercial, legal, team",
          "Read data-room hygiene as the signal investors take it to be",
        ],
        whyToday:
          "Between the pitch and the cheque sits diligence, and the data room is its venue. Advisers usually assemble it — and its speed and order are read, fairly, as a proxy for the company's. This day also sets up module 6, which sits on the other side of the same folder.",
        principle:
          "Diligence speed is a signal. A disorganised data room reads as a disorganised company.",
        commonMistake:
          "Assembling the room reactively, uploading whatever each investor asks for as they ask. The room should be built once, complete, before the process starts — because the second investor's associate finding gaps the first one filled reads exactly as bad as it is.",
        challenge:
          "Write the full data-room index for a Series A — every folder, every document, and for each document one line: what a diligence associate is checking with it. The index is an adviser deliverable in its own right; a founder given this list knows exactly what to gather.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The standard index",
            detail:
              "Corporate (incorporation, cap table, board minutes), financial (statements, MIS, bank), commercial (contracts, pipeline, metrics), legal (IP, litigation, licences), team (ESOP, key contracts). Predictable structure is the courtesy.",
          },
          {
            title: "The cap table's home",
            detail:
              "The module-2 model — documents-reconciled, formula-driven — lives here, beside the documents that prove it. A cap table that matches its documents on first check buys credibility for everything else.",
          },
          {
            title: "Versioning and access",
            detail:
              "Dated files, one current version each, access logged. Stale duplicates and 'final_v3_new' filenames read as the company's actual state of mind.",
          },
          {
            title: "What absence signals",
            detail:
              "A missing document is a finding: no board minutes means no governance rhythm; no signed contracts means the revenue is handshakes. Module 6 reads gaps exactly this way.",
          },
        ],
        checks: [
          {
            question: "When should the data room be complete?",
            answer:
              "Before the process starts — built once, not assembled reactively per investor request.",
          },
          {
            question: "What are the five standard sections?",
            answer: "Corporate, financial, commercial, legal, and team/ESOP.",
          },
          {
            question: "Why is data-room hygiene read as a signal?",
            answer:
              "Fairly or not, investors take the room's order and speed as a proxy for the company's — it is the one operational artefact they experience directly.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Stripe Atlas guides",
            url: "https://stripe.com/atlas/guides",
            sourceName: "Stripe",
            editorNote:
              "Practical, founder-facing writing on the mechanics around a raise. The guides on equity and fundraising paperwork map to the corporate section of today's index.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "pitch-deck",
        ],
      },
      {
        title: "Auditing a founder's model",
        summary:
          "The module capstone — and the skill the brief names as the job: finding the errors in someone else's spreadsheet.",
        learningObjectives: [
          "Run a structured model audit: structure, hardcodes, links, signs, sanity",
          "Find the assumption doing the most work and test it first",
          "Complete the module deliverable: model and deck, reconciled exactly",
        ],
        whyToday:
          "The brief's sharpest line: an adviser spends more time finding errors in models than building them. Today converts the week's construction knowledge into audit instinct — you know where bodies get buried because you have just built the graveyard.",
        principle: "You will spend more time finding errors in models than building them.",
        commonMistake:
          "Auditing by re-deriving the answer. The efficient audit is structural: trace the drivers, hunt hardcodes among formulas, check signs and sum ranges, then sanity-check outputs against module-4 benchmarks. Rebuilding finds your errors; auditing finds theirs.",
        challenge:
          "Swap models with someone — or take any founder model you can get — and run the full audit: hardcode hunt, link trace, sign check, benchmark sanity, load-bearing assumption. Write the findings memo. Then complete the module deliverable: your own model and ten-slide deck, reconciled line by line.",
        challengeMinutes: 80,
        estMinutes: 95,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The audit sequence",
            detail:
              "Structure first (where do inputs live?), then hardcodes (constants hiding mid-formula), then links (broken ranges, off-by-one sums), then signs (costs entered positive), then sanity (outputs versus unit-economics benchmarks). Order matters — structure findings change everything after.",
          },
          {
            title: "The hardcode hunt",
            detail:
              "The classic startup-model bug: a formula row with one typed number where a growth assumption was 'temporarily' overridden and never restored. Excel's trace and go-to-special tools find them in minutes.",
          },
          {
            title: "Benchmark sanity",
            detail:
              "Module 4 is the reference table: does modelled CAC payback, NRR, contribution match any real company that has ever existed? A model can be internally consistent and externally impossible.",
          },
          {
            title: "The findings memo",
            detail:
              "Errors ranked by effect on the conclusion, not by count. Three material findings with cell references beat forty trivia — the memo is advice, not proofreading.",
          },
        ],
        checks: [
          {
            question: "Why is structural auditing better than re-deriving?",
            answer:
              "Re-deriving finds your own errors and takes days; tracing structure, hardcodes, signs and sanity finds theirs in hours.",
          },
          {
            question: "What is the classic hardcode bug?",
            answer:
              "A typed constant sitting inside a formula row — a 'temporary' override that never got restored and silently anchors the forecast.",
          },
          {
            question: "How should audit findings be ranked?",
            answer:
              "By effect on the conclusion — material findings with cell references, not a count of trivia.",
          },
          {
            question:
              "You are handed a founder's model an hour before a call. What do you check, in order?",
            answer:
              "Structure — where inputs live and whether revenue is driver-built or a typed growth row, which alone tells you how seriously to take it. Then hardcodes in the formula rows, then the cash line: does the model reach a bank balance, and when does it cross zero? Then one sanity check of the headline outputs against unit-economics benchmarks. In an hour you will not verify the model; you will find whether it is the kind of model that can be verified — and that is the first sentence of the call.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [],
        concepts: [
          "model-audit",
          "startup-financial-model",
          "excel-error-handling",
        ],
      },
    ],
  },
  {
    title: "Due diligence from the investor's side",
    weekRange: "Weeks 7–8",
    objective: "Reading a company the way the people writing the cheque do.",
    deliverable:
      "A full investment memo on a real startup — thesis, unit economics, valuation, risks, and an explicit statement of what would falsify your view.",
    estHours: 7.75,
    nodes: [
      {
        title: "What diligence is actually looking for",
        summary: "Not verification — the search for the reason to say no.",
        learningObjectives: [
          "State diligence's real objective and how it shapes the process",
          "Map the workstreams: financial, commercial, legal, team — and who runs each",
          "Scope diligence to the stage: what seed, Series A and growth each check",
        ],
        whyToday:
          "The module's frame has to come first: diligence is adversarial by design, and everything in it — the sequence, the sampling, the interviews — follows from looking for the kill rather than confirming the pitch. Advisers who understand this serve both sides better.",
        principle: "Diligence is not verification. It is looking for the reason not to invest.",
        commonMistake:
          "Running diligence as a checklist to complete rather than a thesis to attack. The checklist mind confirms what the data room offers; the diligence mind asks what would have to be false for this deal to be a mistake, and goes looking for exactly that.",
        challenge:
          "Pick a startup you find genuinely attractive. Write the bear case first — the three most plausible reasons this fails — and then design the specific checks that would confirm or retire each. That inversion, attraction into attack, is the module's method statement.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The adversarial frame",
            detail:
              "The pitch is the best case; diligence exists to find what the best case omits. This is not cynicism — it is the division of labour that lets enthusiasm and scrutiny coexist in one firm.",
          },
          {
            title: "The workstreams",
            detail:
              "Financial (the numbers are real), commercial (the market and customers are real), legal (the company owns what it claims), team (the people are who they seem). Different specialists, one synthesis.",
          },
          {
            title: "Stage calibration",
            detail:
              "Seed diligence is mostly team and market — there is little else. Series A adds unit economics and cohorts. Growth adds quality of earnings and full financial diligence. Applying growth diligence to a seed deal is theatre.",
          },
          {
            title: "The kill list",
            detail:
              "Good diligence starts by naming what would kill the deal, then checks those first. Everything else is documentation; the kill list is the work.",
          },
        ],
        checks: [
          {
            question: "What is diligence actually optimised to find?",
            answer:
              "The reason not to invest — it attacks the thesis rather than confirming the pitch.",
          },
          {
            question: "How does diligence differ by stage?",
            answer:
              "Seed checks team and market; Series A adds unit economics and cohorts; growth adds quality of earnings and full financial work.",
          },
          {
            question: "What is the kill list?",
            answer:
              "The named things that would kill the deal, checked first — the thesis's weakest points, not the checklist's first page.",
          },
          {
            question: "How would you scope diligence for a seed deal versus a growth deal?",
            answer:
              "By what exists to check. At seed there are barely any numbers, so the work is team and market: founder history verified, references done properly, the market sized bottom-up. At Series A, unit economics and cohorts become checkable and become the centre. At growth, full financial diligence — quality of earnings, working capital, legal — earns its cost. Running growth-stage diligence on a seed deal is theatre; skipping it on a growth deal is negligence. The scope follows the evidence available, not the cheque size.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "Read one essay on how investors decide — the library's investor-perspective pieces show the thesis-first thinking today's kill-list method mirrors.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "due-diligence-commercial",
        ],
      },
      {
        title: "Quality of revenue",
        summary: "Recognised, collected, retained — three different claims wearing one word.",
        learningObjectives: [
          "Decompose reported revenue: recognition policy, collection reality, retention durability",
          "Test revenue quality: concentration, related parties, channel stuffing, refunds",
          "Read receivables against revenue as the first honesty check",
        ],
        whyToday:
          "Revenue is the number the valuation multiplies, so it is where diligence bites first. The quality question — is this revenue real, collectible and repeatable? — reuses module 4's metrics with an auditor's suspicion attached.",
        principle:
          "Revenue recognised is not revenue collected, and neither is revenue retained.",
        commonMistake:
          "Accepting the revenue line and moving to costs. The line is a policy output: annual contracts recognised upfront, pilots booked as sales, GMV dressed as revenue, incentives netted or not — the policy choices are worth more diligence than the arithmetic below them.",
        challenge:
          "For one company — real filings or a case — build the revenue quality table: reported revenue, less doubtful recognition, less uncollected (receivables trend), less non-recurring. The gap between the top and bottom lines is the finding; write it as two sentences a partner would read.",
        challengeMinutes: 55,
        estMinutes: 70,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Recognition policy",
            detail:
              "When is a sale a sale — on signing, delivery, or cash? Aggressive recognition pulls the future into today. The policy note is the first read; the change in policy year-over-year is the second.",
          },
          {
            title: "Collection reality",
            detail:
              "Receivables growing faster than revenue is the classic tell: booking is outrunning collecting. Days sales outstanding, trended, converts the suspicion into a number.",
          },
          {
            title: "Concentration and relationships",
            detail:
              "Top-five customer share, related-party sales, and revenue that arrived just before the raise. Each is a discount factor on the multiple, and together they can be the whole finding.",
          },
          {
            title: "Retention as quality",
            detail:
              "Module 4's cohort work returns as evidence: revenue that repeats is worth a multiple of revenue that must be resold. The retention curve is the quality-of-revenue exhibit.",
          },
        ],
        checks: [
          {
            question: "What is the classic receivables tell?",
            answer:
              "Receivables growing faster than revenue — booking outrunning collection, visible in trended DSO.",
          },
          {
            question: "Why does recognition policy matter more than arithmetic?",
            answer:
              "The policy decides what counts as revenue at all — aggressive recognition pulls future periods into today before any addition happens.",
          },
          {
            question: "What converts revenue quality into valuation impact?",
            answer:
              "Durability — retained, diversified, arm's-length revenue carries a higher multiple than concentrated or resold revenue.",
          },
          {
            question:
              "A target's revenue grew 40% and receivables grew 90% in the same year. What is your working hypothesis and how do you test it?",
            answer:
              "Booking is outrunning collecting — some of the growth is sales the customers have not paid for and may never pay for. Test it three ways: days sales outstanding trended over eight quarters, not two points; the ageing schedule, to see whether the growth sits in the oldest buckets; and revenue by month against the diligence date, to catch a quarter-end stuffing pattern. Then the sharpest question: what were the payment terms on the biggest new contracts of the year? Extended terms bought growth, and the buyer should not pay for it twice.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — fundamental analysis",
            url: "https://zerodha.com/varsity/module/fundamental-analysis/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The revenue and receivables chapters model the honest read; today's DSO drill is that read with suspicion added.",
          },
        ],
        concepts: [
          "due-diligence-financial",
        ],
      },
      {
        title: "Quality of earnings and normalisation",
        summary: "The EBITDA under the EBITDA — finding what the adjustments hope you miss.",
        learningObjectives: [
          "Normalise EBITDA: one-offs, related-party pricing, owner costs, timing games",
          "Challenge add-backs — which are honest and which are recurring costs in costume",
          "Produce the bridge from reported to sustainable earnings",
        ],
        whyToday:
          "Where revenue quality asks if the top line is real, earnings quality asks what the business sustainably makes — the number a buyer actually prices. This is transaction advisory's core craft, and the brief's audience will do it professionally within months.",
        principle: "Every founder's EBITDA contains at least one adjustment they hope you miss.",
        commonMistake:
          "Accepting 'adjusted EBITDA' with its adjustments unlisted. The adjustments are the analysis: a one-time legal cost may be genuinely one-time, or it may be the third 'one-time' legal cost in three years. The word 'adjusted' is where diligence starts, not where it stops.",
        challenge:
          "Take a reported-to-adjusted EBITDA bridge — from any filing or case — and audit each adjustment: genuinely non-recurring, or recurring-in-costume? Rebuild the bridge with only the adjustments you would defend, and state the sustainable number. The delta is the negotiation.",
        challengeMinutes: 55,
        estMinutes: 70,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The standard add-backs",
            detail:
              "One-time legal, restructuring, founder excess salary, launch costs. Each is sometimes honest; the test is recurrence — three consecutive one-times are a run rate.",
          },
          {
            title: "Related-party normalisation",
            detail:
              "Rent from a founder's family firm, supplies from a cousin's company — priced kindly in either direction. Normalising to market prices can move EBITDA materially in small companies.",
          },
          {
            title: "Timing games",
            detail:
              "Expenses deferred past the measurement window, maintenance skipped in the sale year, hiring frozen for the metrics. The trailing-twelve-months picture versus the three-year average exposes most of them.",
          },
          {
            title: "The bridge as artefact",
            detail:
              "Reported → each adjustment with a verdict → sustainable. One exhibit, every disagreement locatable — this is the page the price negotiation actually happens on.",
          },
        ],
        checks: [
          {
            question: "What is the test for an honest add-back?",
            answer:
              "Non-recurrence — a cost that appears repeatedly is a run-rate expense whatever it is labelled.",
          },
          {
            question: "Why do related-party transactions need normalisation?",
            answer:
              "Their pricing is discretionary, so reported costs can flatter earnings in either direction; market pricing restores the real number.",
          },
          {
            question: "What does the QoE bridge enable?",
            answer:
              "A price negotiation with locatable disagreements — each adjustment argued on its own evidence.",
          },
          {
            question:
              "A target's adjusted EBITDA adds back ₹2 crore of 'one-time' costs. How do you evaluate it?",
            answer:
              "Item by item, against history. Pull three years of the same P&L lines: a truly one-time cost appears once; the third consecutive 'one-time restructuring' is a recurring cost wearing a label. Check related-party items at market pricing, founder compensation against a replacement salary, and whether any deferred maintenance or frozen hiring flatters the year. Then rebuild the bridge with only defensible adjustments — the buyer prices the sustainable number, and the delta on that bridge is usually worth more than the fee.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — fundamental analysis",
            url: "https://zerodha.com/varsity/module/fundamental-analysis/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The P&L quality discussion here is the gentle version of today's adversarial one — read it as the baseline the adjustments distort.",
          },
        ],
        concepts: [
          "due-diligence-financial",
        ],
      },
      {
        title: "Working capital and the cash conversion cycle",
        summary: "Profit is an opinion; the cycle is where the cash actually lives.",
        learningObjectives: [
          "Compute DSO, DIO, DPO and the cash conversion cycle, trended",
          "Model what growth does to working capital needs",
          "Spot window-dressing: the balance-sheet date as the company's best day",
        ],
        whyToday:
          "The silent killer in SME deals: profitable companies that die of working capital. For the brief's SME-IPO audience this is doubly load-bearing — listing-year accounts are precisely where cycles get dressed.",
        principle: "A profitable company with a 90-day cycle can still die.",
        commonMistake:
          "Reading working capital from the balance-sheet date alone. The date is chosen; the monthly picture is the truth. A company that collects hard every March 28th has a March 31st balance sheet and an April problem — ask for twelve month-ends, not one.",
        challenge:
          "For one company: DSO, DIO, DPO and the cycle, trended over three years. Then the growth test — model the incremental working capital its own growth plan requires, and check the funding plan covers it. Companies that grow into insolvency do it exactly here.",
        challengeMinutes: 50,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The cycle",
            detail:
              "DSO + DIO − DPO: days from paying suppliers to collecting from customers. Every day of the cycle is cash the company must fund; the cycle times daily revenue is the standing investment.",
          },
          {
            title: "Growth eats cash",
            detail:
              "A positive cycle means every rupee of new revenue requires working capital upfront — growth accelerates the need exactly when ambition peaks. The model must fund the growth's cycle, not just its costs.",
          },
          {
            title: "The trend over the level",
            detail:
              "A stable 60-day cycle is a characteristic; a cycle stretching 45→60→75 is a story — customers paying slower, or sales pushed with terms. The trend is the finding.",
          },
          {
            title: "Window-dressing",
            detail:
              "Collections sprinted and payments stalled around the reporting date. Twelve month-end balances expose it; the gap between the average month and the reported month is the dressing, measured.",
          },
        ],
        checks: [
          {
            question: "State the cash conversion cycle formula and its meaning.",
            answer:
              "DSO + DIO − DPO: the days between paying for inputs and collecting from customers — each day is cash the company must fund.",
          },
          {
            question: "Why does growth worsen a positive cycle?",
            answer:
              "Each rupee of new revenue demands its cycle's working capital upfront — the need scales with the ambition.",
          },
          {
            question: "How is balance-sheet window-dressing caught?",
            answer:
              "Twelve month-end balances instead of one — the reported date versus the average month measures the dressing.",
          },
          {
            question:
              "A distributor with 6% margins wants to triple revenue in two years and has modelled the profit. What has the model probably missed?",
            answer:
              "The cash the growth consumes. With a typical distributor cycle — inventory plus receivables well ahead of payables — every incremental rupee of revenue demands its share of working capital upfront, and tripling revenue can require more cash than several years of 6% margins generate. The model shows profit because accrual profit ignores the funding gap. The check is one line: incremental working capital at the current cycle versus the funding plan. Companies grow into insolvency through exactly this door.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — fundamental analysis",
            url: "https://zerodha.com/varsity/module/fundamental-analysis/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The ratio and working-capital chapters ground today's cycle arithmetic in real Indian statements. Free, no signup.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "working-capital",
        ],
      },
      {
        title: "Founder and team assessment",
        summary: "The seed-stage truth said out loud: you are underwriting people.",
        learningObjectives: [
          "Assess founders on evidence: history, references, behaviour under questions",
          "Run reference calls that produce information rather than praise",
          "Separate assessable signals from the halo effects that pass for judgement",
        ],
        whyToday:
          "The earlier the stage, the more the deal is the people — and the field runs on unexamined pattern-matching. This day imports the judgement discipline the catalogue already teaches into the highest-stakes read an early investor makes.",
        principle:
          "At seed stage you are underwriting the founder. Say so, and assess accordingly.",
        commonMistake:
          "Confusing polish with evidence. A rehearsed narrative and confident answers correlate with fundraising skill, not with company-building — the assessable evidence is history, behaviour when challenged in the room, and what references say when asked properly.",
        challenge:
          "Design the founder-assessment protocol you would actually run: five interview questions probing history and thinking rather than narrative, three reference questions that permit unflattering answers, and the specific behaviours you would treat as signal. Protocols beat vibes; write yours down.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "History over narrative",
            detail:
              "What they have actually built, shipped, sold or survived — verified, not recounted. The best predictor available, and the one a rehearsed pitch cannot manufacture.",
          },
          {
            title: "Reference calls that work",
            detail:
              "Off-list references, specific questions — 'what would they be worst at?', 'would you work for them again, honestly?' — and attention to hesitations. On-list references answering general questions produce recommendation letters, verbally.",
          },
          {
            title: "The room as evidence",
            detail:
              "How they handle the question they did not prepare, disagreement with their thesis, and 'I do not know'. Defensiveness under mild challenge at pitch stage prices what board meetings will be like.",
          },
          {
            title: "Halo hygiene",
            detail:
              "Pedigree, charisma and resemblance to past winners are the three standard halos — each one a bias with a name, from the same catalogue the thinking roadmap teaches. Naming them in the memo is the antidote.",
          },
        ],
        checks: [
          {
            question: "What founder evidence can a pitch not manufacture?",
            answer:
              "Verified history — what they actually built, shipped or survived — and unrehearsed behaviour under challenge.",
          },
          {
            question: "What makes a reference call informative?",
            answer:
              "Off-list references and questions that permit unflattering answers — hesitations included as data.",
          },
          {
            question: "Name the three standard halos in founder assessment.",
            answer:
              "Pedigree, charisma, and resemblance to past winners — biases to name in the memo, not judgements.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "YC's essays on what they look for in founders — read one as the practitioner's benchmark, then notice how much of it is history and behaviour rather than polish. Your protocol should test for the same things.",
          },
        ],
        concepts: [
          "due-diligence-commercial",
        ],
      },
      {
        title: "Legal, regulatory and compliance red flags",
        summary: "The company's behaviour when nobody was watching, read from its filings.",
        learningObjectives: [
          "Run the compliance scan: filings, licences, disputes, related-party disclosure",
          "Distinguish fatal flags from fixable hygiene — and price the fixable ones",
          "Know when to stop and send for lawyers",
        ],
        whyToday:
          "The adviser is not the lawyer, but the adviser is the person who decides when lawyers are needed — and the compliance record is character evidence: how the company behaves under rules predicts how it behaves under investors.",
        principle:
          "The compliance history tells you how the company behaves when nobody is watching.",
        commonMistake:
          "Binary reading — clean or dirty. The useful reading is graded: late annual filings are hygiene, priced in time and cost to cure; undisclosed related-party flows or unregistered core IP are character; a licence the business cannot operate without, absent, is a valuation event, not a footnote.",
        challenge:
          "Build the red-flag checklist for an Indian private company: what to pull, where it lives publicly, and a three-grade severity scale — hygiene, character, fatal — with one example each. Then run it on a real company as far as public records allow.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The public scan",
            detail:
              "Statutory filings and their timeliness, charges on assets, director disqualifications, litigation, GST and tax standing. Much of it is public; the adviser's first pass costs an afternoon.",
          },
          {
            title: "The IP question",
            detail:
              "Who owns the code, the brand, the patents — the company, or a founder personally, or a previous employer arguably? Assignment gaps are among the most common and most fixable pre-round findings.",
          },
          {
            title: "Grading severity",
            detail:
              "Hygiene: cure with time and fees. Character: pattern of choices, priced into terms and trust. Fatal: the deal-stopper — operating without a required licence, undisclosed material litigation. The grade drives the response.",
          },
          {
            title: "When to escalate",
            detail:
              "The adviser scans and grades; lawyers verify and cure. The escalation trigger is anything graded character or fatal — and the escalation itself, early, is part of the advice.",
          },
        ],
        checks: [
          {
            question: "Why is compliance history read as character evidence?",
            answer:
              "It records the company's behaviour under rules when nobody was checking — the best available predictor of behaviour under investors.",
          },
          {
            question: "What are the three severity grades and their responses?",
            answer:
              "Hygiene (cure with time and fees), character (price into terms and trust), fatal (stop until resolved).",
          },
          {
            question: "What is the most common fixable IP finding?",
            answer:
              "Assignment gaps — code or brand owned by a founder personally or clouded by a previous employer, curable before a round if caught.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — legal framework and regulations",
            url:
              "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=3&smid=0",
            sourceName: "SEBI",
            editorNote:
              "The regulator's own index of the rules. For private-company diligence it is context; module 7 makes it central. Bookmark it — this listing is where 'check the current circular' starts.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "regulatory-sebi",
        ],
      },
      {
        title: "Writing the investment memo",
        summary: "The module deliverable: the document that commits your judgement to paper.",
        learningObjectives: [
          "Structure the memo: thesis, evidence, risks, valuation, recommendation, falsifier",
          "Write the falsification clause — what would change your mind, specifically",
          "Complete the full memo on a real startup",
        ],
        whyToday:
          "Everything the module gathered becomes accountable here. The memo is where diligence stops being activity and becomes judgement — and the falsifier clause imports the calibration discipline this catalogue teaches into the document that firms actually argue over.",
        principle: "A memo that does not state what would change your mind is not a memo.",
        commonMistake:
          "Writing the memo as advocacy. A memo that only argues for the deal has pre-decided — the honest structure carries the bear case at full strength, states the kill conditions, and lets the recommendation survive contact with both. Partners fund memos they can argue with.",
        challenge:
          "Complete the module deliverable: a full memo on one real startup — thesis, unit economics (module 4), valuation (module 3), diligence findings (this module), risks graded, recommendation, and the explicit falsifier: the two or three observations that would reverse your view. Two to four pages. This is a portfolio artefact; write it like one.",
        challengeMinutes: 85,
        estMinutes: 100,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The structure",
            detail:
              "One-paragraph thesis; the evidence for it; the bear case at full strength; valuation with the load-bearing assumption named; risks graded; recommendation; falsifier. Each section short enough to be argued with.",
          },
          {
            title: "The falsifier clause",
            detail:
              "Named in advance: 'if cohort retention is below X, if the top customer is related-party, if reference calls surface Y — I reverse.' It converts the memo from advocacy into a testable position, and it is the clause that makes post-mortems honest.",
          },
          {
            title: "The bear case at strength",
            detail:
              "Written as its best advocate would write it, not as a foil. A memo whose bear case is a strawman has told the reader the author stopped thinking at yes.",
          },
          {
            title: "Judgement, owned",
            detail:
              "The memo ends in a recommendation with a name on it. Hedged conclusions are the genre's failure mode — the entire apparatus exists so one person can say 'invest' or 'pass' and be examinable about why.",
          },
        ],
        checks: [
          {
            question: "What does the falsifier clause do to a memo?",
            answer:
              "Converts it from advocacy into a testable position — the conditions that would reverse the view are named before the outcome is known.",
          },
          {
            question: "What standard must the bear case meet?",
            answer:
              "Its best advocate's — a strawman bear case tells the reader the thinking stopped at yes.",
          },
          {
            question: "What is the memo's failure mode?",
            answer:
              "The hedged conclusion — the document exists so a named person can say invest or pass, examinably.",
          },
        ],
        resources: [],
        concepts: [
          "due-diligence-financial",
          "due-diligence-commercial",
          "startup-valuation",
        ],
      },
    ],
  },
  {
    title: "SME IPO and the Indian regulatory layer",
    weekRange: "Weeks 8–9",
    objective: "The India-specific module, and the one that rots fastest.",
    deliverable:
      "Read one filed DRHP end to end and produce a two-page critical summary — the business, the risks that matter, and the three questions you would ask management.",
    estHours: 7,
    nodes: [
      {
        title: "Why an SME lists at all",
        summary: "The IPO as one financing option among several — evaluated, not celebrated.",
        learningObjectives: [
          "Weigh listing against the alternatives: PE, debt, staying private",
          "Price the real costs — fees, compliance, disclosure, founder time",
          "Name the wrong reasons to list, which an adviser will hear weekly",
        ],
        whyToday:
          "The module opens with the decision, not the process — because the adviser's first job is telling some clients not to do it. The SME platforms have real momentum in India, and momentum is exactly when the financing-decision framing earns its keep.",
        principle: "An IPO is a financing decision, not a milestone.",
        commonMistake:
          "Treating the listing as the goal and working backwards. The honest analysis starts from what the company needs — capital, liquidity for early holders, currency for acquisitions, credibility with lenders — and asks whether a listing is the cheapest way to get it. Often it is not.",
        challenge:
          "Take one SME that recently listed (the exchanges publish them). From its offer document's stated objects and its financials, write one page: what it actually needed, what the listing cost all-in, and whether an alternative would have been cheaper. Conclude honestly — sometimes the answer is 'the IPO was right'.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "What a listing buys",
            detail:
              "Primary capital, an exit path for early investors, paper for acquisitions and ESOPs, and the credibility that comes with disclosure. Each has a private-market substitute at a price — the comparison is the analysis.",
          },
          {
            title: "What it costs",
            detail:
              "Merchant banker and intermediary fees, ongoing compliance and disclosure, quarterly scrutiny, and a founder-year of attention. All-in costs on small raises can be a material slice of the proceeds.",
          },
          {
            title: "The wrong reasons",
            detail:
              "Prestige, a peer listed, 'the market is hot'. Each produces listed companies that should not be — thinly traded, compliance-burdened, and worse off than before. The adviser hears all three weekly.",
          },
          {
            title: "The SME platform's actual promise",
            detail:
              "A listing venue sized for companies the main board would reject — lower thresholds, lighter ongoing burden, and a migration path when scale arrives. Day 47 walks the staircase.",
          },
        ],
        checks: [
          {
            question: "What is the honest starting question for a listing decision?",
            answer:
              "What does the company actually need — capital, liquidity, currency, credibility — and is a listing the cheapest way to get it?",
          },
          {
            question: "Name three wrong reasons to list.",
            answer:
              "Prestige, a competitor listed, and a hot market — none is a financing rationale.",
          },
          {
            question: "What does an SME platform offer that the main board does not?",
            answer:
              "Entry thresholds and ongoing burden sized for smaller companies, with a migration path to the main board later.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — the IPO markets, part 1",
            url: "https://zerodha.com/varsity/chapter/the-ipo-markets-part-1/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The why and the who of going public, in plain Indian-market language, free with no signup. Read it today; part 2 carries the process on day 46.",
          },
        ],
        concepts: [
          "sme-ipo-framework",
        ],
      },
      {
        title: "NSE Emerge and BSE SME — eligibility",
        summary: "The criteria that decide the timeline before any banker is hired.",
        learningObjectives: [
          "Work through the SME platform eligibility heads: net worth, track record, profitability",
          "Map a real company against the criteria and find its binding constraint",
          "Explain why eligibility drives timeline more than ambition does",
        ],
        whyToday:
          "Eligibility is the gate everything else queues behind: a company two years from qualifying has a two-year advisory plan, not an IPO plan. The criteria themselves are checkable facts — and they change by circular, which is why this day teaches the checking, not just the current numbers.",
        principle:
          "The eligibility criteria decide the timeline more than anything the company does.",
        commonMistake:
          "Quoting eligibility numbers from memory or from a blog. The criteria are exchange rules amended by circular — the adviser's habit is pulling the current criteria pages at every engagement, because advice built on last year's thresholds is malpractice with citations.",
        challenge:
          "Pull the current BSE SME eligibility criteria from the exchange itself. Map one real private company against every head — net worth, track record, profitability, the rest — and write the gap analysis: which criterion binds, what closes the gap, and the earliest honest filing date.",
        challengeMinutes: 50,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The heads of eligibility",
            detail:
              "Post-issue capital bounds, net worth, tangible assets, track record and profitability history, plus governance basics. Each platform publishes its own current list — the list is the law here.",
          },
          {
            title: "The binding constraint",
            detail:
              "Most companies fail one head, not all of them. Finding the binding constraint converts 'can we list?' into a dated plan: what must be true, by when, evidenced how.",
          },
          {
            title: "Two exchanges, one framework",
            detail:
              "BSE SME and NSE Emerge implement the same SEBI framework with their own criteria and processes. Advisers compare both for each client; this roadmap cites BSE's pages because NSE's site blocks automated verification — the framework knowledge transfers wholly.",
          },
          {
            title: "Criteria drift",
            detail:
              "Thresholds move by circular — sometimes materially. The skill being taught is the verification habit: current page, current circular, dated note in the file.",
          },
        ],
        checks: [
          {
            question: "Why does eligibility drive the timeline?",
            answer:
              "A company short of a criterion cannot file until it cures the gap — the cure time, not the ambition, sets the earliest date.",
          },
          {
            question: "What is the binding-constraint method?",
            answer:
              "Map the company against every head, find the one it fails, and plan against that — it converts eligibility into a dated to-do.",
          },
          {
            question: "Why must criteria be pulled fresh each engagement?",
            answer:
              "They are amended by circular; advice on stale thresholds is wrong with confidence.",
          },
          {
            question:
              "A promoter wants to file for an SME listing in six months. What do you check first, and why?",
            answer:
              "Current eligibility, head by head, from the exchange's own page — because a single failed criterion makes every other workstream irrelevant until cured. Then the track-record and profitability heads specifically, since they are the ones time alone can fix and therefore the ones that set real timelines. The six-month ambition is an output of that gap analysis, not an input to it — and telling the promoter so is the first piece of advice.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "BSE SME platform",
            url: "https://www.bsesme.com/",
            sourceName: "BSE",
            editorNote:
              "The exchange's own SME site — eligibility, process and the list of companies on the platform. This is the primary source the challenge pulls from; blogs summarising it go stale.",
          },
          {
            type: "doc",
            title: "BSE — about the SME platform",
            url: "https://www.bseindia.com/static/about/bsesme.html",
            sourceName: "BSE",
            editorNote: "The main-site companion page — framework context around the platform.",
          },
        ],
        concepts: [
          "sme-ipo-framework",
        ],
      },
      {
        title: "The DRHP, section by section",
        summary: "The anatomy of the offer document — and where its truth density varies.",
        learningObjectives: [
          "Map the DRHP's sections and each one's job",
          "Know who writes each part and for whom — which sections sell, which confess",
          "Read risk factors first, and know why",
        ],
        whyToday:
          "The DRHP is the genre's central document — for issuers, the disclosure burden; for analysts, the richest free company document India produces. Learning its anatomy today makes tomorrow's critical read possible.",
        principle:
          "The risk factors are the only part written by lawyers protecting themselves. Read them first.",
        commonMistake:
          "Reading front to back. The front is written to sell; the truth density lives in risk factors, related-party disclosures, litigation, and the financial statements' notes. Analysts read confession first, marketing last — the order is the method.",
        challenge:
          "Open any filed DRHP (SEBI and the exchanges publish them). Do not read it — map it: every major section, one line each on its job and its author's incentive. Mark the four highest-truth-density sections. Tomorrow you read; today you learn where.",
        challengeMinutes: 55,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The anatomy",
            detail:
              "Summary and industry overview, business, risk factors, objects of the issue, financial statements with restatements, management and promoters, legal and other information. Each section has a defined job under the regulations.",
          },
          {
            title: "Authors and incentives",
            detail:
              "The business section is management's story via bankers; risk factors are counsel's shield; financials are the auditors' restated numbers. Reading a section without knowing its author reads advertising as testimony.",
          },
          {
            title: "Risk factors as confession",
            detail:
              "Liability drives completeness: what is disclosed cannot later be called concealed. The specific, quantified risks matter; the boilerplate is chaff — telling them apart is tomorrow's skill.",
          },
          {
            title: "Objects of the issue",
            detail:
              "What the money is for, with monitoring obligations attached. Vague objects — 'general corporate purposes' at the cap — are themselves a disclosure about planning.",
          },
        ],
        checks: [
          {
            question: "Why are risk factors the honest section?",
            answer:
              "Liability — counsel discloses exhaustively because anything disclosed cannot later be called concealed. Confession, not marketing.",
          },
          {
            question: "What is the analyst's reading order and why?",
            answer:
              "Truth-dense sections first — risks, related parties, litigation, financial notes — then the business narrative, read against them.",
          },
          {
            question: "What does a vague objects-of-the-issue section disclose?",
            answer:
              "The state of planning — money raised without specific priced uses is itself a finding.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "The regulator's own archive of filed offer documents — every DRHP, free. Pick tomorrow's document from here today: an SME issue in a business you can understand.",
          },
        ],
        concepts: [
          "drhp-structure",
        ],
      },
      {
        title: "Reading a real DRHP critically",
        summary: "The full critical read — the day the document becomes evidence.",
        learningObjectives: [
          "Execute the truth-density reading order on a real filing",
          "Cross-examine sections against each other for contradictions",
          "Extract the three questions the document cannot answer",
        ],
        whyToday:
          "Yesterday's map, today's territory. A filed DRHP is the most detailed free document about any company you will ever get — and the module deliverable's raw material. This is also diligence practice with public evidence: every module-6 skill runs here without an NDA.",
        principle:
          "A filed DRHP is the most detailed free document about any company you will ever get.",
        commonMistake:
          "Reading sections in isolation. The findings live in the joins: growth narrative versus receivables trend; 'diversified customers' versus the concentration table; promoter salary versus company profit; objects of the issue versus the balance sheet's actual needs. Contradiction between sections is the highest-value read.",
        challenge:
          "Read your chosen DRHP end to end in the truth-density order. Produce working notes: five specific risks that matter (not boilerplate), three cross-section contradictions or tensions, and the three questions you would put to management. Tomorrow's process day and day 48's deliverable both build on these notes.",
        challengeMinutes: 75,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The specific-risk filter",
            detail:
              "Boilerplate risks appear in every filing; the risks that matter name numbers, customers, dependencies and dates. A risk factor with a quantity in it was fought over — that is the tell.",
          },
          {
            title: "Cross-examination",
            detail:
              "Restated financials versus the narrative; related-party schedules versus the business description; litigation versus 'no material proceedings'. The document is long enough to disagree with itself, and where it does is where to dig.",
          },
          {
            title: "The promoter read",
            detail:
              "Salary history, related-party dealings, share pledges, past ventures. The DRHP discloses more about promoters than any private-round data room volunteers — use it.",
          },
          {
            title: "Questions as output",
            detail:
              "The critical read ends in questions the document raises but cannot answer — the management-meeting agenda. Writing them precisely is the skill the deliverable grades.",
          },
        ],
        checks: [
          {
            question: "What distinguishes a risk factor that matters from boilerplate?",
            answer:
              "Specificity — named customers, quantities, dates. Quantified risks were negotiated into the document; generic ones came with the template.",
          },
          {
            question: "Where do the highest-value DRHP findings live?",
            answer:
              "In contradictions between sections — narrative versus financials, claims versus schedules.",
          },
          {
            question: "What is the proper output of a critical read?",
            answer:
              "Precise questions the document cannot answer — the agenda for management, and the spine of the summary.",
          },
          {
            question:
              "You have two hours with a DRHP before a call. What do you read, in what order?",
            answer:
              "Risk factors first, filtering for the specific ones — numbers, named customers, dates — because those were fought over. Then related-party transactions and litigation, then the restated financials' notes, and only then the business section, read against what the honest sections already told me. In the margins I keep two lists: contradictions between sections, and questions the document raises but cannot answer. Those lists are the call agenda — the summary can wait, the questions cannot.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "Your document lives here. If the one you picked turns out unreadable — scanned badly, or a business you cannot judge — swap it now rather than push through; the skill needs a real read.",
          },
        ],
        concepts: [
          "drhp-structure",
          "due-diligence-financial",
        ],
      },
      {
        title: "The process — merchant banker to listing",
        summary: "The pipeline, the parties, and the incentive map that explains the behaviour.",
        learningObjectives: [
          "Walk the process: appointment, diligence, filing, review, issue, listing",
          "Map every party to what they are paid for and when",
          "Predict the standard frictions from the incentive map",
        ],
        whyToday:
          "The client will ask 'what happens and how long?' — and the honest answer is a pipeline with parties attached. The incentive map matters more than the Gantt chart: who is paid at which milestone explains nearly every behaviour the client will find confusing.",
        principle:
          "Every party in an IPO is paid at a different milestone. That explains most of the behaviour.",
        commonMistake:
          "Explaining the process as a schedule rather than a system of incentives. The banker's fee lands at completion — hence pressure to proceed; counsel bills time — hence exhaustive caution; the exchange wants listings that do not embarrass it — hence scrutiny. The client navigates people, not phases.",
        challenge:
          "Draw the process map twice: once as a timeline with phases and rough durations, once as an incentive map — every party, what they do, what they are paid, at which milestone. Write three predictions of where friction will appear, derived from the second map. Those predictions are the adviser's realism.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The pipeline",
            detail:
              "Merchant banker appointed; due diligence and restatement; DRHP drafted and filed; exchange and regulator review with query rounds; issue opens and closes; allotment; listing. Months end to end, with the review rounds the least predictable.",
          },
          {
            title: "The parties",
            detail:
              "Merchant banker leads and underwrites the process; auditors restate; counsel papers; registrar handles applications; the exchange reviews and lists; market makers support SME trading after. Each appears exactly when their fee structure predicts.",
          },
          {
            title: "The query rounds",
            detail:
              "The exchange and regulator return questions on the filing; each round costs weeks. Clean first filings are the merchant banker's craft — and the adviser's diligence in module-6 style is what makes filings clean.",
          },
          {
            title: "SME specifics",
            detail:
              "The SME route trades some review burden for underwriting and market-making obligations — the banker carries more risk, which shapes who will take small mandates and at what fee.",
          },
        ],
        checks: [
          {
            question: "Why does the incentive map predict process behaviour?",
            answer:
              "Each party acts around its payment milestone — completion-paid bankers push pace, time-billed counsel exhausts caution, reputation-paid exchanges scrutinise.",
          },
          {
            question: "What makes IPO timelines unpredictable?",
            answer:
              "The query rounds — each regulator or exchange round adds weeks, and the count depends on filing quality.",
          },
          {
            question: "What does the SME route add to the banker's role?",
            answer:
              "Underwriting and market-making obligations — more banker risk, which shapes fees and mandate appetite.",
          },
          {
            question: "Why do IPO timelines slip, structurally?",
            answer:
              "The query rounds. Everything else in the pipeline is schedulable work; the regulator's and exchange's questions on the filing arrive in rounds, each costing weeks, and the number of rounds depends on filing quality — which was determined months earlier by the diligence and drafting. So the honest timeline answer is a range whose width is filing quality, and the honest advice is that money spent making the first filing clean buys back multiples of its time later. Every party's incentive map says the banker will still promise the short end.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — the IPO markets, part 2",
            url: "https://zerodha.com/varsity/chapter/the-ipo-markets-part-2/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The process end of the story — from filing to listing in Indian-market terms. Read alongside your process map and reconcile the two.",
          },
        ],
        concepts: [
          "ipo-process",
        ],
      },
      {
        title: "Migration to the main board",
        summary: "The staircase's second step — and what the SME listing was always for.",
        learningObjectives: [
          "State the migration path and its criteria in outline",
          "Advise on listing venue with the second step in view from the start",
          "Track migration criteria the same way as eligibility — current page, dated note",
        ],
        whyToday:
          "Migration completes the strategic picture: the SME platform is not a destination but a staircase, and clients deciding today's step deserve advice that has already looked at the next one. It is also the day's second lesson in criteria-checking discipline.",
        principle: "The SME platform is a staircase, and the second step has its own criteria.",
        commonMistake:
          "Advising the SME listing without modelling the migration. Company trajectories that will clear main-board criteria in two years have a different optimal path than those that will not — and the difference should shape today's structuring, not be discovered later.",
        challenge:
          "For the company you mapped on day 43: model its trajectory against migration criteria in outline. Write the two-paragraph advice: list where, when, and what today's choices do to the second step. Then pull the current migration requirements from the exchange and date your note.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Why migration exists",
            detail:
              "The SME platform is sized for entry; the main board offers liquidity, index inclusion and institutional access. Migration is the designed path between them — the staircase, by intent.",
          },
          {
            title: "The criteria in kind",
            detail:
              "Time listed, capital thresholds, and shareholder-approval requirements — the heads are stable, the numbers move by circular. As with day 43: the current page is the source, the blog is not.",
          },
          {
            title: "Advising with the staircase in view",
            detail:
              "Issue sizing, capital structure and governance choices at SME listing all echo at migration. The two-step plan is the adviser's product; the one-step plan is a banker's.",
          },
          {
            title: "The freshness habit, again",
            detail:
              "This module's recurring discipline: pull, cite, date. Migration rules changed before and will again — the roadmap's quarterly review exists for exactly these pages.",
          },
        ],
        checks: [
          {
            question: "What is the SME platform, strategically?",
            answer:
              "A staircase — an entry venue with a designed migration path to the main board, not a destination.",
          },
          {
            question: "Why must migration be modelled at listing time?",
            answer:
              "Sizing and structure choices at the SME step echo at migration — the second step shapes the first.",
          },
          {
            question: "What is the module's recurring source discipline?",
            answer:
              "Pull the current criteria from the exchange, cite the page, date the note — never advise from memory or blogs.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "BSE SME platform",
            url: "https://www.bsesme.com/",
            sourceName: "BSE",
            editorNote:
              "The migration criteria live on the exchange's SME pages alongside eligibility. Pull the current version for the challenge — the habit is the lesson.",
          },
        ],
        concepts: [
          "sme-ipo-framework",
          "ipo-process",
        ],
      },
      {
        title: "SEBI ICDR and the adviser's obligations",
        summary:
          "Where the rules bind you personally — and the roadmap's deliverable, completed.",
        learningObjectives: [
          "Locate the ICDR framework and the disclosure obligations it drives",
          "Know where an adviser's own conduct is regulated — and where the lines are",
          "Complete the module deliverable: the two-page critical DRHP summary",
        ],
        whyToday:
          "The roadmap ends where professional responsibility begins: some of this audience will advise on real transactions within months, and knowing where the rule binds you — not just the client — is part of the advice. The deliverable then closes the module with the analyst's artefact.",
        principle: "Knowing where the rule binds you is part of the advice.",
        commonMistake:
          "Treating regulation as the lawyers' territory entirely. The lawyer interprets; the adviser must know the landscape — which activities require registration, what disclosure obligations attach, where 'helping with the pitch' ends and regulated activity begins. Ignorance of the boundary is itself the compliance failure.",
        challenge:
          "Complete the deliverable: the two-page critical summary of your DRHP — the business in plain language, the five risks that matter, the cross-section findings, and the three management questions. Then the final page of the roadmap: your own one-paragraph note on which activities in this course's skillset touch regulated territory, with the ICDR listing bookmarked and dated. Not investment advice; educational material about method — and now you know why that sentence is on every page.",
        challengeMinutes: 75,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The ICDR framework",
            detail:
              "SEBI's Issue of Capital and Disclosure Requirements regulations govern what can be issued, to whom, with what disclosures — the DRHP's skeleton is this regulation made visible. The current consolidated text lives on SEBI's regulations pages, amended continually.",
          },
          {
            title: "Where the adviser is regulated",
            detail:
              "Merchant banking, research analysis and investment advice are registered activities with conduct rules. The unregistered adviser's safe ground is corporate finance work for the company — and knowing exactly where that boundary runs is professional survival.",
          },
          {
            title: "The disclaimer, understood",
            detail:
              "This roadmap teaches method, not recommendations — and the distinction is the same line the regulations draw. The disclaimer on these pages is the curriculum's own compliance, modelled.",
          },
          {
            title: "The habit that outlasts the course",
            detail:
              "Every regulatory claim in this module ends the same way: current page, cited, dated. Rules move by circular; the professional's edge is not memorising them but never trusting a memory of them.",
          },
        ],
        checks: [
          {
            question: "What do the ICDR regulations govern?",
            answer:
              "Public issues — what can be offered, to whom, with what disclosures. The DRHP's structure is this regulation applied.",
          },
          {
            question: "Which neighbouring activities are registered, and why does it matter?",
            answer:
              "Merchant banking, research and investment advice — an adviser must know where corporate-finance help ends and registered activity begins, because the boundary binds them personally.",
          },
          {
            question: "What is the module's closing discipline?",
            answer:
              "Never advise from memory of a rule — pull the current text, cite it, date the note, and review quarterly.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — legal framework and regulations",
            url:
              "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=3&smid=0",
            sourceName: "SEBI",
            editorNote:
              "The regulations index — ICDR lives here in its current consolidated form. The bookmark, with today's date, is the deliverable's final line.",
          },
        ],
        concepts: [
          "regulatory-sebi",
          "drhp-structure",
        ],
      },
    ],
  },
];
