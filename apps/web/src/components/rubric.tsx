import type { Rubric as RubricType } from "@/lib/curriculum";

/**
 * The rubric a submission is graded against, shown before anyone enrols.
 *
 * This is not a nice-to-have. The landing page says work is "graded against a
 * rubric you can read before you start", and docs/LEGAL.md §3 is explicit
 * that a claim we cannot back is a misleading advertisement. Rendering this
 * is what makes that sentence true — the rubrics table is public in RLS for
 * exactly this reason.
 */
export function Rubric({ rubric }: { rubric: RubricType }) {
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
          Rubric <code className="font-mono">{rubric.name}</code>. Weeks 1–2 are
          graded by running your SQL, not by a model.
        </p>
      </div>
    </details>
  );
}
