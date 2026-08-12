import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Track queries.
 *
 * Reads go through `assignments_public`, never `assignments` — the public view
 * omits answer_key_ref by projection, because Postgres RLS is row-level and
 * cannot hide a column. There is no code path from this file to an answer key.
 */

export type Archetype =
  | 'executable' | 'detectable' | 'structural' | 'rubric_ai' | 'peer' | 'mentor';

/** Three buckets a reader can actually reason about, derived from six archetypes. */
export type CheckKind = 'machine' | 'peer' | 'model';

export const checkKind = (a: Archetype): CheckKind =>
  a === 'rubric_ai' ? 'model'
  : a === 'peer' || a === 'mentor' ? 'peer'
  : 'machine';

export const CHECK_LABEL: Record<CheckKind, string> = {
  machine: 'Machine', peer: 'Peers', model: 'Model',
};

export interface Criterion {
  name: string;
  weight: number;
  check: Archetype;
}

export interface Resource {
  kind: 'video' | 'article' | 'docs' | 'dataset' | 'tool' | 'practice' | 'book' | 'export';
  title: string;
  sourceLabel: string | null;
  externalUrl: string | null;
  youtubeVideoId: string | null;
  durationSec: number | null;
  needsVerification: boolean;
  health: 'ok' | 'degraded' | 'dead';
}

export interface Unit {
  id: string;
  unitNo: number;
  title: string;
  objective: string;
  estMinutes: number | null;
  buildsOn: string | null;
  /** Short noun phrase for the map tile: what you hand in, not what you study. */
  makes: string;
  artifactPrompt: string;
  points: number;
  criteria: Criterion[];
  resources: Resource[];
}

export interface Track {
  slug: string;
  title: string;
  oneLine: string | null;
  tier: 'verified' | 'community' | 'draft';
  competency: string;
  badgeThreshold: number | null;
  reviewedAt: string | null;
  authorHandle: string | null;
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

export const totalMinutes = (t: Track) =>
  t.units.reduce((a, u) => a + (u.estMinutes ?? 0), 0);

export async function getTrack(slug: string): Promise<Track | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tracks')
    .select(`
      slug, title, one_line, tier, competency, badge_threshold, reviewed_at,
      author:profiles!tracks_author_id_fkey ( handle ),
      units (
        id, unit_no, title, objective, est_minutes, builds_on,
        resources (
          kind, title, source_label, external_url, youtube_video_id,
          duration_sec, needs_verification, health, position
        ),
        assignment:assignments_public (
          kind, prompt, points,
          rubric:rubrics ( slug, rubric_criteria ( name, weight, check_by, position ) )
        )
      )
    `)
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .order('unit_no', { referencedTable: 'units', ascending: true })
    .maybeSingle();

  if (error || !data) return null;

  return {
    slug: data.slug,
    title: data.title,
    oneLine: data.one_line,
    tier: data.tier,
    competency: data.competency,
    badgeThreshold: data.badge_threshold,
    reviewedAt: data.reviewed_at,
    authorHandle: (data.author as { handle: string } | null)?.handle ?? null,
    units: (data.units ?? []).map((u: any) => {
      const a = Array.isArray(u.assignment) ? u.assignment[0] : u.assignment;
      return {
        id: u.id,
        unitNo: u.unit_no,
        title: u.title,
        objective: u.objective,
        estMinutes: u.est_minutes,
        buildsOn: u.builds_on,
        makes: shortLabel(a?.prompt ?? u.title),
        artifactPrompt: a?.prompt ?? '',
        points: Number(a?.points ?? 0),
        criteria: (a?.rubric?.rubric_criteria ?? [])
          .sort((x: any, y: any) => x.position - y.position)
          .map((c: any) => ({ name: c.name, weight: Number(c.weight), check: c.check_by })),
        resources: (u.resources ?? [])
          .sort((x: any, y: any) => x.position - y.position)
          .map((r: any) => ({
            kind: r.kind,
            title: r.title,
            sourceLabel: r.source_label,
            externalUrl: r.external_url,
            youtubeVideoId: r.youtube_video_id,
            durationSec: r.duration_sec,
            needsVerification: r.needs_verification,
            health: r.health,
          })),
      };
    }),
  };
}

/**
 * Tile labels name the OUTPUT, not the topic. "Defect audit" rather than
 * "Data cleaning fundamentals" — the difference between a portfolio and a
 * syllabus. Authored content should set this explicitly; this is the fallback.
 */
function shortLabel(prompt: string): string {
  const first = prompt.split(/[.:\n]/)[0] ?? prompt;
  const words = first.trim().split(/\s+/).slice(0, 3).join(' ');
  return words.length > 22 ? words.slice(0, 22).trimEnd() + '…' : words;
}

export async function getPublishedSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('tracks').select('slug').not('published_at', 'is', null);
  return (data ?? []).map((t) => t.slug);
}
