import { z } from "zod";

/**
 * "Stuck? Tell us what you see" (V2Help/DeskHelp, CHANGES.md item 6,
 * migration 0031) — a step's free-text help request, saved for review.
 * Not graded, not auto-answered: a human reads these later.
 */
export const helpRequestInput = z.object({
  nodeId: z.string().uuid(),
  /** A human-readable label for which step this came from — the step's
   *  own railTitle, e.g. "Step 5 · Ask Git what it sees" — not an index,
   *  since a lesson's step order can change between visits. */
  stepContext: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1, "Say what you're seeing.").max(2000, "Keep it under 2000 characters."),
});

export type HelpRequestInput = z.infer<typeof helpRequestInput>;
