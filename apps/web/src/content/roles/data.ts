import type { Role } from "./types";

/**
 * The data roles. One degree, one set of adverts, four genuinely different
 * jobs — which is why this domain gets the most detailed "what it is not".
 */
const roles: Role[] = [
  {
    slug: "data-analyst",
    title: "Data analyst",
    domain: "data",
    standfirst: "Turns a vague question into an answerable one, then answers it with data that already exists.",
    entry: "Graduate entry. The most common first data job, and the one most people mean by 'getting into data'.",
    whatTheyDo: [
      "Somebody asks why a number moved. The analyst decides what the question actually is, finds the data that can speak to it, checks whether that data means what everyone assumes, and comes back with an answer and its caveats.",
      "Most of the work is upstream of the analysis: locating the data, understanding its grain, and establishing whether it is trustworthy. The SQL is usually the shortest part of the day.",
      "The output is rarely a model. It is a number with a sentence around it, a chart with a finding under it, or a dashboard somebody else will read weekly without you.",
    ],
    typicalWeek: [
      "Rewrite two vague requests into questions that have answers — 'why are sales down' becomes 'which region and category account for the year-on-year unit decline last quarter'.",
      "Write and re-run SQL against the warehouse; discover halfway through that a join has been double-counting since March.",
      "Fix a dashboard nobody told you was broken, because somebody quoted a number from it in a meeting.",
      "Explain to a stakeholder why the number you gave them differs from the number their team has, and find out which of you is right.",
      "Push back on a request that cannot be answered with the data that exists, and say what would need to be collected.",
    ],
    whatItIsNot: [
      {
        line: "Not a data scientist. Analysts answer questions about what happened and why; scientists build models that predict or explain. In Indian job adverts the titles blur, so read the responsibilities rather than the header.",
        compare: "analyst-roles",
      },
      {
        line: "Not a data engineer. If the pipeline breaks, an analyst usually reports it rather than fixes it — and if your job is mostly fixing it, you are already a data engineer with the wrong title.",
        compare: "analyst-roles",
      },
      {
        line: "Not a dashboard operator. Building the dashboard is a fraction of it; deciding what belongs on one, and refusing what does not, is the job.",
      },
    ],
    worksWith: [
      { who: "Product and business teams", on: "the questions, and what a number is going to be used to decide" },
      { who: "Data engineers", on: "what is in the warehouse, what is trustworthy, and what is missing" },
      { who: "Other analysts", on: "definitions — most disagreements between two teams' numbers are definition disagreements" },
    ],
    skills: {
      must: [
        "SQL, well past SELECT — joins, window functions, and the discipline of checking a row count after every join",
        "Spreadsheet fluency, because that is what most of the business will actually open",
        "Explaining a finding in writing to somebody who will not read the query",
        "Enough statistics to know when an average is lying to you",
      ],
      helps: [
        "Python with pandas, for anything a spreadsheet cannot hold",
        "One BI tool learned properly rather than three learned partly",
        "Understanding how the source systems create the data in the first place",
      ],
      overrated: [
        "Machine learning. Almost no analyst job requires it, and listing it does not compensate for shaky SQL.",
        "Knowing five visualisation libraries. One, used with judgement, is worth more.",
        "Big-data tooling. Most analyst work fits comfortably in a warehouse and a laptop.",
      ],
    },
    howPeopleGetIn: [
      "Directly, as a graduate — the most common route, and the reason this is the standard first data job.",
      "Sideways from an operations, finance or support role where you were already the person who built the spreadsheet everyone used.",
      "From a reporting or MIS job, by learning SQL properly and stopping doing it by hand.",
      "Through a portfolio: two or three finished analyses of real data, each ending in a written finding. This works better than certificates and is the route most self-taught analysts actually take.",
    ],
    levels: [
      { name: "Junior / Associate", whatChanges: "You are given the question. Success is a correct answer, delivered." },
      { name: "Analyst", whatChanges: "You are given the topic and find the question yourself. You are trusted with definitions." },
      { name: "Senior", whatChanges: "You decide what is worth measuring, and say no. You are usually the one who finds the error nobody else noticed." },
      { name: "Lead / Analytics manager", whatChanges: "You own the definitions across teams, and increasingly the people. Some of this fork goes into analytics engineering instead." },
    ],
    whatIsHard:
      "The hard part is not technical, it is that you are permanently responsible for numbers other people act on, and the failure mode is silent — a wrong join produces plausible output, nobody questions it, and a decision gets made on it. You also spend a lot of the week being told your number is wrong by someone whose number is wrong. If you need your work to be visibly appreciated, or you dislike being the person who says the data cannot answer that, this job will grind on you.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "data-analyst", note: "The full ninety-one days: spreadsheets, SQL, Python, statistics and dashboards, in the order they build on each other." },
        { slug: "excel-at-work", note: "Start here instead if spreadsheets are still slow — it is twenty days and it makes the first three weeks of the analyst roadmap much easier." },
      ],
    },
  },

  {
    slug: "business-analyst",
    title: "Business analyst",
    domain: "data",
    standfirst: "Works out what the business actually needs, and writes it down precisely enough to be built.",
    entry: "Graduate entry, and also the most common landing spot for people leaving operations roles.",
    whatTheyDo: [
      "Sits between the people with a problem and the people who will build something about it, and converts one into the other. The output is requirements, process maps and decisions — not usually queries.",
      "Spends most of the time in conversation: interviewing the people who do the work today, finding the exception nobody mentioned, and discovering that two departments define the same word differently.",
      "In many Indian firms the title covers a wide range, from genuinely no SQL at all to something close to a data analyst. Read the responsibilities.",
    ],
    typicalWeek: [
      "Interview three people who do the same process and get three different descriptions of it.",
      "Map the current process, including the step everyone does in a spreadsheet and nobody documents.",
      "Write requirements precise enough that an engineer could not build the wrong thing from them.",
      "Chair the meeting where two teams discover they disagree about what 'active customer' means.",
      "Test what was built against what was asked for, and negotiate the gap.",
    ],
    whatItIsNot: [
      {
        line: "Not a data analyst. A BA works with processes, requirements and stakeholders; a data analyst works with data. Many BA roles involve no SQL at all, which surprises people who applied expecting one job and got the other.",
        compare: "analyst-roles",
      },
      {
        line: "Not a project manager. A BA defines what should be built; a PM owns scope, timeline and budget for building it. The same person sometimes does both in a small company, which is where the confusion starts.",
        compare: "product-roles",
      },
    ],
    worksWith: [
      { who: "Business stakeholders", on: "what the problem actually is, as distinct from the solution they arrived with" },
      { who: "Engineering", on: "whether what has been asked for is buildable, and at what cost" },
      { who: "QA", on: "acceptance criteria — usually the same document, read differently" },
    ],
    skills: {
      must: [
        "Interviewing — getting the real process out of somebody who has stopped noticing what they do",
        "Writing precisely, in a way that survives being read by somebody who was not in the room",
        "Process mapping, and the patience to include the exceptions",
        "Spreadsheets, which remain the working surface of most businesses",
      ],
      helps: [
        "Enough SQL to check a claim yourself rather than commissioning it",
        "Domain knowledge in the industry — this transfers less than people expect between sectors",
        "Familiarity with whatever tracker the company runs on",
      ],
      overrated: [
        "Certification alphabet soup. Useful for filtering CVs, close to useless for doing the work.",
        "UML and formal notation. Most teams want a clear document, not a diagram standard.",
      ],
    },
    howPeopleGetIn: [
      "From an operations or process role, where you already knew how the work really happened.",
      "Directly as a graduate, most often in consulting or a services firm, where the BA role is a defined entry grade.",
      "From support or account management, where you have already spent years hearing what customers actually struggle with.",
      "From QA, which is closer to this than it looks — both jobs are about specifying behaviour precisely.",
    ],
    levels: [
      { name: "Junior BA", whatChanges: "You document a process somebody else scoped." },
      { name: "BA", whatChanges: "You own a workstream, run the interviews, and write the requirements." },
      { name: "Senior BA", whatChanges: "You are trusted to tell a stakeholder their requested solution is the wrong one." },
      { name: "Lead / Product owner / PM", whatChanges: "The fork: deeper into the domain, or across into owning what gets built." },
    ],
    whatIsHard:
      "You have responsibility without authority. You are accountable for the requirements being right, and you cannot make anybody give you accurate information or turn up to the meeting. A large part of the job is extracting a truthful account of a process from somebody who is worried that describing it honestly will get them into trouble. If you dislike ambiguity, or you need to be the one who decides, this will frustrate you badly.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "excel-at-work", note: "Twenty days. Spreadsheets are the BA's working surface and most people are much slower in them than they think." },
        { slug: "thinking-under-uncertainty", note: "Twenty-four days on the reasoning half of the job — base rates, second-order effects, and the discipline of separating a decision from its outcome." },
      ],
    },
  },

  {
    slug: "product-analyst",
    title: "Product analyst",
    domain: "data",
    standfirst: "A data analyst embedded in a product team, focused on what users do and why a feature did or did not work.",
    entry: "Graduate entry where it exists as a named role; more often a second job after general analytics.",
    whatTheyDo: [
      "Owns the numbers for one product area: how people move through it, where they drop out, and whether the last change helped.",
      "Runs and reads experiments, which means being the person who says the result is not significant, or that the test was broken before it started.",
      "Defines and defends the product's metrics, including the unglamorous work of deciding what counts as an active user and making the whole team use the same definition.",
    ],
    typicalWeek: [
      "Build a funnel for a flow somebody suspects is leaking, and find the drop-off is a loading state rather than a design problem.",
      "Check an experiment's sample ratio before looking at its result, and occasionally throw the whole test out because of it.",
      "Say no to a request to segment a null result until something looks significant.",
      "Write a cohort retention query, then explain why the newest cohort looks so good.",
      "Sit in the product meeting and be the person with the number, which means being the person who is asked to justify it.",
    ],
    whatItIsNot: [
      {
        line: "Not a product manager. The analyst owns whether it worked; the PM owns what to build and whether to ship it. Analysts do influence the roadmap, but they do not own it.",
        compare: "product-roles",
      },
      {
        line: "Not a generalist data analyst with a different title. The difference is depth in one surface and ownership of its metrics, rather than breadth across the business.",
        compare: "analyst-roles",
      },
    ],
    worksWith: [
      { who: "Product managers", on: "what to measure before building, not after" },
      { who: "Engineers", on: "instrumentation — most missing data is a tracking event nobody added" },
      { who: "Designers", on: "what the qualitative research and the funnel each say, which is often not the same" },
    ],
    skills: {
      must: [
        "SQL including window functions, because retention and funnels are window problems",
        "Experiment literacy — power, sample ratio mismatch, peeking, and multiple comparisons",
        "Metric definition: numerator, denominator, window, population, and how each could be gamed",
        "Saying 'this did not work' to people who wanted it to",
      ],
      helps: [
        "A product analytics tool, though the concepts matter far more than the vendor",
        "Enough Python to do what the tool cannot",
        "Understanding the instrumentation layer well enough to spot when it changed",
      ],
      overrated: [
        "Predictive modelling. Almost every product question is descriptive or causal, not predictive.",
        "Dashboard volume. One dashboard the team actually opens beats nine nobody does.",
      ],
    },
    howPeopleGetIn: [
      "From a general data analyst role, by specialising into one product surface.",
      "Directly, at companies large enough to have named product analysts — usually product-led software firms.",
      "From product management, occasionally, by someone who preferred the measurement half.",
      "By building the funnel and retention analysis nobody asked for, in a job where you already had the data.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You answer the product team's questions." },
      { name: "Senior", whatChanges: "You decide what the team should be measuring, and kill metrics that mislead." },
      { name: "Lead / Principal", whatChanges: "You own the measurement strategy across products, and the experiment standards everybody follows." },
    ],
    whatIsHard:
      "You are structurally the bearer of bad news. Most features do not move most metrics, and the honest answer to most experiments is that nothing happened — which is unwelcome in a room that spent a quarter building it. The pressure to slice the data until something looks significant is constant and it is rarely applied openly. If you cannot hold a null result under friendly pressure, this job will slowly make you dishonest.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "data-analyst", note: "Ninety-one days. The SQL, statistics and experiment weeks are the core of this role." },
        { slug: "thinking-under-uncertainty", note: "Twenty-four days. The calibration and data-literacy half of holding a null result honestly." },
      ],
    },
  },

  {
    slug: "analytics-engineer",
    title: "Analytics engineer",
    domain: "data",
    standfirst: "Owns the transformation layer — the tested, documented models every analyst then queries.",
    entry: "Rarely a first job. Almost always a second one, from analysis or from engineering.",
    whatTheyDo: [
      "Takes raw tables loaded by data engineers and turns them into models the business can use: named, tested, documented, and consistent between teams.",
      "Owns the definitions in code. When two dashboards disagree about revenue, the fix belongs here rather than in either dashboard.",
      "Brings software practice to analytics — version control, code review, tests, and a build that fails rather than a spreadsheet that quietly diverges.",
    ],
    typicalWeek: [
      "Write and test a model that turns four raw tables into one that means something to a human.",
      "Trace why two teams report different active-user counts, and find both are right under different definitions.",
      "Review another analyst's pull request, mostly about naming and grain.",
      "Add a test that would have caught last month's silent duplication, and watch it fail on today's data.",
      "Write documentation nobody asked for, which is most of what makes the layer usable.",
    ],
    whatItIsNot: [
      {
        line: "Not a data engineer. Data engineering moves and lands the data; analytics engineering shapes what has landed. The two jobs use different tools and think about different failures.",
        compare: "analyst-roles",
      },
      {
        line: "Not a senior data analyst. It is a different job, not a promotion — the work is building the layer other people analyse on, and someone excellent at analysis may dislike it entirely.",
        compare: "analyst-roles",
      },
    ],
    worksWith: [
      { who: "Data engineers", on: "what lands, in what shape, and how often" },
      { who: "Analysts", on: "the models they need and the definitions they keep disagreeing about" },
      { who: "Business owners", on: "what a metric means, which is a negotiation more than a lookup" },
    ],
    skills: {
      must: [
        "SQL at a level well beyond querying — you are writing SQL other people depend on",
        "Dimensional modelling: facts, dimensions, grain, and why a star schema is denormalised on purpose",
        "Version control and code review as habits, not ceremonies",
        "Testing data: uniqueness, referential integrity, accepted values, freshness",
      ],
      helps: [
        "dbt or an equivalent transformation framework",
        "Enough Python to automate the parts SQL cannot reach",
        "Warehouse-specific performance knowledge — this pays off quickly and is very transferable",
      ],
      overrated: [
        "Streaming and real-time. Most analytics is comfortably batch, and pretending otherwise adds cost for nothing.",
        "Tool collecting. The modelling judgement transfers; the vendor does not matter nearly as much as adverts suggest.",
      ],
    },
    howPeopleGetIn: [
      "From data analysis, by being the analyst who kept fixing the shared models and eventually owned them.",
      "From software engineering, by moving toward data and learning dimensional modelling properly.",
      "From BI development, which is the closest adjacent job and often the same work under an older title.",
      "It is the highest-demand, lowest-awareness role in this domain — which means a portfolio of well-modelled, tested SQL stands out unusually far.",
    ],
    levels: [
      { name: "Analytics engineer", whatChanges: "You build and test models within an existing structure." },
      { name: "Senior", whatChanges: "You own the structure, and the standards other people's models are reviewed against." },
      { name: "Lead / Staff", whatChanges: "You own the semantic layer across the company and the arguments about what things mean." },
    ],
    whatIsHard:
      "Nobody notices when this layer works, and everybody notices the day it does not. You are also the permanent arbiter of definitional disputes between teams who each believe theirs is obviously correct, and those arguments are political rather than technical. The work is invisible by design, so if you need visible credit for what you build, this is a poor fit.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "data-analyst", note: "The SQL and modelling weeks are the foundation — window functions, schema design and query performance especially." },
        { slug: "git-and-github", note: "Twelve days. Version control is not optional here: this role is analytics done with software practice." },
      ],
    },
  },
];

export default roles;
