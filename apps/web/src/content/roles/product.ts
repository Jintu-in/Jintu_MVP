import type { Role } from "./types";

/**
 * PM, PgM, TPM, project manager and product owner are the single largest
 * confusion cluster in tech careers — including among people holding the
 * titles. Two get full pages here; all five are separated on the comparison.
 */
const roles: Role[] = [
  {
    slug: "product-manager",
    title: "Product manager",
    domain: "product",
    standfirst: "Owns what gets built and why — and is accountable for the outcome, without anybody reporting to them.",
    entry: "Rarely a first job. Most PMs arrive from engineering, analysis, design, support or founding something.",
    whatTheyDo: [
      "Decides what the team should build next and can explain why that and not the eleven other things, in terms of a problem somebody actually has.",
      "Spends most of the week gathering evidence and removing ambiguity: talking to customers, reading the funnel, and turning a vague complaint into a specific, buildable problem statement.",
      "Says no far more than yes, and is responsible for the consequences of both.",
    ],
    typicalWeek: [
      "Talk to three customers and discover the feature everyone asked for solves a problem two of them do not have.",
      "Write a one-pager that gets torn apart, and rewrite it — the tearing apart is the process working.",
      "Cut scope on something already half-built, and absorb the team's disappointment about it.",
      "Look at last month's launch and admit it did not move the metric.",
      "Spend an hour reconciling what sales promised with what exists.",
    ],
    whatItIsNot: [
      {
        line: "Not a program manager. A PM owns what gets built and why; a PgM owns whether several teams ship it together. Different jobs, routinely conflated in job adverts.",
        compare: "product-roles",
      },
      {
        line: "Not a project manager. Project management owns scope, timeline and budget for a defined piece of work. A PM owns whether the work is worth doing at all.",
        compare: "product-roles",
      },
      {
        line: "Not a product owner. Product owner is a Scrum role — a seat in a ceremony — not a career. Many PMs wear it; it is not the same thing.",
        compare: "product-roles",
      },
      {
        line: "Not the CEO of the product, whatever the cliché says. A PM has responsibility and influence, and no authority over anybody.",
      },
    ],
    worksWith: [
      { who: "Engineering", on: "what is possible, at what cost, and what the hidden work is" },
      { who: "Design", on: "the problem, before either of you has a solution in mind" },
      { who: "Analysts", on: "whether it worked, and what would count as working" },
      { who: "Sales and support", on: "what customers actually hit, as opposed to what they ask for" },
    ],
    skills: {
      must: [
        "Writing — the primary tool of the job, and the one most candidates underestimate",
        "Talking to customers without leading them to the answer you wanted",
        "Enough data literacy to define a metric and know when a result is noise",
        "Prioritising in public, with reasons that survive being challenged",
        "Saying no in a way that keeps the relationship",
      ],
      helps: [
        "Technical depth, enough to know when an estimate is being padded and when it is honest",
        "Design sense, enough to tell a real usability problem from a preference",
        "Domain knowledge, which matters far more in enterprise than in consumer",
      ],
      overrated: [
        "Frameworks with acronyms. Teams adopt them, then do whatever they were going to do.",
        "The tool. Nobody has ever failed at this job because of their tracker.",
        "MBA, for most product jobs outside a few large firms.",
      ],
    },
    howPeopleGetIn: [
      "From engineering, which is the most common route and the one that transfers most credibility with the team.",
      "From analysis, which transfers the evidence half well and the influence half less so.",
      "From support or account management, which gives an unusually accurate picture of what customers actually struggle with.",
      "Through an APM programme, which exists at a small number of large firms and is extremely competitive.",
      "By doing the job before having the title — writing the one-pager nobody asked for, in a role adjacent to product.",
    ],
    levels: [
      { name: "APM / Associate", whatChanges: "You own a feature within somebody else's strategy." },
      { name: "Product manager", whatChanges: "You own an area and its roadmap, and you are the one who says no." },
      { name: "Senior", whatChanges: "You own an outcome rather than a surface, and you choose which problems the team does not work on." },
      { name: "Group PM / Director", whatChanges: "Mostly people and strategy. Increasingly a management job." },
    ],
    whatIsHard:
      "You are accountable for outcomes you cannot produce yourself and cannot instruct anybody to produce. Every decision is made on incomplete evidence and is visibly wrong some of the time, in front of the people who built the thing. The job is also structurally lonely: you are the person who cut the feature, and the person who has to say the launch did not work. If you need to be liked, or you need to be certain before deciding, this is a bad fit — and both are far more common reasons people leave product than any lack of skill.",
    startHere: {
      kind: "notYet",
      note: "We have not built a product management roadmap yet. It is on the list, and if you want it, say so through the request box on the catalogue — those requests are what we build from. In the meantime the two roadmaps below are the parts of the job we do cover, and they are the parts most PM material skips.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days, and the closest thing we have to the reasoning half of the job", url: "/learn/thinking-under-uncertainty" },
        { label: "Data analyst — 91 days; the SQL, statistics and experiment weeks are what makes a PM credible with numbers", url: "/learn/data-analyst" },
      ],
    },
  },

  {
    slug: "program-manager",
    title: "Program manager",
    domain: "product",
    standfirst: "Owns whether several teams ship something together — the coordination, the dependencies, and the risk.",
    entry: "Mid-level entry. Almost nobody starts here; most arrive from project management, engineering or operations.",
    whatTheyDo: [
      "Takes something that requires four teams and makes it actually happen: maps the dependencies, finds the one that will slip, and gets it moved before it becomes the reason everything is late.",
      "Owns the communication surface — the status that is true rather than green, the escalation that happens early enough to matter, and the decision log nobody else keeps.",
      "Spends the week on people and sequencing rather than on the product's content. What gets built is somebody else's call.",
    ],
    typicalWeek: [
      "Find the dependency nobody flagged, three weeks before it would have become critical.",
      "Run the meeting where two teams discover they each assumed the other was doing a piece of work.",
      "Rewrite a status from green to amber and defend it, which is most of the value of the role.",
      "Chase a decision that has been open for two weeks because nobody was clearly the decider.",
      "Cut a dependency out of the plan entirely, which is usually better than managing it.",
    ],
    whatItIsNot: [
      {
        line: "Not a product manager. A PgM does not decide what gets built or why. Confusing the two is the single most common error in this cluster, and it goes both ways in job adverts.",
        compare: "product-roles",
      },
      {
        line: "Not a project manager, though they overlap. A project has a defined scope and end; a programme is a set of related work that continues, and the PgM's unit is the dependency rather than the task.",
        compare: "product-roles",
      },
      {
        line: "Not a note-taker. If the role is being run as meeting administration, it is being wasted — the value is in seeing the risk early and having the standing to move it.",
      },
    ],
    worksWith: [
      { who: "Engineering managers", on: "capacity, sequencing and what will actually be ready" },
      { who: "Product managers", on: "what the scope is, and what can be dropped when something slips" },
      { who: "Leadership", on: "an honest status, which is the whole job in one deliverable" },
    ],
    skills: {
      must: [
        "Writing status that is true, brief, and readable by somebody with no context",
        "Dependency mapping, and the instinct for which one is actually load-bearing",
        "Running a meeting that ends in a decision rather than a follow-up",
        "Escalating early without it reading as blame",
      ],
      helps: [
        "Technical depth — for a TPM it is required rather than helpful",
        "Having been an engineer or an EM, so that estimates cannot be waved past you",
        "Comfort with spreadsheets, which is still where most programme tracking really lives",
      ],
      overrated: [
        "Certification. Widely requested in adverts, rarely predictive of whether somebody is good at this.",
        "Elaborate tooling. A programme that needs a complex tool to be legible is usually badly scoped.",
      ],
    },
    howPeopleGetIn: [
      "From project management, by taking on work that spans teams rather than one defined deliverable.",
      "From engineering, especially people who were already the informal coordinator — this is the route to TPM specifically.",
      "From operations or delivery in a services company, where cross-team coordination is the day job under another name.",
      "From a PMO, which is the most common Indian route and often the least visible one from outside.",
    ],
    levels: [
      { name: "Program manager", whatChanges: "You run one programme across a few teams." },
      { name: "Senior", whatChanges: "You run the programme that matters, and you are trusted to say it will not land." },
      { name: "Principal / Director", whatChanges: "You own how the organisation coordinates, not just one instance of it." },
    ],
    whatIsHard:
      "You are accountable for delivery across teams none of which report to you, and your main instrument is credibility. That takes months to build and one dishonest green status to lose. The role also attracts a specific misery: being blamed for slippage you flagged early and were told to stop worrying about. Keep the written record, and be somewhere that rewards an amber status rather than punishing it.",
    startHere: {
      kind: "notYet",
      note: "No programme management roadmap yet — request it on the catalogue if you want it built. The two below cover the parts of the job that are genuinely teachable rather than learned in post: reasoning about risk, and writing that gets read.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days on second-order effects, base rates and pre-mortems, which is most of dependency risk", url: "/learn/thinking-under-uncertainty" },
        { label: "Excel at work — 20 days; programme tracking still lives in spreadsheets more than in any tool", url: "/learn/excel-at-work" },
      ],
    },
  },
];

export default roles;
