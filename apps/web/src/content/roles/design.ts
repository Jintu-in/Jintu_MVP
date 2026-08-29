import type { Role } from "./types";

/**
 * The design roles, from the tail of the owner's expanded taxonomy. The
 * design-roles comparison predates these pages and its rows now link here.
 *
 * None of these has a roadmap, and every page says so rather than padding a
 * route — a design curriculum is a real gap, and honest pages are also the
 * demand signal for filling it.
 */
const roles: Role[] = [
  {
    slug: "ux-designer",
    title: "UX designer",
    aliases: ["User Experience Designer", "Interaction Designer"],
    domain: "design",
    standfirst: "Structure, flow and behaviour. What happens, in what order, and why.",
    entry: "Graduate entry — widely advertised, frequently conflated with UI. Read the responsibilities, not the title.",
    whatTheyDo: [
      "Works out how a product should behave before deciding how it should look. Maps flows, resolves the states nobody thought about, tests whether people can actually complete the task, and argues for the simpler version.",
      "The output is behaviour: what happens, in what order, and what happens when it goes wrong.",
    ],
    typicalWeek: [
      "Map a flow including the error and empty states the brief forgot.",
      "Watch five people attempt a task and say nothing while they struggle.",
      "Redraw the flow after what you watched, not what you hoped.",
      "Argue that a requested feature makes the flow worse.",
      "Hand over specifications precise enough to build from.",
    ],
    whatItIsNot: [
      {
        line: "Not UI design, though Indian job advertisements routinely ask for both under one title. UX decides behaviour; UI decides appearance — and being good at one says little about the other.",
        compare: "design-roles",
      },
      {
        line: "Not drawing. The tool and the visuals are the smallest part; the work is structure, testing, and the argument for less.",
      },
    ],
    worksWith: [
      { who: "Product managers", on: "the problem, before either of you has a solution attached" },
      { who: "Engineers", on: "what the flow costs to build, and what the states really are" },
      { who: "Researchers", on: "what users actually did, as opposed to what they said" },
    ],
    skills: {
      must: [
        "Flow and information architecture",
        "Usability testing — running it without leading, and changing the design afterwards",
        "Articulating rationale so a decision can be examined",
        "Handling critique without defending the work like a limb",
      ],
      helps: [
        "Prototyping",
        "Front-end literacy, enough to know what is cheap and what is not",
        "Accessibility",
        "Visual craft, as a neighbour rather than the core",
      ],
      overrated: [
        "Drawing ability.",
        "A design degree. The portfolio of reasoned work is the credential.",
        "Mastery of a specific tool — the tools rotate; the thinking does not.",
      ],
    },
    howPeopleGetIn: [
      "A portfolio of real redesigns with the reasoning shown — the reasoning is what gets read.",
      "From front-end engineering, crossing from building flows to deciding them.",
      "From research, adding the design half to the evidence half.",
      "From a bootcamp, where the project work was genuine rather than templated.",
    ],
    levels: [
      { name: "Junior", whatChanges: "You design inside a pattern library and a senior's review." },
      { name: "UX designer", whatChanges: "Flows are yours, including the states and the testing." },
      { name: "Senior", whatChanges: "You own problems rather than screens, and your no carries." },
      { name: "Lead / product designer", whatChanges: "The fork: people, or the wider product-design remit." },
    ],
    whatIsHard:
      "Your best work is invisible — a flow nobody notices is a flow that worked — and the version that ships is usually the one that survived a compromise you lost. If you want your work to be admired, good UX will disappoint you: it is only visible when it fails.",
    startHere: {
      kind: "notYet",
      note: "No design roadmap yet — it is a real gap, and requesting it is the signal we build from. Start with the comparison so you are aiming at the right one of these four jobs; the testing half of UX is also the discipline of not fooling yourself, which we do cover.",
      readInstead: [
        { label: "UX vs UI vs product designer vs UX researcher — aim before you train", url: "/roles/compare/design-roles" },
        { label: "Thinking clearly under uncertainty — 24 days; usability testing honestly is exactly this", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "ui-designer",
    title: "UI designer",
    aliases: ["User Interface Designer", "Visual Designer"],
    domain: "design",
    standfirst: "Visual craft — type, colour, spacing, hierarchy, the design system.",
    entry: "Graduate entry — though the pure UI title is being absorbed into product designer.",
    whatTheyDo: [
      "Turns structure into something legible and coherent: owns typography, colour, spacing and states, builds and maintains the component library, and makes sure the twentieth screen still looks like the first.",
      "The unit of the work is the system, not the screen — a beautiful screen that fragments the system is a defect.",
    ],
    typicalWeek: [
      "Design screens and every state they can be in.",
      "Extend the design system without fragmenting it.",
      "Check contrast and touch targets against accessibility standards.",
      "Review what engineering built against what was designed.",
      "Rework a screen after a critique, better rather than just different.",
    ],
    whatItIsNot: [
      {
        line: "Not graphic design and not UX. Graphic design communicates in a fixed frame; UI is a system that has to hold up across hundreds of screens and every state of each.",
        compare: "design-roles",
      },
      {
        line: "Not illustration. Some UI designers illustrate; the job is type, colour, spacing and consistency, and it is entirely possible to be excellent at it without drawing anything.",
      },
    ],
    worksWith: [
      { who: "UX designers", on: "the structure the visuals sit on" },
      { who: "Front-end engineers", on: "the build matching the design, and the tokens both sides read" },
      { who: "Brand", on: "the boundary between brand expression and interface clarity" },
    ],
    skills: {
      must: [
        "Typography",
        "Colour and contrast, including the accessibility arithmetic",
        "Systematic thinking — components, tokens, and the discipline of reuse",
        "Precision, sustained across hundreds of small decisions",
      ],
      helps: [
        "Motion",
        "Front-end literacy",
        "Accessibility standards in detail",
        "Illustration, as an extra rather than a requirement",
      ],
      overrated: [
        "Illustration ability.",
        "A fine arts degree.",
      ],
    },
    howPeopleGetIn: [
      "A portfolio, judged on system thinking as much as surface polish.",
      "From graphic design, learning to trade the fixed frame for the living system.",
      "From front-end engineering, crossing from building the components to designing them.",
    ],
    levels: [
      { name: "Junior", whatChanges: "You produce screens inside the system." },
      { name: "UI designer", whatChanges: "Parts of the system are yours to extend." },
      { name: "Senior", whatChanges: "The system's coherence is your responsibility." },
      { name: "Design system lead / product designer", whatChanges: "The system as a product, or the wider remit." },
    ],
    whatIsHard:
      "Consistency across a growing system is unglamorous and constant, and everyone has an opinion about colour — including people who will never open the file. Most of the job is small decisions repeated carefully; if detail work bores you, that is not a flaw to overcome here but a signal to aim at UX or product design instead.",
    startHere: {
      kind: "notYet",
      note: "No design roadmap yet — request it. Start with the comparison to confirm this is the one of the four you actually want; the pure UI title is being absorbed into product designer, which matters for where you aim.",
      readInstead: [
        { label: "UX vs UI vs product designer vs UX researcher", url: "/roles/compare/design-roles" },
      ],
    },
  },

  {
    slug: "product-designer",
    title: "Product designer",
    aliases: ["UX/UI Designer"],
    domain: "design",
    standfirst: "UX plus UI plus product judgement. The dominant title now.",
    entry: "Mid-level entry — the standard title at product companies, almost never a first hire.",
    whatTheyDo: [
      "Owns a problem from understanding it through to the shipped interface. Decides what to build as much as how it should work and look, and is expected to argue about the problem rather than only execute the solution.",
      "The distinguishing third is the product judgement — without it, the title is a UX designer and a UI designer merged for budget reasons, which some adverts mean.",
    ],
    typicalWeek: [
      "Reframe a feature request as the underlying problem.",
      "Explore several structurally different approaches, not variations of one.",
      "Design the flow and the interface together.",
      "Test with users and abandon the approach you preferred.",
      "Work alongside engineers as it gets built, and adjust without ceremony.",
    ],
    whatItIsNot: [
      {
        line: "Not a UX and a UI designer stapled together, although some job advertisements mean exactly that. The distinguishing part is product judgement — arguing about the problem, not just executing the solution.",
        compare: "design-roles",
      },
      {
        line: "Not a role where the brief is handed to you. Here you write it, and the expectation of that autonomy is why it is rarely an entry-level hire.",
      },
    ],
    worksWith: [
      { who: "Product managers", on: "the problem framing, as peers who disagree productively" },
      { who: "Engineers", on: "the build, continuously rather than at handover" },
      { who: "Researchers and data", on: "the evidence that kills the preferred approach" },
    ],
    skills: {
      must: [
        "Flow and interface craft, both at working depth",
        "Problem framing — the skill that separates the title from its budget-merge homonym",
        "User research literacy",
        "Communicating rationale to a room that includes sceptics",
      ],
      helps: [
        "Prototyping",
        "Front-end literacy",
        "Data fluency",
        "Design systems",
      ],
      overrated: [
        "Being equally strong at UX and UI. Almost nobody is; the honest shape is deep in one, fluent in the other.",
        "A design degree.",
      ],
    },
    howPeopleGetIn: [
      "From UX or UI with product exposure — the standard route.",
      "From front-end engineering, for those whose design judgement grew alongside the building.",
      "Rarely directly from study — the product judgement is the part that needs a product to have happened to you.",
    ],
    levels: [
      { name: "Product designer", whatChanges: "You own problems within a team's remit." },
      { name: "Senior", whatChanges: "You own outcomes, and your problem-framing is trusted over the brief." },
      { name: "Staff", whatChanges: "Scope across teams; the hardest ambiguous problems arrive at your desk." },
      { name: "Design lead / head of design", whatChanges: "The people and the practice, not just the work." },
    ],
    whatIsHard:
      "You are accountable for outcomes while the decision is shared with a PM and an engineering lead who may both disagree with you — the influence is real and the authority is not, which is the same structural tension PMs carry, felt from the design chair. If you want a brief handed to you, this role will feel like being permanently mid-negotiation, because it is.",
    startHere: {
      kind: "notYet",
      note: "No design roadmap yet — request it. The comparison below is where to aim; the judgement half of the role overlaps heavily with what the reasoning roadmap teaches.",
      readInstead: [
        { label: "UX vs UI vs product designer vs UX researcher", url: "/roles/compare/design-roles" },
        { label: "Thinking clearly under uncertainty — 24 days; problem framing under disagreement is the daily work", url: "/learn/thinking-under-uncertainty" },
      ],
    },
  },

  {
    slug: "ux-researcher",
    title: "UX researcher",
    aliases: ["User Researcher", "Design Researcher"],
    domain: "design",
    standfirst: "A separate research discipline, not a junior designer.",
    entry: "Mid-level entry, from social science, HCI, design or data — rarely a first job under this title.",
    whatTheyDo: [
      "Designs and runs studies that answer questions the team is currently guessing at: chooses the method to fit the question, avoids leading participants, and reports findings that are frequently unwelcome.",
      "The value is delivered before the decision or not at all — research that arrives after the roadmap is set changes nothing.",
    ],
    typicalWeek: [
      "Turn a vague worry into a researchable question.",
      "Recruit participants who are actually representative, which is harder than the study.",
      "Run interviews or usability sessions without leading.",
      "Analyse across sessions rather than quoting the memorable one.",
      "Present a finding that contradicts what leadership expected.",
    ],
    whatItIsNot: [
      {
        line: "Not a step towards becoming a designer. It is a research discipline with its own methods and standards, and treating it as design's junior grade is how teams get research that confirms what the designer already believed.",
        compare: "design-roles",
      },
      {
        line: "Not the person who runs a survey when someone asks for one. Method selection is the discipline — the wrong method answers a different question with full confidence.",
      },
    ],
    worksWith: [
      { who: "Designers", on: "what the evidence says about the flow, before it ships" },
      { who: "Product managers", on: "getting the study in before the decision, which is political work" },
      { who: "Data scientists", on: "the qualitative half of a question the numbers half-answer" },
    ],
    skills: {
      must: [
        "Method selection — matching the study to the question",
        "Non-leading interviewing",
        "Qualitative analysis across sessions, resisting the vivid quote",
        "Reporting inconvenient findings intact",
      ],
      helps: [
        "Statistics",
        "Survey design, which is much harder than it looks",
        "Behavioural science literacy",
        "Facilitation",
      ],
      overrated: [
        "Design skill.",
        "A psychology PhD — useful in a minority of roles, the gate in almost none.",
      ],
    },
    howPeopleGetIn: [
      "From social science or HCI study, where the methods were the degree.",
      "From design, by the designer who kept insisting on real evidence.",
      "From data analysis, adding the qualitative half.",
    ],
    levels: [
      { name: "Researcher", whatChanges: "You run studies somebody else scoped." },
      { name: "Senior", whatChanges: "You decide what is worth studying, and your method calls are trusted." },
      { name: "Lead", whatChanges: "The research practice and its standards are yours." },
      { name: "Head of research", whatChanges: "Getting evidence into decisions is your remit at the org level." },
    ],
    whatIsHard:
      "Research that arrives after the decision changes nothing, and getting it in beforehand is a political problem more than a methodological one. Your findings will also frequently be shelved — if you need your work to be acted on to feel it mattered, this role will hurt in a specific way that method skill cannot fix.",
    startHere: {
      kind: "notYet",
      note: "No research roadmap yet — request it. The bias-and-evidence half is genuinely covered today; the interviewing and study-design half is the gap.",
      readInstead: [
        { label: "Thinking clearly under uncertainty — 24 days; selection bias, leading questions and honest analysis are its exact material", url: "/learn/thinking-under-uncertainty" },
        { label: "UX vs UI vs product designer vs UX researcher", url: "/roles/compare/design-roles" },
      ],
    },
  },
];

export default roles;
