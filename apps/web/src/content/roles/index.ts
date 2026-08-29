import data from "./data";
import software from "./software";
import product from "./product";
import gtm from "./gtm";
import other from "./other";
import comparisons from "./comparisons";
import { ROLE_DOMAINS, type Comparison, type Role, type RoleDomain } from "./types";

export type { Role, Comparison, RoleDomain };
export { ROLE_DOMAINS };

/**
 * Every role, in one array. Order within a domain is the order of the files,
 * which is deliberate: the first role in each domain is the one we would
 * point somebody at first.
 */
export const ROLES: Role[] = [...data, ...software, ...product, ...gtm, ...other];

export const COMPARISONS: Comparison[] = comparisons;

export const roleBySlug = (slug: string): Role | undefined =>
  ROLES.find((r) => r.slug === slug);

export const comparisonBySlug = (slug: string): Comparison | undefined =>
  COMPARISONS.find((c) => c.slug === slug);

export const rolesInDomain = (domain: RoleDomain): Role[] =>
  ROLES.filter((r) => r.domain === domain);

/** Domains that actually have a role page, in the declared order. */
export const populatedDomains = () =>
  ROLE_DOMAINS.filter((d) => ROLES.some((r) => r.domain === d.key));

/**
 * The comparisons a role page should link to, derived rather than declared
 * twice: any comparison whose table names this role.
 */
export const comparisonsMentioning = (slug: string): Comparison[] =>
  COMPARISONS.filter((c) => c.rows.some((r) => r.role === slug));

/** Every roadmap slug any role routes into — what the guard checks. */
export const referencedRoadmapSlugs = (): string[] => {
  const out = new Set<string>();
  for (const r of ROLES) {
    if (r.startHere.kind === "roadmaps") {
      for (const p of r.startHere.picks) out.add(p.slug);
    }
  }
  return [...out];
};
