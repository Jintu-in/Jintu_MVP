/**
 * Icons extracted from the lesson design set (docs/design), geometry
 * verbatim. One deliberate adaptation: strokes and fills are
 * `currentColor` instead of hardcoded hexes, so colour comes from the
 * design-token classes at the use site — the files carried #8A8A85 et al.
 * inline, and tokens are what the contrast guard reads.
 *
 * All are decorative (`aria-hidden`); interactive parents carry the labels.
 */
type IconProps = { size?: number; className?: string };

export function BackIcon({ size = 18, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BookmarkIcon({ size = 17, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5.5 3.5h9v13l-4.5-3.4-4.5 3.4v-13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function TickIcon({ size = 11, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CopyIcon({ size = 14, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="2" stroke="currentColor" />
      <path d="M10.5 3.5A2 2 0 0 0 8.5 2H4.5a2 2 0 0 0-2 2v4a2 2 0 0 0 1.5 1.9" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

export function EyeIcon({ size = 16, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M1.5 9S4.4 4 9 4s7.5 5 7.5 5-2.9 5-7.5 5S1.5 9 1.5 9Z" stroke="currentColor" />
      <circle cx="9" cy="9" r="2.1" stroke="currentColor" />
    </svg>
  );
}

export function DocFileIcon({ size = 15, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 2.5h5l3 3v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5Z" stroke="currentColor" />
      <path d="M9 2.5v3h3M5.8 8.5h4.4M5.8 11h3" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

export function VideoTileIcon({ size = 15, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" />
      <path d="M6.6 6.3 10 8l-3.4 1.7V6.3Z" fill="currentColor" />
    </svg>
  );
}

export function PlayCircleIcon({ size = 14, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" />
      <path d="M6.8 5.6 10.4 8l-3.6 2.4V5.6Z" fill="currentColor" />
    </svg>
  );
}

export function ExternalIcon({ size = 11, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M4 2.5h5.5V8M9.3 2.7 2.5 9.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

export function CcPersonIcon({ size = 15, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.3" stroke="currentColor" />
      <path d="M5.6 9.4a2.6 2.6 0 1 0 0-2.9M10.4 9.4a2.6 2.6 0 1 0 0-2.9" stroke="currentColor" strokeWidth=".9" />
    </svg>
  );
}

/* ── Nav icons ─────────────────────────────────────────────────────────────
 * The four shell nav items (Today/Roadmaps/Roles/Profile), geometry copied
 * verbatim from design/jintu-design/screens/DeskToday.dc.html and
 * V2Today.dc.html — both screens draw the same four paths at 24×24, stroke
 * width 2, round caps/joins. Sized at 22 by default (the desktop sidebar's
 * size); the phone tab bar asks for 24 explicitly. */

export function TodayNavIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

export function RoadmapsNavIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />
    </svg>
  );
}

export function RolesNavIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function ProfileNavIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 19c1.2-3 4-4.5 7-4.5s5.8 1.5 7 4.5" />
    </svg>
  );
}
