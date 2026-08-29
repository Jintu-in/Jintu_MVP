import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RolePage } from "@/components/roles/role-page";
import { ROLES, comparisonsMentioning, roleBySlug } from "@/content/roles";

/**
 * One role. Statically generated from the content files — there is no
 * database read here, so these pages are the cheapest thing on the site to
 * serve and the easiest to have indexed.
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
  return <RolePage role={role} comparisons={comparisonsMentioning(role.slug)} />;
}
