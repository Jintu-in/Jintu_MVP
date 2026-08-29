import type { Role } from "./types";

/**
 * The rest of the data taxonomy: the roles downstream and upstream of the
 * four analysts already written. Adapted from the owner's expanded taxonomy
 * (2026-08-30) into the page model, with slugs corrected against
 * docs/roadmaps/.
 */
const roles: Role[] = [
  {
    slug: "data-engineer",
    title: "Data engineer",
    aliases: ["ETL Developer"],
    domain: "data",
    standfirst: "Builds the pipelines that make data available, reliably and on time.",
    entry: "Mid-level entry — growing faster than data analysis and less crowded at the door.",
    whatTheyDo: [
      "Moves data from source systems into a warehouse or lake, on a schedule, without losing or duplicating it. Owns orchestration, reliability and cost, and rarely analyses anything.",
      "The output is infrastructure, and success means nobody notices it — the numbers were just there, again, this morning.",
    ],
    typicalWeek: [
      "Fix a pipeline that failed overnight, before the analysts arrive to empty dashboards.",
      "Add a new source and the schema handling it will inevitably need.",
      "Reduce a warehouse bill that grew 30% last month, and find the query that did it.",
      "Handle a schema change an upstream team made without telling anyone.",
      "Backfill six months of data without breaking anything downstream.",
    ],
    whatItIsNot: [
      {
        line: "Not a data analyst with more code. The product is infrastructure; the analysis belongs to somebody else, and wanting to do both usually means wanting the other job.",
        compare: "analyst-roles",
      },
      {
        line: "Not an analytics engineer. Getting the data to land is data engineering; making what landed mean something is analytics engineering. Companies without either get analysts doing both, badly, in a folder of untested queries.",
        compare: "analyst-roles",
      },
    ],
    worksWith: [
      { who: "Analytics engineers", on: "what lands, in what shape, and how often" },
      { who: "Backend engineers", on: "the source systems and the schema changes they forgot to mention" },
      { who: "Analysts", on: "freshness and trust — the pipeline's real customers" },
    ],
    skills: {
      must: [
        "SQL, and Python for everything SQL cannot reach",
        "Orchestration — Airflow or an equivalent — as a system you reason about, not a scheduler you configure",
        "Warehousing concepts: partitioning, incremental loads, idempotency",
        "The habit of making every job safe to re-run",
      ],
      helps: [
        "Spark, at the scale that genuinely needs it",
        "Streaming, for the minority of problems that are really streaming problems",
        "Cloud cost literacy — the bill is a design review",
        "Docker",
      ],
      overrated: [
        "Big-data tooling for small data. Most companies' data fits in a warehouse and the complexity budget is better spent on reliability.",
        "Machine learning. It is a different job.",
      ],
    },
    howPeopleGetIn: [
      "From backend engineering, which transfers the reliability instincts directly.",
      "From data analysis, by going deeper into the layer that kept breaking under you.",
      "From ETL and database administration roles, modernising the same skill.",
    ],
    levels: [
      { name: "Engineer", whatChanges: "You maintain pipelines and add sources within an existing platform." },
      { name: "Senior", whatChanges: "You design the platform's patterns — and you are the one paged when it matters." },
      { name: "Lead / Principal", whatChanges: "You own the data platform's architecture and its cost." },
    ],
    whatIsHard:
      "Everything upstream changes without telling you, and everything downstream assumes you are perfect. The job sits between two groups who each believe the other is the difficult one, and the failures arrive at night. If what you actually want is to answer business questions, this role will frustrate you — you will make it possible for someone else to, permanently.",
    startHere: {
      kind: "notYet",
      note: "A data engineering roadmap is the planned sequel to the data analyst roadmap and is not built yet — requesting it moves it up the list. The foundations below are genuine prerequisites, not placeholders.",
      readInstead: [
        { label: "Data analyst — 91 days; the SQL, modelling and warehouse weeks are shared foundations", url: "/learn/data-analyst" },
        { label: "Linux command line — 15 days; pipelines run and fail here", url: "/learn/linux-command-line" },
      ],
    },
  },

  {
    slug: "data-scientist",
    title: "Data scientist",
    aliases: ["Applied Scientist"],
    domain: "data",
    standfirst: "Builds models to predict or explain — and is often really doing analysis.",
    entry: "Mid-level entry. Heavily oversubscribed at the door, with genuine demand at senior levels.",
    whatTheyDo: [
      "Uses statistics and machine learning to answer questions that cannot be answered by querying — prediction, inference, causal questions. Most of the time goes to cleaning data and framing the problem, not to modelling.",
      "In many Indian job adverts the title means 'analyst who uses Python', so read the responsibilities rather than the header — in both directions, when applying and when hiring.",
    ],
    typicalWeek: [
      "Explore a dataset to see whether the question is answerable at all.",
      "Build and evaluate a model, then spend longer on the evaluation than the build.",
      "Explain to a stakeholder why 87% accuracy is not good enough for this decision.",
      "Do far more data cleaning than modelling, again.",
      "Write up a finding with its caveats attached and intact.",
    ],
    whatItIsNot: [
      {
        line: "Not a data analyst with a fancier title, though the advert may mean exactly that. The distinguishing work is inference and modelling; if the week is dashboards and reporting, it is an analyst role wearing the title.",
        compare: "analyst-roles",
      },
      {
        line: "Not an ML engineer. Scientists build and evaluate models; ML engineers ship and maintain them in production. The skill bases diverge more than the titles suggest.",
      },
    ],
    worksWith: [
      { who: "Product and business stakeholders", on: "whether the question needs a model at all" },
      { who: "ML engineers", on: "what it takes to run this in production" },
      { who: "Data engineers", on: "the data that exists versus the data the model needs" },
    ],
    skills: {
      must: [
        "Statistics, properly — inference, uncertainty, and the discipline not to overclaim",
        "Python and SQL",
        "Experiment design",
        "Communicating a result without laundering its caveats away",
      ],
      helps: [
        "Machine learning breadth",
        "Causal inference, which is where the valuable questions live",
        "Domain knowledge in the business you serve",
      ],
      overrated: [
        "Deep learning for everything. Most business problems are tabular and small, and a regression you can explain beats a network you cannot.",
        "A PhD, for the large majority of industry roles.",
      ],
    },
    howPeopleGetIn: [
      "From analytics, by adding the statistics and modelling depth — the most common real route.",
      "From a quantitative degree, into the minority of roles that are genuinely research-shaped.",
      "From research, trading publication pressure for production pressure.",
    ],
    levels: [
      { name: "Scientist", whatChanges: "You answer modelling questions somebody else framed." },
      { name: "Senior", whatChanges: "You frame them, and you are trusted to say a model is not needed." },
      { name: "Staff / Principal", whatChanges: "You own the methodology across teams, and the standards results are held to." },
    ],
    whatIsHard:
      "Most business problems do not need a model, and saying so is the most valuable thing you can do — and the least rewarded, because you were hired to build models. The daily reality is also further from the job's image than any other role in this list: mostly cleaning, mostly communication. If you want to build models all day, industry will disappoint you at exactly that rate.",
    startHere: {
      kind: "notYet",
      note: "No data science roadmap yet — request it if you want it built. The honest path in runs through analysis first, and the reasoning roadmap covers the half of statistics that interviews actually probe.",
      readInstead: [
        { label: "Data analyst — 91 days; the statistics and experiment weeks are the foundation this role assumes", url: "/learn/data-analyst" },
        { label: "Thinking clearly under uncertainty — 24 days; base rates, calibration and not fooling yourself", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "ml-engineer",
    title: "Machine learning engineer",
    aliases: ["MLE", "MLOps Engineer"],
    domain: "data",
    standfirst: "Closer to software engineering than to data science.",
    entry: "Mid-level entry, usually from backend engineering — and less crowded than data science.",
    whatTheyDo: [
      "Takes models and makes them work in production: serving, latency, monitoring, retraining, versioning. Owns the system around the model rather than the model itself.",
      "The skill base is software and infrastructure engineering with enough ML to be dangerous — not the other way round, whatever the title implies.",
    ],
    typicalWeek: [
      "Serve a model behind an API with latency the product can live with.",
      "Build a retraining pipeline that will not need you present to run.",
      "Investigate why production predictions drifted from training.",
      "Optimise inference cost, which nobody noticed until the bill arrived.",
      "Version a dataset and a model together so a result is reproducible in six months.",
    ],
    whatItIsNot: [
      {
        line: "Not a data scientist who deploys. The centre of gravity is engineering — the model is a dependency, and often somebody else's.",
      },
      {
        line: "Not research. Inventing architectures is a different job at a small number of labs; this one ships and maintains.",
      },
    ],
    worksWith: [
      { who: "Data scientists", on: "what the model needs in production that it never needed in a notebook" },
      { who: "Backend engineers", on: "the API surface and the latency budget" },
      { who: "Platform", on: "the infrastructure training and serving both sit on" },
    ],
    skills: {
      must: [
        "Strong Python and real software engineering practice",
        "Docker and one cloud",
        "Model serving and its latency arithmetic",
        "Monitoring — a model's failures are silent by default",
      ],
      helps: [
        "Feature stores and data versioning",
        "Drift detection",
        "Distributed training, at the scale that genuinely needs it",
      ],
      overrated: [
        "Inventing new architectures. The job is running proven ones reliably.",
      ],
    },
    howPeopleGetIn: [
      "From backend engineering, adding the ML layer — the cleanest route because the hard half is already built.",
      "From data science, for those whose engineering is genuinely strong.",
      "From DevOps, through the MLOps door.",
    ],
    levels: [
      { name: "Engineer", whatChanges: "You productionise models within an existing platform." },
      { name: "Senior", whatChanges: "You design the serving and retraining architecture." },
      { name: "Staff", whatChanges: "You own how the organisation ships ML, and the standards models must meet to ship at all." },
    ],
    whatIsHard:
      "Models fail silently. A broken API returns an error; a drifted model returns confident, wrong answers for weeks, and the monitoring that catches it is the part everyone deprioritised. If you want to do research, be honest that this is engineering — the satisfaction is reliability, not novelty.",
    startHere: {
      kind: "notYet",
      note: "No ML engineering roadmap yet — request it if you want it. The route in is software engineering first, and both foundations below are load-bearing.",
      readInstead: [
        { label: "Linux command line — 15 days; serving, containers and debugging all live here", url: "/learn/linux-command-line" },
        { label: "Git & GitHub — 12 days; reproducibility starts with version control", url: "/learn/git-and-github" },
      ],
    },
  },

  {
    slug: "bi-developer",
    title: "BI developer",
    aliases: ["Power BI Developer", "Tableau Developer", "Reporting Analyst"],
    domain: "data",
    standfirst: "Builds the dashboards a whole company runs on.",
    entry: "Graduate entry, with very large corporate demand — Power BI dominant wherever Microsoft is.",
    whatTheyDo: [
      "Designs data models and reports in a BI tool, and owns the semantic layer that decides what a metric means. The technical part is modelling and DAX; the hard part is getting everyone to accept one definition.",
      "Trains and supports the business users who live in what you built — a report nobody can use is a model nobody needed.",
    ],
    typicalWeek: [
      "Build or fix a report someone senior depends on.",
      "Model relationships so a filter behaves the way a human expects.",
      "Write DAX measures and debug filter context, which is the whole language in one concept.",
      "Reconcile two dashboards showing different revenue, and make one of them win.",
      "Train a business team to use what you built, and learn what confused them.",
    ],
    whatItIsNot: [
      {
        line: "Not a data analyst who happens to use Power BI. The output is a reusable reporting layer with agreed definitions — infrastructure for other people's answers, not a one-off answer.",
        compare: "analyst-roles",
      },
      {
        line: "Not a programming role, and honest about it. The engineering habits help; the daily material is modelling, DAX and negotiation.",
      },
    ],
    worksWith: [
      { who: "Finance and operations", on: "what the metric means, which is a negotiation, not a lookup" },
      { who: "Data engineers", on: "what lands in the warehouse and when" },
      { who: "Analysts", on: "the boundary between the standard report and the ad-hoc question" },
    ],
    skills: {
      must: [
        "One BI tool deeply — depth in one beats familiarity with three",
        "SQL",
        "Dimensional modelling: facts, dimensions, and why the star schema is denormalised on purpose",
        "DAX and its filter context, or Tableau's LOD equivalents",
      ],
      helps: [
        "Power Query, for the cleaning upstream of the model",
        "Visual restraint — one accent colour, decluttered pages",
        "Patience for stakeholder training",
      ],
      overrated: [
        "Dashboard volume. One dashboard the company actually opens beats nine nobody does.",
        "General programming ability. Useful, and not what the job selects for.",
      ],
    },
    howPeopleGetIn: [
      "From Excel-heavy operations or finance roles — the most common route, and the excel roadmap is built for exactly this person.",
      "From data analysis, by specialising into the reporting layer.",
      "Campus placement, at the enterprises where the tooling is standard.",
    ],
    levels: [
      { name: "Developer", whatChanges: "You build reports on an existing model." },
      { name: "Senior", whatChanges: "You own the model and the definitions in it." },
      { name: "BI lead / Analytics manager", whatChanges: "You own the semantic layer across the company, and the arguments about it." },
    ],
    whatIsHard:
      "Everyone wants their own version of the truth, and your job is to make one version everyone accepts — which is politics conducted through a data model. The technical work is learnable in months; the negotiation is the career. If negotiating definitions with people who are certain sounds exhausting rather than interesting, this is the wrong seat in the data room.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "data-analyst", note: "Ninety-one days, and week 12 is the BI module — data model, DAX filter context, dashboard design and the published handover." },
        { slug: "excel-at-work", note: "Twenty days. The most common route into BI runs straight through Excel, and this is that route paved." },
      ],
    },
  },
];

export default roles;
