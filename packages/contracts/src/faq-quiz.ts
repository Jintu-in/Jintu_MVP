import { z } from "zod";

/**
 * "Questions you might have" (V2Questions/DeskQuestions) and the no-score
 * quiz (V2Quiz/DeskQuiz) — migration 0032, BUILD-PLAN.md §3.4. Separate
 * from nodes.steps (0030): these aren't spliced into the challenge
 * position, they're a tail-of-lesson pair reached after the last authored
 * step, not derived from any other field.
 */

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});
export const faqSchema = z.array(faqItemSchema).min(1);

export const quizQuestionSchema = z
  .object({
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correctIndex: z.number().int().min(0),
    /** Shown after an answer either way — "why", not "you got it wrong". */
    explanation: z.string().min(1),
  })
  .refine((v) => v.correctIndex < v.options.length, {
    message: "correctIndex must index into options",
    path: ["correctIndex"],
  });
export const quizSchema = z.array(quizQuestionSchema).min(1);

export type FaqItem = z.infer<typeof faqItemSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
