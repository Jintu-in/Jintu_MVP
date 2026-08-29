import type { Role } from "./types";

/**
 * The marketing taxonomy beyond performance, from the tail of the owner's
 * expanded data. Several of these have no roadmap and no close substitute —
 * those pages say so plainly and point at the request box, because a
 * demand signal is worth more than a padded route.
 */
const roles: Role[] = [
  {
    slug: "social-media-manager",
    title: "Social media manager",
    aliases: ["Social Media Executive", "Community Manager"],
    domain: "marketing",
    standfirst: "Not posting. Calendar, community, creative briefs and the reporting behind them.",
    entry: "Graduate entry — very high hiring volume in India, and one of the few open doors without a degree filter.",
    whatTheyDo: [
      "Owns what a brand says in public and how often: plans a content calendar against actual objectives, briefs designers and editors, replies in the comments and the inbox, and reports on what any of it did.",
      "The making of assets is mostly other people's craft; the distribution, the community and the judgement about what goes out are yours.",
    ],
    typicalWeek: [
      "Plan and schedule the next fortnight's calendar against something more than vibes.",
      "Brief a designer or editor and review the output against the brief.",
      "Reply to comments and DMs, including the hostile ones, in the brand's voice.",
      "Pull last month's numbers and explain a drop honestly.",
      "Adapt one idea into four platform-specific formats.",
    ],
    whatItIsNot: [
      {
        line: "Not a junior version of content marketing, and not a design job. The craft is distribution and community; the asset is usually somebody else's work, briefed by you.",
      },
      {
        line: "Not being personally popular online. Running a brand's presence and having one of your own are different skills, and the first is the job.",
      },
    ],
    worksWith: [
      { who: "Design and video", on: "briefs, and the review that keeps output on-brand" },
      { who: "Performance marketing", on: "which organic winners deserve paid budget" },
      { who: "Customer support", on: "the complaints that arrive in the comments first" },
    ],
    skills: {
      must: [
        "Writing short copy that survives its platform",
        "Platform fluency — formats, cadences and what each algorithm currently feeds",
        "Briefing creative work precisely enough to get what you meant",
        "Reading engagement data without flattering yourself",
      ],
      helps: [
        "Basic design and video editing, for the gaps between briefs",
        "Community moderation judgement",
        "Paid social basics",
      ],
      overrated: [
        "Being personally popular online.",
        "A marketing degree. The portfolio of accounts you have run is the credential.",
        "Design skill. Brief it; do not become it.",
      ],
    },
    howPeopleGetIn: [
      "Directly, with a portfolio of accounts you have actually run — your own, a club's, a small business's.",
      "From content writing, adding the distribution half.",
      "From an agency, where the volume teaches fast.",
    ],
    levels: [
      { name: "Executive", whatChanges: "You run the calendar somebody else set." },
      { name: "Manager", whatChanges: "The strategy, the briefs and the reporting are yours." },
      { name: "Lead", whatChanges: "Multiple brands or channels, and the people running them." },
      { name: "Head of brand or content", whatChanges: "The public voice itself is your remit." },
    ],
    whatIsHard:
      "You are judged on numbers set by an algorithm you do not control, and the work is public when it fails — a bad post is screenshotted before it is deleted. Some of the hostility in the inbox will be personal even though the account is not you; if public criticism lands hard, this exposure is daily, not occasional.",
    startHere: {
      kind: "notYet",
      note: "No social media roadmap yet — request it on the catalogue; this is among the most-requested subjects we have not built. The measurable half is coursable today.",
      readInstead: [
        { label: "Excel at work — 20 days; the calendar and the reporting live here before any scheduling tool", url: "/learn/excel-at-work" },
      ],
    },
  },

  {
    slug: "content-marketer",
    title: "Content marketer",
    aliases: ["Content Strategist", "Content Writer"],
    domain: "marketing",
    standfirst: "Editorial strategy in service of a commercial outcome.",
    entry: "Graduate entry — being reshaped by generative tools, with the value moving to judgement and expert interviews.",
    whatTheyDo: [
      "Decides what a company should publish and why, then writes or commissions it. Works backwards from the questions buyers actually ask, and is measured on whether the writing brings people who convert — not on volume.",
      "Increasingly the job is editorial judgement and getting real expertise out of experts, because drafting alone has stopped being scarce.",
    ],
    typicalWeek: [
      "Interview an internal expert and turn what they actually know into a draft.",
      "Edit an outside writer's piece into house voice.",
      "Decide what not to publish, and defend that decision.",
      "Update an old piece that is decaying instead of writing a new one.",
      "Look at which pieces actually produced signups, and retire the vanity metric.",
    ],
    whatItIsNot: [
      {
        line: "Not an SEO specialist, though the two overlap constantly. SEO owns how a page is found; content owns whether it was worth finding — and each fails without the other.",
      },
      {
        line: "Not volume writing. Ten pieces that answer real buyer questions beat fifty that exist to exist, and the discipline of the job is saying no to the fifty.",
      },
    ],
    worksWith: [
      { who: "SEO", on: "what people search and how they phrase it" },
      { who: "Subject-matter experts", on: "extracting what they know in their words, not yours" },
      { who: "Design", on: "the pieces that need more than prose" },
    ],
    skills: {
      must: [
        "Writing clearly, and editing others without flattening their expertise",
        "Interviewing experts — the skill the generative era made decisive",
        "Editorial judgement about what deserves to exist",
        "Working backwards from buyer questions rather than forwards from topics",
      ],
      helps: [
        "SEO fundamentals",
        "Analytics enough to know what converted",
        "Distribution instincts — publishing is half the work",
      ],
      overrated: [
        "A journalism or English degree.",
        "Writing fast. The scarce thing is knowing what to write, and what to cut.",
      ],
    },
    howPeopleGetIn: [
      "From freelance writing, with a portfolio that shows judgement rather than volume.",
      "From journalism, trading the newsroom for the funnel.",
      "From a domain job into writing about that domain — the most underrated route, because the expertise is the moat.",
    ],
    levels: [
      { name: "Writer", whatChanges: "You draft against somebody else's plan." },
      { name: "Content marketer", whatChanges: "The plan is yours, and so is the no." },
      { name: "Content lead", whatChanges: "Writers and freelancers report into your standards." },
      { name: "Head of content", whatChanges: "The editorial strategy is a line in the company's plan." },
    ],
    whatIsHard:
      "The results take months to appear and are hard to attribute, which makes this the first budget cut in a bad quarter — a structural fact about the discipline, not about your work. If you need to see the effect of your work quickly, the feedback loop here will starve you; the durable people keep private conviction alongside public patience.",
    startHere: {
      kind: "notYet",
      note: "No content marketing roadmap yet, and a writing roadmap is separately on the request list — asking for either moves it up. What is coursable now is the judgement that separates editorial from output.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; editorial judgement is knowing which claims survive scrutiny", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "seo-specialist",
    title: "SEO specialist",
    aliases: ["SEO Executive", "Search Marketer"],
    domain: "marketing",
    standfirst: "Three different jobs sharing one title: technical, on-page and off-page.",
    entry: "Graduate entry — real demand, under visible pressure from AI search results. Worth entering with eyes open.",
    whatTheyDo: [
      "Makes pages findable. Technical SEO fixes crawling, indexing and speed; on-page shapes what a page is about; off-page earns links and mentions. Most people specialise in one and claim all three.",
      "The honest current picture: AI summaries are absorbing clicks that used to reach pages, so the discipline is being repriced around the traffic that still converts.",
    ],
    typicalWeek: [
      "Audit why a section of the site is not being indexed.",
      "Research what people actually search and how they phrase it.",
      "Brief writers on structure and intent — not keyword density.",
      "Diagnose a ranking drop against an algorithm update.",
      "Report on traffic that is increasingly not clicking through, honestly.",
    ],
    whatItIsNot: [
      {
        line: "Not content marketing, though they share a border. SEO owns findability; content owns whether the page deserved to be found.",
      },
      {
        line: "Not a bag of tricks. The tricks era selected for people the next update fired; the durable work is intent, structure and technical hygiene.",
      },
    ],
    worksWith: [
      { who: "Content", on: "intent and structure, before a word is drafted" },
      { who: "Engineering", on: "the technical fixes that need a deploy, prioritised honestly" },
      { who: "Performance marketing", on: "which queries to pay for and which to earn" },
    ],
    skills: {
      must: [
        "Search intent analysis — what the query actually wants",
        "Technical diagnosis: crawling, indexing, rendering, speed",
        "Analytics fluency",
        "Patience with feedback measured in months",
      ],
      helps: [
        "HTML and site architecture literacy",
        "Log file analysis",
        "Basic scripting for the audits that do not fit a tool",
      ],
      overrated: [
        "Secret tricks. There are none that survive an update.",
        "Keyword stuffing, a decade dead and still in job adverts.",
        "A marketing degree.",
      ],
    },
    howPeopleGetIn: [
      "Self-taught, with a site you have actually ranked — the portfolio is a search result.",
      "From an agency, where the case volume compresses years of learning.",
      "From content, adding the technical half.",
    ],
    levels: [
      { name: "Executive", whatChanges: "You execute audits and briefs inside somebody's strategy." },
      { name: "Specialist", whatChanges: "One of the three sub-crafts is genuinely yours." },
      { name: "Manager", whatChanges: "The organic channel is your number." },
      { name: "Head of growth or SEO", whatChanges: "You own the argument for organic against channels that show a number tomorrow." },
    ],
    whatIsHard:
      "The rules change without notice, AI summaries are absorbing the clicks, and you can do everything right and lose anyway. If you want a stable playbook, this one is rewritten by someone else every few months — the people who last treat the volatility as the job rather than an interruption to it.",
    startHere: {
      kind: "notYet",
      note: "No SEO roadmap yet — request it if you want it, and know that we would build it around the durable parts, not the tricks. The measurement half is coursable now.",
      readInstead: [
        { label: "Data analyst — 91 days; the analytics, funnel and honest-measurement weeks are the durable half of SEO", url: "/learn/data-analyst" },
      ],
    },
  },

  {
    slug: "growth-marketer",
    title: "Growth marketer",
    aliases: ["Growth Manager", "Growth Hacker"],
    domain: "marketing",
    standfirst: "Experimentation across the whole funnel rather than one channel.",
    entry: "Mid-level entry, usually from performance marketing, product analytics or product management.",
    whatTheyDo: [
      "Finds the constraint on growth and attacks it wherever it sits — acquisition, activation, retention or referral. Runs experiments, most of which fail, and is trusted or not on the honesty of the measurement.",
      "Often discovers the problem is not acquisition at all, which is the finding that pays for the role.",
    ],
    typicalWeek: [
      "Find where users drop out and form a hypothesis about why.",
      "Design an experiment with a real control, sized before it starts.",
      "Ship a landing page or onboarding change.",
      "Kill an experiment that is not working, at the planned end, not early.",
      "Report a negative result without dressing it up.",
    ],
    whatItIsNot: [
      {
        line: "Not performance marketing. Paid acquisition is one channel; growth owns the whole loop, and the loop's constraint is usually somewhere paid budget cannot reach.",
      },
      {
        line: "Not a bag of growth hacks. The hacks that worked once are case studies, not methods — the method is honest experimentation, which is slower and compounds.",
      },
    ],
    worksWith: [
      { who: "Product and engineering", on: "the experiments that need a deploy" },
      { who: "Data", on: "whether the result is real — sample ratio, peeking, multiple comparisons" },
      { who: "Performance marketing", on: "the acquisition half of the loop" },
    ],
    skills: {
      must: [
        "Experiment design: power, controls, and a primary metric named in advance",
        "Statistical honesty under pressure to find a win",
        "Funnel analysis",
        "Prioritisation — the backlog of possible experiments is infinite",
      ],
      helps: [
        "SQL",
        "Landing page craft and copy",
        "Basic front-end, for shipping your own small changes",
      ],
      overrated: [
        "Knowing growth hacks.",
        "Generalism without depth anywhere. The strong growth people have one deep craft plus the method.",
      ],
    },
    howPeopleGetIn: [
      "From performance marketing, widening from one channel to the loop.",
      "From product analytics, adding the shipping half to the measuring half.",
      "From product management, by preference for the experimental end.",
    ],
    levels: [
      { name: "Growth marketer", whatChanges: "You run experiments inside somebody's thesis." },
      { name: "Senior", whatChanges: "The thesis is yours — you pick which constraint to attack." },
      { name: "Head of growth", whatChanges: "The loop itself, the team, and the argument for what growth spend buys." },
    ],
    whatIsHard:
      "Most experiments fail, and the discipline is telling people that honestly instead of finding a chart that looks better. The pressure to slice a null result until something looks significant is constant and rarely stated aloud — if you need most of your work to succeed, the honest version of this job will feel like losing, even when the programme is winning.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "data-analyst", note: "Ninety-one days — the statistics, experiment and funnel weeks are the method half of growth, covered properly." },
        { slug: "thinking-under-uncertainty", note: "Twenty-four days on not fooling yourself, which is the whole discipline in four words. The channel craft itself is learned by shipping." },
      ],
    },
  },

  {
    slug: "lifecycle-marketer",
    title: "Lifecycle marketer",
    aliases: ["CRM Marketer", "Email Marketer", "Retention Marketer"],
    domain: "marketing",
    standfirst: "Owns what happens after acquisition: email, segmentation, retention.",
    entry: "Graduate entry, often via content or an analyst seat — or directly at a small company where you own everything.",
    whatTheyDo: [
      "Designs the sequences that turn a signup into a habit — onboarding, re-engagement, winback — and the segmentation underneath them. Measured on retention and repeat behaviour rather than new users.",
      "The copy is the visible tenth; the segmentation, timing and measurement are the work.",
    ],
    typicalWeek: [
      "Rewrite an onboarding sequence that people stop opening at step three.",
      "Build a segment and check it is actually distinct from the one next to it.",
      "Test subject lines and timing, one variable at a time.",
      "Investigate a deliverability problem before it becomes invisible churn.",
      "Report retention by cohort rather than in aggregate.",
    ],
    whatItIsNot: [
      {
        line: "Not sending newsletters. A newsletter is one artefact; lifecycle is the system of moments — and the honest optimisation is often to send less.",
      },
      {
        line: "Not a design role. The craft is segmentation logic and copy for a specific moment; the template is a solved problem.",
      },
    ],
    worksWith: [
      { who: "Product", on: "the in-product moments the sequences should mirror" },
      { who: "Data", on: "cohorts, and whether the retention lift is real" },
      { who: "Content", on: "the material the sequences deliver" },
    ],
    skills: {
      must: [
        "Segmentation logic — who gets what, when, and who gets nothing",
        "Copywriting for a specific moment rather than a general audience",
        "Cohort analysis",
        "Testing discipline: one variable, planned duration, honest reading",
      ],
      helps: [
        "SQL, for segments the tool cannot express",
        "Deliverability fundamentals",
        "Automation tooling fluency",
      ],
      overrated: [
        "Design skill.",
        "Writing at length. The craft here is the subject line and the first sentence.",
      ],
    },
    howPeopleGetIn: [
      "From content or social, moving from reach to retention.",
      "From an analyst role, adding the craft half to the cohort half.",
      "Directly at a small company, where lifecycle is everyone's neglected job until somebody owns it.",
    ],
    levels: [
      { name: "Executive", whatChanges: "You run sequences somebody else designed." },
      { name: "Lifecycle marketer", whatChanges: "The map of moments is yours." },
      { name: "CRM manager", whatChanges: "The tooling, the data flows and the programme." },
      { name: "Head of retention", whatChanges: "Retention is your number on the board deck." },
    ],
    whatIsHard:
      "You are optimising against people's willingness to be interrupted, and the honest answer is often to send less — which is a difficult recommendation to make when your function is measured in sends. You will also be measured on unsubscribes as well as opens; if being told 'stop emailing me' in aggregate stings, know that it is the channel's weather.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "excel-at-work", note: "Twenty days. Segments and cohorts are spreadsheet objects before they are tool objects." },
        { slug: "data-analyst", note: "Ninety-one days for the deeper half — the cohort, retention and SQL weeks are exactly this role's measurement core. The channel craft is learned in the tool." },
      ],
    },
  },

  {
    slug: "brand-manager",
    title: "Brand manager",
    aliases: ["Brand Marketing Manager"],
    domain: "marketing",
    standfirst: "Positioning and creative. Rarely an entry-level job.",
    entry: "Mid-level entry — concentrated in consumer companies and agencies, almost never a first job.",
    whatTheyDo: [
      "Decides what a company means to people and keeps everything the company makes consistent with that. Commissions creative work, guards the positioning under pressure, and defends spending that cannot be attributed to a sale this quarter.",
      "Most of the visible work is saying no to creative that is good but off — which is harder than saying no to bad creative.",
    ],
    typicalWeek: [
      "Review creative against the positioning and say no to most of it.",
      "Brief an agency or in-house studio precisely enough to get the thing you meant.",
      "Sit through research on how the brand is actually perceived, which will sting.",
      "Defend brand spend against a performance budget request that can show a number tomorrow.",
      "Write the guidance nobody reads until they get it wrong.",
    ],
    whatItIsNot: [
      {
        line: "Not product marketing. PMM positions a product against competitors for buyers; brand positions the company in the culture. Different time horizons, different evidence, frequently different people.",
      },
      {
        line: "Not taste as a job. Taste helps; the work is holding a line under commercial pressure, and the line has to be arguable, not just felt.",
      },
    ],
    worksWith: [
      { who: "Creative and agencies", on: "briefs and the reviews that keep output on-position" },
      { who: "Product marketing", on: "the boundary between company story and product story" },
      { who: "Leadership", on: "what the company is allowed to mean, and what that costs" },
    ],
    skills: {
      must: [
        "Positioning judgement that survives being written down",
        "Creative direction without doing the creative",
        "Written clarity — the positioning is a document before it is anything",
        "Holding a line when the quarter argues against it",
      ],
      helps: [
        "Research literacy",
        "Media planning",
        "Budget management",
      ],
      overrated: [
        "Being a designer.",
        "Having good taste alone. Unarguable taste is indistinguishable from preference.",
      ],
    },
    howPeopleGetIn: [
      "From product marketing, widening from the product to the company.",
      "From an agency account role, crossing to the client side.",
      "From an FMCG graduate scheme, the classical route.",
    ],
    levels: [
      { name: "Brand executive", whatChanges: "You execute inside the guidelines." },
      { name: "Brand manager", whatChanges: "One brand's meaning is yours to guard." },
      { name: "Senior", whatChanges: "The campaigns that define the year." },
      { name: "Head of brand", whatChanges: "The positioning itself, and the budget argument for it." },
    ],
    whatIsHard:
      "The effect is real and slow, the measurement is contested, and you argue for it against channels that can show a number tomorrow. If you want your contribution to be provable, brand will deny you that almost by definition — the people who last hold conviction on long evidence and stay honest about the difference between conviction and proof.",
    startHere: {
      kind: "notYet",
      note: "No brand roadmap yet — request it if you want it. The half we can course today is the judgement: positioning is a claim about the world, held under pressure.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; holding a position on slow evidence without fooling yourself is this exact discipline", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },
];

export default roles;
