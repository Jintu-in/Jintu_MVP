import type { Role } from "./types";

/**
 * The rest of the go-to-market ladder, adapted from the tail of the owner's
 * expanded taxonomy (2026-08-30). With these, every rung the gtm-roles
 * comparison names has its own page.
 */
const roles: Role[] = [
  {
    slug: "account-executive",
    title: "Account executive",
    aliases: ["AE", "Sales Executive"],
    domain: "gtm",
    standfirst: "Runs deals from first meeting to signature, and carries a number.",
    entry: "Mid-level entry — the standard promotion from SDR, rarely a first hire.",
    whatTheyDo: [
      "Takes qualified opportunities, runs discovery, demonstrates value against a stated problem, handles procurement and negotiation, and closes. Owns a quota and is measured on it every quarter.",
      "The centre of the job is discovery — the deals that close are the ones where the problem was understood before the product was shown.",
    ],
    typicalWeek: [
      "Run discovery calls that are mostly listening.",
      "Demonstrate the product against a specific stated problem, not the feature tour.",
      "Build a business case with a champion inside the account.",
      "Negotiate terms with procurement, who have seen every trick you know.",
      "Forecast honestly, including the deals that will not land.",
    ],
    whatItIsNot: [
      {
        line: "Not an SDR with more experience — the skill set changes. Prospecting is volume across many accounts; closing is depth on few, and plenty of excellent SDRs need a year to make the turn.",
        compare: "gtm-roles",
      },
      {
        line: "Not persuasion as a personality trait. The stereotype closes worse than the listener; the quota is carried by discovery and follow-through, not charm.",
      },
    ],
    worksWith: [
      { who: "SDRs", on: "what a qualified handover actually contains" },
      { who: "Solutions consultants", on: "the technical half of the deal, as a pair" },
      { who: "Legal and finance", on: "getting the signed thing to be the agreed thing" },
    ],
    skills: {
      must: [
        "Discovery questioning — the deal is won or lost here",
        "Building a business case in the customer's numbers, not yours",
        "Negotiation that leaves the relationship intact",
        "Forecasting honestly, which is rarer and more valued than forecasting well",
      ],
      helps: [
        "A methodology such as MEDDIC, held lightly",
        "Industry knowledge in the segment you sell to",
        "Multi-threading an account so one departure does not kill the deal",
      ],
      overrated: [
        "Being persuasive. Deals close on understood problems, not on pressure.",
        "Talking a lot. The best discovery calls are mostly the customer's voice.",
      ],
    },
    howPeopleGetIn: [
      "Promotion from SDR — the standard route, usually after 12–18 months of consistent qualification.",
      "From account management, moving from growing accounts to winning them.",
      "Lateral from another sales role, bringing a book of relationships or domain depth.",
    ],
    levels: [
      { name: "AE", whatChanges: "You carry a quota on the standard segment." },
      { name: "Senior AE", whatChanges: "Bigger accounts, longer cycles, more of the forecast riding on you." },
      { name: "Enterprise AE", whatChanges: "Few deals, each a project — months of multi-threading per signature." },
      { name: "Sales manager", whatChanges: "The fork into management: other people's quotas become yours." },
    ],
    whatIsHard:
      "The quota resets every quarter regardless of what happened last quarter, and deals die for reasons entirely outside your control — a budget freeze, a champion leaving, a reorg you never saw. Commission is a large share of pay, so if income variability is a problem for your circumstances right now, that is a real constraint to respect rather than push through.",
    startHere: {
      kind: "notYet",
      note: "No sales roadmap yet — it is the largest audience gap in the catalogue, and requesting it moves it up the list. The reasoning half is more coursable than the industry admits: honest forecasting is calibration with a quota attached.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; forecasting honestly is its calibration week, applied", url: "/learn/thinking-under-uncertainty" },
        { label: "The GTM ladder compared — where AE sits and what comes before it", url: "/roles/compare/gtm-roles" },
      ],
    },
  },

  {
    slug: "account-manager",
    title: "Account manager",
    aliases: ["AM"],
    domain: "gtm",
    standfirst: "Grows the accounts that already signed. A different skill from winning them.",
    entry: "Mid-level entry, wherever there is a renewal-based revenue model.",
    whatTheyDo: [
      "Owns a book of existing customers and is measured on renewal and growth within it. Runs the commercial relationship, negotiates renewals, and finds expansion the customer would actually benefit from.",
      "The relationship horizon is years, not quarters — which is the whole difference from closing.",
    ],
    typicalWeek: [
      "Review the accounts closest to renewal, and the warning signs in each.",
      "Run a commercial conversation about next year's contract.",
      "Chase down a service problem on a customer's behalf, inside your own company.",
      "Map who else inside the account could use the product.",
      "Update the forecast for the book you own.",
    ],
    whatItIsNot: [
      {
        line: "Not a customer success manager, though smaller companies merge them. The AM owns the commercial relationship; the CSM owns whether the customer gets the outcome. When merged, the renewal conversation and the health conversation compete.",
        compare: "gtm-roles",
      },
      {
        line: "Not a slower version of closing. Growing an account is a different skill from winning one, and the best AMs are often people who disliked the hunt.",
      },
    ],
    worksWith: [
      { who: "Customers", on: "the multi-year relationship the revenue actually rests on" },
      { who: "Customer success", on: "health signals before they become renewal problems" },
      { who: "Finance", on: "the forecast, and what the book will really do" },
    ],
    skills: {
      must: [
        "Relationship depth sustained over years",
        "Negotiation, especially the renewal where the customer holds the leverage",
        "Commercial judgement about which expansion is real",
        "Follow-through — the compounding asset of the role",
      ],
      helps: [
        "Industry knowledge",
        "Reading usage data before a conversation, not after",
        "Executive presence for the annual meeting that decides everything",
      ],
      overrated: [
        "Being liked by everyone. Trusted beats liked, and they diverge at renewal time.",
        "A classic sales background. Plenty of strong AMs never carried a new-business quota.",
      ],
    },
    howPeopleGetIn: [
      "From customer success, adding the commercial half.",
      "From an AE role, by preference for depth over the hunt.",
      "From support, with demonstrated commercial aptitude — a genuine and underused route.",
    ],
    levels: [
      { name: "AM", whatChanges: "You own a book of standard accounts." },
      { name: "Senior AM", whatChanges: "The accounts that matter, and the renewals that get board attention." },
      { name: "Strategic AM", whatChanges: "A handful of accounts, each effectively a partnership." },
      { name: "Head of accounts", whatChanges: "The whole book, and the people who carry it." },
    ],
    whatIsHard:
      "You inherit whatever the salesperson promised, and you are the one in the room when the product does not do it. The work is also the same accounts for years — which is the appeal for some people and slow suffocation for others; if you want to work on new things constantly, believe that about yourself before taking the book.",
    startHere: {
      kind: "notYet",
      note: "No account management roadmap — request it if you want it. The preparation half is more concrete than it looks: the renewal case is built in a spreadsheet before it is made in a room.",
      readInstead: [
        { label: "Excel at work — 20 days; the book, the forecast and the renewal case all live here", url: "/learn/excel-at-work" },
        { label: "The GTM ladder compared", url: "/roles/compare/gtm-roles" },
      ],
    },
  },

  {
    slug: "customer-success-manager",
    title: "Customer success manager",
    aliases: ["CSM"],
    domain: "gtm",
    standfirst: "Not support. Owns whether customers stay and grow.",
    entry: "Graduate entry — one of the few genuinely entry-accessible GTM roles in Indian SaaS.",
    whatTheyDo: [
      "Makes sure customers reach the outcome they bought the product for: runs onboarding, tracks health signals, spots churn risk early, and finds expansion opportunities. Increasingly carries a retention number.",
      "Proactive and account-based where support is reactive and ticket-based — the distinction the job adverts blur and the interview should not.",
    ],
    typicalWeek: [
      "Onboard a new account and set success criteria you can be held to.",
      "Run a quarterly business review that says something true.",
      "Investigate a drop in usage before it becomes a cancellation.",
      "Escalate a product gap on a customer's behalf, with evidence.",
      "Identify an expansion opportunity and pass it to the AM properly.",
    ],
    whatItIsNot: [
      {
        line: "Not customer support. Support closes tickets; CS is measured on renewal — and if a CSM job turns out to be running a queue, the company hired support and gave it a growth title. Ask in the interview.",
        compare: "gtm-roles",
      },
      {
        line: "Not a technical role, whatever the product. Product depth is learned on the job; the entry filter is communication and follow-through.",
      },
    ],
    worksWith: [
      { who: "Customers", on: "whether they are getting the outcome, honestly measured" },
      { who: "Support", on: "the boundary between a ticket and a pattern" },
      { who: "Product", on: "the gaps that actually cause churn, with evidence" },
    ],
    skills: {
      must: [
        "Relationship building at portfolio scale",
        "Product knowledge deep enough to advise, not just demo",
        "Reading usage data as an early-warning system",
        "Difficult conversations — the at-risk call made early rather than late",
      ],
      helps: [
        "Project management, for onboardings that are really small projects",
        "Domain expertise in the customer's industry",
        "Commercial awareness for spotting real expansion",
      ],
      overrated: [
        "Technical depth. Helpful, not the gate.",
        "Treating it as sales-lite. Retention is its own discipline.",
      ],
    },
    howPeopleGetIn: [
      "From support — the most common route, and the product knowledge transfers whole.",
      "Directly, with strong communication skills and evidence of follow-through.",
      "From account management or teaching, both of which map cleanly.",
    ],
    levels: [
      { name: "CSM", whatChanges: "You own a portfolio's health." },
      { name: "Senior CSM", whatChanges: "The strategic accounts, and the escalations." },
      { name: "Team lead", whatChanges: "Other CSMs' books become your number." },
      { name: "Head of customer success", whatChanges: "Retention itself is your line on the board deck." },
    ],
    whatIsHard:
      "You are accountable for retention while having no control over the product gaps that cause churn — you can do everything right and lose the account to a missing feature you escalated four times. If you need to be able to fix the problems you are blamed for, this seat will grind; the durable CSMs make peace with influencing rather than controlling.",
    startHere: {
      kind: "notYet",
      note: "No CS roadmap yet — request it if you want it built. The measurable half of the job is usage data read early, and that is coursable today.",
      readInstead: [
        { label: "Excel at work — 20 days; the health signals live in a spreadsheet before any tool", url: "/learn/excel-at-work" },
        { label: "The GTM ladder compared — CS against support, AM and the rest", url: "/roles/compare/gtm-roles" },
      ],
    },
  },

  {
    slug: "revenue-operations",
    title: "Revenue operations",
    aliases: ["RevOps", "Sales Operations", "SalesOps"],
    domain: "gtm",
    standfirst: "The systems and numbers underneath everyone else's quota.",
    entry: "Mid-level entry — growing fast, under-supplied, and a common exit from spreadsheet-heavy operations work.",
    whatTheyDo: [
      "Owns the CRM, the pipeline definitions, the territory and quota model, and the reporting leadership decides from. Fixes the process when the numbers stop being trustworthy, which is most of the time.",
      "The role exists because a revenue organisation generates data faster than it generates discipline, and somebody has to own the gap.",
    ],
    typicalWeek: [
      "Rebuild a report leadership does not believe, and find out why they were right.",
      "Clean up pipeline stages that reps are using inconsistently.",
      "Automate a handoff between marketing and sales that kept dropping leads.",
      "Model the impact of a territory change before it is announced.",
      "Argue that a metric is measuring the wrong thing, with evidence.",
    ],
    whatItIsNot: [
      {
        line: "Not a sales role and not an analyst role, though it borrows from both. RevOps owns the machinery; sales owns the outcome — and the machinery only gets credit when it breaks.",
        compare: "gtm-roles",
      },
      {
        line: "Not CRM administration, though that is inside it. Administration keeps the tool running; RevOps decides what the tool should say about reality.",
      },
    ],
    worksWith: [
      { who: "Sales leadership", on: "the forecast, and whether it can be believed" },
      { who: "Marketing", on: "the handoff, and whose numbers are right" },
      { who: "Finance", on: "quota, commission and the plan" },
    ],
    skills: {
      must: [
        "Spreadsheet fluency at the level where models are arguments",
        "CRM administration and the judgement of what to enforce",
        "Process design that survives salespeople under quota pressure",
        "Reading data honestly, especially when the honest reading is unwelcome",
      ],
      helps: [
        "SQL, once the questions outgrow the CRM's reporting",
        "BI tooling",
        "Commission modelling, which is where trust is won or lost",
      ],
      overrated: [
        "Having carried a quota. It helps empathy; it is not the gate.",
        "Engineering ability. Automation here is workflow tooling, not software.",
      ],
    },
    howPeopleGetIn: [
      "From sales into ops — the rep who kept fixing the CRM.",
      "From business analysis or finance, bringing the modelling.",
      "From a CRM admin role, adding the judgement layer on top of the tool.",
    ],
    levels: [
      { name: "RevOps analyst", whatChanges: "You maintain the machinery and build the reports." },
      { name: "RevOps manager", whatChanges: "You design the process, and your model sets the quotas." },
      { name: "Director of RevOps", whatChanges: "The revenue engine's design is yours, across every team that touches it." },
    ],
    whatIsHard:
      "Nobody notices when the machinery works, and everybody notices the quarter it does not. The credit for good quarters goes to the people closing, structurally and permanently — so if you need visible credit for outcomes, this is the wrong seat, and if you enjoy being the person who knows what is actually happening, it is one of the best.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "excel-at-work", note: "Twenty days. The territory model, the commission maths and half the reporting genuinely live here." },
        { slug: "data-analyst", note: "Ninety-one days for the deeper half — SQL, dashboards and the discipline of a number you can defend. The CRM craft itself is learned in the seat." },
      ],
    },
  },

  {
    slug: "partnerships-manager",
    title: "Partnerships manager",
    aliases: ["Alliances", "Channel Manager", "BD"],
    domain: "gtm",
    standfirst: "Sells through other companies rather than to customers.",
    entry: "Mid-level entry — almost always a second or third role, rarely a first.",
    whatTheyDo: [
      "Finds and signs companies whose customers overlap with yours, then makes the partnership actually produce revenue — which is mostly enablement, joint pipeline reviews and unglamorous follow-up long after the announcement.",
      "The announcement is the easy part. Almost all the value, and almost all the failure, happens in the quarters after it.",
    ],
    typicalWeek: [
      "Pitch a potential partner on why the customer overlap is real.",
      "Negotiate commercial terms and a referral model both sides will honour.",
      "Train a partner's sales team on your product, again.",
      "Review joint pipeline with a partner who has stopped responding.",
      "Push internally for the integration the partnership quietly depends on.",
    ],
    whatItIsNot: [
      {
        line: "Not business development in the vague sense the title implies. It is a revenue role with an indirect route to revenue, and it is measured eventually, even where it is not measured well.",
      },
      {
        line: "Not networking as a job. A large personal network is the myth; the work is commercial structure and relentless follow-through on agreements other people forget.",
      },
    ],
    worksWith: [
      { who: "Partner companies", on: "the joint motion, and whether anyone is actually running it" },
      { who: "Sales", on: "referred pipeline, and who gets credit for it" },
      { who: "Product", on: "the integration that makes the partnership real rather than a logo swap" },
    ],
    skills: {
      must: [
        "Commercial negotiation across two companies' interests",
        "Long-horizon relationship building without visible progress",
        "Internal influence — half the deals you close are inside your own building",
      ],
      helps: [
        "Contract literacy",
        "Ecosystem knowledge of who actually sells to whom",
        "Enablement design, because a partner who cannot pitch you will not",
      ],
      overrated: [
        "A large personal network. It ages; the structuring skill does not.",
        "An MBA.",
      ],
    },
    howPeopleGetIn: [
      "From sales, bringing the commercial instincts to a longer game.",
      "From account management, which is the closest adjacent skill.",
      "From product marketing, on the strength of positioning and enablement.",
    ],
    levels: [
      { name: "Partnerships manager", whatChanges: "You run a handful of partnerships end to end." },
      { name: "Senior", whatChanges: "The strategic ones, and the decision about which to stop feeding." },
      { name: "Head of partnerships", whatChanges: "The channel itself is your number, and its economics your argument." },
    ],
    whatIsHard:
      "Signed partnerships that produce nothing are the norm, and the failure is slow and hard to attribute — nobody cancels a partnership, they just stop turning up to the pipeline review. Results take quarters or years, so if you need short feedback loops, this will feel like shouting into fog; the people who thrive here keep their own scoreboard.",
    startHere: {
      kind: "notYet",
      note: "No partnerships roadmap — request it if you want one. The judgement half is coursable: partnership selection is base-rate reasoning about which overlaps are real.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; most dead partnerships were predictable at signing", url: "/learn/thinking-under-uncertainty" },
        { label: "The GTM ladder compared", url: "/roles/compare/gtm-roles" },
      ],
    },
  },
];

export default roles;
