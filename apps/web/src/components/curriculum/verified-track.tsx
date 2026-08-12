"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Track, type Unit, checkKind, CHECK_LABEL, verificationMix,
} from "@/lib/tracks-shared";
import { VerificationStrip, StripLegend, CheckDot } from "./verification-strip";
import { ResourceRow } from "./resource-row";

/**
 * The map. Every unit visible at once, always, while one expands below.
 *
 * Why not a document: a page of stacked blocks never tells you how big the
 * thing is or where you are in it. A stranger arriving from WhatsApp has about
 * forty seconds to decide whether this is real. The map answers that; a
 * document makes them scroll to find out.
 *
 * ARIA: this is a genuine tablist. Roving tabindex, arrow keys move selection,
 * Home/End jump to the ends. Keyboard navigation is most of the difference
 * between a website and a tool.
 */

export function VerifiedTrack({ track }: { track: Track }) {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const mix = verificationMix(track);

  // Deep link (?unit=4) read on the CLIENT, on mount — audit bug (b): reading
  // searchParams in the server component opts the whole route into dynamic
  // rendering. The server renders unit 1; this corrects after hydration, and
  // subsequent arrow keys keep the URL in sync without a navigation.
  // Effectively mount-only (a track's unit count is fixed for the page's
  // life); later changes to ?unit come FROM this component via replaceState,
  // which does not re-fire this.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("unit"));
    if (Number.isFinite(n) && n >= 1 && n <= track.units.length) setSel(n - 1);
  }, [track.units.length]);

  // Shareable without a navigation. replaceState keeps ?unit in sync so a
  // reader can copy the URL for one unit, and avoids a server round-trip on
  // every arrow key.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("unit", String(track.units[sel]?.unitNo ?? 1));
    window.history.replaceState(null, "", url);
  }, [sel, track.units]);

  const move = useCallback((next: number) => {
    const i = Math.max(0, Math.min(track.units.length - 1, next));
    setSel(i);
    tabs.current[i]?.focus();
  }, [track.units.length]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); move(i + 1); }
    else if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); move(i - 1); }
    else if (k === "Home") { e.preventDefault(); move(0); }
    else if (k === "End") { e.preventDefault(); move(track.units.length - 1); }
  };

  const unit = track.units[sel];

  return (
    <main className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-ink-500">
        <Link href="/learn" className="hover:text-brand-700">Tracks</Link>
        <span className="mx-1.5" aria-hidden>/</span>
        <span className="text-ink-600">{track.title}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-check-machine/12 px-2.5 py-1 font-mono text-[11px] tracking-wide text-check-machine-ink">
            Verified
          </span>
        </div>

        <h1 className="text-[27px] leading-tight font-medium tracking-[-0.02em] text-ink-900 sm:text-[32px]">
          {track.title}
        </h1>
        {track.oneLine && (
          <p className="mt-2.5 max-w-[54ch] text-[15px] leading-relaxed text-ink-600">
            {track.oneLine}
          </p>
        )}
      </header>

      <dl className="mb-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat label="points" value={mix.total} />
        <Stat label="machine-checked" value={`${Math.round(mix.machineShare * 100)}%`} />
        <Stat label="artifacts" value={track.units.length} />
        <Stat label="weeks" value={track.units.length} />
      </dl>

      <div className="mb-2.5">
        <VerificationStrip mix={mix} />
      </div>
      <div className="mb-9">
        <StripLegend mix={mix} />
      </div>

      <div
        role="tablist"
        aria-label="Units"
        aria-orientation="horizontal"
        className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-6"
      >
        {track.units.map((u, i) => (
          <Tile
            key={u.id}
            ref={(el) => { tabs.current[i] = el; }}
            unit={u}
            selected={i === sel}
            onSelect={() => setSel(i)}
            onKeyDown={(e) => onKey(e, i)}
          />
        ))}
      </div>

      {unit && (
        <section
          role="tabpanel"
          id={`panel-${unit.unitNo}`}
          aria-labelledby={`tab-${unit.unitNo}`}
          tabIndex={-1}
          className="animate-in"
        >
          <UnitDetail unit={unit} />
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href={`/start/${track.slug}?unit=${unit.unitNo}`}
              className="flex h-12 items-center rounded-lg bg-brand-700 px-4 text-sm font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Start unit {String(unit.unitNo).padStart(2, "0")}
            </Link>
            {sel < track.units.length - 1 && (
              <button
                onClick={() => move(sel + 1)}
                className="flex h-12 items-center rounded-lg border border-ink-200 px-4 text-sm text-ink-800 hover:border-brand-600"
              >
                Next unit
              </button>
            )}
          </div>
        </section>
      )}

      <p className="mt-12 border-t border-ink-100 pt-6 text-[13px] leading-relaxed text-ink-500">
        Every rubric above is readable before you start, and nothing here is held
        back for people who sign up.{" "}
        <Link href="/report" className="text-brand-700 underline underline-offset-2">
          Something broken or out of date?
        </Link>
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white px-3.5 py-3">
      <dd className="font-mono text-[21px] leading-none tabular-nums text-ink-900">{value}</dd>
      <dt className="mt-1.5 text-xs text-ink-500">{label}</dt>
    </div>
  );
}

/**
 * A tile names what you HAND IN, not what you study. "Defect audit" rather
 * than "Data cleaning fundamentals" — that is the difference between a
 * portfolio and a syllabus, and it is the first thing a reader sees.
 *
 * Audit bug (g): this was `as React.FC<any>` to smuggle a ref through. In
 * React 19 ref is an ordinary prop on function components, so it is typed
 * like one and the cast — and everything it was hiding — is gone.
 */
function Tile({
  unit, selected, onSelect, onKeyDown, ref,
}: {
  unit: Unit;
  selected: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  ref: React.Ref<HTMLButtonElement>;
}) {
  const mix = unit.criteria.reduce(
    (a, c) => { a[checkKind(c.check)] += c.weight; a.total += c.weight; return a; },
    { machine: 0, peer: 0, model: 0, total: 0 },
  );
  return (
    <button
      ref={ref}
      role="tab"
      id={`tab-${unit.unitNo}`}
      aria-selected={selected}
      aria-controls={`panel-${unit.unitNo}`}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
        selected
          ? "border-brand-600 bg-brand-50"
          : "border-ink-200 bg-white hover:border-brand-600"
      }`}
    >
      <VerificationStrip mix={mix} height="h-[3px]" className="mb-2" />
      <span className="block font-mono text-[10px] text-ink-500">
        {String(unit.unitNo).padStart(2, "0")}
      </span>
      <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-900">
        {unit.makes}
      </span>
      <span className="mt-1 block font-mono text-[10px] tabular-nums text-ink-500">
        {unit.points} pts
      </span>
    </button>
  );
}

function UnitDetail({ unit }: { unit: Unit }) {
  return (
    <>
      <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5 font-mono text-[11px] text-ink-500">
        <span className="text-brand-700">Unit {String(unit.unitNo).padStart(2, "0")}</span>
      </div>

      <h2 className="text-lg font-medium tracking-[-0.01em] text-ink-900">{unit.title}</h2>
      <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-600">
        {unit.objective}
      </p>

      <div className="mt-5 rounded-card border border-ink-100 bg-white p-4 sm:p-5">
        <p className="mb-2 font-mono text-[11px] tracking-wider text-ink-500 uppercase">
          What you hand in
        </p>
        <p className="text-sm leading-relaxed text-ink-800">{unit.artifactPrompt}</p>

        <p className="mt-5 mb-1 font-mono text-[11px] tracking-wider text-ink-500 uppercase">
          How it is scored · {unit.points} points
        </p>
        <ul>
          {unit.criteria.map((c) => (
            <li
              key={c.name}
              className="flex items-start gap-2.5 border-t border-ink-100 py-2 text-[13.5px]"
            >
              <CheckDot kind={checkKind(c.check)} />
              <span className="flex-1 leading-snug text-ink-800">{c.name}</span>
              <span className="shrink-0 text-xs text-ink-500">
                {CHECK_LABEL[checkKind(c.check)]}
              </span>
              <span className="w-5 shrink-0 text-right font-mono text-xs tabular-nums text-ink-500">
                {c.weight}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources come last on purpose. Anyone can list free links; it is the
          least differentiated thing on the page. */}
      {unit.resources.length > 0 && (
        <>
          <p className="mt-6 mb-0.5 font-mono text-[11px] tracking-wider text-ink-500 uppercase">
            Free sources · {unit.resources.length}
          </p>
          <ul>
            {unit.resources.map((r, i) => <ResourceRow key={i} resource={r} />)}
          </ul>
        </>
      )}
    </>
  );
}
