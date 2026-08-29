import type { Role } from "./types";

/**
 * Marketing and healthcare — the two roles the catalogue already serves
 * end to end, and the two whose roadmaps are the most direct answer to
 * "what job does this lead to".
 */
const roles: Role[] = [
  {
    slug: "performance-marketer",
    title: "Performance marketer",
    domain: "marketing",
    standfirst: "Buys attention and is accountable for what it returns — measured, weekly, against a number.",
    entry: "Graduate entry, and one of the few marketing roles where a portfolio of real results beats a degree outright.",
    whatTheyDo: [
      "Runs paid acquisition on one or more platforms: structures the campaigns, sets the bids and budgets, and decides what to stop.",
      "Spends most of the analytical effort on attribution — working out what a channel actually caused, rather than what it was credited with.",
      "Owns a number. Unusually for marketing, the feedback loop is days rather than quarters, which is both the appeal and the pressure.",
    ],
    typicalWeek: [
      "Audit search terms and add negatives, which is the unglamorous rep that most determines results.",
      "Find that a campaign's excellent return is mostly brand terms people were going to search anyway.",
      "Restructure an account so that defence, capture and conquesting are not blended into one meaningless average.",
      "Explain to a founder why the platform's reported conversions exceed the actual orders.",
      "Run a holdout or a blackout test on the channel everyone is certain about.",
    ],
    whatItIsNot: [
      {
        line: "Not 'running ads'. The platform is a few hours a week; the rest is measurement, margin arithmetic and knowing what to switch off.",
      },
      {
        line: "Not brand marketing. Different time horizon, different evidence, and frequently different people — being good at one says little about the other.",
      },
      {
        line: "Not analytics, though it is the most quantitative marketing role. You are accountable for spending money, not only for explaining it.",
      },
    ],
    worksWith: [
      { who: "Finance", on: "margin and break-even, without which a return target is arbitrary" },
      { who: "Creative", on: "what to test, and the fact that creative usually beats bid tuning" },
      { who: "Analysts or data", on: "incrementality, and reconciling platform numbers with real orders" },
    ],
    skills: {
      must: [
        "Unit economics: contribution margin, break-even return, and the fact that both are per-product",
        "One platform properly — match types, bidding, placements, negatives",
        "Spreadsheets, which is where the actual decisions get made",
        "Scepticism about attribution, especially about branded search",
      ],
      helps: [
        "SQL, once the account is large enough that the platform's reporting stops being enough",
        "Enough experiment literacy to run a geo holdout and read it honestly",
        "Creative judgement, which is the highest-leverage lever and the least systematised",
      ],
      overrated: [
        "Platform certifications. Free, quick, and they signal much less than a documented account turnaround.",
        "Chasing every new placement type. The fundamentals move the number.",
        "Dashboard building, before the measurement question is settled.",
      ],
    },
    howPeopleGetIn: [
      "Directly, often at an agency, which is the fastest way to see many accounts quickly.",
      "By running a real account — your own, a friend's business, a small seller — and being able to talk through what you changed and what happened.",
      "From e-commerce operations, where you were already watching the spend.",
      "From analytics, moving toward the spending side of the same numbers.",
    ],
    levels: [
      { name: "Executive / Associate", whatChanges: "You execute within a structure somebody else set." },
      { name: "Performance marketer", whatChanges: "You own accounts and the structure, and you decide what to stop." },
      { name: "Senior / Lead", whatChanges: "You own the channel mix and the measurement approach, including saying a channel is not incremental." },
      { name: "Head of growth", whatChanges: "The whole funnel, and usually a team." },
    ],
    whatIsHard:
      "You are measured weekly on a number affected by seasonality, competitors, pricing and stock — most of which you do not control. The structural temptation is to take credit for demand that already existed, because the platform hands you that story in its own dashboard. Resisting it is what separates people who last from people who look excellent for two quarters. If you need stable, slow-moving work, this is the wrong end of marketing.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "amazon-ads", note: "Twenty-seven days of retail media: break-even economics from first principles, harvesting and negation, clean rooms, and incrementality testing. The mechanics transfer to Google and Meta almost entirely." },
        { slug: "excel-at-work", note: "Twenty days. Every decision in this job is made in a spreadsheet before it is made in a platform." },
      ],
    },
  },

  {
    slug: "medical-coder",
    title: "Medical coder",
    domain: "health",
    standfirst: "Reads a clinical record and turns it into the codes a payer will accept — accurately, and defensibly.",
    entry: "Graduate entry, and the standard destination for life-science graduates who are not going into a clinical career.",
    whatTheyDo: [
      "Abstracts diagnoses and procedures from a clinician's documentation into standard code sets, in the sequence the guidelines require.",
      "Queries the clinician when documentation is ambiguous — non-leading, on the record — rather than guessing or picking the more favourable option.",
      "Works denials: reading why a claim was rejected, deciding whether it was a coding error or a payer policy question, and correcting or appealing.",
    ],
    typicalWeek: [
      "Code a queue against a clock, with an accuracy target that matters more than the clock.",
      "Write two provider queries and phrase them so they do not lead to an answer.",
      "Work a denial batch, and find that most of it is one systematic cause rather than many individual errors.",
      "Look up a chapter-specific guideline you thought you remembered, and find you did not.",
      "Re-audit your own earlier work cold, which is the habit that separates coders who improve from coders who plateau.",
    ],
    whatItIsNot: [
      {
        line: "Not clinical work. You never diagnose or treat; you classify what a clinician documented. It is the work around healthcare rather than in it.",
      },
      {
        line: "Not data entry. The judgement — sequencing, excludes notes, medical necessity, when to query — is the entire job, and it is why accuracy varies so much between coders.",
      },
      {
        line: "Not billing, exactly. Billing submits and chases the claim; coding decides what is on it. Small practices merge the two, larger ones do not.",
      },
    ],
    worksWith: [
      { who: "Clinicians", on: "queries — which is a relationship as much as a process" },
      { who: "Billing and AR teams", on: "denials, and which are coding problems rather than submission problems" },
      { who: "Compliance and auditors", on: "your accuracy rate and, more importantly, the pattern in your errors" },
    ],
    skills: {
      must: [
        "Medical terminology and enough anatomy to read a note confidently",
        "The official guidelines, and the habit of checking the tabular list rather than coding from the index",
        "Precision under a production target, which is the actual daily difficulty",
        "Knowing when to query, and how to do it without leading",
      ],
      helps: [
        "Familiarity with one specialty in depth — coders who specialise are worth more",
        "Understanding the payment side, so you can see why a denial happened",
        "Spreadsheets, for working a denial queue by cause rather than by date",
      ],
      overrated: [
        "Memorising codes. Nobody does; knowing how to find and verify the right one is the skill.",
        "Speed, early. Accuracy first — a fast inaccurate coder creates compliance exposure, not throughput.",
      ],
    },
    howPeopleGetIn: [
      "With a life-science degree — B.Pharm, BPT, BSc Nursing, biotech and similar — which is the standard Indian route.",
      "Through a certification, which most employers expect; the exam is paid, and the roadmap says what it costs.",
      "From a hospital front-office or billing role, moving across into coding.",
      "Into a large outsourcing provider first, which is where most volume hiring happens and where training is usually structured.",
    ],
    levels: [
      { name: "Trainee / Junior coder", whatChanges: "You code straightforward encounters with your work fully audited." },
      { name: "Coder", whatChanges: "You carry a production target and your own accuracy rate." },
      { name: "Senior / Specialty coder", whatChanges: "You take the complex specialties and the appeals." },
      { name: "Auditor / QA / Compliance", whatChanges: "You audit other coders and own the error patterns rather than the queue." },
    ],
    whatIsHard:
      "It is precise, repetitive work under a production target where the errors are consequential — a pattern of mistakes in one direction is a compliance finding rather than a training note. There is also real pressure, rarely stated openly, toward the more favourable code, and your protection is documentation, queries on file, and a self-audit habit. If repetitive detail work drains you, no amount of interest in healthcare will carry you through it.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "medical-coding", note: "Forty days built entirely on free government sources: the code sets, the guidelines, modifiers, denials, compliance and self-auditing. Day 40 prices the certification honestly." },
      ],
    },
  },
];

export default roles;
