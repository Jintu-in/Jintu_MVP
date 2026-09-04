import type { Role } from "./types";

/**
 * The operations cluster, from the tail of the owner's expanded taxonomy.
 * finance-analyst lived here briefly and moved: the finance domain now
 * splits it properly into financial-analyst and fpa-analyst, which the
 * owner's taxonomy defines as different jobs — and it was right.
 */
const roles: Role[] = [
  {
    slug: "business-operations",
    title: "Business operations",
    aliases: ["BizOps", "Operations Analyst", "Strategy and Operations"],
    domain: "operations",
    standfirst: "Whatever is currently broken, made to work.",
    entry: "Graduate entry — a common, accessible first job at growing companies, and a good route into almost anything else.",
    whatTheyDo: [
      "Takes on the process problems that sit between teams and belong to nobody: builds the model, runs the analysis, designs the new process, and often runs it for a while before handing it over.",
      "Measured on whether the thing now works — not on the elegance of the analysis, which is the difference from a pure analyst seat.",
    ],
    typicalWeek: [
      "Build a model to size a decision leadership is arguing about.",
      "Map a process that three teams each do differently.",
      "Automate a manual report someone rebuilds every Monday.",
      "Run the new process yourself until it is stable.",
      "Write the documentation that makes handover possible.",
    ],
    whatItIsNot: [
      {
        line: "Not project management and not an analyst role, though it uses both. The remit is outcomes: the analysis is a means, and the handover is the finish line.",
      },
      {
        line: "Not a consulting-lite role reserved for MBAs. The gate is structured problem solving and spreadsheet fluency, both of which are learnable in public.",
      },
    ],
    worksWith: [
      { who: "Every function", on: "the problem that sits between them" },
      { who: "Finance", on: "the model, and what the decision actually costs" },
      { who: "Leadership", on: "the recommendation, and then the follow-through" },
    ],
    skills: {
      must: [
        "Spreadsheet modelling at the level where the model is the argument",
        "Process design that survives the people who have to follow it",
        "Structured problem solving",
        "Writing clearly — the memo is the deliverable more often than the deck",
      ],
      helps: [
        "SQL",
        "Automation tooling",
        "Financial literacy",
        "Stakeholder management",
      ],
      overrated: [
        "A consulting background.",
        "An MBA.",
      ],
    },
    howPeopleGetIn: [
      "Directly from any analytical degree — one of the genuinely open doors.",
      "From consulting, trading the engagement rhythm for ownership.",
      "From an analyst role, moving from answering questions to fixing the thing.",
      "From startup operations, where you were already doing this without the title.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You run the analysis inside somebody's problem." },
      { name: "Manager", whatChanges: "The problem is yours, end to end, handover included." },
      { name: "Senior manager", whatChanges: "The problems nobody can even scope arrive at your desk." },
      { name: "Head of BizOps", whatChanges: "You choose which broken things the company fixes this year." },
    ],
    whatIsHard:
      "The remit changes constantly and you rarely own anything long enough to see it mature — you fix, hand over, and move to the next broken thing. That breadth is the design; if you want deep expertise in one domain, this seat will feel like permanent shallow water even while it teaches you more about how companies work than any other first job.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "excel-at-work", note: "Twenty days, and it is most of the daily toolkit — the model, the automation and the report all live here." },
        { slug: "thinking-under-uncertainty", note: "Twenty-four days on the structured-problem-solving half: decomposition, base rates, second-order effects." },
      ],
    },
  },

  {
    slug: "people-operations",
    title: "People operations",
    aliases: ["HR Ops", "People Ops", "HRBP"],
    domain: "operations",
    standfirst: "The systems and decisions around how people join, work and leave.",
    entry: "Graduate entry — increasingly expected to work from data rather than instinct.",
    whatTheyDo: [
      "Runs the machinery of employment — hiring processes, onboarding, policy, compensation administration, and the difficult conversations nobody else will have.",
      "The modern version of the role is operational and data-literate; the administrative version still exists, and the interview should establish which one is being hired for.",
    ],
    typicalWeek: [
      "Fix a hiring process that is losing candidates at one stage.",
      "Onboard new joiners and gather what went badly, honestly.",
      "Advise a manager on a difficult performance conversation.",
      "Analyse attrition by team rather than in aggregate.",
      "Rewrite a policy that is being applied inconsistently.",
    ],
    whatItIsNot: [
      {
        line: "Not administrative HR in the old sense, and not recruitment — though it overlaps with both, and adverts frequently mean one while saying the other.",
      },
      {
        line: "Not 'being a people person' as a job. Warmth helps; the work is process design, data and holding lines, and the difficult conversations are the opposite of pleasant company.",
      },
    ],
    worksWith: [
      { who: "Managers", on: "the conversations they are avoiding, and how to have them" },
      { who: "Finance and legal", on: "compensation, policy and what the law actually requires" },
      { who: "Every employee", on: "the moments that decide whether they stay" },
    ],
    skills: {
      must: [
        "Discretion — the non-negotiable core of the role",
        "Difficult conversations, run with care and without wobble",
        "Process design",
        "Working with people data, honestly segmented",
      ],
      helps: [
        "Employment law literacy",
        "Spreadsheet fluency",
        "Compensation modelling",
      ],
      overrated: [
        "Being a people person.",
        "An HR degree.",
      ],
    },
    howPeopleGetIn: [
      "Directly, into a people-ops associate seat.",
      "From recruitment, widening from hiring into the whole lifecycle.",
      "From operations or office management, formalising what you already ran.",
    ],
    levels: [
      { name: "People ops associate", whatChanges: "You run pieces of the machinery." },
      { name: "Manager", whatChanges: "The processes are yours to design, not just run." },
      { name: "HRBP", whatChanges: "You advise leaders on their hardest people decisions." },
      { name: "Head of people", whatChanges: "The employment experience itself is your remit." },
    ],
    whatIsHard:
      "You hold confidences that isolate you — there are things you know that you can discuss with nobody — and you enforce decisions you did not make and sometimes disagree with. Some of this job cannot be liked, only respected; if you need to be liked by everyone, the role will make you choose between that and doing it properly.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "excel-at-work", note: "Twenty days. The attrition analysis, the comp model and the hiring funnel all live in a spreadsheet — this is the data half of the modern role. The employment-law half is learned in post and jurisdiction-specific." },
      ],
    },
  },

  {
    slug: "management-consultant",
    title: "Management consultant",
    aliases: ["Strategy Consultant"],
    domain: "operations",
    standfirst: "Structured problem solving, sold by the week.",
    entry: "Graduate entry — heavily gated by institution at the big firms; the skills transfer well to BizOps and product.",
    whatTheyDo: [
      "Joins a client's problem for a defined period, structures it, gathers evidence, and recommends a course of action. Junior time goes on analysis and slides; the recommendation is defended by someone more senior.",
      "The engagement ends, and you frequently do not see whether the recommendation worked — which shapes both the skill and its limits.",
    ],
    typicalWeek: [
      "Break a vague question into a testable structure.",
      "Build the analysis and check it survives scrutiny.",
      "Interview client staff about how the work really happens.",
      "Build the story the recommendation rests on.",
      "Rework it after a partner review, late.",
    ],
    whatItIsNot: [
      {
        line: "Not the same as an internal strategy role. The engagement ends; ownership does not transfer. BizOps is the adjacent job that keeps the outcome.",
      },
      {
        line: "Not knowing the answer in advance. The firms sell structure and evidence, and the juniors who thrive are the ones who genuinely do not pre-decide.",
      },
    ],
    worksWith: [
      { who: "Client teams", on: "the truth about how the work happens, extracted carefully" },
      { who: "The case team", on: "the analysis, at close quarters and long hours" },
      { who: "Partners", on: "the review that reshapes everything at 9pm" },
    ],
    skills: {
      must: [
        "Structured problem solving — the craft the industry actually sells",
        "Spreadsheet modelling",
        "Written and verbal clarity under time pressure",
        "Stamina for the rhythm, honestly assessed",
      ],
      helps: [
        "Industry knowledge",
        "Data fluency",
        "Interviewing",
      ],
      overrated: [
        "An MBA to enter — a lateral route, not the only one.",
        "Frameworks memorised. Structure is a skill, not a library.",
      ],
    },
    howPeopleGetIn: [
      "Campus recruitment from target institutions — the dominant and heavily gated route.",
      "Lateral from industry with domain depth the firm is selling this year.",
      "MBA entry, for the institution reset as much as the degree.",
    ],
    levels: [
      { name: "Analyst", whatChanges: "You build the analysis." },
      { name: "Associate", whatChanges: "You own a workstream and its client interviews." },
      { name: "Manager", whatChanges: "The case is yours to run; the partner sells and reviews." },
      { name: "Principal / partner", whatChanges: "You sell. The craft becomes relationships." },
    ],
    whatIsHard:
      "The hours are the reputation, and you leave before you find out whether you were right — the recommendation is the product, and its consequences belong to somebody else. If you want to own outcomes rather than recommendations, consulting will teach you superbly for two years and then start to hollow; the common exit into BizOps exists for exactly that reason.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "excel-at-work", note: "Twenty days. The analysis lives here, and junior consulting is substantially professional spreadsheet work." },
        { slug: "thinking-under-uncertainty", note: "Twenty-four days — decomposition, base rates and honest evidence handling are the structured-problem-solving core, coursed." },
      ],
    },
  },
];

export default roles;
