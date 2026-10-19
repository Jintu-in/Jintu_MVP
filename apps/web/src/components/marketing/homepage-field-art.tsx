import type { RoleDomain } from "@/content/roles";

/**
 * The ten field illustrations on the homepage's "whatever you want to do"
 * grid — one per `RoleDomain`, geometry copied verbatim from
 * `design/jintu-design/screens/V2Landing.dc.html` (each card's inline SVG,
 * `viewBox="0 0 320 180"`). Hand-drawn, not generated, so they are kept as
 * literal markup rather than derived from a prop — there is nothing about a
 * domain a few numbers could redraw this from.
 *
 * All ten are decorative: the card's own heading and role list carry the
 * information, so every svg here stays `aria-hidden`.
 */

type ArtProps = { className?: string };

export function SoftwareFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF3F7" />
      <circle cx="160" cy="96" r="78" fill="#C4E9F0" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <rect x="70" y="39" width="172" height="116" rx="12" fill="#0A3B46" opacity="0.1" />
      <rect x="70" y="34" width="172" height="116" rx="12" fill="#FFFFFF" />
      <path d="M70 58v-12a12 12 0 0 1 12 -12h148a12 12 0 0 1 12 12v12z" fill="#0A3B46" />
      <circle cx="86" cy="46" r="4" fill="#FFB627" />
      <circle cx="100" cy="46" r="4" fill="#43B4C8" />
      <circle cx="114" cy="46" r="4" fill="#FFFFFF" />
      <rect x="82" y="68" width="38" height="70" rx="6" fill="#DDF3F7" />
      <rect x="88" y="76" width="22" height="5" rx="2.5" fill="#A8DDE7" />
      <rect x="88" y="88" width="26" height="5" rx="2.5" fill="#A8DDE7" />
      <rect x="88" y="100" width="18" height="5" rx="2.5" fill="#A8DDE7" />
      <rect x="128" y="68" width="102" height="34" rx="6" fill="#43B4C8" />
      <circle cx="146" cy="85" r="8" fill="#FFFFFF" />
      <rect x="160" y="78" width="44" height="5" rx="2.5" fill="#FFFFFF" />
      <rect x="160" y="88" width="28" height="5" rx="2.5" fill="#0A3B46" />
      <rect x="128" y="108" width="48" height="30" rx="6" fill="#FFF1D1" />
      <rect x="182" y="108" width="48" height="30" rx="6" fill="#DDF4EA" />
      <g transform="translate(236 118)">
        <path d="M0 0v34l9 -8l7 15l8 -4l-7 -15h12z" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(262 46)">
        <rect x="-17" y="-17" width="34" height="34" rx="9" fill="#FFB627" />
        <path d="M-5 -6l-6 6l6 6M5 -6l6 6l-6 6" fill="none" stroke="#0A3B46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function DataFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF3F7" />
      <circle cx="150" cy="96" r="80" fill="#C4E9F0" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <polygon points="167.8,96.2 167.8,103.8 157.2,108.9 155.1,114.5 160.0,125.2 155.1,131.1 143.7,128.1 138.5,131.1 135.4,142.5 127.8,143.8 121.0,134.2 115.1,133.2 105.4,139.9 98.8,136.0 99.7,124.3 95.9,119.7 84.1,118.6 81.5,111.4 89.8,103.0 89.8,97.0 81.5,88.6 84.1,81.4 95.9,80.3 99.7,75.7 98.8,64.0 105.4,60.1 115.1,66.8 121.0,65.8 127.8,56.2 135.4,57.5 138.5,68.9 143.7,71.9 155.1,68.9 160.0,74.8 155.1,85.5 157.2,91.1" fill="#0A3B46" stroke="#0A3B46" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="124" cy="100" r="15.0" fill="#C4E9F0" />
      <polygon points="212.8,57.0 212.8,63.0 205.9,67.0 203.8,71.2 205.1,79.1 200.4,82.9 193.0,79.9 188.4,80.9 183.0,86.8 177.1,85.5 174.8,77.8 171.1,74.9 163.1,74.4 160.5,68.9 165.1,62.4 165.1,57.6 160.5,51.1 163.1,45.6 171.1,45.1 174.8,42.2 177.1,34.5 183.0,33.2 188.4,39.1 193.0,40.1 200.4,37.1 205.1,40.9 203.8,48.8 205.9,53.0" fill="#FFB627" stroke="#FFB627" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="186" cy="60" r="9.2" fill="#C4E9F0" />
      <rect x="190" y="97" width="84" height="64" rx="10" fill="#0A3B46" opacity="0.1" />
      <rect x="190" y="92" width="84" height="64" rx="10" fill="#FFFFFF" />
      <circle cx="206" cy="108" r="6.5" fill="#43B4C8" />
      <path d="M203.0 108l2.0 2.25l4.0 -4.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="220" y="104.5" width="40" height="7" rx="3.5" fill="#A8DDE7" />
      <circle cx="206" cy="125" r="6.5" fill="#43B4C8" />
      <path d="M203.0 125l2.0 2.25l4.0 -4.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="220" y="121.5" width="32" height="7" rx="3.5" fill="#A8DDE7" />
      <circle cx="206" cy="142" r="6.5" fill="#DCE6E7" />
      <rect x="220" y="138.5" width="24" height="7" rx="3.5" fill="#DCE6E7" />
    </svg>
  );
}

export function ProductFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF4EA" />
      <circle cx="160" cy="96" r="78" fill="#C2EAD7" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <rect x="70" y="41" width="180" height="114" rx="12" fill="#0A3B46" opacity="0.1" />
      <rect x="70" y="36" width="180" height="114" rx="12" fill="#FFFFFF" />
      <rect x="82" y="48" width="28" height="8" rx="4.0" fill="#A8DDE7" />
      <rect x="82" y="64" width="46" height="22" rx="6" fill="#DDF3F7" />
      <rect x="88" y="70" width="22" height="4" rx="2.0" fill="#A8DDE7" />
      <rect x="82" y="92" width="46" height="30" rx="6" fill="#DDF3F7" />
      <rect x="88" y="98" width="22" height="4" rx="2.0" fill="#A8DDE7" />
      <rect x="82" y="128" width="46" height="18" rx="6" fill="#DDF3F7" />
      <rect x="88" y="134" width="22" height="4" rx="2.0" fill="#A8DDE7" />
      <rect x="138" y="48" width="28" height="8" rx="4.0" fill="#FFB627" />
      <rect x="138" y="64" width="46" height="28" rx="6" fill="#FFF1D1" />
      <rect x="144" y="70" width="22" height="4" rx="2.0" fill="#FFB627" />
      <rect x="138" y="98" width="46" height="20" rx="6" fill="#FFF1D1" />
      <rect x="144" y="104" width="22" height="4" rx="2.0" fill="#FFB627" />
      <rect x="194" y="48" width="28" height="8" rx="4.0" fill="#2FA57A" />
      <rect x="194" y="64" width="46" height="24" rx="6" fill="#DDF4EA" />
      <rect x="200" y="70" width="22" height="4" rx="2.0" fill="#2FA57A" />
      <rect x="176" y="109" width="54" height="30" rx="7" fill="#0A3B46" opacity="0.16" />
      <g transform="rotate(-8 203 119)">
        <rect x="176" y="104" width="54" height="30" rx="7" fill="#0A3B46" />
        <rect x="184" y="112" width="26" height="4" rx="2.0" fill="#FFFFFF" />
        <rect x="184" y="121" width="16" height="4" rx="2.0" fill="#43B4C8" />
      </g>
      <path d="M262 30v52" stroke="#0A3B46" strokeWidth="4" strokeLinecap="round" />
      <path d="M264 32h30l-8 11l8 11h-30z" fill="#FFB627" />
    </svg>
  );
}

export function GtmFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#FFF1D1" />
      <circle cx="170" cy="100" r="78" fill="#FFE3A3" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <rect x="84" y="75" width="84" height="84" rx="12" fill="#0A3B46" opacity="0.1" />
      <path d="M108 76v-12a18 18 0 0 1 36 0v12" fill="none" stroke="#0A3B46" strokeWidth="6" strokeLinecap="round" />
      <rect x="84" y="70" width="84" height="84" rx="12" fill="#43B4C8" />
      <rect x="84" y="70" width="84" height="22" rx="11" fill="#0A3B46" />
      <circle cx="108" cy="82" r="4" fill="#FFFFFF" />
      <circle cx="144" cy="82" r="4" fill="#FFFFFF" />
      <path d="M126 108c-7 -10 -20 -2 -14 8c3 6 14 13 14 13s11 -7 14 -13c6 -10 -7 -18 -14 -8z" fill="#FFFFFF" />
      <path d="M186 140l26 -34l20 14l34 -58" fill="none" stroke="#0A3B46" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M246 58l22 -2l4 22" fill="none" stroke="#0A3B46" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="190" cy="60" r="11" fill="#FFFFFF" />
      <circle cx="190" cy="57" r="4" fill="#43B4C8" />
      <path d="M183 68a7 7 0 0 1 14 0" fill="#43B4C8" />
      <circle cx="214" cy="48" r="11" fill="#FFFFFF" />
      <circle cx="214" cy="45" r="4" fill="#43B4C8" />
      <path d="M207 56a7 7 0 0 1 14 0" fill="#43B4C8" />
      <circle cx="202" cy="82" r="11" fill="#FFFFFF" />
      <circle cx="202" cy="79" r="4" fill="#43B4C8" />
      <path d="M195 90a7 7 0 0 1 14 0" fill="#43B4C8" />
    </svg>
  );
}

export function MarketingFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF3F7" />
      <circle cx="156" cy="96" r="76" fill="#C4E9F0" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <g transform="rotate(-10 150 96)">
        <rect x="126" y="104" width="18" height="40" rx="8" fill="#43B4C8" transform="rotate(14 135 124)" />
        <path d="M102 78l88 -34v100l-88 -34z" fill="#0A3B46" stroke="#0A3B46" strokeWidth="8" strokeLinejoin="round" />
        <rect x="80" y="74" width="30" height="40" rx="9" fill="#43B4C8" />
        <ellipse cx="192" cy="94" rx="9" ry="50" fill="#FFB627" />
        <path d="M216 72q14 22 0 44M232 58q24 36 0 72" fill="none" stroke="#F29D00" strokeWidth="5" strokeLinecap="round" />
      </g>
      <rect x="232" y="31" width="58" height="36" rx="14" fill="#0A3B46" opacity="0.1" />
      <rect x="232" y="26" width="58" height="36" rx="14" fill="#FFFFFF" />
      <path d="M246 58l-4 14l16 -12z" fill="#FFFFFF" />
      <circle cx="249" cy="44" r="4" fill="#43B4C8" />
      <circle cx="261" cy="44" r="4" fill="#43B4C8" />
      <circle cx="273" cy="44" r="4" fill="#43B4C8" />
      <path d="M48 60c0 -7 10 -8 11 -1c1 -7 11 -6 11 1c0 7 -11 13 -11 13s-11 -6 -11 -13z" fill="#FFB627" />
    </svg>
  );
}

export function DesignFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF4EA" />
      <circle cx="160" cy="96" r="78" fill="#C2EAD7" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <rect x="92" y="39" width="136" height="112" rx="12" fill="#0A3B46" opacity="0.1" />
      <rect x="92" y="34" width="136" height="112" rx="12" fill="#FFFFFF" />
      <circle cx="132" cy="80" r="22" fill="#FFB627" />
      <rect x="150" y="62" width="46" height="46" rx="9" fill="#43B4C8" opacity="0.92" />
      <rect x="146" y="58" width="54" height="54" fill="none" stroke="#0A3B46" strokeWidth="2" />
      <rect x="142" y="54" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="2" />
      <rect x="196" y="54" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="2" />
      <rect x="142" y="108" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="2" />
      <rect x="196" y="108" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="2" />
      <circle cx="110" cy="130" r="6" fill="#0A3B46" />
      <circle cx="128" cy="130" r="6" fill="#43B4C8" />
      <circle cx="146" cy="130" r="6" fill="#FFB627" />
      <circle cx="164" cy="130" r="6" fill="#2FA57A" />
      <g transform="translate(222 96) rotate(40)">
        <rect x="-9" y="-58" width="18" height="52" rx="4" fill="#0A3B46" />
        <rect x="-9" y="-58" width="18" height="12" rx="4" fill="#FFB627" />
        <path d="M-9 -8h18l-9 20z" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M-2.5 6h5l-2.5 6z" fill="#0A3B46" />
      </g>
    </svg>
  );
}

export function OperationsFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF3F7" />
      <circle cx="150" cy="96" r="80" fill="#C4E9F0" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <rect x="70" y="39" width="172" height="116" rx="12" fill="#0A3B46" opacity="0.1" />
      <rect x="70" y="34" width="172" height="116" rx="12" fill="#FFFFFF" />
      <path d="M70 58v-12a12 12 0 0 1 12 -12h148a12 12 0 0 1 12 12v12z" fill="#0A3B46" />
      <circle cx="86" cy="46" r="4" fill="#FFB627" />
      <circle cx="100" cy="46" r="4" fill="#43B4C8" />
      <circle cx="114" cy="46" r="4" fill="#FFFFFF" />
      <rect x="82" y="68" width="38" height="70" rx="6" fill="#DDF3F7" />
      <rect x="88" y="76" width="22" height="5" rx="2.5" fill="#A8DDE7" />
      <rect x="88" y="88" width="26" height="5" rx="2.5" fill="#A8DDE7" />
      <rect x="88" y="100" width="18" height="5" rx="2.5" fill="#A8DDE7" />
      <rect x="128" y="68" width="102" height="34" rx="6" fill="#43B4C8" />
      <circle cx="146" cy="85" r="8" fill="#FFFFFF" />
      <rect x="160" y="78" width="44" height="5" rx="2.5" fill="#FFFFFF" />
      <rect x="160" y="88" width="28" height="5" rx="2.5" fill="#0A3B46" />
      <rect x="128" y="108" width="48" height="30" rx="6" fill="#FFF1D1" />
      <rect x="182" y="108" width="48" height="30" rx="6" fill="#DDF4EA" />
      <g transform="translate(236 118)">
        <path d="M0 0v34l9 -8l7 15l8 -4l-7 -15h12z" fill="#FFFFFF" stroke="#0A3B46" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(262 46)">
        <rect x="-17" y="-17" width="34" height="34" rx="9" fill="#FFB627" />
        <path d="M-5 -6l-6 6l6 6M5 -6l6 6l-6 6" fill="none" stroke="#0A3B46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function HealthFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#DDF3F7" />
      <circle cx="160" cy="96" r="78" fill="#C4E9F0" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <rect x="112" y="39" width="96" height="122" rx="12" fill="#0A3B46" opacity="0.1" />
      <rect x="112" y="34" width="96" height="122" rx="12" fill="#FFFFFF" />
      <rect x="140" y="25" width="40" height="20" rx="7" fill="#0A3B46" />
      <circle cx="160" cy="80" r="19" fill="#FFB627" />
      <path d="M160 71v18M151 80h18" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      <rect x="128" y="112" width="64" height="7" rx="3.5" fill="#A8DDE7" />
      <rect x="128" y="126" width="44" height="7" rx="3.5" fill="#A8DDE7" />
      <rect x="128" y="140" width="54" height="7" rx="3.5" fill="#A8DDE7" />
      <path d="M36 112h30l8 -16l12 32l9 -16h12" fill="none" stroke="#43B4C8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="rotate(-32 250 108)">
        <rect x="224" y="97" width="52" height="22" rx="11" fill="#FFFFFF" />
        <path d="M250 97h15a11 11 0 0 1 0 22h-15z" fill="#0A3B46" />
      </g>
      <path d="M244 52c0 -8 11 -9 12 -1c1 -8 12 -7 12 1c0 8 -12 15 -12 15s-12 -7 -12 -15z" fill="#43B4C8" />
    </svg>
  );
}

export function FinanceFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#FFF1D1" />
      <circle cx="150" cy="100" r="76" fill="#FFE3A3" />
      <path d="M33 36h10M38 31v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M275 144h10M280 139v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="268" cy="34" r="3.5" fill="#FFFFFF" />
      <circle cx="50" cy="140" r="3.5" fill="#FFFFFF" />
      <circle cx="26" cy="92" r="2.5" fill="#FFFFFF" />
      <path d="M72 150h150" stroke="#0A3B46" strokeWidth="4" strokeLinecap="round" />
      <rect x="84" y="112" width="24" height="34" rx="6" fill="#A8DDE7" />
      <rect x="118" y="92" width="24" height="54" rx="6" fill="#43B4C8" />
      <rect x="152" y="72" width="24" height="74" rx="6" fill="#43B4C8" />
      <rect x="186" y="48" width="24" height="98" rx="6" fill="#0A3B46" />
      <path d="M70 106l38 -22l32 10l52 -48" fill="none" stroke="#F29D00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M178 44h16v16" fill="none" stroke="#F29D00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="250" cy="121" r="27" fill="#F29D00" />
      <circle cx="250" cy="116" r="27" fill="#FFB627" />
      <circle cx="250" cy="116" r="19" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.7" />
      <path d="M242 107h16M242 114h16M246 107c9 0 9 12 0 12l10 10" fill="none" stroke="#0A3B46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OtherFieldArt({ className }: ArtProps) {
  return (
    <svg aria-hidden viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className}>
      <rect width="320" height="180" fill="#FFF1D1" />
      <circle cx="170" cy="90" r="76" fill="#FFE3A3" />
      <g transform="rotate(32 160 92)">
        <path d="M146 132c-6 14 -2 26 14 38c16 -12 20 -24 14 -38z" fill="#F29D00" />
        <path d="M152 132c-3 8 -1 15 8 22c9 -7 11 -14 8 -22z" fill="#FFFFFF" />
        <path d="M134 106l-22 26h26zM186 106l22 26h-26z" fill="#43B4C8" />
        <path d="M160 22c26 22 32 66 22 110h-44c-10 -44 -4 -88 22 -110z" fill="#FFFFFF" />
        <path d="M160 22c12 10 19 24 23 40h-46c4 -16 11 -30 23 -40z" fill="#0A3B46" />
        <circle cx="160" cy="88" r="13" fill="#43B4C8" stroke="#0A3B46" strokeWidth="4" />
        <rect x="140" y="124" width="40" height="10" rx="4" fill="#0A3B46" />
      </g>
      <circle cx="70" cy="150" r="20" fill="#FFFFFF" />
      <circle cx="96" cy="156" r="16" fill="#FFFFFF" />
      <circle cx="46" cy="158" r="14" fill="#FFFFFF" />
      <path d="M250 52l3 8l8 3l-8 3l-3 8l-3 -8l-8 -3l8 -3z" fill="#FFFFFF" />
      <path d="M82 46l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2l6 -2z" fill="#FFFFFF" />
    </svg>
  );
}

/** One lookup, so a card only has to name its domain. */
export const FIELD_ART: Record<RoleDomain, (props: ArtProps) => React.JSX.Element> = {
  software: SoftwareFieldArt,
  data: DataFieldArt,
  product: ProductFieldArt,
  gtm: GtmFieldArt,
  marketing: MarketingFieldArt,
  design: DesignFieldArt,
  operations: OperationsFieldArt,
  health: HealthFieldArt,
  finance: FinanceFieldArt,
  other: OtherFieldArt,
};
