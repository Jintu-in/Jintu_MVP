/**
 * The verification archetypes, as the DATABASE spells them — and the one
 * place the database's spelling and the engine's are allowed to differ.
 *
 * The v3 schema's enum is ('executable','detectable','structural',
 * 'rubric_ai','peer','mentor'). The engine grew up calling the last one
 * 'mentor_sample'. Left unmapped, a mentor criterion would fall through
 * grade()'s peer/mentor branch test and be treated as a machine archetype
 * with no checker — pendingHuman forever, silently. This module makes the
 * translation explicit, total, and tested: every DB value round-trips.
 */

export const DB_ARCHETYPES = [
  "executable",
  "detectable",
  "structural",
  "rubric_ai",
  "peer",
  "mentor",
] as const;

export type DbArchetype = (typeof DB_ARCHETYPES)[number];

export type EngineArchetype =
  | "executable"
  | "detectable"
  | "structural"
  | "rubric_ai"
  | "peer"
  | "mentor_sample";

/** DB → engine. Total over the enum; anything else throws rather than guesses. */
export function toEngineCheck(db: string): EngineArchetype {
  if (db === "mentor") return "mentor_sample";
  if ((DB_ARCHETYPES as readonly string[]).includes(db)) return db as EngineArchetype;
  throw new Error(`"${db}" is not a verification archetype the database defines`);
}

/** Engine → DB. The exact inverse, so point_events.verification always fits the enum. */
export function toDbArchetype(check: EngineArchetype): DbArchetype {
  return check === "mentor_sample" ? "mentor" : check;
}
