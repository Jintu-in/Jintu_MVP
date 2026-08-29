import type { Role } from "./types";

/**
 * The last two from the expanded taxonomy: the second healthcare entry, and
 * the one page that is not a job.
 *
 * Founder is included because people plan for it and deserve an honest page
 * — and it is written under rule 4's shadow deliberately: no success rates
 * we cannot evidence, no romance, and the "not for you if" is stated as a
 * constraint rather than a character judgement.
 */
const roles: Role[] = [
  {
    slug: "clinical-research-coordinator",
    title: "Clinical research coordinator",
    aliases: ["CRC", "Clinical Research Associate", "CRA"],
    domain: "health",
    standfirst: "Runs a clinical trial at the site where it happens.",
    entry: "Graduate entry — growing in India as trial work expands, and a real non-clinical door into healthcare alongside medical coding.",
    whatTheyDo: [
      "Manages the day-to-day conduct of a trial: screening and consenting participants, following the protocol exactly, recording data, and keeping the documentation audit-ready.",
      "A CRA monitors sites on the sponsor's behalf; a CRC runs one. The advert may use either title for either job, so ask which side of that line the seat is on.",
    ],
    typicalWeek: [
      "Screen and consent participants against strict criteria.",
      "Run scheduled visits exactly as the protocol specifies.",
      "Enter data and resolve queries from the sponsor.",
      "Prepare documentation for a monitoring visit.",
      "Report a deviation or adverse event within the required window.",
    ],
    whatItIsNot: [
      {
        line: "Not a clinical care role and not a laboratory role. It is regulated administration and coordination around research on people — the work around healthcare, not in it, the same side of the line as medical coding.",
      },
      {
        line: "Not paperwork as an afterthought. The documentation is the product: in a trial, what was not recorded did not happen, and an auditor will read it that way.",
      },
    ],
    worksWith: [
      { who: "Investigators", on: "the protocol, and the deviations that must be reported rather than smoothed" },
      { who: "Participants", on: "consent, visits and the duty of care around both" },
      { who: "Sponsors and CROs", on: "data queries and monitoring visits" },
    ],
    skills: {
      must: [
        "Protocol adherence — exactly, not approximately",
        "Documentation discipline at audit standard",
        "Regulatory literacy: GCP and the local requirements",
        "Communication with participants who are anxious, unwell or both",
      ],
      helps: [
        "A life-sciences background",
        "Data management systems",
        "Local regulatory knowledge",
      ],
      overrated: [
        "A medical degree. The role is coordination, not care.",
        "Laboratory experience.",
      ],
    },
    howPeopleGetIn: [
      "From a life-sciences degree — the same pool medical coding draws from.",
      "From nursing or allied health, moving from care to research.",
      "From a data or administrative role in healthcare, adding the regulatory layer.",
    ],
    levels: [
      { name: "CRC", whatChanges: "You run visits and documentation under supervision." },
      { name: "Senior CRC", whatChanges: "The site's conduct is yours, and the monitor deals with you." },
      { name: "Lead coordinator", whatChanges: "Multiple studies, and the coordinators running them." },
      { name: "CRA / clinical project manager", whatChanges: "The move to the sponsor side, or up into managing the trial itself." },
    ],
    whatIsHard:
      "The documentation standard is unforgiving, and an error is a regulatory matter rather than an inconvenience — the pressure is precision sustained indefinitely, not intensity in bursts. Strict procedure and paperwork are most of the job by design; if they frustrate you, that frustration will not fade with seniority, because the seniority is more of them.",
    startHere: {
      kind: "notYet",
      note: "A clinical research roadmap is on the build list — ICH-GCP and the regulatory core are genuinely free-sourced, and requesting it moves it up. Until then, the adjacent roadmap below shares this role's talent pool and its documentation discipline.",
      readInstead: [
        { label: "Medical coding — 40 days; the adjacent non-clinical healthcare route, built entirely on free government sources", url: "/learn/medical-coding" },
      ],
    },
  },

  {
    slug: "founder",
    title: "Founder",
    aliases: ["Co-founder", "Entrepreneur"],
    domain: "other",
    standfirst: "Not a job. Included because people plan for it and deserve an honest page.",
    entry: "Not an entry level at all — people arrive from everywhere, and the honest page is the point.",
    whatTheyDo: [
      "Does whatever the company currently needs and nobody else will do, which changes every few months. Early on that is finding customers and building something they will pay for; later it is hiring and deciding.",
      "The defining condition is that every gap is yours: the work you are worst at does not go away, because there is nobody else to be better at it yet.",
    ],
    typicalWeek: [
      "Talk to potential customers who mostly say no.",
      "Build or fix whatever is blocking the next customer.",
      "Manage money against a runway you can count in months.",
      "Make a decision with far less information than you want.",
      "Do the work you are worst at, because nobody else is there.",
    ],
    whatItIsNot: [
      {
        line: "Not a title you award yourself, and not a strategy for avoiding employment. It is a route with a low success rate and real personal cost, and no roadmap changes either fact.",
      },
      {
        line: "Not gated on the myths: an idea nobody has had, funding at the start, or a technical co-founder in every case. The common ingredient in the honest accounts is deep exposure to a real problem, plus persistence.",
      },
    ],
    worksWith: [
      { who: "Customers", on: "whether the problem is real enough to pay for" },
      { who: "Co-founders", on: "everything, under stress, for years — choose accordingly" },
      { who: "Early employees and eventually investors", on: "a plan honest enough to survive their scrutiny" },
    ],
    skills: {
      must: [
        "Selling before there is a product",
        "Deciding under uncertainty, repeatedly, without the information you want",
        "Persistence through a default state of rejection",
        "Financial discipline — the runway is the one number that does not negotiate",
      ],
      helps: [
        "Building the thing yourself",
        "Writing",
        "Recruiting",
        "Domain depth in the problem",
      ],
      overrated: [
        "An idea nobody has had. Execution and distribution decide; novel ideas mostly select for absent demand.",
        "Funding at the start. Money follows evidence; seeking it first inverts the order.",
      ],
    },
    howPeopleGetIn: [
      "From deep experience of the problem — the most common thread in the ventures that work.",
      "From a first job that exposes the problem up close.",
      "Alongside employment, until the thing can support you — unglamorous, and it removes the deadline that kills most attempts.",
    ],
    levels: [
      { name: "No ladder", whatChanges: "The company grows or it does not. Every stage replaces your job description with a new one." },
    ],
    whatIsHard:
      "Most attempts fail, the failure is public and personal, and no roadmap changes that — anyone selling certainty about this is selling. If income stability matters to your circumstances right now, that is a constraint, not a weakness, and it can change later; the version of this that respects it is building alongside employment until the evidence, not the enthusiasm, says jump.",
    startHere: {
      kind: "roadmaps",
      picks: [
        { slug: "thinking-under-uncertainty", note: "Twenty-four days, and the closest thing to a founder curriculum we would honestly claim: base rates against the inside view, deciding under noise, and the calibration to know when the evidence says jump." },
      ],
    },
  },
];

export default roles;
