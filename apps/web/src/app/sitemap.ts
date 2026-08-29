import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getRoadmap, listPublishedRoadmaps } from "@/lib/roadmaps";
import { COMPARISONS, ROLES } from "@/content/roles";

/**
 * The crawl surface, stated: static pages, every published roadmap, and
 * every node page — the roadmap pages are the SEO argument for the whole
 * product, and until this file existed the ~180 node pages were invisible
 * to anything that did not walk the DOM.
 *
 * Built from the database at request time (CI builds with no Supabase; a
 * failed read degrades to the static routes rather than a 500 — a sitemap
 * that takes the site down is a parody of itself).
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()?.toString().replace(/\/$/, "") ?? "https://jintu-mvp.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/learn",
    "/pricing",
    "/terms",
    "/privacy",
    "/refunds",
    "/contact",
    "/report",
  ].map((p) => ({ url: `${base}${p || "/"}`, changeFrequency: "weekly" as const }));

  // The roles layer ships with the deploy, so these need no database read
  // and cannot fail. They exist FOR search — the comparison pages answer
  // queries typed millions of times — so leaving them out of the sitemap
  // would undercut the entire reason they were written.
  const roleRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/roles`, changeFrequency: "weekly" as const },
    ...ROLES.map((r) => ({
      url: `${base}/roles/${r.slug}`,
      changeFrequency: "monthly" as const,
    })),
    ...COMPARISONS.map((c) => ({
      url: `${base}/roles/compare/${c.slug}`,
      changeFrequency: "monthly" as const,
    })),
  ];

  try {
    const summaries = await listPublishedRoadmaps();
    const roadmaps = await Promise.all(summaries.map((s) => getRoadmap(s.slug)));

    const roadmapRoutes: MetadataRoute.Sitemap = [];
    for (const r of roadmaps) {
      if (!r) continue;
      roadmapRoutes.push({ url: `${base}/learn/${r.slug}`, changeFrequency: "weekly" });
      for (const m of r.modules) {
        for (const n of m.nodes) {
          roadmapRoutes.push({
            url: `${base}/learn/${r.slug}/${n.slug}`,
            changeFrequency: "monthly",
          });
        }
      }
    }
    return [...staticRoutes, ...roleRoutes, ...roadmapRoutes];
  } catch {
    return [...staticRoutes, ...roleRoutes];
  }
}
