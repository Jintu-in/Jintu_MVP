"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { setNodeDone, type StreakResult } from "@/actions/progress";
import LessonPage, { type LessonBlock } from "@/components/lesson/lesson-page";
import { VideoFacade } from "@/components/video-facade";

/**
 * The client seam between the day page (a server component that fetches)
 * and the design's LessonPage (a client component that takes callbacks).
 * Everything that crosses the boundary is serializable; the two things
 * that cannot be — the nocookie video player and the mark-done action —
 * are assembled here.
 *
 * Marking the DAY done is the progress event: it moves the streak and
 * pays the points, and it ticks every section at once. Per-section ticks
 * are reading progress and live in localStorage inside LessonPage —
 * there is no block_progress table, and node_progress.last_block_position
 * (0012) is a single furthest-point bookmark rather than a set.
 */

/** A LessonBlock the server can send: no done flag, no React nodes. */
export type LessonBlockSeed = { id: string; railTitle: string } & (
  | { kind: "brief"; text: { kind: "text" | "code" | "mono"; text: string }[] }
  | {
      kind: "concept";
      heading?: string;
      paragraphs: { kind: "text" | "code" | "mono"; text: string }[][];
    }
  | {
      kind: "resource";
      resType: "doc" | "video";
      title: string;
      href?: string;
      meta: string;
      why: string;
      /** Present on YouTube resources — becomes the nocookie facade. */
      video?: { videoId: string; durationSec: number | null; estSizeMb: number | null };
    }
  | { kind: "challenge"; label: string; text: { kind: "text" | "code" | "mono"; text: string }[] }
  | {
      kind: "check";
      number: string;
      question: { kind: "text" | "code" | "mono"; text: string }[];
      answer: { kind: "text" | "code" | "mono"; text: string }[][];
    }
  | {
      kind: "gotcha";
      heading?: string;
      text: { kind: "text" | "code" | "mono"; text: string }[];
    }
  | { kind: "topics"; heading: string; items: { title: string; detail: string }[] }
  | {
      kind: "resources";
      heading: string;
      items: {
        id: string;
        typeLabel: string;
        resType: "doc" | "video";
        title: string;
        href: string;
        meta: string;
        why: string;
        dead: boolean;
        video?: { videoId: string; durationSec: number | null; estSizeMb: number | null };
      }[];
    }
  | { kind: "checks"; heading: string; items: { question: string; answer: string }[] }
  | { kind: "summary"; lead: string; bullets: string[] }
);

export interface LessonRouteProps {
  slug: string;
  nodeSlug: string;
  nodeId: string;
  roadmapId: string;
  roadmapTitle: string;
  moduleLabel: string;
  title: string;
  dayLabel: string;
  metaLine: string;
  principle?: string;
  /** Numerals only — the mono number in "Mark day 45 done". */
  dayNumber: string;
  points: number;
  signedIn: boolean;
  initialDone: boolean;
  seeds: LessonBlockSeed[];
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
  railFooter: string[];
}

export default function LessonRoute({
  slug,
  nodeSlug,
  nodeId,
  roadmapId,
  roadmapTitle,
  moduleLabel,
  title,
  dayLabel,
  metaLine,
  principle,
  dayNumber,
  points,
  signedIn,
  initialDone,
  seeds,
  prev,
  next,
  railFooter,
}: LessonRouteProps) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const { execute, isExecuting, result } = useAction(setNodeDone, {
    onSuccess: ({ data }) => {
      if (data) {
        setDone(data.done);
        setStreak(data.streak);
      }
    },
    onError: () => setDone(initialDone),
  });

  const blocks = useMemo<LessonBlock[]>(
    () =>
      seeds.map((s) => {
        if (s.kind === "resources") {
          return {
            ...s,
            done,
            items: s.items.map(({ video, ...r }) => ({
              ...r,
              // The nocookie facade is the click-to-load affordance itself;
              // no iframe exists until someone asks for one.
              player: video ? (
                <VideoFacade
                  videoId={video.videoId}
                  title={r.title}
                  durationSec={video.durationSec}
                  estSizeMb={video.estSizeMb}
                />
              ) : undefined,
            })),
          };
        }
        return { ...s, done };
      }),
    [seeds, done],
  );

  const onMarkDone = () => {
    if (!signedIn) {
      router.push(`/join?next=/learn/${slug}/${nodeSlug}`);
      return;
    }
    if (isExecuting) return;
    setDone(!done); // optimistic — under 200ms perceived
    setStreak(null);
    execute({ nodeId, roadmapId, roadmapSlug: slug, done: !done });
  };

  // The one mono line under the button carries the whole streak story:
  // what a tap earns beforehand, what it counted for afterwards. Same
  // copy discipline as the streak spec — the break is named, the total
  // is protected in the same sentence.
  const earnsLine = result.serverError
    ? result.serverError
    : streak && done
      ? streak.wasBroken
        ? `You missed ${streak.daysMissed} ${streak.daysMissed === 1 ? "day" : "days"}. Streak restarted at 1 — your ${streak.totalDays} total days are safe.`
        : streak.isNewDay
          ? `Day ${streak.currentDays} of your streak · ${streak.totalDays} total days`
          : "Already counted today — points still earned."
      : `earns ${points} pts · counts toward today's streak`;

  return (
    <LessonPage
      roadmapTitle={roadmapTitle}
      moduleLabel={moduleLabel}
      title={title}
      dayLabel={dayLabel}
      metaLine={metaLine}
      principle={principle}
      blocks={blocks}
      footer={{
        markDoneLabel: !signedIn ? (
          "Sign in to mark this day done"
        ) : done ? (
          <>✓ Done — tap to undo</>
        ) : (
          <>
            Mark day <span className="font-mono">{dayNumber}</span> done
          </>
        ),
        // Empty label hides the button: day-level saving has no backend
        // yet, and a dead control is worse than a missing one.
        saveLabel: "",
        earnsLine,
      }}
      prev={prev}
      next={next}
      railFooter={railFooter}
      // Per-node, so ticks on day 45 do not follow you to day 46.
      tickStorageKey={`jintu:ticks:${nodeId}`}
      onBack={() => router.push(`/learn/${slug}`)}
      onMarkDone={onMarkDone}
    />
  );
}
