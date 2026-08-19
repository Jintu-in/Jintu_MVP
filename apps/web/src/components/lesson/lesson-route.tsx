"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { setNodeDone, type StreakResult } from "@/actions/progress";
import LessonPage, { type LessonBlock } from "@/components/lesson/lesson-page";
import { EndOfDayCard, ResumeStrip } from "@/components/lesson/lesson-states";
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
  /** The next day, spelled out for the done card's "Up next". */
  nextDayNumber?: string;
  nextTitle?: string;
  nextMeta?: string;
  /** The honest alternative to carrying on, e.g. "or stop here — 3 of 91 days done". */
  stopLine?: string;
  /** Where they stopped last time, when they did not finish. */
  resumePoint?: { label: string; href: string };
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
  nextDayNumber,
  nextTitle,
  nextMeta,
  stopLine,
  resumePoint,
  railFooter,
}: LessonRouteProps) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const { execute, isExecuting, result } = useAction(setNodeDone, {
    onSuccess: ({ data }) => {
      setFailed(false);
      if (data) {
        setDone(data.done);
        setStreak(data.streak);
      }
    },
    // The optimistic flip is reversed and the failure is NAMED. A silent
    // revert is the worst outcome here: the button looks untouched and the
    // day is not saved.
    onError: () => {
      setDone(initialDone);
      setFailed(true);
    },
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
    setFailed(false);
    setDone(!done); // optimistic — under 200ms perceived
    setStreak(null);
    execute({ nodeId, roadmapId, roadmapSlug: slug, done: !done });
  };

  // Retry repeats the attempt that failed, not the inverse of whatever the
  // button now shows — the optimistic flip was already reversed.
  const onRetry = () => {
    if (isExecuting) return;
    setFailed(false);
    execute({ nodeId, roadmapId, roadmapSlug: slug, done: !initialDone });
  };

  // The one mono line under the button carries the whole streak story:
  // what a tap earns beforehand, what it counted for afterwards. Same
  // copy discipline as the streak spec — the break is named, the total
  // is protected in the same sentence.
  const earnsLine = streak && done
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
        failure: failed
          ? {
              line: result.serverError ?? "That did not save. Your place is kept — try again.",
              onRetry,
            }
          : undefined,
        doneCard:
          done && streak && next ? (
            <EndOfDayCard
              dayNumber={dayNumber}
              streakFrom={String(Math.max(0, streak.currentDays - 1))}
              streakTo={`${streak.currentDays} ${streak.currentDays === 1 ? "day" : "days"}`}
              pointsLine={`+${points}`}
              reviewLine={`${streak.totalDays} days learned`}
              next={{ dayNumber: nextDayNumber ?? "", title: nextTitle ?? "", metaLine: nextMeta ?? "" }}
              stopLine={stopLine ?? ""}
              onOpenNext={() => router.push(next.href as never)}
            />
          ) : undefined,
      }}
      lead={
        resumePoint && !done && !resumeDismissed ? (
          <ResumeStrip
            stoppedAt={resumePoint.label}
            jumpHref={resumePoint.href}
            onDismiss={() => setResumeDismissed(true)}
          />
        ) : undefined
      }
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
