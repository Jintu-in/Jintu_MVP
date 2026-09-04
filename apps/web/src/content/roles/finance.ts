import type { Role } from "./types";

/**
 * The finance roles, from assets/Finance/finance-roles.json (2026-09-03),
 * adapted into the page model. This domain landed together with the
 * startup-finance roadmap, so several routes point at a curriculum the
 * source data was written before: VC, transaction advisory, IB and
 * startup-CFO now end in the roadmap built for exactly them.
 *
 * financial-analyst and fpa-analyst replace the earlier finance-analyst
 * page that straddled both — the owner's taxonomy splits them, correctly.
 */
const roles: Role[] = [
  {
    slug: "financial-analyst",
    title: "Financial analyst",
    aliases: ["Finance Analyst", "Business Finance Analyst"],
    domain: "finance",
    standfirst: "The standard first finance job. Builds the numbers other people decide with.",
    entry: "Graduate entry — very high volume across corporates, GCCs and startups, and the default destination for PGDM Finance graduates.",
    whatTheyDo: [
      "Prepares forecasts, budgets, variance analysis and management reporting. Owns the models that tell a business what happened and what is likely to happen next.",
      "Most of the work is in Excel, and most of the value is in noticing what the number implies — the model is the medium, the observation is the job.",
    ],
    typicalWeek: [
      "Update a monthly forecast and explain the variance.",
      "Build or fix a model somebody else started.",
      "Reconcile two reports that should agree and do not.",
      "Prepare a management pack for review.",
      "Answer 'why is this number different from last month', with the actual reason.",
    ],
    whatItIsNot: [
      {
        line: "Not accounting. Accountants record what happened; analysts explain it and project forward. Adjacent desks, different crafts — and moving between them is common but not automatic.",
      },
      {
        line: "Not a stepping stone you rush through. The variance-analysis instinct built here is the foundation every senior finance role stands on, and the people who skipped it show it.",
      },
    ],
    worksWith: [
      { who: "The finance controller", on: "actuals, and what the ledger really says" },
      { who: "Business heads", on: "their numbers, and the explanations they owe for them" },
      { who: "Data teams", on: "the sources behind the spreadsheets, as the models outgrow them" },
    ],
    skills: {
      must: [
        "Advanced Excel — the actual gate for this job",
        "Financial statement analysis",
        "Variance analysis: decomposing 'the number moved' into causes",
        "Explaining a number in plain words to somebody who will not open the file",
      ],
      helps: [
        "SQL, as the questions outgrow exports",
        "Power BI",
        "Cost accounting",
        "Domain knowledge in the business you serve",
      ],
      overrated: [
        "A CFA at entry level. Valuable later in some tracks; not the gate here.",
        "Programming. The work lives in models, not scripts.",
      ],
    },
    howPeopleGetIn: [
      "MBA or PGDM Finance — the standard route.",
      "B.Com or BBA with genuinely strong Excel, demonstrated rather than claimed.",
      "From accounting, moving from recording to explaining.",
      "Campus placement into a corporate or GCC finance team.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You maintain models and explain variances." },
      { name: "Senior analyst", whatChanges: "The model design is yours, and the harder questions come to you." },
      { name: "Finance manager", whatChanges: "A function's numbers, and the partnership with its leader." },
      { name: "Controller / CFO", whatChanges: "The fork: into the ledger's integrity, or the planning seat." },
    ],
    whatIsHard:
      "You are asked for certainty about a future nobody can know, and blamed when the forecast is wrong — while every number you produce is challenged by somebody whose bonus depends on a different one. If you dislike being questioned about your assumptions, this job is a poor fit, because the questioning is the job working as designed.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "excel-at-work",
          note: "Twenty days, and it is the actual gate — lookups, conditional aggregation, validation and the modelling discipline the role runs on.",
        },
      ],
    },
  },

  {
    slug: "fpa-analyst",
    title: "FP&A analyst",
    aliases: ["Financial Planning and Analysis"],
    domain: "finance",
    standfirst: "Forecasting and business planning — the finance seat closest to actual decisions.",
    entry: "Mid-level entry, usually from a financial analyst seat. Strong demand in GCCs and Indian SaaS, with a well-defined ladder to CFO.",
    whatTheyDo: [
      "Owns the planning cycle: annual budget, rolling forecast, and the business review that follows. Partners with department heads rather than serving them.",
      "Is expected to challenge a plan that does not add up — which is what separates the role from reporting, and what makes it politely adversarial by design.",
    ],
    typicalWeek: [
      "Run the forecast cycle and chase inputs from business owners.",
      "Build a driver-based model rather than a spreadsheet of assumptions.",
      "Prepare the monthly business review deck.",
      "Challenge a department's headcount request with numbers.",
      "Model a scenario leadership asked about on a call, by tomorrow.",
    ],
    whatItIsNot: [
      {
        line: "Not reporting. FP&A is forward-looking and partnership-based; reporting is backward-looking and produced on a schedule. A role advertised as FP&A that is really report production is the commonest bait-and-switch in finance hiring.",
      },
      {
        line: "Not accounting with better meetings. The accounting qualification is the myth here — the craft is driver modelling and business partnering, and plenty of excellent FP&A people never articled.",
      },
    ],
    worksWith: [
      { who: "Business unit heads", on: "their plans, and the challenge those plans owe the numbers" },
      { who: "The controller", on: "actuals the forecast is judged against" },
      { who: "The CFO", on: "the version of the future the board gets told" },
    ],
    skills: {
      must: [
        "Driver-based modelling — plans built from quantities somebody controls",
        "Advanced Excel",
        "Business partnering: challenge without rupture",
        "Presenting to leadership under questioning",
      ],
      helps: [
        "Power BI and SQL",
        "Unit economics fluency",
        "A planning tool such as Anaplan, where the shop runs one",
      ],
      overrated: [
        "An accounting qualification. Helpful history, not the gate.",
      ],
    },
    howPeopleGetIn: [
      "From a financial analyst seat — the standard route.",
      "MBA or PGDM Finance into an FP&A programme directly.",
      "From consulting or audit, trading breadth for a seat at one table.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You run pieces of the cycle." },
      { name: "Manager", whatChanges: "The forecast is yours, and so is the challenge function." },
      { name: "Senior manager / Director of FP&A", whatChanges: "The planning process itself, and the partnership with the CFO." },
      { name: "CFO", whatChanges: "The ladder's stated destination, and this seat is its best preparation." },
    ],
    whatIsHard:
      "You must tell a business head their plan is unrealistic while depending on them for the inputs — every month, politely, with evidence. If you avoid confrontation, useful FP&A is not available to you; the entire value of the seat is the challenge, and a compliant FP&A team is an expensive reporting team.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "excel-at-work",
          note: "Twenty days — the toolkit the cycle runs on.",
        },
        {
          slug: "startup-finance",
          note: "Forty-eight days; module 5 is driver-based modelling and scenario work — the exact craft that separates FP&A from report production, taught through fundraising models but identical in method.",
        },
      ],
    },
  },

  {
    slug: "investment-banking-analyst",
    title: "Investment banking analyst",
    aliases: ["IB Analyst", "M&A Analyst"],
    domain: "finance",
    standfirst: "Builds the models and books behind M&A, fundraising and IPOs. The hours are the reputation.",
    entry: "Graduate entry, heavily gated — boutique and mid-market firms are the realistic route for most PGDM graduates.",
    whatTheyDo: [
      "Produces valuation models, pitch books, information memoranda and financial analysis for transactions. Supports senior bankers on live deals and pitches.",
      "Extremely high volume of precise, deadline-driven work — the job is relentless accuracy under time pressure more than intellectual difficulty.",
    ],
    typicalWeek: [
      "Build or update an operating model and a valuation.",
      "Produce a comparable companies and precedent transactions analysis.",
      "Turn a model into a pitch book slide, correctly.",
      "Populate or manage a data room.",
      "Turn a comment sheet at 1am, and again at 4am.",
    ],
    whatItIsNot: [
      {
        line: "Not investment management. Bankers advise on transactions and earn fees; investors deploy capital and earn returns. The confusion costs people application seasons.",
        compare: "investing-roles",
      },
      {
        line: "Not a mental-maths contest. The myths are the CFA-before-entry and arithmetic showmanship; the reality is three-statement fluency and attention to detail that survives the fourth all-nighter.",
      },
    ],
    worksWith: [
      { who: "Associates and VPs", on: "the comment sheets that shape everything you produce" },
      { who: "Clients", on: "the numbers behind their deal, carefully and rarely directly at first" },
      { who: "Lawyers and auditors", on: "diligence and documentation on live transactions" },
    ],
    skills: {
      must: [
        "Three-statement modelling that balances first time",
        "DCF and comparables, fluently",
        "Extreme attention to detail under deadline",
        "PowerPoint at production quality",
      ],
      helps: [
        "Sector knowledge",
        "Accounting depth",
        "Capital markets awareness",
        "Stamina, honestly assessed",
      ],
      overrated: [
        "A CFA before entry.",
        "Being good at mental maths.",
      ],
    },
    howPeopleGetIn: [
      "Top-tier MBA or PGDM campus recruitment — the front door, and a narrow one.",
      "CA with demonstrated modelling ability.",
      "From Big Four transaction advisory, laterally.",
      "A boutique bank first — the most realistic route, and the work is the same craft.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You build everything and own nothing." },
      { name: "Associate", whatChanges: "You check analysts and run workstreams." },
      { name: "VP", whatChanges: "You run deals day to day and manage clients." },
      { name: "Director / MD", whatChanges: "You originate — the job becomes relationships and revenue." },
    ],
    whatIsHard:
      "The hours are genuinely severe — not tough-job severe, but structurally, for years — and the work is not intellectually difficult so much as relentlessly precise under deadline. If you need predictable hours or protected personal time in the first few years, believe that about yourself now; the industry's attrition exists because many people discover it after signing.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "excel-at-work",
          note: "Twenty days — the speed and accuracy layer everything sits on.",
        },
        {
          slug: "startup-finance",
          note: "Forty-eight days on the deal side of the desk: valuation beyond textbook DCF, diligence, data rooms, and the Indian IPO process module — the transaction context a PGDM does not teach.",
        },
      ],
    },
  },

  {
    slug: "venture-capital-analyst",
    title: "Venture capital analyst",
    aliases: ["VC Analyst", "Investment Analyst (VC)"],
    domain: "finance",
    standfirst: "Evaluates startups. Mostly reading, meeting and judging, not modelling.",
    entry: "Graduate entry in name, network-gated in practice — startup operating experience often beats a finance degree.",
    whatTheyDo: [
      "Sources and screens startups, runs early diligence on market, team and traction, builds the investment note, and supports portfolio companies afterwards.",
      "The financial modelling is lighter than in banking; the judgement is heavier — and the feedback on that judgement arrives years later, if at all.",
    ],
    typicalWeek: [
      "Meet five or six founders and write them up honestly.",
      "Build a bottom-up market size for a sector nobody has data on.",
      "Analyse a startup's unit economics and find the assumption that carries everything.",
      "Write an investment memo and defend it in partner meeting.",
      "Help a portfolio company with a hiring or metrics problem.",
    ],
    whatItIsNot: [
      {
        line: "Not private equity. VC underwrites growth in companies with little history; PE underwrites cash flows in companies with a lot. The skills, models and temperaments differ more than the shared word 'investor' suggests.",
        compare: "investing-roles",
      },
      {
        line: "Not complex modelling as a day job. The myth is the DCF wizard; the reality is market sizing, unit economics, founder judgement and a clear memo — the deal maths fits on a page.",
      },
    ],
    worksWith: [
      { who: "Partners", on: "the memo, and the defence of it" },
      { who: "Founders", on: "diligence now, and help later if the deal happens" },
      { who: "Co-investors", on: "syndicates, references and shared conviction" },
    ],
    skills: {
      must: [
        "Unit economics — CAC, LTV, contribution, and how each is gamed",
        "Market sizing, bottom-up",
        "Startup valuation methods, used honestly as anchors",
        "Writing a clear investment memo with its falsifier stated",
      ],
      helps: [
        "Sector expertise",
        "Cap table mechanics",
        "Founder assessment discipline",
        "A network, which is also the door",
      ],
      overrated: [
        "Complex DCF modelling.",
        "An MBA from a top school — helpful for the network, not the judgement.",
      ],
    },
    howPeopleGetIn: [
      "From startup operating experience — often the strongest signal a fund hires on.",
      "From investment banking or consulting, laterally.",
      "From an accelerator or angel network, where the deal flow taught the craft.",
      "PGDM with demonstrated startup interest — real memos, real angel syndicate work, a record of judgement.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You source and screen; your memos train your judgement in public." },
      { name: "Associate", whatChanges: "You run diligence and carry deals to partner meeting." },
      { name: "Principal", whatChanges: "You have a voice in decisions and a portfolio to serve." },
      { name: "Partner", whatChanges: "Your name is on the fund's judgement, and its returns." },
    ],
    whatIsHard:
      "You are wrong most of the time by design — the power-law economics mean most investments fail and the winners pay for everything — and the feedback on any decision arrives years later. Entry is heavily network-dependent, which is worth knowing before spending a year on applications. If you need to know whether your decisions were right within a reasonable timeframe, this job withholds exactly that.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "startup-finance",
          note: "Forty-eight days built around this desk: the funding ladder, cap tables, startup valuation, unit economics and their manipulations, diligence, and the memo with its falsifier — module 6's deliverable is this job's core artefact.",
        },
        {
          slug: "thinking-under-uncertainty",
          note: "Twenty-four days on the judgement half — base rates against the inside view, calibration, and being wrong by design without becoming sloppy about it.",
        },
      ],
    },
  },

  {
    slug: "private-equity-analyst",
    title: "Private equity analyst",
    aliases: ["PE Analyst", "Buyout Analyst"],
    domain: "finance",
    standfirst: "Underwrites control investments in companies with real cash flows.",
    entry: "Almost never a first job — the standard path runs through banking or Big Four transaction services first.",
    whatTheyDo: [
      "Models leveraged buyouts, runs deep diligence, and works with portfolio company management on value creation.",
      "Heavier modelling and more operational involvement than VC — the asset has history, so the work is interrogating it.",
    ],
    typicalWeek: [
      "Build or stress an LBO model.",
      "Coordinate diligence workstreams across advisers.",
      "Analyse a target's quality of earnings.",
      "Prepare an investment committee paper.",
      "Review a portfolio company's monthly performance against the deal case.",
    ],
    whatItIsNot: [
      {
        line: "Not VC. PE buys control of profitable businesses and improves them; VC buys minority stakes in unprofitable ones and backs growth. Different underwriting, different models, different daily work.",
        compare: "investing-roles",
      },
      {
        line: "Not an entry-level role, whatever the adverts imply. The lateral gate is real: funds hire people who have already done transaction work elsewhere, because the deals are too few to train on.",
      },
    ],
    worksWith: [
      { who: "Deal partners", on: "the investment case and the committee paper" },
      { who: "Portfolio management teams", on: "the value-creation plan, monthly" },
      { who: "Bankers, lenders and consultants", on: "the transaction's moving parts" },
    ],
    skills: {
      must: [
        "LBO modelling",
        "Debt structures and covenants",
        "Quality of earnings analysis",
        "Diligence coordination across workstreams",
      ],
      helps: [
        "Sector expertise",
        "Operational improvement literacy",
        "Legal awareness",
      ],
      overrated: [
        "The idea that it is reachable directly from campus. It rarely is, and planning around that fact beats resenting it.",
      ],
    },
    howPeopleGetIn: [
      "From investment banking, usually after two to three years — the standard route.",
      "From Big Four transaction advisory, which is the same diligence craft on the sell side of the desk.",
      "From consulting, into the operationally-flavoured funds.",
    ],
    levels: [
      { name: "Analyst / Associate", whatChanges: "You build the models and run the workstreams." },
      { name: "VP", whatChanges: "You run deals and own portfolio relationships." },
      { name: "Principal / Partner", whatChanges: "You originate, decide and answer to the LPs." },
    ],
    whatIsHard:
      "Almost never a first job — and pretending otherwise wastes application seasons. The honest plan for a PGDM graduate is two to three years in banking or transaction advisory first, chosen deliberately as the route. Concentrated in Mumbai and Bengaluru, small, and largely lateral: the constraint is structural, not personal.",
    startHere: {
      kind: "notYet",
      note: "No LBO curriculum yet — and the honest route runs through transaction work first anyway. The two below are that route's foundations: the diligence craft, and the modelling floor under it.",
      readInstead: [
        {
          label: "Startup finance & fundraising — 48 days; module 6 is quality of earnings, working capital and diligence, which is the PE-adjacent craft the lateral gate actually tests",
          url: "/learn/startup-finance",
        },
        {
          label: "Excel at work — 20 days; LBO models are unforgiving of weak Excel",
          url: "/learn/excel-at-work",
        },
      ],
    },
  },

  {
    slug: "equity-research-analyst",
    title: "Equity research analyst",
    aliases: ["Research Analyst", "Sell-side Analyst"],
    domain: "finance",
    standfirst: "Covers a set of companies deeply and publishes a view with a number attached.",
    entry: "Graduate entry — the Indian research KPO industry serving global banks is the common route in.",
    whatTheyDo: [
      "Builds and maintains models for companies in one sector, tracks results and management commentary, and publishes reports with a rating and target price.",
      "Accountable for a public, dated, checkable opinion — which is rarer in finance than it sounds, and shapes everything about the work.",
    ],
    typicalWeek: [
      "Update a model after a quarterly result.",
      "Listen to an earnings call and note what management avoided.",
      "Write a note with a defensible target price.",
      "Speak to institutional clients about the sector.",
      "Revise a thesis that is not playing out, in print.",
    ],
    whatItIsNot: [
      {
        line: "Not portfolio management. Research produces the view; the fund manager takes the risk. The border matters because the skills that make a great analyst — depth, writing, honesty about uncertainty — are necessary but not sufficient on the other side.",
        compare: "investing-roles",
      },
      {
        line: "Not market prediction. The myth is the oracle; the craft is sector depth, model discipline, and written argument that survives the quarter being wrong.",
      },
    ],
    worksWith: [
      { who: "Institutional clients", on: "the sector view, and the questions that sharpen it" },
      { who: "Company management", on: "results, guidance, and what the call did not say" },
      { who: "Sales and trading", on: "getting the view to the people who act on it" },
    ],
    skills: {
      must: [
        "Sector modelling maintained through every result",
        "Financial statement analysis at depth",
        "Written argument — the report is the product",
        "Valuation, defended in public",
      ],
      helps: [
        "The CFA, which genuinely counts in this track",
        "Accounting depth",
        "Channel checks and industry contacts",
      ],
      overrated: [
        "Predicting the market. Nobody is hired for it and nobody sustains it.",
      ],
    },
    howPeopleGetIn: [
      "MBA or PGDM Finance into a sell-side seat.",
      "CA, especially into sectors where accounting depth is the edge.",
      "The CFA route, alongside either.",
      "From a KPO research desk serving global banks — the volume route, and real training.",
    ],
    levels: [
      { name: "Associate", whatChanges: "You maintain models and draft under an analyst's name." },
      { name: "Analyst", whatChanges: "The coverage, the calls and the name on the report are yours." },
      { name: "Senior analyst", whatChanges: "The franchise sector, and the institutional relationships." },
      { name: "Head of research", whatChanges: "The desk's standards, and its independence under pressure." },
    ],
    whatIsHard:
      "Your view is public, timestamped and checkable — being wrong is visible in a way it is not in most finance roles, and you will be wrong regularly in front of clients who remember. If you dislike writing, this is disqualifying rather than inconvenient: the report is the product, and the analyst who cannot write is a model without a voice.",
    startHere: {
      kind: "notYet",
      note: "No sector-research curriculum yet — and a writing roadmap is separately on the request list, which this desk would lean on hardest. What is coursable today is the judgement layer under the craft.",
      readInstead: [
        {
          label: "Thinking clearly under uncertainty — 24 days; a target price is a calibrated forecast in public, which is this roadmap's exact material",
          url: "/learn/thinking-under-uncertainty",
        },
        {
          label: "Excel at work — 20 days; the model maintenance layer",
          url: "/learn/excel-at-work",
        },
      ],
    },
  },

  {
    slug: "transaction-advisory-analyst",
    title: "Transaction advisory analyst",
    aliases: ["Financial Due Diligence", "Deal Advisory", "TAS"],
    domain: "finance",
    standfirst: "Does the financial diligence that decides whether a deal happens at that price.",
    entry: "Graduate entry — Big Four TAS teams hire in volume in India, and it is one of the strongest routes toward PE.",
    whatTheyDo: [
      "Analyses a target's historical financials for a buyer — quality of earnings, working capital normalisation, one-off items, debt-like items.",
      "Produces the report the buyer prices from — findings here move purchase prices, which is the job's weight and its appeal.",
    ],
    typicalWeek: [
      "Analyse three years of a target's monthly financials.",
      "Normalise working capital and identify one-offs.",
      "Question management on a revenue recognition policy, carefully.",
      "Draft findings that will change the purchase price.",
      "Coordinate with legal and commercial diligence teams.",
    ],
    whatItIsNot: [
      {
        line: "Not audit. Audit opines on whether statements are fairly stated; diligence asks what the earnings are actually worth to a buyer. The same statements, a different question — and the different question is the whole job.",
      },
      {
        line: "Not merely a stepping stone, though it is a strong one. The craft — quality of earnings — is a career in itself, and the partners doing it at depth are among the most trusted people in any deal.",
        compare: "investing-roles",
      },
    ],
    worksWith: [
      { who: "Buyers and their deal teams", on: "the findings, and what they do to price" },
      { who: "Target management", on: "questions they would rather not answer precisely" },
      { who: "Legal and commercial diligence teams", on: "the joined-up picture" },
    ],
    skills: {
      must: [
        "Financial statement analysis at forensic depth",
        "Advanced Excel",
        "Quality of earnings method — add-backs, normalisation, run-rate",
        "Report writing that survives being priced from",
      ],
      helps: [
        "Sector knowledge",
        "Accounting standards depth",
        "Valuation literacy",
      ],
      overrated: [
        "Treating it as a waiting room for PE. The exit exists because the craft is real; do the craft.",
      ],
    },
    howPeopleGetIn: [
      "CA — the dominant credential in Big Four TAS.",
      "MBA or PGDM Finance, into the same teams.",
      "From audit, across the corridor — the most common internal move.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You spread financials and draft sections." },
      { name: "Senior analyst", whatChanges: "Workstreams are yours, and management interviews too." },
      { name: "Manager", whatChanges: "You run the engagement and sign the findings draft." },
      { name: "Director", whatChanges: "You own the client, the scope and the judgement calls." },
    ],
    whatIsHard:
      "You work to a deal timetable on incomplete information, and your findings can kill something a lot of people want to happen — the pressure to soften a finding is real and rarely explicit. Deal cycles also do not respect schedules; if you need a stable rhythm, the work's quality will not save the fit.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "startup-finance",
          note: "Forty-eight days; module 6 is this desk's exact craft — quality of revenue, quality of earnings, working capital normalisation and the findings memo.",
        },
        {
          slug: "excel-at-work",
          note: "Twenty days. Three years of monthly financials do not analyse themselves.",
        },
      ],
    },
  },

  {
    slug: "startup-cfo",
    title: "Startup finance lead / CFO",
    aliases: ["Head of Finance", "Finance Lead"],
    domain: "finance",
    standfirst: "The only finance person, doing every finance job at once.",
    entry: "Senior entry — growing with the Indian startup ecosystem, with fractional and part-time versions increasingly common.",
    whatTheyDo: [
      "Owns everything financial in a small company — accounting oversight, cash runway, fundraising support, board reporting, compliance, and the operating model.",
      "Breadth over depth, and the runway calculation is the job that matters most: being right about that one number is the role's core duty.",
    ],
    typicalWeek: [
      "Update the runway and cash forecast, from bank actuals.",
      "Prepare the board pack.",
      "Support a fundraise — data room, model, diligence questions.",
      "Handle a compliance or tax matter.",
      "Tell a founder something is unaffordable, with the numbers open.",
    ],
    whatItIsNot: [
      {
        line: "Not a corporate CFO role scaled down. There is no team, no systems and no precedent — you build all three while running the function, and the corporate playbook mostly does not apply yet.",
      },
      {
        line: "Not a specialisation. It is the broadest finance role there is, and someone who wants depth in one area will be stretched thin across ten.",
      },
    ],
    worksWith: [
      { who: "Founders", on: "the truth about cash, delivered early enough to act on" },
      { who: "The board and investors", on: "reporting that is honest before it is polished" },
      { who: "Auditors and CA firms", on: "the compliance the company cannot staff internally" },
    ],
    skills: {
      must: [
        "Cash and runway management from actuals",
        "Fundraising mechanics — instruments, cap table, data room",
        "Board reporting",
        "Compliance awareness across tax, payroll and filings",
      ],
      helps: [
        "Cap table management at modelling depth",
        "Unit economics",
        "Systems implementation",
        "Recruiting, because you will build the team",
      ],
      overrated: [
        "Deep specialisation in one area. The role punishes it — breadth is the requirement.",
      ],
    },
    howPeopleGetIn: [
      "From FP&A in a startup, growing into the seat.",
      "From CA practice with startup clients — the compliance half is already fluent.",
      "From banking or VC, crossing to the operating side.",
      "By growing with the company from its first finance hire.",
    ],
    levels: [
      { name: "Finance lead", whatChanges: "You are the function, alone." },
      { name: "Head of finance", whatChanges: "A small team exists; the systems are yours to build." },
      { name: "CFO", whatChanges: "The board seat, the fundraise, and the title's full weight." },
    ],
    whatIsHard:
      "You are the person who has to say the runway is nine months, not eighteen — being right and unwelcome is the recurring position, and the founder you must correct is also your boss. If you want deep specialisation or the comfort of a function around you, this seat offers neither; what it offers is the widest finance education available anywhere.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "startup-finance",
          note: "Forty-eight days that map to this desk almost one-to-one: instruments, the cap table, runway, the model behind the deck, the data room, and the diligence you will sit on the receiving end of.",
        },
        {
          slug: "excel-at-work",
          note: "Twenty days. Every artefact this role owns lives in a workbook.",
        },
      ],
    },
  },

  {
    slug: "credit-risk-analyst",
    title: "Credit / risk analyst",
    aliases: ["Credit Analyst", "Risk Analyst"],
    domain: "finance",
    standfirst: "Decides whether to lend, how much, and at what price.",
    entry: "Graduate entry — very large hiring across Indian banks, NBFCs and fintech lenders.",
    whatTheyDo: [
      "Assesses a borrower's ability to repay — financials, cash flows, collateral, sector risk — and writes the credit note a committee approves or declines.",
      "In market-risk seats, measures and limits exposure instead; in both, the job is saying no correctly, in writing.",
    ],
    typicalWeek: [
      "Spread a borrower's financials and analyse cash flow coverage.",
      "Write a credit appraisal note with a recommendation.",
      "Present to a credit committee and defend it.",
      "Monitor an existing exposure for early warning signals.",
      "Update a risk model or a limit.",
    ],
    whatItIsNot: [
      {
        line: "Not sales, and structurally opposed to it: relationship managers bring the deal, credit decides whether the bank takes it. The tension is the design, not a dysfunction.",
      },
      {
        line: "Not a back-office role, whatever the front office implies. Credit's no is the bank's actual risk appetite in action, and senior credit people carry real institutional weight.",
      },
    ],
    worksWith: [
      { who: "Relationship managers", on: "deals they want and you must judge" },
      { who: "The credit committee", on: "your note, and its defence" },
      { who: "Collections and legal", on: "the exposures that went wrong" },
    ],
    skills: {
      must: [
        "Financial statement analysis with a lender's eye",
        "Cash flow and coverage analysis",
        "Sector risk assessment",
        "A written recommendation that commits",
      ],
      helps: [
        "Regulatory knowledge",
        "Statistical modelling, in the model-driven shops",
        "SQL",
        "Collateral and legal awareness",
      ],
      overrated: [
        "The back-office framing. It misprices the seat and the people in it.",
      ],
    },
    howPeopleGetIn: [
      "MBA or PGDM Finance into bank and NBFC programmes.",
      "CA, especially into corporate credit.",
      "Bank management trainee programmes.",
      "From accounting, with the analysis layer added.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You spread, write and recommend." },
      { name: "Senior analyst", whatChanges: "Larger exposures, and your note carries further." },
      { name: "Credit manager", whatChanges: "A portfolio's quality is yours." },
      { name: "Chief risk officer", whatChanges: "The institution's appetite, stated and defended." },
    ],
    whatIsHard:
      "You are rewarded for saying no correctly and blamed for saying no unnecessarily — and both are hard to prove, because the loans you decline produce no observable outcome. If you want to be liked by the commercial side of the business, this seat structurally prevents it; the durable credit people substitute respect for popularity and are content with the trade.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "excel-at-work",
          note: "Twenty days — spreading financials and coverage analysis live here.",
        },
        {
          slug: "thinking-under-uncertainty",
          note: "Twenty-four days; credit judgement is base-rate reasoning with a signature on it, and the calibration discipline transfers whole.",
        },
      ],
    },
  },

  {
    slug: "treasury-analyst",
    title: "Treasury analyst",
    aliases: ["Cash Management Analyst"],
    domain: "finance",
    standfirst: "Makes sure the money is in the right place, in the right currency, at the right time.",
    entry: "Graduate entry — steady demand in large corporates, GCCs and shared service centres.",
    whatTheyDo: [
      "Manages cash positioning, liquidity, short-term investments, banking relationships and FX or interest-rate exposure.",
      "Highly operational with real deadlines every day — treasury deals with actual money movement, not its recording or projection.",
    ],
    typicalWeek: [
      "Position cash across accounts and entities.",
      "Forecast short-term liquidity.",
      "Execute or monitor an FX hedge.",
      "Manage a banking relationship or facility.",
      "Reconcile and report the daily position, on time, again.",
    ],
    whatItIsNot: [
      {
        line: "Not accounting or FP&A. Accounting records money, FP&A projects it, treasury moves it — three desks, three relationships with the same rupee.",
      },
      {
        line: "Not a valuation seat. The complex-modelling myth misses the role's actual texture: operational precision on a daily clock.",
      },
    ],
    worksWith: [
      { who: "Banks", on: "facilities, rates and the daily mechanics" },
      { who: "Accounting", on: "reconciliation between the ledger and the bank" },
      { who: "FP&A and tax", on: "the cash implications of everybody else's plans" },
    ],
    skills: {
      must: [
        "Cash forecasting",
        "Banking mechanics — instruments, cut-offs, settlement",
        "Excel",
        "Precision under daily deadlines",
      ],
      helps: [
        "FX and derivatives literacy",
        "A treasury management system",
        "Regulatory knowledge such as FEMA",
      ],
      overrated: [
        "Complex valuation modelling.",
      ],
    },
    howPeopleGetIn: [
      "MBA or PGDM Finance into corporate treasury.",
      "From banking, across the counter.",
      "From accounting, following the cash.",
      "Corporate graduate programmes.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "The daily position is yours to run." },
      { name: "Manager", whatChanges: "Liquidity strategy and the banking relationships." },
      { name: "Treasurer", whatChanges: "The company's cash, debt and FX posture." },
      { name: "Group treasurer", whatChanges: "The same, across every entity and border." },
    ],
    whatIsHard:
      "Daily deadlines that cannot slip, and errors that are immediately expensive and visible — a mispositioned crore is not a variance to explain next month but a today problem. If you prefer project work to operational rhythm, treasury's clock will grind; the people who thrive here like the daily heartbeat and the clean zero at reconciliation.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "excel-at-work",
          note: "Twenty days — the positioning sheets, the forecasts and the reconciliations all live here, under a daily deadline.",
        },
      ],
    },
  },

  {
    slug: "investment-manager",
    title: "Investment / portfolio manager",
    aliases: ["Fund Manager", "Wealth Manager", "Portfolio Manager"],
    domain: "finance",
    standfirst: "Takes the risk. Everyone else in finance advises; this role decides.",
    entry: "Senior entry — small, and almost never a first job. Wealth management is the accessible entry point.",
    whatTheyDo: [
      "Constructs and manages a portfolio against a mandate and a benchmark, sizing positions and managing risk.",
      "In wealth management, does the same for individual clients with their goals and constraints — the craft is the same, the accountability more personal.",
    ],
    typicalWeek: [
      "Review positions against the mandate and risk limits.",
      "Meet analysts and challenge their theses.",
      "Size or exit a position, and own it.",
      "Report performance and attribution.",
      "Explain underperformance to clients or a committee, without excuses that are really reasons.",
    ],
    whatItIsNot: [
      {
        line: "Not equity research with more seniority. Research recommends; the manager owns the decision and the outcome — a difference of kind, and the reason strong analysts sometimes make poor managers.",
        compare: "investing-roles",
      },
      {
        line: "Not stock-picking as a personality. The myth is the hot hand; the craft is portfolio construction, risk management and emotional discipline across full cycles.",
      },
    ],
    worksWith: [
      { who: "Analysts", on: "theses, challenged before they become positions" },
      { who: "Risk and compliance", on: "the limits that are the mandate's teeth" },
      { who: "Clients", on: "expectations, and the years when the benchmark wins" },
    ],
    skills: {
      must: [
        "Portfolio construction",
        "Risk management as practice, not paperwork",
        "Valuation",
        "Emotional discipline under public measurement",
      ],
      helps: [
        "The CFA",
        "Sector expertise",
        "Quantitative methods",
        "Client communication",
      ],
      overrated: [
        "Stock-picking ability alone. It is necessary and dramatically insufficient.",
      ],
    },
    howPeopleGetIn: [
      "From equity research, crossing from view to risk.",
      "From analyst seats inside a fund, earning sleeve by sleeve.",
      "The wealth-management route, building from client portfolios upward — the accessible door.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You feed the decision without owning it." },
      { name: "Assistant PM", whatChanges: "A sleeve is yours, inside someone else's mandate." },
      { name: "Portfolio manager", whatChanges: "The mandate, the number, and the name on both." },
      { name: "CIO", whatChanges: "The house view, and every mandate under it." },
    ],
    whatIsHard:
      "Performance is public, measured continuously against a benchmark, and largely determined by factors you do not control — you will underperform for stretches while doing everything right, in front of clients. If you cannot sit with being wrong in public for extended periods, the seat is unlivable regardless of skill; calibration and temperament are the actual gates.",
    startHere: {
      kind: "roadmaps",
      picks: [
        {
          slug: "thinking-under-uncertainty",
          note: "Twenty-four days on exactly this temperament: calibration, base rates, resulting, and the discipline of judging process when outcomes are noisy — the roadmap's capstone is a tracked forecasting record, which is this job in miniature.",
        },
      ],
    },
  },
];

export default roles;
