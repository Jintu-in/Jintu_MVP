import type { Role } from "./types";

/**
 * The go-to-market ladder is invisible from outside the industry, which is
 * why it is worth writing down: it is the largest genuinely non-technical
 * audience available to this catalogue, and the entry role has no degree
 * requirement at all.
 */
const roles: Role[] = [
  {
    slug: "sdr",
    title: "Sales development representative (SDR / BDR)",
    domain: "gtm",
    standfirst: "Finds and qualifies potential customers, and books the meeting. Does not close.",
    entry: "Graduate entry, and one of very few well-paid roles with no degree or portfolio requirement.",
    whatTheyDo: [
      "Works a list: researches accounts, works out who the right person is, and contacts them with a reason specific enough to be worth answering.",
      "Qualifies — establishes quickly whether there is a real problem, a budget and a timeline, and disqualifies fast when there is not. Disqualifying well is most of the skill.",
      "Hands the qualified conversation to an account executive, and is measured on meetings that actually happen and progress.",
    ],
    typicalWeek: [
      "Research thirty accounts properly rather than emailing three hundred badly.",
      "Write sequences that get read, and delete the paragraph about how excited you are.",
      "Make calls, most of which end quickly, and stay useful on the twentieth.",
      "Sit in on an AE's discovery call to hear what a real conversation sounds like.",
      "Review what converted last month and change one variable, not five.",
    ],
    whatItIsNot: [
      {
        line: "Not closing. An SDR opens conversations; the account executive runs the deal. Wanting to close is the normal reason to move up, not a reason to skip this.",
        compare: "gtm-roles",
      },
      {
        line: "Not a call centre job, though a badly run one is indistinguishable. The difference is research and targeting — volume without either is the version that burns people out in six months.",
      },
      {
        line: "Not customer success. CSM works with people who already bought.",
        compare: "gtm-roles",
      },
    ],
    worksWith: [
      { who: "Account executives", on: "what a good handover looks like, and what they will reject" },
      { who: "Marketing", on: "which leads are worth the time and which campaigns produce nothing usable" },
      { who: "RevOps", on: "the CRM, the data, and why your numbers disagree with the dashboard" },
    ],
    skills: {
      must: [
        "Writing short, specific messages that do not sound like a template",
        "Research — finding the reason this company, this person, this quarter",
        "Handling a no without either arguing or deflating",
        "Discipline: this is a volume job with a long feedback loop and no external structure",
      ],
      helps: [
        "Understanding the product well enough to have an actual conversation",
        "CRM hygiene, which sounds trivial and determines whether anybody trusts your pipeline",
        "Basic spreadsheet ability, for working your own numbers rather than waiting for a report",
      ],
      overrated: [
        "Charisma. Consistency and research beat it, and most top performers are unremarkable on a call.",
        "Scripts, past the first month. They stop you listening.",
        "Sales certifications, which carry very little weight compared to a track record.",
      ],
    },
    howPeopleGetIn: [
      "Directly, with no specific degree — one of the genuinely open entry points in tech.",
      "From customer support, which transfers well because you already know the product and the objections.",
      "From retail or field sales, which transfers better than people expect.",
      "By doing it visibly: a short, well-researched, specific outreach message to the hiring manager is itself the work sample.",
    ],
    levels: [
      { name: "SDR / BDR", whatChanges: "You work the list and book meetings." },
      { name: "Senior SDR", whatChanges: "You take the harder segment, and usually help train new starters." },
      { name: "Account executive", whatChanges: "The standard promotion. You now own the deal and the number." },
      { name: "Or sideways", whatChanges: "Into RevOps, marketing or customer success — all common and none a failure." },
    ],
    whatIsHard:
      "Most of what you do does not work, every day, measurably, in public on a leaderboard. The rejection is not personal but it arrives personally, and the job has a well-earned reputation for burning people out inside a year — usually where it is run on volume alone with no research and no coaching. Ask in the interview what the ramp looks like and how many SDRs were promoted internally last year; the answer tells you most of what you need to know.",
    startHere: {
      kind: "notYet",
      note: "No sales roadmap yet. It is the largest audience gap in the catalogue and we would like to build it — request it and that becomes a real signal. In the meantime the closest thing we have is the writing and reasoning half, which is more of this job than most people expect.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; qualification is base-rate reasoning under a quota", url: "/learn/thinking-under-uncertainty" },
        { label: "Excel at work — 20 days; you will work your own pipeline numbers long before anybody builds you a dashboard", url: "/learn/excel-at-work" },
      ],
    },
  },

  {
    slug: "solutions-consultant",
    title: "Solutions consultant / sales engineer",
    domain: "gtm",
    standfirst: "Technical pre-sales — the person who proves the product actually does what the salesperson said.",
    entry: "Mid-level entry. Usually a second job, from engineering, support or implementation.",
    whatTheyDo: [
      "Joins sales conversations as the technical authority: runs the demo, answers the hard question honestly, and works out whether the product genuinely fits.",
      "Designs the proof of concept and the integration story, and is often the reason a technical buyer trusts the vendor at all.",
      "Is the person who says 'no, it does not do that' in front of the salesperson — which is exactly why the customer believes the rest.",
    ],
    typicalWeek: [
      "Run two demos, neither of which follows the script because the customer asked something real.",
      "Build a proof of concept against the customer's own data, and find the edge case that breaks it.",
      "Answer a security questionnaire, which is less interesting than it sounds and often decides the deal.",
      "Tell an account executive that the deal needs a feature that does not exist, and agree how to say so.",
      "Feed a recurring blocker back to product, with evidence from three deals rather than one anecdote.",
    ],
    whatItIsNot: [
      {
        line: "Not an account executive. You are not carrying the number or negotiating the contract, though you are measured against the same deals.",
        compare: "gtm-roles",
      },
      {
        line: "Not support. You work before the sale, not after — implementation and customer success take over once it closes.",
        compare: "gtm-roles",
      },
      {
        line: "Not a demoted engineer. It is a different career with different rewards, and it is among the better-paid technical roles that does not require writing production code all day.",
      },
    ],
    worksWith: [
      { who: "Account executives", on: "deal strategy — you are a pair, and the pairing is the job" },
      { who: "The customer's engineers", on: "the actual integration, which is where credibility is won or lost" },
      { who: "Product", on: "what keeps blocking deals, with evidence rather than opinion" },
    ],
    skills: {
      must: [
        "Enough technical depth to be believed by an engineer who is trying to catch you out",
        "Presenting and demoing without hiding behind slides",
        "Listening — most failed demos are failures to hear what was actually being asked",
        "Saying no clearly, in the room, without undermining your colleague",
      ],
      helps: [
        "Having been an engineer, which is the most common background and the most credible one",
        "Writing, for the follow-up document that circulates after you leave the call",
        "Domain knowledge in the customer's industry",
      ],
      overrated: [
        "Knowing every feature. Knowing which three matter to this customer is the skill.",
        "Polished slideware. The unscripted answer is what is being evaluated.",
      ],
    },
    howPeopleGetIn: [
      "From software engineering, by people who liked the customer conversations more than the codebase.",
      "From implementation or professional services, which is the most natural adjacent move.",
      "From technical support, especially anyone who was already pulled into pre-sales calls informally.",
      "From QA, occasionally — the instinct for how a product breaks is directly useful in a demo.",
    ],
    levels: [
      { name: "Solutions consultant", whatChanges: "You support deals in one product area." },
      { name: "Senior", whatChanges: "You take the complex and strategic deals, and you shape the technical approach." },
      { name: "Principal / Lead SC", whatChanges: "You set how the team sells technically, and you are in the room for the largest deals." },
      { name: "Or across", whatChanges: "Into product management or solutions architecture — both common exits." },
    ],
    whatIsHard:
      "You carry sales pressure without sales control, and the tension between being honest and being helpful is the permanent condition of the job. Say yes too often and you burn the credibility that makes you useful; say no too bluntly and you lose the room. It is also a travel-heavy, calendar-driven job in most companies, which suits some people and quietly wrecks others.",
    startHere: {
      kind: "notYet",
      note: "No pre-sales roadmap yet. The technical half is well covered by the engineering roadmaps below — most people in this role come from exactly that background, and the credibility is the hard prerequisite.",
      readInstead: [
        { label: "Java & Spring Boot — 38 days to a deployed backend, which is the technical grounding this role assumes", url: "/learn/java-spring-boot" },
        { label: "Data analyst — 91 days; increasingly what a technical buyer wants to talk about is their data", url: "/learn/data-analyst" },
      ],
    },
  },
];

export default roles;
