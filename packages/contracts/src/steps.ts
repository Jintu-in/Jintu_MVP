import { z } from "zod";

/**
 * Phase 5 Part B: authored rich steps (nodes.steps, migration 0030), seven
 * kinds total: the Git-&-GitHub-specific pair (command, turn — V2Step's
 * terminal card and V2Turn's richer "your turn"), plus the five Uni* kinds
 * (choose/find/formula/number/write) that extend to other subjects — a
 * multiple-choice worked example, a find-it-in-a-source task, a spreadsheet
 * formula, a worked numeric answer, and a fill-in-the-template sentence.
 * All seven are distinct from the six generic kinds lib/steps.ts derives
 * automatically from a day's existing fields.
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

/** A label/value row — "What you know" (choose), "The deal" (number). */
const fact = z.object({ label: z.string().min(1), value: z.string().min(1) });

export const chooseStepSchema = z.object({
  kind: z.literal("choose"),
  title: z.string().min(1),
  factsLabel: z.string().min(1).default("What you know"),
  facts: z.array(fact).min(1),
  promptLabel: z.string().min(1).default("Pick one"),
  options: z.array(z.string().min(1)).min(2),
  /** Which option the "Right" tag and the green highlight land on. */
  correctIndex: z.number().int().min(0),
  /** The reasoning card under the options — not the correct option's own
   *  text, the "why" (e.g. the natural-frequencies arithmetic). */
  explanation: z.string().min(1),
  note: z.string().optional(),
  ctaLabel: z.string().min(1),
}).refine((v) => v.correctIndex < v.options.length, {
  message: "correctIndex must index into options",
  path: ["correctIndex"],
});

export const findStepSchema = z.object({
  kind: z.literal("find"),
  title: z.string().min(1),
  sourceLabel: z.string().min(1),
  sourceTitle: z.string().min(1),
  sourceUrl: z.string().url(),
  /** Breadcrumb pills — "Index" -> "Diabetes, diabetic" -> "type 2". */
  lookUnder: z.array(z.string().min(1)).min(1).optional(),
  answerLabel: z.string().min(1).default("You should land on"),
  answerCode: z.string().min(1),
  answerText: z.string().min(1),
  note: z.string().optional(),
  ctaLabel: z.string().min(1),
});

export const formulaStepSchema = z.object({
  kind: z.literal("formula"),
  title: z.string().min(1),
  /** The cells the formula reads — "B2 (sale amount)" -> "₹1,000" — so the
   *  result is derivable rather than asserted. Optional: a formula with no
   *  external inputs (a constant, a text function) doesn't need one. */
  inputsLabel: z.string().min(1).default("Inputs"),
  inputs: z.array(fact).optional(),
  /** "Type this in cell B7" — rendered in the same TerminalCard chrome as
   *  the command step, not a pixel-accurate spreadsheet grid: the mockup's
   *  grid is cosmetic, and reusing the existing dark card is both simpler
   *  and the teaching point survives — a formula, and what it resolves to. */
  cellLabel: z.string().min(1),
  formula: z.string().min(1),
  resultLabel: z.string().min(1).default("The cell should show"),
  resultValue: z.string().min(1),
  /** The "look for this" pill, if the result needs calling out. */
  resultHighlight: z.string().optional(),
  note: z.string().optional(),
  ctaLabel: z.string().min(1),
});

export const numberStepSchema = z.object({
  kind: z.literal("number"),
  title: z.string().min(1),
  factsLabel: z.string().min(1).default("The deal"),
  facts: z.array(fact).min(1),
  /** The worked answer, shown as read-only rows — never a live input. This
   *  is the no-grading posture CLAUDE.md requires (no grading, no
   *  verification): a worked example to check your own arithmetic
   *  against, exactly like a check step reveals an answer rather than
   *  scoring one. */
  answersLabel: z.string().min(1).default("Your answer"),
  answers: z.array(fact).min(1),
  workingLabel: z.string().min(1).default("Check your working"),
  working: z.array(terminalLine).min(1),
  note: z.string().optional(),
  ctaLabel: z.string().min(1),
});

export const writeStepSchema = z.object({
  kind: z.literal("write"),
  title: z.string().min(1),
  /** "I am __% sure that __ by __." */
  template: z.string().min(1),
  /** The filled-in worked example — static text, not a live textbox; same
   *  no-grading posture as the number step above. */
  example: z.string().min(1),
  /** The checklist under it — "A number" -> "70%", one row per part. */
  parts: z.array(fact).min(1),
  note: z.string().optional(),
  ctaLabel: z.string().min(1),
});

export const authoredStepSchema = z.discriminatedUnion("kind", [
  commandStepSchema,
  turnStepSchema,
  chooseStepSchema,
  findStepSchema,
  formulaStepSchema,
  numberStepSchema,
  writeStepSchema,
]);
export const authoredStepsSchema = z.array(authoredStepSchema);

export type CommandStep = z.infer<typeof commandStepSchema>;
export type TurnStep = z.infer<typeof turnStepSchema>;
export type ChooseStep = z.infer<typeof chooseStepSchema>;
export type FindStep = z.infer<typeof findStepSchema>;
export type FormulaStep = z.infer<typeof formulaStepSchema>;
export type NumberStep = z.infer<typeof numberStepSchema>;
export type WriteStep = z.infer<typeof writeStepSchema>;
export type AuthoredStep = z.infer<typeof authoredStepSchema>;
