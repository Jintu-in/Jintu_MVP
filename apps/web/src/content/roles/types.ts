/**
 * The roles layer: what a job actually is, before anybody picks a roadmap.
 *
 * Jintu sells skills; people search for roles. Someone who wants "a job in
 * tech" cannot choose between eight roadmaps because they do not yet know
 * what the jobs are — and the roles they cannot distinguish are exactly the
 * ones with the most search volume. A role page answers the question that
 * comes BEFORE the catalogue, and routes into it.
 *
 * WHY THESE ARE FILES AND NOT ROWS. Roadmaps live in the database because
 * they carry per-user progress and third-party links that need a health
 * column and a licence. Role pages carry neither: they are our own prose
 * about the world, nothing points at them, and no user state hangs off them.
 * Putting them in Postgres would buy nothing and cost a migration and a
 * hand-pasted import for every wording change — and re-importing is the
 * operation that deletes progress. So they ship with the deploy.
 *
 * The one thing that DOES cross into the database is `startHere`, which
 * names roadmap slugs. `scripts/assert-roles.mjs` checks every one against
 * docs/roadmaps/, so a renamed or deleted roadmap fails the build rather
 * than producing a role page that dead-ends.
 *
 * TWO RULES, BOTH ENFORCED BY THAT GUARD:
 *
 *   1. Every page ends in a roadmap, or in an honest "we have not built one
 *      yet" that says what to read instead. A role page that stops without
 *      routing anywhere is a blog post, and this is not a blog.
 *
 *   2. No salary numbers. They vary by city, company and year, and a figure
 *      invented to look authoritative would be the least honest thing on a
 *      site whose whole pitch is that a person checked. Cite a dated source
 *      or say nothing.
 */

/** The six catalogue categories, plus the two the catalogue has no roadmap in yet. */
export type RoleDomain =
  | "software"
  | "data"
  | "product"
  | "gtm"
  | "marketing"
  | "design"
  | "operations"
  | "health"
  | "finance"
  | "other";

export const ROLE_DOMAINS: { key: RoleDomain; label: string; blurb: string }[] = [
  { key: "software", label: "Build software", blurb: "Write and run the systems." },
  { key: "data", label: "Work with data", blurb: "Answer questions, build the pipes." },
  { key: "product", label: "Run products", blurb: "Decide what gets built, and get it shipped." },
  { key: "gtm", label: "Sell and grow", blurb: "Find customers and keep them." },
  { key: "marketing", label: "Market", blurb: "Demand, positioning and the funnel." },
  { key: "design", label: "Design", blurb: "How it works and how it looks." },
  { key: "operations", label: "Operations", blurb: "The machinery behind the org." },
  { key: "health", label: "Healthcare", blurb: "The work around clinical care." },
  { key: "finance", label: "Work in finance", blurb: "The numbers behind every decision." },
  { key: "other", label: "Starting something", blurb: "Not a career ladder — one honest page." },
];

/**
 * Where a role page sends the reader.
 *
 * `roadmaps` is the normal case. `notYet` is the honest one: a role we can
 * describe but have no curriculum for. It is deliberately not a dead end —
 * it names what to read and points at the request box, which makes the page
 * a demand signal as well as an answer.
 */
export type RoleDestination =
  | { kind: "roadmaps"; picks: { slug: string; note: string }[] }
  | { kind: "notYet"; readInstead: { label: string; url: string }[]; note: string };

export type Role = {
  slug: string;
  /** The title as it appears in a job advert. */
  title: string;
  /**
   * The other names the same job is advertised under — "SDE-1", "dbt
   * Developer", "Delivery Manager". Optional, and worth filling in: the
   * person searching almost never types the canonical title.
   */
  aliases?: string[];
  domain: RoleDomain;
  /** One line under the title. No salary, ever. */
  standfirst: string;
  /** "Graduate entry", "Mid-level entry", "Senior entry" — how people arrive. */
  entry: string;
  /** What they actually do: three or four concrete sentences, not a job spec. */
  whatTheyDo: string[];
  /** Five or six real activities. The section people come for. */
  typicalWeek: string[];
  /** What it is NOT, each optionally pointing at a comparison page. */
  whatItIsNot: { line: string; compare?: string }[];
  /** Who they work with, and on what. */
  worksWith: { who: string; on: string }[];
  skills: {
    must: string[];
    helps: string[];
    /** Named honestly: the things job adverts list that nobody actually needs. */
    overrated: string[];
  };
  /** The real entry paths, including the unglamorous ones. */
  howPeopleGetIn: string[];
  levels: { name: string; whatChanges: string }[];
  /** One honest paragraph, including who should not do this job. */
  whatIsHard: string;
  startHere: RoleDestination;
};

/**
 * A comparison page: several roles people cannot tell apart, in one table.
 *
 * These are the highest-value pages in the layer — the search intent behind
 * "product manager vs program manager" is enormous and almost every answer
 * online is a vendor blog. They also cost the least, because the roles are
 * already written.
 */
export type Comparison = {
  slug: string;
  title: string;
  domain: RoleDomain;
  standfirst: string;
  /** The one-sentence answer, before the table. */
  shortAnswer: string;
  rows: {
    /** Slug of a role page where one exists, so the table links onward. */
    role: string;
    label: string;
    owns: string;
    doesNotOwn: string;
    tell: string;
  }[];
  /** Two or three paragraphs of nuance the table cannot carry. */
  nuance: string[];
};
