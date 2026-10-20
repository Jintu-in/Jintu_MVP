"use client";

import { useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { updatePublicProfile } from "@/actions/account";
import { IdentityMark } from "@/components/avatar/identity-mark";
import { SettingsNavIcon } from "@/components/ui/icons";

const EDIT_PENCIL = (
  <svg aria-hidden width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
    <path d="M14 7l3 3" />
  </svg>
);

const SHARE_ICON = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15V4" />
    <path d="M8 8l4-4 4 4" />
    <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </svg>
);

/**
 * The identity header, restyled against V2Profile/V2ProfileNew: monogram,
 * name, handle, a share button. Not editable here — that moved to
 * /settings (Decision 3) — this is display plus one action.
 *
 * A settings gear sits next to the share button on phone, where there is no
 * persistent sidebar to carry it (DeskProfileNew.dc.html draws a "Settings"
 * link in the desktop sidebar's own nav — see desktop-sidebar.tsx — but no
 * phone screen in the pack draws an equivalent entry point, and Settings has
 * to be reachable somehow).
 */
export function ProfileHeader({
  avatarAnimal,
  avatarColor,
  name,
  handle,
  suggestedHandle,
  isPublic,
  siteHost,
}: {
  avatarAnimal: string | null;
  avatarColor: string | null;
  name: string;
  handle: string | null;
  suggestedHandle: string;
  isPublic: boolean;
  siteHost: string;
}) {
  const [pub, setPub] = useState(isPublic);
  const [shownHandle, setShownHandle] = useState(handle);
  const [prompting, setPrompting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { execute, status } = useAction(updatePublicProfile, {
    onSuccess: ({ data }) => {
      if (data) {
        setPub(data.isPublic);
        setShownHandle(data.handle);
        void share(data.isPublic, data.handle);
      }
    },
  });

  const share = async (isNowPublic: boolean, forHandle: string | null) => {
    if (!isNowPublic || !forHandle) return;
    const url = `https://${siteHost}/u/${forHandle}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Cancelling the native share sheet rejects the promise — not an error.
    }
  };

  const onShareClick = () => {
    if (pub) {
      void share(true, shownHandle);
      return;
    }
    setPrompting(true);
  };

  return (
    <div className="flex flex-none flex-col gap-3">
      <div className="flex items-center gap-3.5">
        <Link href="/profile/avatar" aria-label="Change avatar" className="relative flex-none">
          <IdentityMark avatarAnimal={avatarAnimal} avatarColor={avatarColor} size={64} />
          <span
            aria-hidden
            className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-ink-50 bg-white text-ink-700"
          >
            {EDIT_PENCIL}
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[24px] leading-[28px] font-bold tracking-[-0.02em] text-ink-900">
            {name}
          </h1>
          {pub && shownHandle ? (
            <div className="truncate font-mono text-[12.5px] leading-[18px] text-ink-500">
              {siteHost}/u/{shownHandle}
            </div>
          ) : null}
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-11 flex-none items-center justify-center rounded-full bg-white text-ink-900 lg:hidden"
        >
          <SettingsNavIcon size={20} />
        </Link>
        <button
          type="button"
          aria-label="Share profile"
          onClick={onShareClick}
          className="flex size-12 flex-none items-center justify-center rounded-full bg-brand-500 text-on-brand"
        >
          {SHARE_ICON}
        </button>
      </div>

      {copied ? <p role="status" className="text-[13px] text-ok-700">Link copied.</p> : null}

      {prompting ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4">
          <p className="text-[14px] text-pretty text-ink-700">
            Your profile is private. Turn it on to share it?
          </p>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={() => setPrompting(false)}
              className="flex h-10 items-center rounded-lg px-3 text-[13.5px] font-medium text-ink-600"
            >
              Not now
            </button>
            <button
              type="button"
              disabled={status === "executing"}
              onClick={() => {
                setPrompting(false);
                execute({ handle: handle ?? suggestedHandle, isPublic: true });
              }}
              className="flex h-10 items-center rounded-lg bg-night-900 px-3 text-[13.5px] font-semibold text-on-night"
            >
              Turn on
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
