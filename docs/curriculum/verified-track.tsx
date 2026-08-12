'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type Track, type Unit, checkKind, CHECK_LABEL, verificationMix, totalMinutes,
} from '@/lib/tracks';
import { VerificationStrip, StripLegend, CheckDot } from './verification-strip';
import { ResourceRow } from './resource-row';

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

export function VerifiedTrack({ track, initialUnit }: { track: Track; initialUnit: number }) {
  const [sel, setSel] = useState(initialUnit);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const mix = verificationMix(track);
  const mins = totalMinutes(track);

  // Shareable without a navigation. replaceState keeps ?unit in sync so a
  // reader can copy the URL for one unit, and avoids a server round-trip on
  // every arrow key.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('unit', String(track.units[sel]?.unitNo ?? 1));
    window.history.replaceState(null, '', url);
  }, [sel, track.units]);

  const move = useCallback((next: number) => {
    const i = Math.max(0, Math.min(track.units.length - 1, next));
    setSel(i);
    tabs.current[i]?.focus();
  }, [track.units.length]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); move(i + 1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); move(i - 1); }
    else if (k === 'Home') { e.preventDefault(); move(0); }
    else if (k === 'End') { e.preventDefault(); move(track.units.length - 1); }
  };

  const unit = track.units[sel];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-neutral-400">
        <a href="/learn" className="hover:text-brand-700">Tracks</a>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-500">{track.title}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-check-machine/12 px-2.5 py-1 font-mono text-[11px] tracking-wide text-check-machine-ink">
            Verified
          </span>
          {track.reviewedAt && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-mono text-[11px] text-neutral-500">
              Reviewed {new Date(track.reviewedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          )}
        </div>

        <h1 className="text-[27px] font-medium leading-tight tracking-[-0.02em] text-neutral-950 sm:text-[32px]">
          {track.title}
        </h1>
        {track.oneLine && (
          <p className="mt-2.5 max-w-[54ch] text-[15px] leading-relaxed text-neutral-600">
            {track.oneLine}
          </p>
        )}
      </header>

      <dl className="mb-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat label="points" value={mix.total} />
        <Stat label="machine-checked" value={`${Math.round(mix.machineShare * 100)}%`} />
        <Stat label="artifacts" value={track.units.length} />
        <Stat label="hours" value={mins ? Math.round(mins / 60) : '—'} />
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
            <a
              href={`/start/${track.slug}?unit=${unit.unitNo}`}
              className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm text-white transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Start unit {String(unit.unitNo).padStart(2, '0')}
            </a>
            {sel < track.units.length - 1 && (
              <button
                onClick={() => move(sel + 1)}
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-800 hover:border-neutral-400"
              >
                Next unit
              </button>
            )}
          </div>
        </section>
      )}

      <p className="mt-12 border-t border-neutral-200 pt-6 text-[13px] leading-relaxed text-neutral-500">
        Every rubric above is readable before you start, and nothing here is held
        back for people who sign up.{' '}
        <a href="/report" className="text-brand-700 underline underline-offset-2">
          Something broken or out of date?
        </a>
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3.5 py-3">
      <dd className="font-mono text-[21px] leading-none tabular-nums text-neutral-950">{value}</dd>
      <dt className="mt-1.5 text-xs text-neutral-500">{label}</dt>
    </div>
  );
}

/**
 * A tile names what you HAND IN, not what you study. "Defect audit" rather
 * than "Data cleaning fundamentals" — that is the difference between a
 * portfolio and a syllabus, and it is the first thing a reader sees.
 */
const Tile = ((props: {
  unit: Unit; selected: boolean; onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const { unit, selected, onSelect, onKeyDown, ref } = props;
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
      className={`rounded-[10px] border p-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
        selected
          ? 'border-brand-600 bg-brand-50'
          : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}
    >
      <VerificationStrip mix={mix} height="h-[3px]" className="mb-2" />
      <span className="block font-mono text-[10px] text-neutral-400">
        {String(unit.unitNo).padStart(2, '0')}
      </span>
      <span className="mt-0.5 block text-[12.5px] leading-snug text-neutral-900">
        {unit.makes}
      </span>
      <span className="mt-1 block font-mono text-[10px] tabular-nums text-neutral-400">
        {unit.points} pts
      </span>
    </button>
  );
}) as React.FC<any>;

function UnitDetail({ unit }: { unit: Unit }) {
  return (
    <>
      <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5 font-mono text-[11px] text-neutral-400">
        <span className="text-brand-700">Unit {String(unit.unitNo).padStart(2, '0')}</span>
        {unit.estMinutes && <span>~{Math.round(unit.estMinutes / 60)} hrs</span>}
        {/* Stated, never enforced. Self-paced learners arrive with uneven prior
            knowledge; walling someone behind a unit they already know loses them. */}
        {unit.buildsOn && <span>builds on {unit.buildsOn}</span>}
      </div>

      <h2 className="text-lg font-medium tracking-[-0.01em] text-neutral-950">{unit.title}</h2>
      <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-neutral-600">
        {unit.objective}
      </p>

      <div className="mt-5 rounded-xl bg-neutral-50 p-4 sm:p-5">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          What you hand in
        </p>
        <p className="text-sm leading-relaxed text-neutral-800">{unit.artifactPrompt}</p>

        <p className="mb-1 mt-5 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
          How it is scored · {unit.points} points
        </p>
        <ul>
          {unit.criteria.map((c) => (
            <li
              key={c.name}
              className="flex items-start gap-2.5 border-t border-neutral-200 py-2 text-[13.5px]"
            >
              <CheckDot kind={checkKind(c.check)} />
              <span className="flex-1 leading-snug text-neutral-800">{c.name}</span>
              <span className="shrink-0 text-xs text-neutral-400">
                {CHECK_LABEL[checkKind(c.check)]}
              </span>
              <span className="w-5 shrink-0 text-right font-mono text-xs tabular-nums text-neutral-500">
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
          <p className="mb-0.5 mt-6 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
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
