import { type CheckKind, CHECK_LABEL } from "@/lib/tracks-shared";

/**
 * The verification strip. The signature element of this page.
 *
 * A reader absorbs "most of this is machine-checked" from four green segments
 * before reading a word. No amount of prose delivers the differentiator faster,
 * which is why this component appears at track level AND on every tile — the
 * repetition is the point.
 *
 * Colours are semantic and fixed: mint = a machine compared it to a right
 * answer, violet = humans judged it, amber = a model scored prose. Never
 * recolour these for aesthetic reasons; they carry meaning. (They live in the
 * preset with measured ratios: the base steps are fills, the -ink steps are
 * the only ones legible as text.)
 */

const FILL: Record<CheckKind, string> = {
  machine: "bg-check-machine",
  peer: "bg-check-peer",
  model: "bg-check-model",
};

export function VerificationStrip({
  mix, height = "h-1.5", className = "",
}: {
  mix: Record<CheckKind, number> & { total: number };
  height?: string;
  className?: string;
}) {
  if (mix.total === 0) return null;
  const kinds: CheckKind[] = ["machine", "peer", "model"];
  return (
    <div
      className={`flex ${height} overflow-hidden rounded-full bg-ink-100 ${className}`}
      role="img"
      aria-label={kinds
        .filter((k) => mix[k] > 0)
        .map((k) => `${CHECK_LABEL[k]} ${Math.round((mix[k] / mix.total) * 100)}%`)
        .join(", ")}
    >
      {kinds.map((k) =>
        mix[k] > 0 ? (
          <div
            key={k}
            className={FILL[k]}
            style={{ width: `${(mix[k] / mix.total) * 100}%` }}
          />
        ) : null,
      )}
    </div>
  );
}

export function StripLegend({ mix }: { mix: Record<CheckKind, number> }) {
  const kinds: CheckKind[] = ["machine", "peer", "model"];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-500">
      {kinds.map((k) =>
        mix[k] > 0 ? (
          <li key={k} className="flex items-center gap-1.5">
            <span className={`h-0.5 w-3 rounded-full ${FILL[k]}`} aria-hidden />
            {CHECK_LABEL[k]}
            <span className="font-mono tabular-nums text-ink-500">{mix[k]}</span>
          </li>
        ) : null,
      )}
    </ul>
  );
}

/** Single-criterion marker used in the rubric table. */
export function CheckDot({ kind }: { kind: CheckKind }) {
  return (
    <span
      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${FILL[kind]}`}
      aria-hidden
    />
  );
}
