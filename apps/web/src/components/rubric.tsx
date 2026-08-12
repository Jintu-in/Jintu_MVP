import type { Assignment, Rubric as RubricType } from "@/lib/curriculum";

/**
 * The rubric a submission is graded against, shown before anyone enrols.
 *
 * This is not a nice-to-have. The landing page says work is "graded against a
 * rubric you can read before you start", and docs/LEGAL.md §3 is explicit
 * that a claim we cannot back is a misleading advertisement. Rendering this
 * is what makes that sentence true — the rubrics table is public in RLS for
 * exactly this reason.
 */

/**
 * How this particular artifact is marked.
 *
 * This used to be one hardcoded sentence in the footer below — "Weeks 1-2 are
 * graded by running your SQL, not by a model" — printed under every rubric on
 * the page. Under week 4's written-finding-v1 and week 6's walkthrough-v1 it
 * was simply false: neither is SQL and neither is run. A page whose entire
 * argument is "we tell you exactly how you are marked" cannot get the
 * how-you-are-marked line wrong.
 *
 * Keyed on the assignment kind rather than stored on the rubric, because the
 * kind is what actually decides which checker runs. A note on the rubric would
 * be a second copy of that fact, free to drift — and rubrics are shared across
 * assignments, so the same rubric could carry a note that is right in one
 * place and wrong in another.
 *
 * Typed as a total Record, so adding a fifth assignment kind fails the build
 * here rather than shipping a rubric with no explanation under it.
 */
// "Two peers" is a system guarantee — allocate_peer_reviews assigns exactly
// two. Mentor review is sampling, and the copy says so: "a mentor spot-check"
// on every artifact was 80 written commitments per 20-student cohort, made on
// a public page before payment. Promise what the machine enforces; describe
// what a human does.
const GRADING_NOTE: Record<Assignment["kind"], string> = {
  sql: "Graded by running your query against a fixed dataset and comparing the result to the expected one. Deterministic — the same query always scores the same.",
  artifact_link:
    "Graded by two peers against the criteria above, with mentor spot-checks sampled across the cohort.",
  file: "Graded by two peers against the criteria above, with mentor spot-checks sampled across the cohort.",
  recording:
    "Graded by two peers against the criteria above, with mentor spot-checks sampled across the cohort.",
};

export function Rubric({ rubric, kind }: { rubric: RubricType; kind: Assignment["kind"] }) {
  const total = rubric.criteria.reduce((n, c) => n + c.weight, 0);

  return (
    <details className="mt-3 rounded-card border border-ink-200 bg-white">
      <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-ink-700 marker:text-ink-500 hover:text-brand-800">
        How this is graded · {rubric.max_score} points
      </summary>

      <div className="border-t border-ink-100 px-4 py-3">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Grading criteria for {rubric.name}
          </caption>
          <thead>
            <tr className="text-left text-xs tracking-wide text-ink-500 uppercase">
              <th scope="col" className="pb-2 font-medium">
                Criterion
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Weight
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rubric.criteria.map((c) => (
              <tr key={c.key}>
                <td className="py-2 pr-4 text-ink-700">{c.label}</td>
                <td className="py-2 text-right font-mono text-ink-600">{c.weight}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink-200">
              <td className="pt-2 text-ink-500">Total</td>
              <td className="pt-2 text-right font-mono text-ink-900">{total}</td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-3 text-xs text-ink-500">
          Rubric <code className="font-mono">{rubric.name}</code>.{" "}
          {GRADING_NOTE[kind]}
        </p>

        {/*
          Deliberately NOT "no model marks any of it", which used to be here.
          That was true, published, and one shipped rubric_ai criterion away
          from being a broken promise on a paid product — the old comment on
          this line predicted exactly that. What replaces it is the promise
          that survives any grader: the rubric is the whole of the marking.
        */}
        <p className="mt-1.5 text-xs text-ink-500">
          Marked against exactly this list — nothing off-rubric counts for or
          against you.
        </p>
      </div>
    </details>
  );
}
