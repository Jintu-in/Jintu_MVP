/**
 * Data analyst, modules 17–20 (weeks 11–13, days 75–91): statistics,
 * experiments, BI dashboards, portfolio and interview.
 */
export default [
  {
    title: "Statistics that matter at work",
    weekRange: "Week 11",
    objective:
      "Describe honestly, quantify uncertainty, test hypotheses without fooling yourself.",
    nodes: [
      {
        title: "Day 75 — Descriptive statistics",
        summary: "Report the median when the mean would flatter you. Report both when it matters.",
        learningObjectives: [
          "Mean, median, mode; when the mean lies",
          "Variance, standard deviation, IQR",
          "Skewness and kurtosis, intuitively",
          "Percentiles: why p50/p90/p99 beat an average for latency and spend",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "StatQuest — descriptive statistics",
            url: "https://www.youtube.com/@statquest",
            sourceName: "StatQuest with Josh Starmer (YouTube)",
            editorNote: "Search the channel for his descriptive statistics and standard deviation videos.",
          },
          {
            type: "doc",
            title: "Khan Academy — statistics and probability",
            url: "https://www.khanacademy.org/math/statistics-probability",
            sourceName: "Khan Academy",
          },
        ],
      },
      {
        title: "Day 76 — Distributions",
        summary: "The central limit theorem is why everything else works.",
        learningObjectives: [
          "Normal, uniform, binomial, Poisson — what each describes in the real world",
          "The empirical rule; z-scores",
          "What the CLT actually says",
          "Plot your data against a normal curve and judge the fit",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "The Normal Distribution, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=rzFX5NWojp0",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "rzFX5NWojp0",
            durationSec: 313,
            estSizeMb: 40,
          },
          {
            type: "video",
            title: "The Central Limit Theorem, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=YAlJCEDH2uY",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "YAlJCEDH2uY",
            durationSec: 465,
            estSizeMb: 60,
          },
          {
            type: "tool",
            title: "Seeing Theory",
            url: "https://seeing-theory.brown.edu/",
            sourceName: "Brown University",
            editorNote: "The probability-distributions chapters — interactive, free.",
          },
        ],
      },
      {
        title: "Day 77 — Sampling and uncertainty",
        summary: "A number without an interval is a guess wearing a suit.",
        learningObjectives: [
          "Population vs sample; sampling bias",
          "Standard error; what \"95%\" means and does not",
          "Margin of error and sample size intuition",
          "Compute a confidence interval and write it in plain English",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "Confidence Intervals, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=TqOeMYtOc1w",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "TqOeMYtOc1w",
            durationSec: 372,
            estSizeMb: 47,
          },
        ],
      },
      {
        title: "Day 78 — Correlation",
        summary: "The first question after a correlation is: what else could explain this?",
        learningObjectives: [
          "Pearson vs Spearman; when each",
          "Correlation matrices and heatmaps",
          "Correlation is not causation — with a real spurious example",
          "Confounders and Simpson's paradox",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Simpson's paradox",
            url: "https://en.wikipedia.org/wiki/Simpson%27s_paradox",
            sourceName: "Wikipedia",
            editorNote:
              "Then find your strongest correlation and argue against it: name a plausible confounder.",
          },
        ],
      },
      {
        title: "Day 79 — Hypothesis testing",
        summary: "A p-value is not the probability your hypothesis is true. Almost every misuse starts there.",
        learningObjectives: [
          "Null and alternative; one- vs two-tailed",
          "p-values and the four things people wrongly think they mean",
          "Type I and II errors; significance level",
          "Statistical vs practical significance",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "video",
            title: "p-values: What they are and how to interpret them",
            url: "https://www.youtube.com/watch?v=vemZtEM63GY",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "vemZtEM63GY",
            durationSec: 686,
            estSizeMb: 86,
          },
        ],
      },
      {
        title: "Day 80 — Choosing and running a test",
        summary: "Three tests on your data, one sentence of conclusion each.",
        learningObjectives: [
          "One-sample, two-sample, paired t-tests",
          "ANOVA; chi-square for categorical independence",
          "Non-parametric alternatives: Mann-Whitney, Kruskal-Wallis",
          "Running them with scipy.stats",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "doc",
                    title: "Statistics (scipy.stats) tutorial",
                    url: "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
                    sourceName: "SciPy documentation",
                    editorNote: "t-tests, ANOVA and chi-square with runnable examples."
          }
        ],
      },
    ],
  },
  {
    title: "Experiments & A/B testing",
    weekRange: "Weeks 11–12",
    objective:
      "Design an experiment before running it, read one without fooling yourself, and report a null result well.",
    nodes: [
      {
        title: "Day 81 — Experiment design",
        summary:
          "Decide the sample size before you start, or you will stop the test when you like the number.",
        learningObjectives: [
          "Randomisation is the whole ballgame; the unit of randomisation",
          "Control and treatment",
          "Minimum detectable effect, power, and the sample size that follows",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "tool",
            title: "Sample size calculator",
            url: "https://www.evanmiller.org/ab-testing/sample-size.html",
            sourceName: "Evan Miller",
            editorNote: "Design an experiment for a real product question and compute its sample size.",
          },
        ],
      },
      {
        title: "Day 82 — Running and reading a test",
        summary: "Sample ratio mismatch is the first check, always.",
        learningObjectives: [
          "SRM; peeking and why it inflates false positives",
          "Novelty and primacy effects; seasonality",
          "Segmenting without p-hacking your way to a story",
          "Analyse a public A/B dataset end to end",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "read",
                    title: "How not to run an A/B test",
                    url: "https://www.evanmiller.org/how-not-to-run-an-ab-test.html",
                    sourceName: "Evan Miller",
                    editorNote: "The peeking problem, by the person whose calculator you used yesterday."
          }
        ],
      },
      {
        title: "Day 83 — Multiple comparisons and honest reporting",
        summary: "An experiment that finds nothing has still bought you information. Report it that way.",
        learningObjectives: [
          "Why testing twenty metrics finds one \"significant\" result by chance",
          "Bonferroni and false discovery rate, plainly",
          "Pre-registering the primary metric",
          "Rewrite yesterday's conclusion assuming a null result — make it useful anyway",
        ],
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
                    type: "read",
                    title: "Multiple comparisons problem",
                    url: "https://en.wikipedia.org/wiki/Multiple_comparisons_problem",
                    sourceName: "Wikipedia",
                    editorNote: "Read for the jelly-bean intuition; skim the corrections table."
          }
        ],
      },
      {
        title: "Day 84 — Metrics that businesses actually track",
        summary: "Define five metrics for a business you know — including how each could be gamed.",
        learningObjectives: [
          "SaaS: MRR, ARR, churn, LTV, CAC, NRR",
          "E-commerce: GMV, AOV, conversion, repeat rate, ROAS",
          "Product: DAU/MAU, stickiness, retention curves, funnels",
          "Metric design: what makes a metric gameable",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
                    type: "read",
                    title: "Performance indicator",
                    url: "https://en.wikipedia.org/wiki/Performance_indicator",
                    sourceName: "Wikipedia",
                    editorNote: "A sober taxonomy to steal vocabulary from before defining your five."
          }
        ],
      },
    ],
  },
  {
    title: "BI tools & dashboards",
    weekRange: "Week 12",
    objective:
      "One BI tool learned properly: data model, measures, an honest one-page dashboard, published.",
    deliverable: "A published, publicly viewable dashboard with a three-line handover note.",
    nodes: [
      {
        title: "Day 85 — Getting into Power BI or Tableau",
        summary: "Pick one. Power BI if you are Microsoft-adjacent, Tableau otherwise.",
        learningObjectives: [
          "Connecting data; import vs live",
          "Relationships, cardinality, cross-filter direction",
          "Star schema in a BI tool; the Dim_Date table you always need",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "video",
            title: "Guy in a Cube — Power BI",
            url: "https://www.youtube.com/@GuyInACube",
            sourceName: "Guy in a Cube (YouTube)",
            editorNote: "Or Tableau's own free training if you chose Tableau.",
          },
          {
            type: "tool",
            title: "Tableau Public",
            url: "https://public.tableau.com/",
            sourceName: "Tableau",
          },
        ],
      },
      {
        title: "Day 86 — Calculations",
        summary: "In DAX, understanding filter context is the whole language. Everything else is syntax.",
        learningObjectives: [
          "Power BI: calculated columns vs measures; row vs filter context; CALCULATE, ALL, SUMX",
          "Time intelligence: TOTALYTD, SAMEPERIODLASTYEAR, DATEADD",
          "Tableau: calculated fields and LOD expressions",
          "Eight measures including one year-on-year comparison",
        ],
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        resources: [
          {
            type: "doc",
            title: "DAX overview",
            url: "https://learn.microsoft.com/en-us/dax/dax-overview",
            sourceName: "Microsoft Learn",
          },
        ],
      },
      {
        title: "Day 87 — Dashboard design",
        summary: "Build a one-page dashboard; then delete a third of it and check nothing was lost.",
        learningObjectives: [
          "Top-left is the most valuable space on the page",
          "KPI cards → trend → breakdown: the standard reading order",
          "Filters, drill-through, tooltips",
          "Colour with restraint; accessible contrast",
        ],
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        resources: [
          {
            type: "read",
            title: "Storytelling with Data — blog",
            url: "https://www.storytellingwithdata.com/blog",
            sourceName: "Storytelling with Data",
            editorNote: "Two posts on decluttering, before you build.",
          },
        ],
      },
      {
        title: "Day 88 — Publishing and the handover",
        summary:
          "The handover note: who it is for, what decision it supports, what it deliberately does not show.",
        learningObjectives: [
          "Publishing to Power BI Service or Tableau Public",
          "Refresh schedules; row-level security, briefly",
          "The three-line handover note",
        ],
        estMinutes: 50,
        points: 40,
        difficulty: "core",
        resources: [],
      },
    ],
  },
  {
    title: "Portfolio, capstone & interview",
    weekRange: "Week 13",
    objective:
      "One complete project a stranger can follow, three project descriptions written around outcomes, and interview patterns rehearsed aloud.",
    deliverable: "A complete capstone project on GitHub: question, data, method, finding, caveats.",
    nodes: [
      {
        title: "Day 89 — The capstone",
        summary:
          "Full pipeline on one real dataset and one real question: SQL extraction → Python cleaning → analysis → visualisation → written finding.",
        learningObjectives: [
          "Repo structure: data/, sql/, notebooks/, outputs/, README.md",
          "The README a stranger can follow: question, data, method, finding, caveats",
        ],
        estMinutes: 120,
        points: 40,
        difficulty: "stretch",
        resources: [
          {
                    type: "doc",
                    title: "About READMEs",
                    url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
                    sourceName: "GitHub Docs",
                    editorNote: "The README is half the capstone's value; structure it before the code."
          },
          {
                    type: "tool",
                    title: "Kaggle Datasets",
                    url: "https://www.kaggle.com/datasets",
                    sourceName: "Kaggle"
          }
        ],
      },
      {
        title: "Day 90 — Portfolio and profile",
        summary: "Nobody is impressed that you used pandas. They are impressed by what changed.",
        learningObjectives: [
          "Three projects, not ten: a dashboard, a SQL analysis, a Python EDA",
          "Descriptions written around outcomes, not tools",
          "Quantify: \"cut query runtime 40%\", \"monitors ₹2 crore of monthly spend\"",
          "LinkedIn and resume: same discipline, shorter",
        ],
        estMinutes: 70,
        points: 40,
        difficulty: "core",
        resources: [
          {
                    type: "doc",
                    title: "About READMEs",
                    url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
                    sourceName: "GitHub Docs",
                    editorNote: "Apply the same discipline to all three project pages."
          }
        ],
      },
      {
        title: "Day 91 — Interview preparation",
        summary: "The strongest answer names its own limitation before the interviewer does.",
        learningObjectives: [
          "SQL live-coding patterns: top-N per group, running totals, cohort retention, gaps and islands, dedup",
          "Case questions: metric drop root-cause, metric design, trade-offs",
          "Behavioural: proudest project, a time you were wrong, data vs stakeholder",
          "Record a five-minute capstone walkthrough ending with its weakest assumption",
        ],
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        resources: [
          {
            type: "tool",
            title: "DataLemur — timed practice",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
            editorNote: "Fifteen problems under time pressure.",
          },
        ],
      },
    ],
  },
];
