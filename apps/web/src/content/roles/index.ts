import data from "./data";
import dataExtended from "./data-extended";
import software from "./software";
import softwareExtended from "./software-extended";
import product from "./product";
import productExtended from "./product-extended";
import gtm from "./gtm";
import gtmExtended from "./gtm-extended";
import other from "./other";
import otherExtended from "./other-extended";
import marketingExtended from "./marketing-extended";
import design from "./design";
import operations from "./operations";
import comparisons from "./comparisons";
import { ROLE_DOMAINS, type Comparison, type Role, type RoleDomain } from "./types";

export type { Role, Comparison, RoleDomain };
export { ROLE_DOMAINS };

/**
 * Every role, in one array. Order within a domain is the order of the files,
 * which is deliberate: the first role in each domain is the one we would
 * point somebody at first — so the original file for each domain comes
 * before its extension.
 */
export const ROLES: Role[] = [
  ...data,
  ...dataExtended,
  ...software,
  ...softwareExtended,
  ...product,
  ...productExtended,
  ...gtm,
  ...gtmExtended,
  ...other,
  ...marketingExtended,
  ...design,
  ...operations,
  ...otherExtended,
];

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
