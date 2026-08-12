import { z } from "zod";

/**
 * Community authoring — the client half of author_community_track() and
 * set_community_outline().
 *
 * Bounds here mirror the RPCs exactly, and the database's are the real ones:
 * these exist so an over-long title is refused in the form with a field-level
 * message instead of a round trip. Nothing may be looser than the SQL — a
 * value this schema passes and the RPC refuses is a bug in this file.
 */

const title = z
  .string()
  .trim()
  .min(4, "Give the track a title — at least four characters.")
  .max(80, "Eighty characters is plenty for a title.");

export const communityTrackInput = z.object({
  title,
  summary: z
    .string()
    .trim()
    .min(20, "Say what the track prepares someone for — one or two sentences.")
    .max(300, "Three hundred characters is the ceiling. Trim it to the promise."),
});

export type CommunityTrackInput = z.infer<typeof communityTrackInput>;

export const communityOutlineInput = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "not a track address"),
  weeks: z
    .array(
      z.object({
        title,
        objective: z
          .string()
          .trim()
          .min(10, "What can someone do after this week? A sentence.")
          .max(300, "Objectives are one promise, not a syllabus — three hundred characters."),
      }),
    )
    .min(1, "An outline is at least one week.")
    .max(12, "Twelve weeks is the ceiling."),
});

export type CommunityOutlineInput = z.infer<typeof communityOutlineInput>;
