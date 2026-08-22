/**
 * Thinking clearly under uncertainty — 10 weeks (owner curriculum,
 * 2026-08-13). The meta-skill: mental models, bias detection, Bayesian
 * updating, data literacy, and calibrated forecasting.
 *
 * Sourcing notes:
 * - LessWrong rate-limits automated fetches (429 on every attempt), which
 *   would fail --check on every regeneration. The Sequences therefore ship
 *   via readthesequences.com — the complete, stable community mirror — and
 *   the owner's LessWrong anchor is honoured through it.
 * - The owner's anti-pattern guardrails (no bias listicles, no resulting,
 *   no epistemic arrogance, no passive consumption) ride as editor notes
 *   on the nodes where each trap actually bites.
 * - Every URL resolved live on 2026-08-13; --check re-verifies at
 *   generation.
 */
export default {
  slug: "thinking-under-uncertainty",
  title: "Thinking clearly under uncertainty",
  summary:
    "Ten weeks of mental models, bias detection, Bayesian updating, data literacy and calibrated forecasting — the meta-skill behind every high-stakes decision, from free material only.",
  subjectTags: ["thinking", "decision-making", "statistics", "forecasting", "rationality"],
  category: "judgement",
  difficulty: "intermediate",
  estimatedWeeks: 10,
  licenseNote: null,
  modules: [
    {
      title: "Epistemic foundations & core mental models",
      weekRange: "Weeks 1–2",
      objective:
        "Install the handful of load-bearing models — map vs territory, first principles, inversion, second-order effects — deeply enough to catch yourself using their absence.",
      deliverable:
        "A two-page post-mortem of one real failed decision: where the map was confused with the territory, what inversion would have caught, which second-order effects were ignored.",
      nodes: [
        {
          title: "Map vs territory, and first-principles thinking",
          summary:
            "Models are compressions of reality, not reality — and problems deconstruct into foundational truths before they resynthesize into solutions.",
          learningObjectives: [
            "Why every metric, model and abstraction is a lossy map",
            "Spotting 'confusing the model with truth' in your own field",
            "First-principles deconstruction vs reasoning by analogy",
          ],
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Mental models: the best way to make intelligent decisions",
              url: "https://fs.blog/mental-models/",
              sourceName: "Farnam Street",
              editorNote:
                "The index for the whole discipline. Guardrail: do not try to memorise the taxonomy — this roadmap operationalizes a few models deeply instead.",
            },
            {
              type: "read",
              title: "First-principles thinking",
              url: "https://fs.blog/first-principles/",
              sourceName: "Farnam Street",
            },
          ],
        },
        {
          title: "Circle of competence",
          summary: "The boundary between what you understand and what you merely have opinions about.",
          learningObjectives: [
            "Defining your circle honestly, in writing",
            "The tells that you have crossed the boundary",
            "Operating near the edge: borrowing competence vs pretending it",
          ],
          estMinutes: 45,
          points: 25,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Circle of competence",
              url: "https://fs.blog/circle-of-competence/",
              sourceName: "Farnam Street",
            },
          ],
        },
        {
          title: "Inversion",
          summary: "Solve 'how do I guarantee failure?' and delete those paths — often easier and safer than optimizing for success.",
          learningObjectives: [
            "Forward vs backward problem framing",
            "Failure-mode enumeration as a design tool",
            "Running a pre-mortem on a live project",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Inversion",
              url: "https://fs.blog/inversion/",
              sourceName: "Farnam Street",
            },
          ],
        },
        {
          title: "Second-order effects and the razors",
          summary: "Trace consequences past T0, and default to incompetence before conspiracy.",
          learningObjectives: [
            "Second- and nth-order consequence tracing",
            "Occam's razor: minimal assumptions win ties",
            "Hanlon's razor: systemic failure before malice",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Second-order thinking",
              url: "https://fs.blog/second-order-thinking/",
              sourceName: "Farnam Street",
            },
          ],
        },
        {
          title: "Assignment — the decision post-mortem",
          summary:
            "Pick one real failed decision and write the two-page audit: map/territory confusions, the missing inversion, the ignored second-order effects.",
          learningObjectives: [
            "Post-mortem structure: context, information at the time, models missed",
            "Naming the exact sentence where the map replaced the territory",
            "One process change you will actually adopt",
          ],
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "The Sequences — Map and Territory",
              url: "https://www.readthesequences.com/",
              sourceName: "readthesequences.com (LessWrong mirror)",
              editorNote:
                "Book I is the epistemic backbone of this module. Read a few essays alongside the assignment, not instead of it — passive consumption is this curriculum's named failure mode.",
            },
          ],
        },
      ],
    },
    {
      title: "Cognitive biases & decoupling outcomes",
      weekRange: "Weeks 3–4",
      objective:
        "Catch your own System 1 in the act — availability, confirmation, sunk cost — and permanently separate decision quality from outcome quality.",
      deliverable:
        "A standing decision journal with 14 days of entries: information at the time, explicit probabilities, models applied, and what would change your mind.",
      nodes: [
        {
          title: "System 1 and System 2",
          summary: "Fast pattern-matching vs slow deliberate reasoning — and why the fast one answers first.",
          learningObjectives: [
            "The two-system architecture and its energy economics",
            "Which decisions deserve System 2 and which genuinely do not",
            "Cognitive load, fatigue, and error timing",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Thinking, Fast and Slow",
              url: "https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow",
              sourceName: "Wikipedia",
              editorNote:
                "The summary carries the architecture; the book is the optional deep end. Note the replication-crisis section — priming chapters aged badly, the two-system frame did not.",
            },
          ],
        },
        {
          title: "Availability, representativeness and vividness",
          summary: "The mind judges probability by how easily examples come to mind. Easily ≠ often.",
          learningObjectives: [
            "Availability: recency and vividness masquerading as frequency",
            "Representativeness: category resemblance beating base rates",
            "Building the reflex: 'is this vivid, or is it common?'",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Base rate fallacy",
              url: "https://en.wikipedia.org/wiki/Base_rate_fallacy",
              sourceName: "Wikipedia",
            },
            {
              type: "read",
              title: "The Sequences — Predictably Wrong",
              url: "https://www.readthesequences.com/",
              sourceName: "readthesequences.com (LessWrong mirror)",
              editorNote:
                "Guardrail: the goal is catching these in YOUR next decision, not naming them in other people's. The bias blind spot is the trap the whole module walks past.",
            },
          ],
        },
        {
          title: "Confirmation bias and motivated reasoning",
          summary: "The brain as defence lawyer: evidence filtered to protect identity and prior belief.",
          learningObjectives: [
            "Selective search, selective memory, selective interpretation",
            "Identity-protective cognition — why smart people do it more",
            "The one working countermeasure: writing down what would change your mind",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Confirmation bias",
              url: "https://en.wikipedia.org/wiki/Confirmation_bias",
              sourceName: "Wikipedia",
            },
          ],
        },
        {
          title: "Resulting, sunk costs and scope insensitivity",
          summary:
            "A good decision can lose and a bad one can win — judging by outcome is the error this whole curriculum exists to kill.",
          learningObjectives: [
            "Resulting: process quality vs outcome quality, with expected value as the judge",
            "Sunk cost: when unrecoverable spend dictates future allocation",
            "Scope insensitivity: intuition failing to scale across orders of magnitude",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Outcome bias",
              url: "https://en.wikipedia.org/wiki/Outcome_bias",
              sourceName: "Wikipedia",
            },
            {
              type: "read",
              title: "Sunk cost",
              url: "https://en.wikipedia.org/wiki/Sunk_cost",
              sourceName: "Wikipedia",
            },
            {
              type: "read",
              title: "Scope neglect",
              url: "https://en.wikipedia.org/wiki/Scope_neglect",
              sourceName: "Wikipedia",
            },
          ],
        },
        {
          title: "Assignment — the decision journal",
          summary:
            "Fourteen days of non-trivial decisions logged before their outcomes are known: context, probabilities, models, and what would change your mind.",
          learningObjectives: [
            "The four-field entry: information at the time, expected probabilities, models applied, mind-changers",
            "Making entries immutable — no editing after outcomes arrive",
            "Why the journal is the only cure for hindsight rewriting your memory",
          ],
          estMinutes: 60,
          points: 40,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "The decision journal",
              url: "https://fs.blog/decision-journal/",
              sourceName: "Farnam Street",
              editorNote: "Template included. Start it today; module 5's capstone feeds on these entries.",
            },
          ],
        },
      ],
    },
    {
      title: "Bayesian reasoning & base rates",
      weekRange: "Weeks 5–6",
      objective:
        "Replace true/false with probabilities, anchor them in empirical base rates, and update incrementally by the strength of evidence.",
      deliverable:
        "A Bayesian diagnostic matrix for one live thesis in your field: explicit prior, three pieces of evidence, and the computed posterior for each.",
      nodes: [
        {
          title: "Base rates before case details",
          summary:
            "Before analysing the specifics, ask: how often does this happen in general? Then defend the number.",
          learningObjectives: [
            "Base-rate neglect and the inside view's seduction",
            "Finding empirical priors instead of guessing them",
            "Grounding a baseline in real historical data",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "tool",
              title: "Our World in Data",
              url: "https://ourworldindata.org/",
              sourceName: "Our World in Data",
              editorNote:
                "The empirical anchor for this whole module: pull real baselines from here before trusting your impression of one.",
            },
          ],
        },
        {
          title: "Bayes' theorem, mechanically",
          summary: "Prior × likelihood ratio = posterior. The formula is small; the habit is the skill.",
          learningObjectives: [
            "P(A|B) = P(B|A)·P(A) / P(B), each term in words",
            "The likelihood ratio as 'diagnostic strength of evidence'",
            "Working two worked examples by hand, including a medical-test one",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Bayes' theorem",
              url: "https://en.wikipedia.org/wiki/Bayes%27_theorem",
              sourceName: "Wikipedia",
            },
            {
              type: "read",
              title: "The Sequences — how to actually change your mind",
              url: "https://www.readthesequences.com/",
              sourceName: "readthesequences.com (LessWrong mirror)",
              editorNote: "The intuitive-Bayes material lives here; read it after the mechanical version, not instead.",
            },
          ],
        },
        {
          title: "Incremental updating",
          summary:
            "Beliefs move in small steps proportional to evidence strength — not binary flips on noisy data.",
          learningObjectives: [
            "Over-updating on vivid noise vs under-updating on dull signal",
            "Chaining updates: yesterday's posterior is today's prior",
            "Holding numeric beliefs you are willing to say out loud",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Base rate fallacy",
              url: "https://en.wikipedia.org/wiki/Base_rate_fallacy",
              sourceName: "Wikipedia",
              editorNote: "Re-read the worked examples now that the formula is in hand — they read differently.",
            },
          ],
        },
        {
          title: "Assignment — the Bayesian diagnostic matrix",
          summary:
            "One debated thesis from your field, one explicit prior, three pieces of evidence, three computed posteriors — measuring how much your view should actually move.",
          learningObjectives: [
            "Setting a numeric prior you can defend",
            "Estimating likelihood ratios for real evidence",
            "Noticing when the computed shift is smaller than your felt shift",
          ],
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
          resources: [],
        },
      ],
    },
    {
      title: "Quantitative data literacy & calling bullshit",
      weekRange: "Weeks 7–8",
      objective:
        "Read charts, metrics and studies the way a hostile reviewer would: Goodhart, survivorship, Simpson's, truncated axes, confounders.",
      deliverable:
        "A 500-word audit of one widely-shared chart-backed claim: selection biases, missing base rates, axis games, and the alternative explanations it ignored.",
      nodes: [
        {
          title: "Goodhart's law and metric gaming",
          summary: "When a measure becomes a target, it stops measuring — in orgs, policy and your own dashboards.",
          learningObjectives: [
            "Goodhart's and Campbell's laws with live examples",
            "Spotting the gamed metric behind a proud number",
            "Designing metrics that resist their own success",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Goodhart's law",
              url: "https://en.wikipedia.org/wiki/Goodhart%27s_law",
              sourceName: "Wikipedia",
            },
            {
              type: "doc",
              title: "Calling Bullshit — the course",
              url: "https://callingbullshit.org/",
              sourceName: "University of Washington (Bergstrom & West)",
              editorNote: "The full free course this module anchors on; the syllabus page maps lecture videos to these nodes.",
            },
          ],
        },
        {
          title: "Selection and survivorship bias",
          summary: "The data you see was filtered before you saw it. Wald's bombers are the eternal example.",
          learningObjectives: [
            "Non-random sampling and where it hides",
            "Survivorship: the missing planes, funds, and founders",
            "Asking 'what data never made it into this dataset?' by default",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Survivorship bias",
              url: "https://en.wikipedia.org/wiki/Survivorship_bias",
              sourceName: "Wikipedia",
            },
          ],
        },
        {
          title: "Simpson's paradox",
          summary: "Aggregate trends that reverse when disaggregated — the sharpest knife in the data-literacy drawer.",
          learningObjectives: [
            "How aggregation flips conclusions",
            "The Berkeley admissions case, worked",
            "When to trust the aggregate vs the subgroups",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Simpson's paradox",
              url: "https://en.wikipedia.org/wiki/Simpson%27s_paradox",
              sourceName: "Wikipedia",
            },
          ],
        },
        {
          title: "Chart deception and confounders",
          summary:
            "Truncated axes, dual-axis games, cherry-picked windows — and the confounding variable behind every 'X causes Y' headline.",
          learningObjectives: [
            "The visual-deception checklist: axes, scales, intervals",
            "Correlation vs causation: spurious, reversed, confounded",
            "Drawing the confounder diagram before accepting a causal claim",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "video",
              title: "Calling Bullshit — lecture videos",
              url: "https://callingbullshit.org/videos.html",
              sourceName: "University of Washington (Bergstrom & West)",
              editorNote: "The data-visualization and causality lectures are this node.",
            },
            {
              type: "video",
              title: "More or Less: Behind the Stats",
              url: "https://www.bbc.co.uk/programmes/b006qshd",
              sourceName: "BBC Radio 4 (Tim Harford)",
              editorNote:
                "Audio, small data cost. One episode per commute: watch Harford run this module's checklist on live public claims.",
            },
          ],
        },
        {
          title: "Assignment — the data BS audit",
          summary:
            "One widely-shared chart-backed claim, taken apart in 500 words: selection, base rates, axes, and the explanations it did not consider.",
          learningObjectives: [
            "Running the full checklist on a real artefact",
            "Steelmanning the claim before attacking it",
            "Writing critique a defender would concede is fair",
          ],
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "Calling Bullshit — syllabus",
              url: "https://callingbullshit.org/syllabus.html",
              sourceName: "University of Washington (Bergstrom & West)",
              editorNote: "The case-study sections model exactly this audit.",
            },
          ],
        },
      ],
    },
    {
      title: "Superforecasting, calibration & the capstone",
      weekRange: "Weeks 9–10",
      objective:
        "Forecast like it is a skill: Fermi decomposition, outside-then-inside view, granular updates — and a Brier score that tells you the truth about yourself.",
      deliverable:
        "The personal calibration engine: 50 time-bound numeric predictions, an auto-updating Brier tracker, a calibration curve, and post-mortems on five resolved journal decisions.",
      nodes: [
        {
          title: "The superforecaster toolkit",
          summary:
            "Tetlock's findings, operationalized: decompose, start outside, adjust inside, update in small steps.",
          learningObjectives: [
            "Fermi decomposition of vague questions into estimable parts",
            "Outside view (base rate) before inside view (case details)",
            "Granular, frequent updates over binary flips",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Good Judgment",
              url: "https://goodjudgment.com/",
              sourceName: "Good Judgment Inc (Tetlock)",
            },
          ],
        },
        {
          title: "Fermi estimation",
          summary: "Order-of-magnitude answers to unanswerable-looking questions, from structured bounds.",
          learningObjectives: [
            "The decomposition pattern: population → fraction → rate",
            "Bounding above and below; geometric-mean point estimates",
            "Five drills: engineers in Singapore, and four of your own",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Fermi problem",
              url: "https://en.wikipedia.org/wiki/Fermi_problem",
              sourceName: "Wikipedia",
            },
          ],
        },
        {
          title: "Calibration and the Brier score",
          summary:
            "When you say 80%, you should be right 80% of the time — and there is a number that checks.",
          learningObjectives: [
            "Calibration vs resolution vs accuracy",
            "Brier score: mean squared error of probabilistic forecasts",
            "Reading a calibration curve for over/underconfidence",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Brier score",
              url: "https://en.wikipedia.org/wiki/Brier_score",
              sourceName: "Wikipedia",
            },
          ],
        },
        {
          title: "Forecasting practice, in public",
          summary: "Real questions, real resolution dates, real scores — the gym for everything above.",
          learningObjectives: [
            "Registering forecasts on live platforms",
            "Writing the rationale at forecast time, not resolution time",
            "Updating on news without over-trading your beliefs",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "tool",
              title: "Good Judgment Open",
              url: "https://www.gjopen.com/",
              sourceName: "Good Judgment Inc",
            },
            {
              type: "tool",
              title: "Metaculus",
              url: "https://www.metaculus.com/",
              sourceName: "Metaculus",
              editorNote: "Pick one platform and forecast weekly; the capstone's 50 predictions can live here.",
            },
          ],
        },
        {
          title: "Capstone — the personal calibration engine",
          summary:
            "Fifty explicit predictions with confidence levels, an auto-updating Brier tracker, the calibration curve, and five decision post-mortems from your journal.",
          learningObjectives: [
            "50 time-bound, verifiable predictions at explicit confidence levels",
            "A spreadsheet or script recomputing your aggregate Brier score as outcomes resolve",
            "The confidence-vs-accuracy curve, and what it says about you",
            "Five post-mortems judging process, base-rate use, and outcome decoupling",
          ],
          estMinutes: 120,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "The decision journal",
              url: "https://fs.blog/decision-journal/",
              sourceName: "Farnam Street",
              editorNote:
                "Guardrail, one last time: reading about calibration produces a false sense of it. The ledger is the curriculum.",
            },
          ],
        },
      ],
    },
  ],
};
