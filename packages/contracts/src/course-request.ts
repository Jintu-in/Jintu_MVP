import { z } from "zod";

/**
 * Asking for a course that does not exist.
 *
 * Bounds match the CHECK on course_requests.prompt exactly. Two copies of a
 * rule is two things to get wrong, so the rule is that these move together —
 * the database one is what makes it true, this one is what turns it into a
 * sentence next to the field instead of a 500.
 */
export const courseRequestInput = z.object({
  prompt: z
    .string()
    .trim()
    .min(10, "Tell us a bit more — a few words is not enough to write a course from.")
    .max(600, "That is longer than we can file. Six hundred characters is plenty."),

  // Minted by the browser into localStorage. Validated as a uuid so a caller
  // cannot put an email address or a session token in the column, which is
  // anonymous by design and should not depend on the client behaving.
  requesterKey: z.uuid("must be a uuid minted by the browser"),
});

export type CourseRequestInput = z.infer<typeof courseRequestInput>;
