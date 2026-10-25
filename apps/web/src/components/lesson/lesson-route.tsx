"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import type { CodeLanguageKey } from "@jintu/contracts";
import { setCodeLanguage } from "@/actions/account";
import { setNodeDone, type StreakResult } from "@/actions/progress";
import { StepReader } from "@/components/lesson/step-reader";
import { LessonDoneScreen } from "@/components/lesson/lesson-states";
import type { LessonStep } from "@/lib/steps";

/**
 * The client seam between the day page (a server component that fetches)
 * and the step reader — one step at a time (StepReader), capped by the
 * done screen (LessonDoneScreen) once the last step is finished. Replaces
 * the old six-section scrolling page (lesson-page.tsx, retired) wholesale;
 * see lib/steps.ts's header comment for why lib/blocks.ts stays untouched
 * alongside this.
 *
 * Finishing the LAST step is the progress event — it calls setNodeDone,
 * same RPC the old explicit "Mark day done" button called, same streak/
 * points logic, same idempotency. If the node is already done (a revisit),
 * finishing the last step does not re-call the action at all: the old
 * button was an explicit toggle ("tap to undo"); stepping through to the
 * end is not a deliberate "undo" gesture, and silently flipping a finished
 * lesson back to unfinished because someone re-read it would be a bad
 * surprise, not a feature.
 */

/** A LessonStep the server can send — no React nodes, fully serializable. */
export type LessonStepSeed = LessonStep;

/**
 * V2Offline/DeskOffline (Phase 5 Part D): starts true (matches what the
 * server-rendered page assumed, since it has no way to know) and corrects
 * itself on mount from the browser's own flag, then tracks the online/
 * offline events for the rest of the visit.
 */
function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(window.navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
}

export interface LessonRouteProps {
  slug: string;
  nodeSlug: string;
  nodeId: string;
  roadmapId: string;
  roadmapTitle: string;
  moduleLabel: string;
  /** Numerals only — "Lesson 1 done", "Start lesson 2". */
  lessonNumber: string;
  points: number;
  signedIn: boolean;
  initialDone: boolean;
  steps: LessonStepSeed[];
  /** This lesson's total estimated minutes — the desktop nav's footer. */
  estMinutes: number;
  /** The DSA language switch's remembered choice (migration 0033) — "one
   *  choice ... applies to every code block", so this lives here (shared
   *  across every codeMulti step in the lesson), not as per-step state. */
  initialCodeLanguage: CodeLanguageKey;
  next?: { lessonNumber: string; title: string; metaLine: string; href: string };
  /** For the done screen's stat cards. */
  streakDaysNow: number;
  lessonsLine: string;
  accomplishmentLine: string;
  /** The done screen's "Share your progress" card (V2Done/DeskDone) — see
   *  lesson-states.tsx's ShareCard and lib/share-card.ts for why these
   *  arrive as finished strings rather than being assembled here. */
  shareHeadline: string;
  shareLessonLine: string;
  /** Absolute — what gets copied/shared has to resolve outside this tab. */
  shareUrl: string;
  /** Relative — same-origin fetch/<img src>/<a download>, all same tab. */
  shareImagePath: string;
}

export default function LessonRoute({
  slug,
  nodeSlug,
  nodeId,
  roadmapId,
  roadmapTitle,
  moduleLabel,
  lessonNumber,
  points,
  signedIn,
  initialDone,
  steps,
  estMinutes,
  initialCodeLanguage,
  next,
  streakDaysNow,
  lessonsLine,
  accomplishmentLine,
  shareHeadline,
  shareLessonLine,
  shareUrl,
  shareImagePath,
}: LessonRouteProps) {
  const router = useRouter();
  const storageKey = `jintu:step:${nodeId}`;
  const online = useOnlineStatus();

  const [index, setIndex] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [done, setDone] = useState(initialDone);
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [codeLanguage, setCodeLanguageState] = useState(initialCodeLanguage);
  const { execute: persistCodeLanguage } = useAction(setCodeLanguage);

  // Optimistic — the switch feels instant (matching the mockup's own
  // setState-only demo) and persists in the background when signed in.
  // Signed-out visitors still get a working switch for this visit; it
  // just does not survive a reload, same trade-off as every other
  // signed-out-friendly bit of local-only state in this reader.
  const onCodeLanguageChange = (next: CodeLanguageKey) => {
    setCodeLanguageState(next);
    if (signedIn) persistCodeLanguage({ codeLanguage: next });
  };

  // Resume at the furthest step reached, clamped to the current step count
  // (content can change between visits). A finished lesson still resumes
  // mid-way, not forced back to the done screen — re-reading is allowed.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const saved = raw ? Number(raw) : 0;
      const clamped = Number.isFinite(saved) ? Math.min(Math.max(0, saved), steps.length - 1) : 0;
      setIndex(clamped);
      setFurthest(clamped);
    } catch {
      // Private mode, quota, disabled storage — start at the top.
    }
    // Only on mount / when the node itself changes.
  }, [storageKey]);

  const saveProgress = (nextIndex: number) => {
    const value = Math.max(furthest, nextIndex);
    setFurthest(value);
    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch {
      // The step still advances for this session; it just will not resume.
    }
  };

  const { execute, isExecuting, result } = useAction(setNodeDone, {
    onSuccess: ({ data }) => {
      setFailed(false);
      if (data) {
        setDone(data.done);
        setStreak(data.streak);
      }
      setShowDone(true);
    },
    onError: () => {
      setFailed(true);
    },
  });

  // "Progress queues locally and syncs when back online" (BUILD-PLAN.md's
  // offline testing checklist) — a completion attempt that failed while
  // offline retries itself the moment the connection returns, rather than
  // leaving the learner to notice and tap "try again". Durability is only
  // for this visit (same trade-off as the furthest-step localStorage above):
  // the real requirement is "finish a step, come back online, progress is
  // saved" within one session, not surviving a closed tab while offline.
  useEffect(() => {
    if (online && failed) {
      setFailed(false);
      execute({ nodeId, roadmapId, roadmapSlug: slug, done: true });
    }
    // Only on the online transition — not on every `failed`/`execute` change.
  }, [online]);

  const onContinue = () => {
    const isLast = index === steps.length - 1;
    if (!isLast) {
      setIndex(index + 1);
      saveProgress(index + 1);
      return;
    }
    if (done) {
      // Already finished — show the capstone without re-touching the flag.
      setShowDone(true);
      return;
    }
    if (!signedIn) {
      router.push(`/join?next=/learn/${slug}/${nodeSlug}`);
      return;
    }
    if (isExecuting) return;
    setFailed(false);
    execute({ nodeId, roadmapId, roadmapSlug: slug, done: true });
  };

  const onPrev = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  // Desktop nav only (mobile has no equivalent) — jumps to an
  // already-reached step. Guarded here too, not just by the nav
  // disabling the button: the reader stays strictly sequential either way.
  const onJump = (i: number) => {
    if (i > furthest || i === index) return;
    setIndex(i);
  };

  if (showDone) {
    return (
      <LessonDoneScreen
        lessonNumber={lessonNumber}
        accomplishmentLine={accomplishmentLine}
        pointsLine={`+${points}`}
        streakDays={streak?.currentDays ?? streakDaysNow}
        lessonsLine={lessonsLine}
        shareHeadline={shareHeadline}
        shareLessonLine={shareLessonLine}
        shareUrl={shareUrl}
        shareImagePath={shareImagePath}
        next={next}
        onClose={() => router.push(`/learn/${slug}` as never)}
        onOpenNext={next ? () => router.push(next.href as never) : undefined}
      />
    );
  }

  return (
    <StepReader
      roadmapTitle={roadmapTitle}
      moduleLabel={moduleLabel}
      nodeId={nodeId}
      quizHref={`/learn/${slug}/${nodeSlug}/quiz`}
      steps={steps}
      stepIndex={index}
      total={steps.length}
      furthest={furthest}
      step={steps[index]!}
      estMinutes={estMinutes}
      codeLanguage={codeLanguage}
      onCodeLanguageChange={onCodeLanguageChange}
      online={online}
      onBack={() => router.push(`/learn/${slug}` as never)}
      onPrev={index > 0 ? onPrev : undefined}
      onContinue={onContinue}
      onJump={onJump}
      continuing={isExecuting}
      error={
        failed
          ? result.serverError ?? (online ? "That did not save. Your place is kept — try again." : "You're offline — this will save as soon as you're back.")
          : undefined
      }
    />
  );
}
