import type { Role } from "./types";

const roles: Role[] = [
  {
    slug: "associate-software-engineer",
    title: "Associate software engineer",
    domain: "software",
    standfirst: "The defined first level of an engineering career — not a holding pen, and not 'junior forever'.",
    entry: "Graduate entry. The standard way into engineering at service majors, GCCs and product firms alike.",
    whatTheyDo: [
      "Takes a well-specified piece of work and finishes it: writes the code, writes the tests, gets it reviewed, and ships it without the reviewer having to rewrite it.",
      "Spends much of the first year reading code rather than writing it, which is the part nobody warns graduates about and the part that actually determines how fast you get good.",
      "Is expected to ask. The failure mode at this level is silence — a day lost to something a colleague would have unblocked in five minutes.",
    ],
    typicalWeek: [
      "Pick up a ticket, discover the description is missing a case, and go and ask rather than guessing.",
      "Read a part of the codebase you have never opened to work out where your change belongs.",
      "Get a review with fifteen comments, most about naming and tests, and learn more from it than from writing the code.",
      "Break something in staging, find it yourself, and fix it before anybody else notices.",
      "Sit in a design discussion you do not fully follow, and write down the three terms you did not know.",
    ],
    whatItIsNot: [
      {
        line: "Not an indefinite grade. It is a level with defined expectations and a defined exit; if two years pass with no change in the scope you are given, that is a signal about the employer rather than about you.",
      },
      {
        line: "Not an apprenticeship where you only watch. You own real work from early on — smaller work, fully owned.",
      },
      {
        line: "Not defined by the language. The stack on your first job matters far less than whether the team reviews code and writes tests.",
      },
    ],
    worksWith: [
      { who: "Your reviewer", on: "almost everything — this is the main channel through which you improve" },
      { who: "QA or SDETs", on: "what your change broke that you did not think of" },
      { who: "The product owner or PM", on: "what the ticket actually meant" },
    ],
    skills: {
      must: [
        "One language properly, rather than four superficially",
        "Version control beyond commit and push — branching, rebasing, and reading a diff",
        "SQL, in almost every backend job, whatever the advert says",
        "Writing a test that would have caught your own bug",
        "Asking a question with enough context that somebody can answer it in one reply",
      ],
      helps: [
        "The command line, which quietly determines how fast everything else is",
        "Reading a stack trace properly instead of pasting it somewhere",
        "Knowing what your framework is doing underneath, at least in outline",
      ],
      overrated: [
        "Competitive programming rating, once you are past the interview. It correlates with getting hired and barely at all with being useful in the first year.",
        "Framework collecting. Depth in one beats a CV listing six.",
        "Certifications, in software specifically. They move the needle much less here than in cloud or data.",
      ],
    },
    howPeopleGetIn: [
      "Campus placement, which is the highest-volume route in India by a wide margin.",
      "Off-campus applications backed by a portfolio — two or three finished, deployed projects with readable READMEs beat a long list of unfinished ones.",
      "Internship conversion, which is the highest-probability route of all if you can get the internship.",
      "Service company first, product company later. Common, unglamorous, and it works.",
    ],
    levels: [
      { name: "Associate / SDE-1", whatChanges: "You finish well-specified work reliably." },
      { name: "Software engineer / SDE-2", whatChanges: "You own a feature end to end, including deciding how it should work." },
      { name: "Senior", whatChanges: "You own outcomes rather than tasks, and you are trusted with the ambiguous problems." },
      { name: "Staff and beyond", whatChanges: "A scope change rather than a skill change — impact across teams, not deeper code." },
    ],
    whatIsHard:
      "The first year is mostly the feeling of being slow at something everyone else finds easy, and the honest answer is that you are, and that it passes. The other difficulty is that your output is publicly reviewed in a way few other jobs are, so if criticism of your work reads to you as criticism of you, engineering will be harder than it needs to be. It gets much better once you separate the two.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "java-spring-boot", note: "Thirty-eight days to a deployed backend — the highest-volume fresher hiring stack in India." },
        { slug: "git-and-github", note: "Twelve days, and the java roadmap assumes it from day one. Start here if you have never branched or rebased." },
        { slug: "linux-command-line", note: "Fifteen days. Everything you deploy will run on it." },
      ],
    },
  },

  {
    slug: "backend-engineer",
    title: "Backend engineer",
    domain: "software",
    standfirst: "Builds the part that stores things, decides things, and has to still be correct when two requests arrive at once.",
    entry: "Graduate entry, and the most common specialisation for engineers in India.",
    whatTheyDo: [
      "Designs and builds the services behind an application: the data model, the API, the rules, and the behaviour under load and failure.",
      "Spends a surprising share of the time on data — schema design, queries, transactions, and the moment a query that was instant at ten thousand rows is not at ten million.",
      "Owns correctness under concurrency, which is the thing that separates backend work from most other programming: two users doing the same thing at the same moment must not both succeed.",
    ],
    typicalWeek: [
      "Design a table and argue about whether a nullable column is expressing a real optionality or hiding a missing state.",
      "Find that an endpoint is slow because of an N+1 query that nothing in the code makes visible.",
      "Add an index, measure, and discover the planner ignored it.",
      "Write the migration, and worry more about the rollback than the change.",
      "Get paged, or read the incident review of somebody who was.",
    ],
    whatItIsNot: [
      {
        line: "Not full-stack with the frontend removed. Backend has its own depth — data modelling, transactions, failure behaviour — that a full-stack role rarely reaches.",
      },
      {
        line: "Not DevOps. You will touch deployment and containers, but running the platform is a different job with different on-call expectations.",
        compare: "infra-roles",
      },
      {
        line: "In India, 'full-stack' in a job advert often means a backend engineer who can also do frontend. Read the responsibilities, and ask what the split actually is.",
      },
    ],
    worksWith: [
      { who: "Frontend engineers", on: "the API contract, which is where most inter-team friction lives" },
      { who: "Data engineers and analysts", on: "what your service writes and whether it can be analysed downstream" },
      { who: "SRE or platform", on: "how your service behaves when something it depends on is unavailable" },
    ],
    skills: {
      must: [
        "One backend language and its main framework, deeply",
        "SQL and relational modelling — keys, constraints, transactions, indexes",
        "HTTP and REST semantics: verbs, status codes, idempotency",
        "Testing: unit, and enough integration to prove the wiring works",
        "Reasoning about concurrency, at minimum the read-then-write race",
      ],
      helps: [
        "Docker and enough deployment knowledge to ship your own work",
        "Caching, and knowing when it is the wrong answer",
        "Message queues and the idea that some work should not happen in the request",
      ],
      overrated: [
        "Microservices, for a first job. Almost every product should start as one service, and the interesting problems are the same.",
        "NoSQL as a default. Most applications want a relational database and regret not using one.",
        "Kubernetes for a backend developer specifically. Useful to understand, rarely yours to own.",
      ],
    },
    howPeopleGetIn: [
      "Directly from a graduate engineering role, by specialising after the first year.",
      "By building and deploying something that a stranger can run — the deployment is the part most portfolios skip and the part that most demonstrates the job.",
      "From QA or support engineering, both of which give unusually good instincts for how systems fail.",
      "Service company to product company, after two or three years, which is the standard Indian trajectory.",
    ],
    levels: [
      { name: "Associate", whatChanges: "You implement within an existing design." },
      { name: "Engineer", whatChanges: "You design the service or the schema for a feature." },
      { name: "Senior", whatChanges: "You own the failure modes, the migrations and the trade-offs, and you are asked before things are decided." },
      { name: "Staff / Architect", whatChanges: "Scope across systems and teams. Less code, more consequence." },
    ],
    whatIsHard:
      "The mistakes are durable. A frontend bug is visible and reversible; a schema mistake or a lost write is neither, and some of it is unrecoverable. You are also on the receiving end of ambiguity from every direction — the requirements are incomplete, the third-party API is down, and the data has values the spec said were impossible. If you need problems to be well-defined before you start, backend work will be uncomfortable.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "java-spring-boot", note: "Thirty-eight days: modern Java, SQL, Spring Boot 3, JPA, security and testing, ending in a deployed service with a concurrency requirement that cannot be faked." },
        { slug: "linux-command-line", note: "Fifteen days, and it makes the deployment half of the capstone much less painful." },
      ],
    },
  },
];

export default roles;
