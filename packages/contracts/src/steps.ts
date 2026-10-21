import { z } from "zod";

/**
 * Phase 5 Part B: authored rich steps (nodes.steps, migration 0030) — the
 * Git-&-GitHub-specific step types V2Step/V2Turn draw (a terminal command,
 * a richer "your turn" with its own terminal setup), distinct from the six
 * generic kinds lib/steps.ts derives automatically from a day's existing
 * fields. The five Uni* types (choose/find/formula/number/write) extend
 * this same union in a later part; nothing here assumes they won't.
 *
 * Both the importer (scripts/import-roadmap.mjs, Node) and the app
 * (apps/web, Next) read this from the one place, so a shape neither side
 * invented independently is what ends up in nodes.steps.
 */

/** One line of a terminal card: `$ git status`, or a highlighted line of
 *  output ("look for this"). Plain strings for ordinary lines keep the
 *  common case simple; the object form is only for the rare line that
 *  needs the pill. */
const terminalLine = z.union([
  z.string(),
  z.object({ text: z.string(), highlight: z.string().optional() }),
]);

export const commandStepSchema = z.object({
  kind: z.literal("command"),
  /** The step's own heading — "Ask Git what it sees". */
  title: z.string().min(1),
  /** "Type this" (V2Step) / "Start with this" (V2Turn). */
  promptLabel: z.string().min(1).default("Type this"),
  command: z.string().min(1),
  outputLabel: z.string().min(1).default("You should see"),
  output: z.array(terminalLine).min(1),
  /** The plain white card under the terminal — what the output means. */
  note: z.string().optional(),
});

export const turnStepSchema = z.object({
  kind: z.literal("turn"),
  /** "About 5 minutes" — V2Turn's own eyebrow, replacing "Step N". */
  timeLabel: z.string().min(1),
  title: z.string().min(1),
  body: z.string().optional(),
  /** "Start with this" terminal card — optional: a turn step need not
   *  open with a command. */
  startCommands: z.array(terminalLine).optional(),
  /** The plain paragraph after the terminal card, e.g. "Then add the
   *  file, commit it, and run `git log --oneline`." */
  thenText: z.string().optional(),
  doneWhenText: z.string().min(1),
  doneWhenExample: z.array(terminalLine).optional(),
  doneWhenNote: z.string().optional(),
  /** The CTA's own words — "My log shows two lines", not "Continue". */
  ctaLabel: z.string().min(1),
});

export const authoredStepSchema = z.discriminatedUnion("kind", [commandStepSchema, turnStepSchema]);
export const authoredStepsSchema = z.array(authoredStepSchema);

export type CommandStep = z.infer<typeof commandStepSchema>;
export type TurnStep = z.infer<typeof turnStepSchema>;
export type AuthoredStep = z.infer<typeof authoredStepSchema>;
