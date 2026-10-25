"use client";

import { useState } from "react";
import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { consumeSave, removeSave } from "@/actions/saves";
import { ExternalIcon } from "@/components/ui/icons";
import type { SavedItem } from "@/lib/saved";

/**
 * The saved queue, as a list (V2Saved/DeskSaved).
 *
 * "Mark as read" consumes the row rather than deleting it — the list is a
 * queue, not an archive, and the record that a save led to reading is worth
 * keeping. Removing is the other thing, and it says so.
 *
 * Fifty at a time behind a button, never infinite scroll: a list that grows
 * as you scroll has no end and no position, which is exactly wrong for
 * something you are meant to work through and finish.
 */
const PAGE = 50;

function Row({ item, onGone }: { item: SavedItem; onGone: (id: string) => void }) {
  const read = useAction(consumeSave, { onSuccess: () => onGone(item.resourceId) });
  const drop = useAction(removeSave, { onSuccess: () => onGone(item.resourceId) });
  const busy = read.status === "executing" || drop.status === "executing";
  const error = read.result?.serverError ?? drop.result?.serverError;

  return (
    <li className="flex flex-col gap-2.5 rounded-[22px] bg-white p-[18px] shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)] lg:p-[22px]">
      <div className="flex flex-col gap-1">
        <div className="font-mono text-[12.5px] leading-[18px] text-ink-500">{item.sourceLine}</div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading text-[19px] leading-[26px] font-semibold tracking-[-0.01em] text-ink-900 no-underline hover:text-brand-800 lg:text-[21px] lg:leading-7"
        >
          {item.title}
        </a>
        {item.editorNote ? (
          <div className="text-[15px] leading-[22px] text-ink-600">{item.editorNote}</div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 flex-none items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-4.5 text-[14.5px] font-semibold text-on-brand no-underline"
        >
          <ExternalIcon size={16} />
          <span>Open</span>
        </a>
        <button
          type="button"
          disabled={busy}
          onClick={() => read.execute({ resourceId: item.resourceId })}
          className="flex h-11 flex-none items-center justify-center rounded-2xl border border-ink-200 px-4 text-[14.5px] font-semibold text-ink-900 disabled:text-ink-500"
        >
          Mark as read
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => drop.execute({ resourceId: item.resourceId })}
          className="flex h-11 flex-none items-center justify-center rounded-2xl px-2.5 text-[14.5px] font-semibold text-link disabled:text-ink-500"
        >
          Remove
        </button>
      </div>

      {item.provenance ? (
        <a
          href={item.nodeHref as Route}
          className="self-start text-[13.5px] leading-5 font-semibold text-ink-900 no-underline lg:min-h-7"
        >
          {item.provenance}
        </a>
      ) : null}

      {error ? (
        <p role="alert" className="text-[13.5px] text-ink-900">
          {error}
        </p>
      ) : null}
    </li>
  );
}

export function SavedList({ items }: { items: SavedItem[] }) {
  const [gone, setGone] = useState<Set<string>>(new Set());
  const [shown, setShown] = useState(PAGE);

  const live = items.filter((i) => !gone.has(i.resourceId));
  const visible = live.slice(0, shown);
  const remaining = live.length - visible.length;

  const onGone = (id: string) => setGone((s) => new Set(s).add(id));

  if (live.length === 0) {
    return (
      <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        Tap save on any resource you want to come back to. They wait here, not in
        a browser tab you will close.
      </p>
    );
  }

  return (
    <>
      <ul className="mt-2 flex flex-col gap-3 pl-0 lg:gap-3.5">
        {visible.map((i) => (
          <Row key={i.resourceId} item={i} onGone={onGone} />
        ))}
      </ul>
      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE)}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-brand-700 hover:border-brand-700"
        >
          Show more ({remaining})
        </button>
      ) : null}
    </>
  );
}
