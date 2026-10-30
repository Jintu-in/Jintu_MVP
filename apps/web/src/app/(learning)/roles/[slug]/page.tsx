import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { RolePage } from "@/components/roles/role-page";
import { ROLES, comparisonsMentioning, roleBySlug } from "@/content/roles";
import { getDraftRoadmaps } from "@/lib/draft-roadmaps";
import { getMyMomentum } from "@/lib/momentum";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * One role. Statically generated from the content files — there is no
 * database read for the role data itself, so these pages are the cheapest
 * thing on the site to serve and the easiest to have indexed. (The
 * viewer/momentum reads for the shell's account slot are the one dynamic
 * part, same trade every AppShell-wrapped page already makes.)
 *
 * Moved here from the marketing route group alongside /roles — see that
 * page's header comment for why. Content and section order are unchanged
 * (asked and answered 2026-10-19: keep the single scrolling page as
 * designed originally, not the four-tab layout V2Role.dc.html's one static
 * export shows with no reference for where the other five sections go).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ROLES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = roleBySlug(slug);
  if (!role) return {};
  return {
    title: role.title,
    description: role.standfirst,
    alternates: { canonical: `/roles/${role.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = roleBySlug(slug);
  if (!role) notFound();

  const [viewer, momentum, drafts] = await Promise.all([
    getViewer().catch(() => null),
    getMyMomentum().catch(() => null),
    getDraftRoadmaps().catch(() => []),
  ]);
  // Live, not baked in — getViewer()/getMyMomentum() above already force
  // this page to render per-request (see this file's own header), so
  // getDraftRoadmaps() costs nothing extra in architecture, only one more
  // query alongside the two this page was already making on every visit.
  const draftSlugs = new Set(drafts.map((d) => d.slug));

  return (
    <AppShell
      active="roles"
      user={
        viewer
          ? {
              displayName: viewer.fullName ?? viewer.email ?? "You",
              initials: initialsFor(viewer),
              points: momentum?.totalPoints ?? 0,
              avatarAnimal: viewer.avatarAnimal,
              avatarColor: viewer.avatarColor,
            }
          : null
      }
    >
      <RolePage role={role} comparisons={comparisonsMentioning(role.slug)} draftSlugs={draftSlugs} />
    </AppShell>
  );
}
