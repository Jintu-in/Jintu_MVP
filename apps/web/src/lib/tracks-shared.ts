/**
 * Track types and pure helpers — importable from BOTH server and client.
 *
 * This file exists because of bug (a) in the curriculum-page audit: the
 * original lib/tracks.ts opened with `import 'server-only'` and the client
 * component verified-track.tsx imported checkKind/CHECK_LABEL/verificationMix
 * from it, which is a build failure by design — server-only modules poison
 * every client importer. Types and arithmetic live here with no marker;
 * getTrack and its Supabase client stay in lib/tracks.ts, which keeps its
 * server-only import.
 */

export type Archetype =
  | "executable" | "detectable" | "structural" | "rubric_ai" | "peer" | "mentor_sample";

/** Three buckets a reader can actually reason about, derived from six archetypes. */
export type CheckKind = "machine" | "peer" | "model";

export const checkKind = (a: Archetype): CheckKind =>
  a === "rubric_ai" ? "model"
  : a === "peer" || a === "mentor_sample" ? "peer"
  : "machine";

export const CHECK_LABEL: Record<CheckKind, string> = {
  machine: "Machine", peer: "Peers", model: "Model",
};

export interface Criterion {
  name: string;
  weight: number;
  check: Archetype;
}

export interface TrackResource {
  kind: "video" | "article" | "docs" | "dataset" | "tool";
  title: string;
  sourceLabel: string | null;
  externalUrl: string | null;
  youtubeVideoId: string | null;
  durationSec: number | null;
  health: "ok" | "degraded" | "dead";
}

export interface Unit {
  id: string;
  unitNo: number;
  title: string;
  objective: string;
  /** Short noun phrase for the map tile: what you hand in, not what you study. */
  makes: string;
  artifactPrompt: string;
  points: number;
  criteria: Criterion[];
  resources: TrackResource[];
}

export interface Track {
  slug: string;
  title: string;
  oneLine: string | null;
  /** Display tier. The live column still says 'sprint'; the mapping is getTrack's job. */
  tier: "verified" | "community" | "draft";
  units: Unit[];
}

/** Points split by how they are earned. The whole differentiator, as one object. */
export function verificationMix(track: Track) {
  const mix: Record<CheckKind, number> = { machine: 0, peer: 0, model: 0 };
  for (const u of track.units) {
    for (const c of u.criteria) mix[checkKind(c.check)] += c.weight;
  }
  const total = mix.machine + mix.peer + mix.model;
  return {
    ...mix,
    total,
    // Computed from points, never from criteria count. Five 1-point structural
    // checks beside an 8-point model criterion is 5 of 6 criteria and 38% of
    // points — the difference matters and only one of them is honest.
    machineShare: total === 0 ? 0 : mix.machine / total,
  };
}
