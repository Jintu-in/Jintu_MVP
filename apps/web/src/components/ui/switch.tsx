import { cn } from "@/lib/utils";

/**
 * The on/off switch drawn across every V2Settings/V2Consents row — extracted
 * because reminders-card.tsx, public-profile-card.tsx and the old
 * consent-row.tsx each built the same `role="switch"` button independently
 * and had started to drift (one used `border-brand-700`, another didn't).
 */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 flex-none rounded-full border transition-colors",
        checked ? "border-night-900 bg-night-900" : "border-ink-200 bg-ink-100",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
          checked ? "left-[26px]" : "left-0.5",
        )}
      />
    </button>
  );
}
