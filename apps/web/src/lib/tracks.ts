import "server-only";
import { getPublishedTrack } from "@/lib/curriculum";
import type { Archetype, Track, TrackResource, Unit } from "@/lib/tracks-shared";

/**
 * The map/document page's data layer, against the LIVE schema.
 *
 * The design this serves was written for the v3 schema (units,
 * assignments_public, tier='verified'); production runs modules-under-
 * versioned-paths. Rather than fork the components, this
 * adapter maps one onto the other and the components stay schema-blind:
 *
 *   modules              -> units          (week_no -> unitNo)
 *   tracks.summary       -> oneLine
 *   tier                 -> pass-through   (the column says 'verified' since
 *                                           20260812090000)
 *   rubric max_score     -> points
 *   criteria label/check -> name/check     (pre-#57 rubrics carry no check;
 *                                           they fall back by assignment kind,
 *                                           never upward to machine)
 *
 * ANSWER KEYS: the audited constraint is "no code path from a browser to a
 * key". In the live schema that is structural — assignments carries NO key
 * column at all; keys live in assignment_answer_keys (service-role only,
 * proven unreachable four ways in the schema audit) and defect keys in
 * assignment_defect_keys (same). This file reads through getPublishedTrack,
 * which selects columns by name from public tables only.
 */

export async function getTrack(slug: string): Promise<Track | null> {
  const t = await getPublishedTrack(slug);
  if (!t) return null;

  return {
    slug: t.slug,
    title: t.title,
    oneLine: t.summary,
    tier: t.tier,
    units: t.modules.map((m): Unit => {
      // One artifact per unit is the house shape; when a week carries more
      // (sql + artifact in the same week), the highest-paying one is the
      // unit's face and the rest still render in its rubric list.
      const primary = [...m.assignments].sort(
        (a, b) => Number(b.rubrics?.max_score ?? 0) - Number(a.rubrics?.max_score ?? 0),
      )[0];

      const criteria = m.assignments.flatMap((a) =>
        (a.rubrics?.criteria ?? []).map((c) => ({
          name: c.label,
          weight: Number(c.weight),
          check: normalizeCheck(c.check, a.kind),
        })),
      );

      const points = m.assignments.reduce(
        (n, a) => n + Number(a.rubrics?.max_score ?? 0),
        0,
      );

      return {
        id: m.id,
        unitNo: m.week_no,
        title: m.title,
        objective: m.objective,
        makes: shortLabel(primary?.spec?.prompt ?? m.title),
        artifactPrompt: primary?.spec?.prompt ?? "",
        points,
        criteria,
        resources: m.resources.map(
          (r): TrackResource => ({
            kind: r.kind,
            title: r.title,
            sourceLabel: r.provider === "youtube" ? "YouTube" : hostOf(r.external_url),
            externalUrl: r.external_url,
            youtubeVideoId: r.youtube_video_id,
            durationSec: r.duration_sec,
            health: r.health,
          }),
        ),
      };
    }),
  };
}

/**
 * Pre-#57 rubrics carry no archetype on their criteria. The fallback goes by
 * what actually grades the assignment kind — and it NEVER falls upward to
 * machine for prose, because the verification strip is the page's one real
 * claim and an optimistic default would inflate it.
 */
function normalizeCheck(check: string | null | undefined, kind: string): Archetype {
  const known: Archetype[] = ["executable", "detectable", "structural", "rubric_ai", "peer", "mentor_sample"];
  if (check && (known as string[]).includes(check)) return check as Archetype;
  return kind === "sql" ? "executable" : "peer";
}

/**
 * Tile labels name the OUTPUT, not the topic. "Defect audit" rather than
 * "Data cleaning fundamentals" — the difference between a portfolio and a
 * syllabus. Authored content should set this explicitly; this is the fallback.
 */
function shortLabel(prompt: string): string {
  const first = prompt.split(/[.:\n]/)[0] ?? prompt;
  const words = first.trim().split(/\s+/).slice(0, 3).join(" ");
  return words.length > 22 ? words.slice(0, 22).trimEnd() + "…" : words;
}

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
