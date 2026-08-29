import type { Comparison } from "./types";

/**
 * The confusion pages.
 *
 * These answer the question people actually type, which is almost never
 * "what should I learn" and very often "what is the difference between X
 * and Y". Every row links onward to a role page where one exists, and every
 * page ends in the catalogue.
 */
const comparisons: Comparison[] = [
  {
    slug: "product-roles",
    title: "Product manager vs program manager vs TPM vs project manager vs product owner",
    domain: "product",
    standfirst: "Five titles, constantly conflated — including by people who hold them.",
    shortAnswer:
      "A product manager owns what gets built and why. A program manager owns whether several teams ship it together. A TPM is a program manager for engineering work. A project manager owns scope, timeline and budget for one defined piece of work. A product owner is a seat in a Scrum ceremony, not a career.",
    rows: [
      {
        role: "product-manager",
        label: "Product manager",
        owns: "What gets built, and why. The problem, the priority and the outcome.",
        doesNotOwn: "The schedule across teams. The people. The ceremony.",
        tell: "Asks 'should we build this at all?'",
      },
      {
        role: "program-manager",
        label: "Program manager",
        owns: "Whether several teams deliver something together. Dependencies, risk, and an honest status.",
        doesNotOwn: "What is worth building. That is the PM's call.",
        tell: "Asks 'who is blocked, and on what?'",
      },
      {
        role: "",
        label: "Technical program manager",
        owns: "The same as a PgM, for engineering work — migrations, platform changes, launches with hard technical sequencing.",
        doesNotOwn: "The product decision, and usually not the code either.",
        tell: "Can read the architecture diagram and argue with the estimate.",
      },
      {
        role: "",
        label: "Project manager",
        owns: "Scope, timeline and budget for one defined project with an end.",
        doesNotOwn: "Whether the project should exist. Ongoing product direction.",
        tell: "Has a plan with a finish date on it.",
      },
      {
        role: "",
        label: "Product owner",
        owns: "The backlog, in a Scrum team. A role in a framework.",
        doesNotOwn: "Nothing inherently — it depends entirely who is wearing it.",
        tell: "It is a hat, not a job. Ask what they do when there is no ceremony on.",
      },
    ],
    nuance: [
      "The cleanest way to separate the first two: a PM owns *what* and *why*, a PgM owns *whether it lands*. If somebody is accountable for a launch date across four teams but cannot decide to cut a feature, they are doing programme management whatever their card says. If somebody decides what is worth building but nobody expects them to chase other teams' dependencies, that is product management.",
      "Product owner is the one worth being blunt about. It is a role defined inside Scrum, and in practice it is either a product manager doing PM work with a ceremony attached, or a business analyst writing tickets. Neither is a career path in itself, and treating it as one is how people end up three years in with a title that does not translate to another company.",
      "In smaller Indian firms one person frequently does all five, and the title is assigned by whoever wrote the advert. When you are evaluating a role, ignore the header and ask two questions: what decision am I allowed to make alone, and what am I accountable for when it goes wrong? The answers separate these five faster than any definition.",
    ],
  },

  {
    slug: "analyst-roles",
    title: "Data analyst vs business analyst vs product analyst vs analytics engineer",
    domain: "data",
    standfirst: "One degree, one set of job adverts, four genuinely different jobs.",
    shortAnswer:
      "A data analyst answers questions with data that exists. A business analyst works out what the business needs and writes it down — often with no SQL at all. A product analyst is a data analyst embedded in one product, owning its metrics. An analytics engineer builds the tested, documented models the other three query.",
    rows: [
      {
        role: "data-analyst",
        label: "Data analyst",
        owns: "Answering questions. The number, and the caveats around it.",
        doesNotOwn: "The pipeline, the model, or usually the decision.",
        tell: "Lives in SQL and a spreadsheet.",
      },
      {
        role: "business-analyst",
        label: "Business analyst",
        owns: "Requirements, process and stakeholder agreement.",
        doesNotOwn: "Frequently, any data at all. Many BA roles involve no SQL.",
        tell: "Lives in documents and meetings.",
      },
      {
        role: "product-analyst",
        label: "Product analyst",
        owns: "One product's metrics, funnels, retention and experiments.",
        doesNotOwn: "What to build. That is the PM's.",
        tell: "Is the one who says the experiment was not significant.",
      },
      {
        role: "analytics-engineer",
        label: "Analytics engineer",
        owns: "The transformation layer: models, definitions, tests, documentation.",
        doesNotOwn: "The analysis itself, and not the ingestion either.",
        tell: "Writes SQL that other people's dashboards depend on.",
      },
      {
        role: "",
        label: "Data engineer",
        owns: "Getting data in and keeping it flowing. Pipelines, orchestration, reliability.",
        doesNotOwn: "What the numbers mean. Rarely does analysis.",
        tell: "Gets paged when a job fails at 3am.",
      },
      {
        role: "",
        label: "Data scientist",
        owns: "Statistical modelling and inference, sometimes production models.",
        doesNotOwn: "Reporting, in a well-staffed team. In India the title often means 'analyst with Python'.",
        tell: "Read the responsibilities, not the header.",
      },
    ],
    nuance: [
      "The business analyst is the odd one out and the source of most disappointment. Candidates apply expecting to work with data and find the job is interviews, process maps and requirements. That is a good job — but it is a different one, and the overlap in title costs people years. If the advert does not mention SQL, assume there is none.",
      "Analytics engineer is the role with the highest demand and the lowest awareness, which makes it unusually reachable. It is not a promotion from analyst: it is a sideways move into building the layer rather than using it, and plenty of excellent analysts dislike it. The tell for whether you would enjoy it is whether you have ever been annoyed enough by an inconsistent definition to want to own it permanently.",
      "Between data engineer and analytics engineer, the split is roughly: getting the data to land is engineering, making it mean something is analytics engineering. Companies without either end up with analysts quietly doing both, badly, in a folder of untested queries — which is exactly how the analytics engineering role came to exist.",
    ],
  },

  {
    slug: "infra-roles",
    title: "DevOps vs SRE vs platform engineer",
    domain: "software",
    standfirst: "Three titles drifting fast, and most of the material explaining them is vendor marketing.",
    shortAnswer:
      "DevOps started as a practice and became a job title, increasingly a legacy one. SRE is Google-originated and reliability-focused, usually with a higher coding bar. Platform engineering is the current evolution: building internal tooling that other engineers use.",
    rows: [
      {
        role: "",
        label: "DevOps engineer",
        owns: "CI/CD, infrastructure automation, deployment. In practice, whatever the company means by it.",
        doesNotOwn: "Nothing consistently — the title's scope varies more than any other in this list.",
        tell: "Ask what they actually did last week. The answers vary enormously.",
      },
      {
        role: "",
        label: "Site reliability engineer",
        owns: "Reliability as an engineering problem: SLOs, error budgets, incident response, and automating away toil.",
        doesNotOwn: "Shipping product features.",
        tell: "Talks in error budgets, and usually codes at the level of a backend engineer.",
      },
      {
        role: "",
        label: "Platform engineer",
        owns: "Internal tooling as a product, with other engineers as the users.",
        doesNotOwn: "Being the ticket queue for deployments. If it is that, it is not platform engineering.",
        tell: "Has users, a roadmap, and cares whether the paved path is adopted.",
      },
    ],
    nuance: [
      "The honest summary is that DevOps as a job title is fading. It was coined to describe a way of working — developers and operations sharing responsibility — and then hired for as a person, which was always slightly contradictory. Many roles advertised as DevOps in India today are operations roles with automation attached, and some are excellent; the point is that the title tells you very little, so ask.",
      "SRE is the most clearly defined of the three because Google wrote it down. The defining ideas are that reliability is a feature with a target rather than an aspiration, that an error budget makes the trade-off explicit, and that manual toil is a bug. The coding bar is usually the highest of the three, which surprises people moving across from operations.",
      "Platform engineering is where the field is heading, and the distinguishing test is whether internal engineers are treated as users. A platform team with a roadmap, adoption metrics and a paved path is doing platform engineering. A platform team that exists to approve deployment tickets has a new name for an old job.",
    ],
  },

  {
    slug: "engineering-leadership",
    title: "Tech lead vs engineering manager vs architect",
    domain: "software",
    standfirst: "The individual-contributor versus management fork, which nobody explains early enough.",
    shortAnswer:
      "A tech lead leads technically and has no reports — it is individual-contributor leadership. An engineering manager owns people and delivery, and usually stops coding. An architect owns technical design across systems, generally with no reports either.",
    rows: [
      {
        role: "",
        label: "Tech lead",
        owns: "The technical direction of one team's work, and usually the hardest parts of it.",
        doesNotOwn: "Performance reviews, hiring decisions, compensation. No reports.",
        tell: "Still writes code, and is the one the team asks before deciding.",
      },
      {
        role: "",
        label: "Engineering manager",
        owns: "The people and the delivery — growth, performance, hiring, and whether the team ships.",
        doesNotOwn: "The code, mostly. Managers who keep the critical path become the bottleneck.",
        tell: "Has one-to-ones in the calendar and a hiring loop to run.",
      },
      {
        role: "",
        label: "Architect",
        owns: "Design across systems and teams; the standards and the significant technical decisions.",
        doesNotOwn: "Day-to-day delivery, and usually no reports.",
        tell: "Is consulted before a system is built rather than after it breaks.",
      },
    ],
    nuance: [
      "The most useful thing to know early is that tech lead is not a step toward management. It is the first rung of the individual-contributor leadership ladder, and it continues into staff and principal engineering — which are scope changes rather than skill changes. Plenty of people move to management, discover they miss the work, and find the way back harder than the way in.",
      "Management is a career change, not a promotion, and the parts that make it hard are not technical. It is hiring, giving feedback that lands, and being accountable for outcomes you produce through other people. The best engineer on a team is frequently a poor choice for it, and taking it for the money or the title is the most common way people end up unhappy in engineering.",
      "Architect is the least consistent of the three. In some organisations it is a senior technical role with real influence; in others it is a title for people who make diagrams and are not present when the trade-offs are made. The question to ask is whether the architect is accountable for the systems working, or only for the design document.",
    ],
  },

  {
    slug: "gtm-roles",
    title: "SDR vs account executive vs account manager vs customer success",
    domain: "gtm",
    standfirst: "The whole go-to-market ladder, which is invisible from outside the industry.",
    shortAnswer:
      "An SDR finds and qualifies prospects and books the meeting. An account executive closes the deal. An account manager grows an existing account. A customer success manager keeps customers getting value — and is not support.",
    rows: [
      {
        role: "sdr",
        label: "SDR / BDR",
        owns: "Prospecting and qualification. Meetings booked that actually progress.",
        doesNotOwn: "The deal, the pricing, the close.",
        tell: "The standard entry point, and one with no degree requirement.",
      },
      {
        role: "",
        label: "Account executive",
        owns: "The deal end to end: discovery, demo, negotiation, close. Carries a quota.",
        doesNotOwn: "The account after it closes, in most companies.",
        tell: "The usual promotion from SDR.",
      },
      {
        role: "",
        label: "Account manager",
        owns: "Growing and renewing existing accounts.",
        doesNotOwn: "Net-new logos.",
        tell: "A different skill from closing — relationships over months, not weeks.",
      },
      {
        role: "",
        label: "Customer success manager",
        owns: "Whether customers get value, and therefore retention and expansion.",
        doesNotOwn: "The support queue. CSM is proactive; support is reactive.",
        tell: "Is measured on renewal, not on tickets closed.",
      },
      {
        role: "solutions-consultant",
        label: "Solutions consultant",
        owns: "The technical side of the sale — demos, proofs of concept, the honest 'no, it does not do that'.",
        doesNotOwn: "The quota or the negotiation.",
        tell: "Paired with an AE, and usually from an engineering background.",
      },
    ],
    nuance: [
      "The ladder is genuinely a ladder, and SDR to AE is the standard progression rather than a hope. What is less obvious is that the sideways moves are just as normal and not failures: SDRs move into RevOps, marketing and customer success routinely, and each of those uses the same understanding of the funnel from a different seat.",
      "Customer success being mistaken for support is the most expensive confusion here, for the person taking the job. Support is reactive and measured on tickets; CS is proactive and measured on renewal and expansion. If you take a CSM role and find you are running a queue, the company has hired a support person and given them a growth title — which is common enough to be worth asking about directly in the interview.",
      "For anyone technical who does not want to write code all day, solutions consulting is the least-known good option on this list. It pays well, it uses the technical depth, and the credibility comes precisely from being the person allowed to say the product cannot do something.",
    ],
  },

  {
    slug: "design-roles",
    title: "UX vs UI vs product designer vs UX researcher",
    domain: "design",
    standfirst: "Conflated constantly, and especially in Indian job adverts, where one advert often wants all four.",
    shortAnswer:
      "UX design is flows, structure and behaviour. UI design is visual craft. Product designer covers both plus product thinking, and is the dominant title now. UX research is a separate discipline, not a junior designer.",
    rows: [
      {
        role: "",
        label: "UX designer",
        owns: "Information architecture, flows, interaction — how it works.",
        doesNotOwn: "The visual system, in a team large enough to split them.",
        tell: "Argues about the order of steps, not the shade of the button.",
      },
      {
        role: "",
        label: "UI designer",
        owns: "Visual craft: type, colour, spacing, components, the design system.",
        doesNotOwn: "The flow, in a split team.",
        tell: "Owns the component library and cares about the eight-pixel grid.",
      },
      {
        role: "",
        label: "Product designer",
        owns: "Both of the above, plus the product judgement about what is worth designing.",
        doesNotOwn: "The roadmap, though they influence it heavily.",
        tell: "The dominant title, and the one most job adverts now mean.",
      },
      {
        role: "",
        label: "UX researcher",
        owns: "Finding out what users actually do and need, rigorously.",
        doesNotOwn: "The design itself.",
        tell: "A distinct discipline with its own methods — not a step on the way to designing.",
      },
    ],
    nuance: [
      "In most Indian job adverts 'UI/UX designer' means one person doing all of it, usually with the visual half emphasised because it is the half that is visible in a portfolio. That is a real job and often a good first one, but be clear-eyed: the flow work is the part that compounds into product design, and the visual work is the part that is easiest to hire around later.",
      "Researcher being treated as a junior designer is the damaging mistake here. Research is a methods discipline — recruiting, study design, avoiding leading questions, analysing qualitative data honestly — and someone good at it is not a designer who has not learned Figma. Teams that conflate them get research that confirms whatever the designer already believed.",
      "We have no design roadmap yet, and we would rather say so than pad this page. If you want one, the request box on the catalogue is the signal we build from.",
    ],
  },
];

export default comparisons;
