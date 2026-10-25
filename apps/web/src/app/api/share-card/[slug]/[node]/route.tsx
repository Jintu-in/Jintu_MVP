import { ImageResponse } from "next/og";
import { getMyFirstName, shareHeadline, shareLessonLine, shareStreakLine } from "@/lib/share-card";
import { getMyMomentum } from "@/lib/momentum";
import { getRoadmap } from "@/lib/roadmaps";

/**
 * The "Share your progress" card's downloadable PNG (V2Done/DeskDone) —
 * what "Download" saves and what "Share" attaches to the native share
 * sheet. Always rendered for whoever is signed in and asking, never for an
 * id passed in the URL: slug/node pick the LESSON, the viewer's own
 * session supplies the name and streak, so this can never hand back
 * somebody else's progress.
 *
 * Same colours as the on-screen preview (lesson-states.tsx's ShareCard) —
 * brand-500 #43b4c8 fill, on-brand #06262c text, the one pairing in this
 * codebase where brand-500 IS legible (6.51:1, see preset.css) — and the
 * same three text lines, built from the same lib/share-card.ts helpers, so
 * the image never says something different from what was shown before the
 * download started.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; node: string }> },
) {
  const { slug, node: nodeParam } = await params;

  const [roadmap, momentum, firstName] = await Promise.all([
    getRoadmap(slug).catch(() => null),
    getMyMomentum(),
    getMyFirstName(),
  ]);
  if (!momentum) return new Response("Sign in to get your card.", { status: 401 });

  const flat = roadmap?.modules.flatMap((m) => m.nodes) ?? [];
  const at = flat.findIndex((n) => n.slug === nodeParam || n.id === nodeParam);
  if (!roadmap || at === -1) return new Response("Lesson not found.", { status: 404 });
  const node = flat[at]!;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background: "#43b4c8",
          color: "#06262c",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>jintu</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", fontSize: 54, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              {shareHeadline(firstName, node.title)}
            </div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 500 }}>
              {shareLessonLine(at + 1, flat.length, roadmap.title)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 40,
              padding: "0 18px",
              borderRadius: 20,
              background: "#06262c",
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {shareStreakLine(momentum.streakDays)}
          </div>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 500 }}>jintu.in</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
