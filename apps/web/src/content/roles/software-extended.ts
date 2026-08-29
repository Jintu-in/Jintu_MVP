import type { Role } from "./types";

/**
 * The rest of the engineering taxonomy: the specialisations, the infra
 * cluster whose titles are drifting fast, and the leadership fork.
 *
 * Adapted from the owner's expanded taxonomy (2026-08-30) into the page
 * model: the one-line what-it-is-nots became two or more, works-with gained
 * its "on what" halves, and levels gained what actually changes at each.
 * Roadmap slugs were corrected against docs/roadmaps/ — the source data
 * said "git-github" and routed several roles to a "writing-clearly" roadmap
 * that has not been built, which is exactly the drift assert-roles exists
 * to catch.
 */
const roles: Role[] = [
  {
    slug: "frontend-engineer",
    title: "Frontend engineer",
    aliases: ["UI Engineer", "Client-side Engineer"],
    domain: "software",
    standfirst: "Builds what people actually touch, on devices you cannot control.",
    entry: "Graduate entry, and consistently among the most-searched technical roles.",
    whatTheyDo: [
      "Turns designs and data into interfaces that work on a cheap Android in poor light on a bad connection. The design is somebody else's job; the states are yours — loading, empty, error, partial, offline — and there are always more of them than the mock-up shows.",
      "Owns performance and accessibility, which are engineering properties rather than polish: a bundle that grew 40KB and a flow that cannot be driven by keyboard are both defects.",
    ],
    typicalWeek: [
      "Build a component from a design, plus the six states the design did not draw.",
      "Fix a layout that breaks between 360px and 400px wide.",
      "Reduce a bundle that grew 40KB last sprint, and find which import did it.",
      "Argue about whether something should be a modal, and lose politely.",
      "Make a flow usable with a keyboard, and discover what that reveals about its structure.",
    ],
    whatItIsNot: [
      {
        line: "Not 'making it pretty'. The design is the designer's; the states, the performance and the accessibility are the engineering, and they are the larger half of the work.",
        compare: "design-roles",
      },
      {
        line: "Not the easy half of full-stack. The environment is more hostile than a server: your code runs on devices you have never seen, on networks you cannot predict, with assistive tools you have never used.",
      },
    ],
    worksWith: [
      { who: "Designers", on: "what the design means in the states it did not draw" },
      { who: "Backend engineers", on: "the API contract, which is where most friction lives" },
      { who: "QA", on: "the device and browser matrix nobody can fully test" },
    ],
    skills: {
      must: [
        "HTML and CSS properly, not as an afterthought to a framework",
        "JavaScript, before and beneath any framework",
        "One framework deeply",
        "Browser devtools as a first instinct rather than a last resort",
      ],
      helps: [
        "Accessibility — it is a hiring differentiator precisely because most candidates skip it",
        "TypeScript",
        "Performance budgets and how to hold one",
        "Testing user-visible behaviour rather than implementation",
      ],
      overrated: [
        "Knowing React, Vue and Angular at once. One deeply beats three shallowly, every time.",
        "Design ability. Taste helps; the job is engineering the design you are given.",
      ],
    },
    howPeopleGetIn: [
      "Self-taught with a portfolio — frontend shows its work, so this route is unusually effective here.",
      "From design, by the designer who kept building the prototypes.",
      "Campus placement or bootcamp, with a deployed project that survives a stranger's phone.",
    ],
    levels: [
      { name: "Associate", whatChanges: "You build components inside an existing system." },
      { name: "Engineer", whatChanges: "You own features and the states nobody specified." },
      { name: "Senior", whatChanges: "You own the architecture, the performance budget and the component system." },
      { name: "Staff", whatChanges: "Scope across products — the design system, the platform choices." },
    ],
    whatIsHard:
      "The environment is hostile and unknowable: a device you have never seen, a network you cannot predict, an accessibility tool you have never used. Frontend also absorbs most of the unspecified detail in any product — every state the spec did not mention becomes your decision — so if ambiguity in requirements bothers you, this is where you will feel it most.",
    startHere: {
      kind: "notYet",
      note: "A frontend roadmap is high on our build list and not built yet — if you want it, say so through the request box on the catalogue; those requests are what we build from. Version control is the one prerequisite worth doing today.",
      readInstead: [
        { label: "Git & GitHub — 12 days, and every frontend job assumes it from the first commit", url: "/learn/git-and-github" },
      ],
    },
  },

  {
    slug: "devops-engineer",
    title: "DevOps engineer",
    aliases: ["Infrastructure Engineer"],
    domain: "software",
    standfirst: "Makes the path from a developer's laptop to production short, safe and boring.",
    entry: "Mid-level entry. Almost always a second job — from backend, sysadmin or QA automation.",
    whatTheyDo: [
      "Owns CI/CD, environments, deployment and the tooling around them. Automates the work that used to be a person following a checklist at midnight, and is judged almost entirely by the absence of failure.",
      "In practice the title covers whatever the company means by it — which is the honest summary of the whole role, and the reason to read the responsibilities rather than the header.",
    ],
    typicalWeek: [
      "Fix a broken build pipeline before it blocks everyone's morning.",
      "Write Terraform for a new environment and resist the temptation to click it together instead.",
      "Reduce a deploy from twenty minutes to four.",
      "Investigate why staging and production behave differently, again.",
      "Rotate a credential that should have been rotated last quarter.",
    ],
    whatItIsNot: [
      {
        line: "Not an SRE. SRE is defined by error budgets and generally demands stronger coding; DevOps as advertised is often operations with automation attached. The titles drift, so ask what last week actually looked like.",
        compare: "infra-roles",
      },
      {
        line: "Not a platform engineer, though that is where the title is heading. The distinction is product thinking — a platform team has users and a roadmap; a DevOps role often has a queue.",
        compare: "infra-roles",
      },
    ],
    worksWith: [
      { who: "Every engineering team", on: "how their code reaches production, and why it did not" },
      { who: "Security", on: "credentials, access and the things nobody rotated" },
      { who: "SRE or platform", on: "the boundary between shipping and running" },
    ],
    skills: {
      must: [
        "Linux, properly — it is the substrate of everything else",
        "One cloud provider deeply",
        "CI/CD as a system you design, not a config you copy",
        "Docker, and scripting to glue it all together",
      ],
      helps: [
        "Terraform or an equivalent — infrastructure that is not in code decays",
        "Kubernetes, once the scale justifies it",
        "Networking fundamentals, which explain most mysterious failures",
        "Observability — metrics, logs and traces as a habit",
      ],
      overrated: [
        "Kubernetes before you need it. Most companies adopt it years before their scale does.",
        "Every cloud at once. Depth in one transfers; a certification in three does not.",
      ],
    },
    howPeopleGetIn: [
      "From backend engineering, by being the person who kept fixing the pipeline.",
      "From sysadmin or IT support, by putting the manual work into code.",
      "From QA automation, which is closer than it looks — both jobs are about repeatable verification.",
    ],
    levels: [
      { name: "Engineer", whatChanges: "You maintain and extend the pipelines and environments." },
      { name: "Senior", whatChanges: "You design them, and you are trusted to change the ones everything depends on." },
      { name: "Lead", whatChanges: "You own how the organisation ships, and the fork begins — toward platform or SRE." },
    ],
    whatIsHard:
      "You are invisible when it works and extremely visible when it does not; the work is judged almost entirely by absence of failure, and nobody notices a deploy that went fine. If you need to be thanked for things, this will quietly wear you down — the satisfaction has to come from the boringness itself.",
    startHere: {
      kind: "notYet",
      note: "No DevOps roadmap yet — request it on the catalogue if you want it built. The two below are the genuine foundations, and neither is optional in this job.",
      readInstead: [
        { label: "Linux command line — 15 days; the substrate of every environment you will ever manage", url: "/learn/linux-command-line" },
        { label: "Git & GitHub — 12 days; CI/CD is built on top of it", url: "/learn/git-and-github" },
      ],
    },
  },

  {
    slug: "site-reliability-engineer",
    title: "Site reliability engineer",
    aliases: ["SRE"],
    domain: "software",
    standfirst: "Software engineering applied to keeping systems up.",
    entry: "Mid-level entry, concentrated in product companies and larger GCCs. Rarely a first job.",
    whatTheyDo: [
      "Defines what 'reliable enough' means in numbers — SLOs and the error budgets they imply — then builds the automation and instrumentation to hold the system there.",
      "Runs incident response and writes the blameless postmortems that stop the same failure happening twice. Treats manual operational work as a bug to be engineered away, not a duty to be endured.",
    ],
    typicalWeek: [
      "Define or adjust an SLO, and defend the error budget it implies to a team that wants to ship faster.",
      "Build tooling that removes a manual operational task permanently.",
      "Lead or take part in an incident, at whatever hour it chose.",
      "Write a postmortem that names causes without naming culprits.",
      "Fix an alert that has been firing uselessly for a month, so the next real one gets believed.",
    ],
    whatItIsNot: [
      {
        line: "Not DevOps with a nicer title. The discipline is defined by error budgets and toil reduction, and the coding bar is usually the highest of the infra cluster — which surprises people moving across from operations.",
        compare: "infra-roles",
      },
      {
        line: "Not 'the on-call person'. On-call is a cost the role carries, not its content; a team that treats SRE as a pager rotation has hired operations under a fashionable name.",
      },
    ],
    worksWith: [
      { who: "Backend engineers", on: "how their service fails, and what the budget says about shipping" },
      { who: "Platform", on: "the shared infrastructure both depend on" },
      { who: "Product", on: "the trade-off between velocity and reliability, made explicit" },
    ],
    skills: {
      must: [
        "Coding at the level of a backend engineer — this is the bar that filters the role",
        "Linux internals",
        "Distributed systems basics: what fails, how, and what that does downstream",
        "Observability — designing the instrumentation, not just reading it",
      ],
      helps: [
        "Capacity planning",
        "Statistics, for reading latency distributions honestly",
        "Chaos engineering, where the maturity exists",
      ],
      overrated: [
        "Treating on-call heroics as the job. The job is making the heroics unnecessary.",
        "Tool fluency without the underlying model. The dashboards change; the failure modes do not.",
      ],
    },
    howPeopleGetIn: [
      "From backend engineering, which is the cleanest route because the coding bar is already met.",
      "From DevOps, by deliberately building the software-engineering half.",
      "Directly into an SRE graduate programme, at the handful of companies large enough to run one.",
    ],
    levels: [
      { name: "SRE", whatChanges: "You hold services to their SLOs and automate away your own toil." },
      { name: "Senior SRE", whatChanges: "You design the reliability approach for systems you did not build." },
      { name: "Staff SRE", whatChanges: "You own reliability across an organisation, and the standards incidents are run by." },
    ],
    whatIsHard:
      "On call. Real incidents happen at bad hours and the pressure is genuine; good teams manage the rotation humanely and bad ones burn people out with it. Be direct about this when evaluating an offer — if your life cannot absorb an on-call rotation right now, this is not the right year for this job, and that is a scheduling fact rather than a failing.",
    startHere: {
      kind: "notYet",
      note: "No SRE roadmap yet — request it if you want it. Linux is the non-negotiable foundation, and the reasoning half of incident response is better covered than people expect.",
      readInstead: [
        { label: "Linux command line — 15 days; incidents are debugged at this layer", url: "/learn/linux-command-line" },
        { label: "Thinking clearly under uncertainty — 24 days; postmortems and error budgets are applied base-rate reasoning", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "platform-engineer",
    title: "Platform engineer",
    aliases: ["Internal Developer Platform Engineer"],
    domain: "software",
    standfirst: "Builds the internal product that other engineers use to ship.",
    entry: "Mid-level entry, from DevOps, backend or SRE. The direction the whole infra cluster is heading.",
    whatTheyDo: [
      "Treats the company's own developers as customers: builds golden paths, self-service tooling and paved roads so a product team can deploy without filing a ticket.",
      "Runs the platform as a product — with users, a roadmap and adoption metrics — which is the entire distinction from the roles it evolved out of.",
    ],
    typicalWeek: [
      "Interview product engineers about what actually slows them down, and hear something different from what you expected.",
      "Build a template or CLI that removes a repeated manual step for every team at once.",
      "Maintain shared infrastructure everyone depends on and nobody else sees.",
      "Write documentation people will actually read, which is harder than the tooling.",
      "Say no to a bespoke request that would not generalise, and explain why kindly.",
    ],
    whatItIsNot: [
      {
        line: "Not DevOps renamed. The distinction is product thinking: a platform team has users, a roadmap and adoption metrics. A platform team that exists to approve deployment tickets has a new name for an old job.",
        compare: "infra-roles",
      },
      {
        line: "Not an ivory tower. A platform nobody adopts is a failure however elegant it is, and adoption is won by being genuinely faster than the workaround.",
      },
    ],
    worksWith: [
      { who: "Every engineering team", on: "the paved path, and whether it is actually paved" },
      { who: "SRE", on: "the reliability of what everyone builds on" },
      { who: "Security", on: "making the secure path the easy path, which is the only way it gets taken" },
    ],
    skills: {
      must: [
        "Strong engineering — this is a building role, not a configuring one",
        "One cloud deeply, and Kubernetes or its equivalent",
        "Product sense applied to internal users",
        "Technical writing, because the docs are half the product",
      ],
      helps: [
        "Developer-experience research — watching someone use your tool is humbling and essential",
        "API design",
        "Having been a product engineer, so you remember what the friction felt like",
      ],
      overrated: [
        "Treating it as 'just infrastructure'. The infrastructure is the easy half; adoption is the job.",
      ],
    },
    howPeopleGetIn: [
      "From DevOps, by adding the product half to the tooling half.",
      "From backend engineering, by moving toward the layer everyone builds on.",
      "From SRE, where the automation instinct is already formed.",
    ],
    levels: [
      { name: "Engineer", whatChanges: "You build and maintain pieces of the platform." },
      { name: "Senior", whatChanges: "You own a surface of it, and its adoption is your number." },
      { name: "Staff / Lead", whatChanges: "You own how the organisation's engineers ship, as a product." },
    ],
    whatIsHard:
      "Adoption. You can build the right thing and have nobody use it, because engineers route around anything slower than their existing habit — so half the job is internal advocacy, demos and listening. If you dislike persuading people, the tooling half will not save you; the platform that wins is the one somebody talked people onto.",
    startHere: {
      kind: "notYet",
      note: "No platform engineering roadmap yet — request it if you want it built. The foundations below are real prerequisites, not filler.",
      readInstead: [
        { label: "Linux command line — 15 days", url: "/learn/linux-command-line" },
        { label: "Git & GitHub — 12 days; the platform's interface to every team is a repository", url: "/learn/git-and-github" },
      ],
    },
  },

  {
    slug: "sdet",
    title: "SDET",
    aliases: ["Software Development Engineer in Test", "Test Automation Engineer"],
    domain: "software",
    standfirst: "An engineer whose product is confidence that the software works.",
    entry: "Graduate entry, with large hiring volume in Indian services companies — and a common route in for non-CS graduates.",
    whatTheyDo: [
      "Writes code that tests other code: automation frameworks, integration suites, load tests, CI gates. Designs how a system should be verified, not just whether one feature works today.",
      "Owns the trustworthiness of the suite itself — a green build people believe is the product, and one flaky test spends that trust faster than fifty good ones earn it.",
    ],
    typicalWeek: [
      "Extend an automation framework so the next hundred tests are cheap to write.",
      "Investigate a flaky test that fails one run in twenty, and find the race underneath it.",
      "Add coverage for a bug that reached production, so it cannot again.",
      "Build a load test for a release and read what it says honestly.",
      "Push back on a feature that cannot be tested as designed, before it ships that way.",
    ],
    whatItIsNot: [
      {
        line: "Not manual QA. An SDET writes production-quality code; a QA analyst may not code at all. They are different careers with different ceilings, and job adverts blur them constantly.",
      },
      {
        line: "Not a stepping stone to 'real' engineering. It is engineering, with a different product — and treating it as a waiting room is how people stay mediocre at both jobs.",
      },
    ],
    worksWith: [
      { who: "Feature engineers", on: "testability, which is cheapest to fix before the code exists" },
      { who: "QA analysts", on: "what should be automated and what genuinely needs a human" },
      { who: "Release management", on: "what green actually means before a release goes out" },
    ],
    skills: {
      must: [
        "One programming language properly — the java roadmap's testing weeks are exactly this bar",
        "Test frameworks and the judgement of what to mock",
        "CI/CD, because the suite lives there",
        "Debugging, especially of failures that will not reproduce on demand",
      ],
      helps: [
        "API testing",
        "Performance and load testing",
        "Containers, for tests that need a real database beside them",
      ],
      overrated: [
        "Record-and-playback tools. They demo well and decay instantly.",
        "Coverage percentage as a goal. Covering the failure paths matters; covering getters does not.",
      ],
    },
    howPeopleGetIn: [
      "From manual QA, by learning to code properly — the most common route and a well-trodden one.",
      "Campus placement, where SDET is a defined entry grade at services companies.",
      "From engineering, by preference — some people genuinely like breaking things better than building them.",
    ],
    levels: [
      { name: "SDET", whatChanges: "You write and maintain tests within an existing framework." },
      { name: "Senior SDET", whatChanges: "You design the framework and decide what verification the system needs." },
      { name: "Lead / QA architect", whatChanges: "You own the quality strategy across teams, and the release gates everyone ships through." },
    ],
    whatIsHard:
      "Flaky tests destroy trust in the whole suite, and their causes are usually environmental rather than logical — timing, ordering, shared state — which makes chasing them unglamorous and endless. If you want to build features, be honest with yourself: here you build the thing that checks the features, and the satisfaction is of a different kind.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "java-spring-boot", note: "Thirty-eight days, and the JUnit 5, Mockito and MockMvc weeks are precisely the SDET bar — plus a capstone with a concurrency test that cannot be faked." },
        { slug: "git-and-github", note: "Twelve days. The suite lives in CI, and CI lives on top of this." },
      ],
    },
  },

  {
    slug: "tech-lead",
    title: "Tech lead",
    aliases: ["Technical Lead", "Lead Engineer"],
    domain: "software",
    standfirst: "Individual contributor leadership. No direct reports, real responsibility.",
    entry: "A promotion, not a hire — almost never advertised externally at entry.",
    whatTheyDo: [
      "Owns the technical direction of one team's work: architecture, sequencing, standards and the difficult trade-offs. Still writes code, but the highest-value output is decisions and unblocked colleagues.",
      "Is the first rung of the individual-contributor leadership ladder — the one that continues into staff and principal, not the one that turns into management.",
    ],
    typicalWeek: [
      "Break a large piece of work into shippable pieces someone else can own.",
      "Review the pull requests that carry risk, and let the routine ones go.",
      "Write a design document and defend it without defending your ego.",
      "Unblock two engineers who are stuck, which outproduces anything you could have coded.",
      "Say no to something the team does not have capacity for, in writing.",
    ],
    whatItIsNot: [
      {
        line: "Not an engineering manager. A tech lead has no reports, runs no performance reviews, and is accountable for the system rather than the people. The fork between the two is the biggest unexplained decision in an engineering career.",
        compare: "engineering-leadership",
      },
      {
        line: "Not 'the best coder on the team'. Frequently the best coder is the wrong choice — the job is judgement and communication applied to other people's code.",
      },
    ],
    worksWith: [
      { who: "The team's engineers", on: "design, review and the unblocking that is most of the job" },
      { who: "The engineering manager", on: "capacity and people, from the technical side of the fence" },
      { who: "The product manager", on: "what is feasible, at what cost, and what the hidden work is" },
    ],
    skills: {
      must: [
        "Deep technical judgement, earned in the codebase this team actually has",
        "Written communication — the design doc is the unit of leadership here",
        "Breaking down work so it can be shared",
        "Code review that teaches rather than gatekeeps",
      ],
      helps: [
        "Mentoring",
        "Estimation honest enough to survive contact with reality",
        "Stakeholder management, because the PM is not the only one asking",
      ],
      overrated: [
        "Personal output. Your commits drop and that is the design, not a decline.",
      ],
    },
    howPeopleGetIn: [
      "Promotion from senior engineer — the standard and nearly the only route.",
      "Sideways from engineering management, by people who tried it and wanted the work back. A valid move, not a failure.",
    ],
    levels: [
      { name: "Tech lead", whatChanges: "You own one team's technical direction." },
      { name: "Staff engineer", whatChanges: "Scope across teams — the problems nobody owns become yours." },
      { name: "Principal", whatChanges: "Scope across the organisation. A scope change, not a skill change." },
    ],
    whatIsHard:
      "Your own output drops and it feels like doing less, because the value has moved into other people's throughput — which is harder to see and harder to feel good about. If your satisfaction comes from personally shipping, know that it shrinks here; it does not disappear, but the days you enjoy most will be the ones that look least productive on paper.",
    startHere: {
      kind: "notYet",
      note: "There is no roadmap for this — it is a promotion earned in a codebase, not a curriculum. What is teachable is the judgement half, and the technical depth that makes the judgement credible.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; trade-offs, pre-mortems and saying no with reasons", url: "/learn/thinking-under-uncertainty" },
        { label: "Java & Spring Boot — 38 days, if the depth itself still needs building", url: "/learn/java-spring-boot" },
      ],
    },
  },

  {
    slug: "engineering-manager",
    title: "Engineering manager",
    aliases: ["EM", "Development Manager"],
    domain: "software",
    standfirst: "Accountable for a team of people and what they deliver.",
    entry: "Almost always an internal promotion, and a career change rather than a level change.",
    whatTheyDo: [
      "Hires, grows and retains engineers; owns delivery and the team's health. The work is mostly conversations, planning and removing obstacles, and the coding becomes optional — then usually stops.",
      "Is the person accountable when the team misses, and the person who absorbs what is coming from above so the team can work.",
    ],
    typicalWeek: [
      "Six one-to-ones, and the preparation that makes them worth having.",
      "Planning, and the stakeholder updates that keep the team unbothered.",
      "Hiring loops and the debriefs after them.",
      "A difficult conversation about performance that you have been rehearsing for a week.",
      "Shielding the team from something upstream they will never know about.",
    ],
    whatItIsNot: [
      {
        line: "Not a promotion from tech lead — a different job with a different skill base. Many strong engineers try it and go back, and going back is a valid move, not a failure.",
        compare: "engineering-leadership",
      },
      {
        line: "Not the strongest engineer's reward. Management taken for the title or the money is the most common way people end up unhappy in engineering.",
      },
    ],
    worksWith: [
      { who: "Their team", on: "growth, feedback and whether the work is sustainable" },
      { who: "Product", on: "what gets committed to, and what the team can actually carry" },
      { who: "Other EMs and leadership", on: "calibration, hiring and the things that cannot be discussed downward" },
    ],
    skills: {
      must: [
        "Giving feedback that lands, in both directions",
        "Hiring — the highest-leverage thing a manager does",
        "Prioritisation under permanent scarcity",
        "Written communication, because half the influence is asynchronous",
      ],
      helps: [
        "Coaching",
        "Conflict handling before it becomes conflict resolution",
        "Enough technical depth to be credible without competing",
      ],
      overrated: [
        "Still coding daily. Managers who keep the critical path become the bottleneck.",
        "Being the strongest engineer. The team needs a manager, not another senior.",
      ],
    },
    howPeopleGetIn: [
      "Promotion from senior engineer or tech lead, usually after acting in the role informally first.",
      "External hire with prior management experience — common at growing companies, rare as a first management job.",
    ],
    levels: [
      { name: "EM", whatChanges: "You own one team's people and delivery." },
      { name: "Senior EM", whatChanges: "Multiple teams, or one that matters disproportionately." },
      { name: "Director", whatChanges: "Managers report to you; the work becomes organisational design." },
      { name: "VP Engineering", whatChanges: "The engineering organisation itself is the product." },
    ],
    whatIsHard:
      "The feedback loop is months long instead of hours. You cannot tell whether today was good, the hardest parts of the job are the ones you cannot discuss with anyone on the team, and your calendar stops being yours. If you need to see the result of your work the same day, this job will starve you of exactly that.",
    startHere: {
      kind: "notYet",
      note: "No management roadmap — most of it is learned in the seat, and the industry's written material varies wildly. The teachable part is the judgement and the writing.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; most management failures are decision failures under noise", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "solutions-architect",
    title: "Solutions architect",
    aliases: ["Enterprise Architect", "Cloud Architect"],
    domain: "software",
    standfirst: "Designs systems for someone else's constraints, usually a customer's.",
    entry: "Senior entry — from engineering, consulting or pre-sales. Strong demand in GCCs, consultancies and cloud vendors.",
    whatTheyDo: [
      "Translates a business problem into a technical design, then defends it to people with budgets. The job is constraint negotiation — budget, timeline, existing systems, politics — and the architecture diagram is the output, not the work.",
      "Often customer-facing, sitting between engineering, sales and the client's own technical team, and trusted by each side roughly in proportion to honesty with the other.",
    ],
    typicalWeek: [
      "Run a discovery session with a customer's technical team and hear what they did not put in the brief.",
      "Produce an architecture and a cost estimate that survive being challenged together.",
      "Defend a design choice to someone who wanted a different vendor.",
      "Build a proof of concept for the part everyone is nervous about.",
      "Hand a design to the team who will build it, with the reasoning attached.",
    ],
    whatItIsNot: [
      {
        line: "Not a senior engineer with a diagram tool. The design is shaped by constraints that are organisational as much as technical, and negotiating those is the actual skill.",
      },
      {
        line: "Not a solutions consultant, though the titles blur. The consultant works deals before the sale; the architect designs what gets built after — in many companies the same person does both, which is how the confusion started.",
        compare: "gtm-roles",
      },
    ],
    worksWith: [
      { who: "Customer engineering teams", on: "the real constraints, which are never all in the brief" },
      { who: "Sales", on: "what can honestly be promised" },
      { who: "Delivery teams", on: "living with the design after you have moved to the next one" },
    ],
    skills: {
      must: [
        "Broad systems knowledge — breadth is the job; depth is what you borrow",
        "One cloud platform deeply and its cost model honestly",
        "Communicating with non-engineers without condescension",
        "Cost modelling, because every design is a budget in disguise",
      ],
      helps: [
        "Security and compliance literacy",
        "Migration patterns — most real work is moving something, not greenfield",
        "Presenting to a hostile room",
      ],
      overrated: [
        "Deep expertise in everything. Nobody has it; the skill is knowing what you do not know and who does.",
      ],
    },
    howPeopleGetIn: [
      "From senior engineering, by the person who kept being pulled into customer calls.",
      "From consulting, where the constraint-negotiation half is already formed.",
      "From pre-sales, adding the depth that makes designs buildable.",
    ],
    levels: [
      { name: "Architect", whatChanges: "You design within a practice's patterns." },
      { name: "Senior", whatChanges: "You own the design for engagements that matter, and your estimate is the estimate." },
      { name: "Principal / Distinguished", whatChanges: "You set the patterns, and you are in the room for the largest deals." },
    ],
    whatIsHard:
      "You design things other people build, so you live with the consequences of decisions you cannot personally control — and you hear about them later, secondhand, when the context has been lost. Add travel, meetings, and being questioned by people with more authority than technical knowledge, and the job suits a particular temperament: if any of those three grates daily, it will not stop grating.",
    startHere: {
      kind: "notYet",
      note: "No architecture roadmap yet — the breadth is accumulated, not coursed. The two below are the foundations the breadth stands on.",
      readInstead: [
        { label: "Java & Spring Boot — 38 days; you cannot negotiate constraints on systems you have never built", url: "/learn/java-spring-boot" },
        { label: "Linux command line — 15 days", url: "/learn/linux-command-line" },
      ],
    },
  },

  {
    slug: "developer-advocate",
    title: "Developer advocate",
    aliases: ["DevRel", "Developer Relations Engineer", "Technical Evangelist"],
    domain: "software",
    standfirst: "Half engineering, half marketing — and almost nobody knows it exists.",
    entry: "Mid-level entry, from engineering with visible writing or speaking. Small but growing in Indian SaaS and developer tools.",
    whatTheyDo: [
      "Helps developers succeed with a product, and carries what they learn back to the product team. Writes documentation and demos, speaks at events, answers questions in public, and argues internally for the changes users need.",
      "Credibility depends on actually building things — advocates who stop building stop being listened to, on both sides of the wall.",
    ],
    typicalWeek: [
      "Build a demo application and write it up honestly, including the part that was annoying.",
      "Answer questions in a community forum, some of them for the fortieth time, kindly.",
      "Record a talk or a walkthrough.",
      "File issues on behalf of frustrated users, with reproductions attached.",
      "Review documentation an engineer wrote for other engineers, and translate it.",
    ],
    whatItIsNot: [
      {
        line: "Not sales, and not marketing with a keyboard. The audience detects either instantly, and the role's entire value is that it is neither.",
      },
      {
        line: "Not a landing place for people who could not get an engineering role. The engineering has to be real — the demos are public, and so are the mistakes.",
      },
    ],
    worksWith: [
      { who: "The developer community", on: "getting unstuck, in public" },
      { who: "Product and engineering", on: "what users actually hit, with evidence" },
      { who: "Marketing", on: "saying true things in places developers will believe them" },
    ],
    skills: {
      must: [
        "Real engineering ability — it is the credential everything else stands on",
        "Writing, constantly and in public",
        "Public speaking, or the willingness to become bearable at it",
        "Empathy for beginners, unfaked",
      ],
      helps: [
        "Video production",
        "Community management",
        "Teaching experience of any kind",
      ],
      overrated: [
        "Follower counts. Reach without credibility converts nobody who matters.",
      ],
    },
    howPeopleGetIn: [
      "From engineering, with writing or speaking already visible — the blog and the meetup talk are the CV.",
      "From technical writing, adding the building half.",
      "From teaching, which transfers better than almost anything else.",
    ],
    levels: [
      { name: "Advocate", whatChanges: "You produce content and answer the community." },
      { name: "Senior", whatChanges: "You shape what the programme covers, and product listens when you escalate." },
      { name: "Head of DevRel", whatChanges: "You own the function, its measurement and its defence at budget time." },
    ],
    whatIsHard:
      "Impact is genuinely difficult to measure, so the role is often first to be cut when budgets tighten — and the work is public, so your mistakes are visible to strangers indefinitely. If being visible online is unpleasant for you, this is the wrong job in a way that no amount of engineering skill compensates for.",
    startHere: {
      kind: "notYet",
      note: "No DevRel roadmap — the route in is engineering plus public writing, and both halves are buildable today.",
      readInstead: [
        { label: "Git & GitHub — 12 days; the demos, the issues and the reproductions all live here", url: "/learn/git-and-github" },
        { label: "Java & Spring Boot — 38 days, if the engineering half still needs its foundation", url: "/learn/java-spring-boot" },
      ],
    },
  },
];

export default roles;
