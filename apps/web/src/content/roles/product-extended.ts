import type { Role } from "./types";

/**
 * The rest of the product-and-delivery cluster: the graduate door, the two
 * roles routinely mistaken for the two already written, and the Scrum hat.
 *
 * The source taxonomy's product-owner entry arrived truncated; its page
 * here is completed in the same stance the product-roles comparison already
 * takes — a role in a framework, not a career — because publishing a role
 * page that contradicts our own comparison would be worse than either alone.
 */
const roles: Role[] = [
  {
    slug: "associate-product-manager",
    title: "Associate product manager",
    aliases: ["APM"],
    domain: "product",
    standfirst: "The graduate entry point into product, and one of the few that exists.",
    entry: "Graduate entry — a small number of positions, very high applicant volume.",
    whatTheyDo: [
      "Owns a small, well-bounded surface of a product with a senior PM watching closely. Does a lot of research, analysis and documentation, and gradually shifts from making recommendations to making decisions.",
      "The first year is closely supervised by design — the programme exists to grow PMs, and the supervision is the mechanism, not a lack of trust.",
    ],
    typicalWeek: [
      "Run user interviews and synthesise them into something a team can act on.",
      "Write a small spec and have it reviewed harder than feels fair.",
      "Pull data to support or kill an idea — including your own.",
      "Sit in on decisions you are not yet making, and notice how they get made.",
      "Own a minor feature end to end, because the minor ones teach the whole loop.",
    ],
    whatItIsNot: [
      {
        line: "Not an internship, and not a business analyst. APM programmes are structured, competitive and lead directly to PM — the work is real product work at a smaller scope.",
        compare: "product-roles",
      },
      {
        line: "Not the standard way in. Most people reach product sideways from engineering, analytics or support; the APM door is real and narrow, and treating it as the only door costs people years.",
      },
    ],
    worksWith: [
      { who: "Senior PMs", on: "everything, deliberately — the apprenticeship is the design" },
      { who: "Engineering and design", on: "the feature you own, at full seriousness and small scale" },
      { who: "Analytics", on: "learning to ask for evidence before opinion" },
    ],
    skills: {
      must: [
        "Structured thinking that survives being written down",
        "Writing — the review of your first spec is the real interview",
        "Basic data literacy: reading a funnel without being led by it",
        "Genuine curiosity about users, which cannot be faked through an interview loop",
      ],
      helps: [
        "SQL, enough to answer your own questions",
        "Design sense",
        "Technical literacy, enough to know what is expensive",
      ],
      overrated: [
        "Prior product experience. The programme exists because there is none.",
        "An MBA. A few programmes filter on it; the work does not require it.",
      ],
    },
    howPeopleGetIn: [
      "APM programmes at large product companies — few seats, heavy competition, structured selection.",
      "Internal moves from analytics, support or engineering, which fill more product seats than the programmes do.",
    ],
    levels: [
      { name: "APM", whatChanges: "You own a feature within somebody else's strategy, supervised." },
      { name: "PM", whatChanges: "You own an area and its roadmap, and the supervision becomes advice." },
      { name: "Senior PM", whatChanges: "You own an outcome rather than a surface." },
    ],
    whatIsHard:
      "Getting in. The programmes are extremely competitive, and most people who become PMs never went through one — so the honest strategy is to apply and simultaneously build the sideways route from a role you can actually get. If you need autonomy immediately, the first year will chafe: it is closely supervised on purpose.",
    startHere: {
      kind: "notYet",
      note: "No product management roadmap yet — it is on the list, and requests move it up. The two below are the halves of the job the interviews actually test: reasoning under uncertainty, and evidence literacy.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; product judgement is this, applied", url: "/learn/thinking-under-uncertainty" },
        { label: "Data analyst — 91 days; the funnel, metric and experiment weeks are what make an APM candidate credible", url: "/learn/data-analyst" },
      ],
    },
  },

  {
    slug: "technical-program-manager",
    title: "Technical program manager",
    aliases: ["TPM"],
    domain: "product",
    standfirst: "A program manager for engineering work, who can read the architecture diagram.",
    entry: "Mid-level entry — well paid and in demand at large product companies and GCCs.",
    whatTheyDo: [
      "Coordinates complex technical programmes — migrations, platform rollouts, infrastructure work — across engineering teams. The technical depth is not decoration: it is what lets you challenge an estimate and understand what a dependency actually means.",
      "Translates engineering risk into language leadership can act on, without flattening the truth on the way up.",
    ],
    typicalWeek: [
      "Map the technical dependencies in a migration, including the one nobody wrote down.",
      "Challenge an estimate because you understand the work — and accept one for the same reason.",
      "Track a rollout across several services and keep the honest status honest.",
      "Run a launch readiness review that somebody wanted to skip.",
      "Write the update that lets leadership act early instead of react late.",
    ],
    whatItIsNot: [
      {
        line: "Not a PgM with a technical veneer. The distinguishing feature is genuine depth — a TPM who cannot read the architecture cannot see which dependency is load-bearing, which is the whole job.",
        compare: "product-roles",
      },
      {
        line: "Not an engineering manager. No reports, no performance reviews — the accountability is delivery across teams, not the people in them.",
        compare: "engineering-leadership",
      },
    ],
    worksWith: [
      { who: "Engineering teams", on: "sequencing, dependencies and what will really be ready" },
      { who: "Architects and SRE", on: "the technical risk register and what belongs on it" },
      { who: "Leadership", on: "a status that is true rather than green" },
    ],
    skills: {
      must: [
        "Technical depth — usually earned as an engineer first",
        "Dependency management across systems, not just teams",
        "Risk assessment with the instinct for which risk is structural",
        "Writing that two very different audiences can act on",
      ],
      helps: [
        "Systems architecture literacy",
        "Cloud platforms",
        "Incident management experience",
      ],
      overrated: [
        "Writing production code daily. The depth has to exist; exercising it in commits is not the job.",
      ],
    },
    howPeopleGetIn: [
      "From engineering — the most common and the most credible route.",
      "From programme management, by deliberately building the technical half.",
      "From SRE or DevOps, where the systems view is already formed.",
    ],
    levels: [
      { name: "TPM", whatChanges: "You run one technical programme." },
      { name: "Senior TPM", whatChanges: "You run the migration everyone is afraid of." },
      { name: "Principal TPM", whatChanges: "You own how the organisation runs technical programmes at all." },
    ],
    whatIsHard:
      "You must be technical enough to be respected by engineers and clear enough to be understood by executives — and the two audiences want opposite levels of detail, often about the same risk on the same day. Like all programme roles, the authority is borrowed: if chasing people you cannot instruct sounds draining rather than energising, believe that instinct.",
    startHere: {
      kind: "notYet",
      note: "No TPM roadmap yet — request it if you want it. The route runs through engineering depth plus programme judgement, and both halves below are real.",
      readInstead: [
        { label: "Linux command line — 15 days; the migrations you will coordinate live at this layer", url: "/learn/linux-command-line" },
        { label: "Thinking clearly under uncertainty — 24 days; dependency risk is second-order reasoning with a deadline", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "project-manager",
    title: "Project manager",
    aliases: ["Delivery Manager"],
    domain: "product",
    standfirst: "Owns scope, timeline and budget for a defined piece of work with an end date.",
    entry: "Mid-level entry — very high volume in Indian services companies.",
    whatTheyDo: [
      "Plans and delivers a project against a fixed scope and deadline, usually for a client: the schedule, the budget, the resourcing, and the change requests that arrive the moment ink dries.",
      "Manages the gap between what the contract says and what the client remembers agreeing to, which is most of the job on a difficult account.",
    ],
    typicalWeek: [
      "Update the plan and report against it, honestly.",
      "Manage a change request and make its cost implication visible before it is accepted.",
      "Resolve a resourcing conflict between two projects that both 'must' have the same person.",
      "Report status to a client who wants a different status.",
      "Escalate a slipping milestone early enough for the escalation to matter.",
    ],
    whatItIsNot: [
      {
        line: "Not a product manager. A project has a defined end; a product does not — and the confusion is worsened by both abbreviating to PM. One owns whether the work is worth doing; the other owns delivering work already agreed.",
        compare: "product-roles",
      },
      {
        line: "Not a program manager, though the border is soft. A programme is related work that continues; a project ends, and the project manager's authority usually ends with it.",
        compare: "product-roles",
      },
    ],
    worksWith: [
      { who: "Clients", on: "expectations, change and the status they would rather not hear" },
      { who: "Delivery teams", on: "the plan as it collides with reality" },
      { who: "Account management", on: "the relationship the project either strengthens or spends" },
    ],
    skills: {
      must: [
        "Planning that survives contact with week three",
        "Budget arithmetic and the discipline to surface overruns early",
        "Risk management as a running practice, not a launch document",
        "Client communication under pressure",
      ],
      helps: [
        "PMP or Prince2 — genuinely filtered on in services hiring, whatever their limits",
        "Agile delivery methods",
        "Contract literacy, because scope disputes end up there",
      ],
      overrated: [
        "Technical ability. Enough to follow the conversation helps; the job is the plan, not the code.",
      ],
    },
    howPeopleGetIn: [
      "From business analysis — the most common route in services.",
      "From delivery coordination or PMO roles, formalising what you were already doing.",
      "From operations, where the planning muscle is the same.",
    ],
    levels: [
      { name: "Project manager", whatChanges: "You deliver one project." },
      { name: "Senior PM", whatChanges: "You deliver the account's difficult one, and mentor the others." },
      { name: "Program director", whatChanges: "You own a portfolio, and the clients that come with it." },
    ],
    whatIsHard:
      "You are accountable for a date set before anyone understood the work, and for a scope the client keeps expanding — the structural condition of services delivery, not a bad week. If you want to own something long-term, note that this role ends when the project does, by design; the people who thrive here like the finish line.",
    startHere: {
      kind: "notYet",
      note: "No project management roadmap yet — request it if you want it built. The plan still lives in a spreadsheet, and the risk half is more teachable than the industry admits.",
      readInstead: [
        { label: "Excel at work — 20 days; the plan, the budget and the tracker all live here", url: "/learn/excel-at-work" },
        { label: "Thinking clearly under uncertainty — 24 days; estimation is base-rate reasoning, and the planning fallacy is day 11", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "product-owner",
    title: "Product owner",
    aliases: ["PO"],
    domain: "product",
    standfirst: "A Scrum role, not a career. Often a product manager wearing a ceremony hat.",
    entry: "Mid-level entry as advertised — but read this page before pursuing it as a destination.",
    whatTheyDo: [
      "Owns and orders the backlog in a Scrum team, writes and refines user stories, and is available to answer the team's questions during a sprint.",
      "In theory this is a decision-making role; in many organisations it is a story-writing one, and which of the two an advertised PO job actually is decides whether it is worth taking.",
    ],
    typicalWeek: [
      "Refine the backlog and reorder it, with reasons.",
      "Write and split user stories until they are buildable.",
      "Answer the team's questions fast enough that nobody stalls.",
      "Accept or reject completed work against the criteria you wrote.",
      "Sit in the ceremonies, and try to make them earn their time.",
    ],
    whatItIsNot: [
      {
        line: "Not a career track. It is a role defined inside a framework — in practice either a product manager doing PM work with a ceremony attached, or a business analyst writing tickets. Three years under this title alone translates poorly to companies that do not use it.",
        compare: "product-roles",
      },
      {
        line: "Not automatically the person who decides what gets built. Ask what happens when the PO and the stakeholders disagree; the answer tells you which version of the role this is.",
      },
    ],
    worksWith: [
      { who: "The Scrum team", on: "the backlog, the questions and the acceptance" },
      { who: "A product manager, where one exists", on: "the strategy the backlog is supposed to serve" },
      { who: "Stakeholders", on: "what gets into the sprint, and what has to wait" },
    ],
    skills: {
      must: [
        "Writing stories precisely enough that the wrong thing cannot be built from them",
        "Prioritising with reasons that survive challenge",
        "Availability and fast, clear answers",
        "Acceptance discipline — rejecting done-but-wrong work kindly",
      ],
      helps: [
        "Real product management skills, which turn the hat into a job",
        "Domain knowledge",
        "Basic data literacy",
      ],
      overrated: [
        "Certification. A two-day course cannot confer judgement, and hiring managers who rely on it get what they filtered for.",
      ],
    },
    howPeopleGetIn: [
      "From business analysis — the most common route in services organisations.",
      "From product management, where the PO hat is simply part of the PM job.",
      "Via certification into a services PO seat — the route to take knowingly, as a step toward PM or BA depth rather than a destination.",
    ],
    levels: [
      { name: "Product owner", whatChanges: "You own one team's backlog." },
      { name: "Senior PO", whatChanges: "Larger surface, more stakeholders — and the ceiling of the title itself." },
      { name: "Product manager", whatChanges: "The real progression: out of the framework role and into owning what and why." },
    ],
    whatIsHard:
      "The title's ambiguity is the hazard. Two PO jobs can be entirely different careers — one is product management, the other is ticket administration — and the advert will not tell you which. Ask what you may decide alone and what happens when you and a stakeholder disagree; if the answers are 'nothing' and 'the stakeholder wins', take the job only as a deliberate stepping stone.",
    startHere: {
      kind: "notYet",
      note: "We would not build a product-owner roadmap — the durable skills are product management's, and that roadmap is on the request list. Start with the comparison, then build the judgement the role's better version runs on.",
      readInstead: [
        { label: "PM vs PgM vs TPM vs Project Manager vs Product Owner — decide which actual job you want first", url: "/roles/compare/product-roles" },
        { label: "Thinking clearly under uncertainty — 24 days", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },
];

export default roles;
