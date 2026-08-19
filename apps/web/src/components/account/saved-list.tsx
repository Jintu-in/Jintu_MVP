"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { consumeSave, removeSave } from "@/actions/saves";
import type { SavedItem } from "@/lib/saved";

/**
 * The saved queue, as a list.
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
    <li className="border-b border-ink-100 py-4 last:border-b-0">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[15px] leading-[1.45] font-medium text-ink-900 hover:text-brand-800"
      >
        {item.title}
      </a>
      <div className="mt-1 font-mono text-[12px] leading-[1.5] text-ink-500">{item.sourceLine}</div>

      {item.editorNote ? (
        <p className="mt-2 max-w-[62ch] text-[13.5px] leading-[1.7] text-pretty text-ink-600">
          {item.editorNote}
        </p>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-1 gap-y-1">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center pr-3 text-[14px] font-medium text-brand-700"
        >
          Open
        </a>
        <button
          type="button"
          disabled={busy}
          onClick={() => read.execute({ resourceId: item.resourceId })}
          className="flex h-12 items-center px-3 text-[14px] font-medium text-brand-700 disabled:text-ink-500"
        >
          Mark as read
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => drop.execute({ resourceId: item.resourceId })}
          className="flex h-12 items-center px-3 text-[14px] text-ink-600 hover:text-ink-900 disabled:text-ink-500"
        >
          Remove
        </button>
        {item.nodeHref ? (
          <Link
            href={item.nodeHref as Route}
            className="flex h-12 items-center px-3 font-mono text-[12px] text-ink-500 hover:text-ink-900"
          >
            where you saved it
          </Link>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-1 text-[13.5px] text-ink-900">
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
      <ul className="mt-2">
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
