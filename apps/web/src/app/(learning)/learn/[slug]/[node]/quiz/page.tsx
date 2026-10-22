import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuizRoute from "@/components/lesson/quiz-route";
import { getRoadmap } from "@/lib/roadmaps";

/**
 * V2Quiz/DeskQuiz — a standalone, chromeless screen (unlike StepReader's
 * three-column shell, the mockup itself has no left nav here), reached
 * from the faq step's "Quiz me first" button. 404s when the node has no
 * quiz authored: there is no "quiz, but empty" state to render.
 */
export const dynamic = "force-dynamic";

type Params = { slug: string; node: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, node: nodeParam } = await params;
  const roadmap = await getRoadmap(slug).catch(() => null);
  const flat = roadmap?.modules.flatMap((m) => m.nodes) ?? [];
  const node = flat.find((n) => n.slug === nodeParam || n.id === nodeParam);
  if (!roadmap || !node) return { title: "Quiz" };
  return {
    title: `Quiz — ${node.title} — ${roadmap.title}`,
    robots: { index: false },
  };
}

export default async function QuizPage({ params }: { params: Promise<Params> }) {
  const { slug, node: nodeParam } = await params;

  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  const flat = roadmap.modules.flatMap((m) => m.nodes);
  const node = flat.find((n) => n.slug === nodeParam || n.id === nodeParam);
  if (!node) notFound();
  if (!node.quiz || node.quiz.length === 0) notFound();

  return (
    <QuizRoute
      slug={slug}
      nodeSlug={node.slug}
      nodeTitle={node.title}
      questions={node.quiz}
    />
  );
}
