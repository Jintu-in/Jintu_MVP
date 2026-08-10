import { z } from "zod";

/**
 * Voting for a course that does not exist yet.
 *
 * The voter key is a uuid the browser mints once and keeps in localStorage.
 * It is validated as a uuid here rather than accepted as any string so that a
 * caller cannot stuff an email address, a phone number, or a session token
 * into the votes table — the column is anonymous by design and the schema
 * should not depend on the client behaving.
 */
export const courseVoteInput = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be a course slug"),
  voterKey: z.uuid("must be a uuid minted by the browser"),
});

export type CourseVoteInput = z.infer<typeof courseVoteInput>;
