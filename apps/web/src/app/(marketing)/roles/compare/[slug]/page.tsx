import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonPage } from "@/components/roles/comparison-page";
import { COMPARISONS, comparisonBySlug } from "@/content/roles";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) return {};
  return {
    title: c.title,
    // The short answer IS the description: it is what somebody searching
    // this question wants, and putting it in the snippet is honest rather
    // than a hook.
    description: c.shortAnswer.slice(0, 300),
    alternates: { canonical: `/roles/compare/${c.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) notFound();
  return <ComparisonPage comparison={c} />;
}
