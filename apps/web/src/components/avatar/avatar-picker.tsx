"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { setAvatar } from "@/actions/account";
import { ANIMALS, COLORS, AvatarGlyph, type AnimalKey, type ColorKey } from "@/components/avatar/avatar-kit";
import { BackIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const SURPRISE_ICON = (
  <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h3c5 0 5 10 10 10h3" />
    <path d="M4 17h3c2 0 3 -1.5 4 -3" />
    <path d="M14 9c1 -1 2 -2 3 -2h3" />
    <path d="M18 4l3 3l-3 3" />
    <path d="M18 14l3 3l-3 3" />
  </svg>
);

const label = (k: string) => k.charAt(0).toUpperCase() + k.slice(1);

/**
 * /profile/avatar — restyled against V2Avatar.dc.html/DeskAvatar.dc.html.
 * Reachable from the avatar on /profile (ProfileHeader), returns there on
 * Save (the mockup's own back/Save targets are both V2Profile.dc.html).
 *
 * "Surprise me" only changes local state (CHANGES.md item 5: "not saved
 * until Save") — setAvatar only runs when Save is pressed.
 */
export function AvatarPicker({
  name,
  initialAnimal,
  initialColor,
}: {
  name: string;
  initialAnimal: AnimalKey;
  initialColor: ColorKey;
}) {
  const router = useRouter();
  const [animal, setAnimalKey] = useState<AnimalKey>(initialAnimal);
  const [color, setColorKey] = useState<ColorKey>(initialColor);
  const { execute, status, result } = useAction(setAvatar, {
    onSuccess: () => router.push("/profile"),
  });

  const surprise = () => {
    setAnimalKey(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]!);
    setColorKey(COLORS[Math.floor(Math.random() * COLORS.length)]!.key);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex h-16 flex-none items-center gap-3 px-3 pr-5">
        <Link
          href="/profile"
          aria-label="Back"
          className="flex size-11 flex-none items-center justify-center rounded-full bg-white text-ink-900"
        >
          <BackIcon />
        </Link>
        <span className="flex-1 text-[15px] font-semibold text-ink-900">Your avatar</span>
        <button
          type="button"
          onClick={surprise}
          className="flex h-10 flex-none items-center gap-1.5 rounded-20 bg-white px-3.5 text-[13.5px] font-semibold text-link"
        >
          {SURPRISE_ICON}
          <span>Surprise me</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-4.5 rounded-3xl bg-white p-4.5">
          <AvatarGlyph animal={animal} color={color} size={112} className="rounded-full" />
          <div className="flex flex-col gap-1">
            <div className="font-heading text-[26px] leading-[30px] font-bold tracking-[-0.02em] text-ink-900">
              {name}
            </div>
            <div className="text-[14px] leading-[20px] text-ink-600">{label(animal)} · no photo needed</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] leading-[18px] font-semibold text-link">Pick an animal</div>
          <div role="group" aria-label="Animal" className="grid grid-cols-4 justify-between gap-y-3">
            {ANIMALS.map((a) => {
              const on = a === animal;
              return (
                <button
                  key={a}
                  type="button"
                  aria-label={label(a)}
                  aria-pressed={on}
                  onClick={() => setAnimalKey(a)}
                  className={cn(
                    "flex size-[74px] items-center justify-center rounded-full border-[3px] p-0 transition-colors",
                    on ? "border-night-900" : "border-transparent",
                  )}
                >
                  <AvatarGlyph animal={a} color={color} size={64} className="rounded-full" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] leading-[18px] font-semibold text-link">Pick a colour</div>
          <div role="group" aria-label="Background colour" className="flex justify-between">
            {COLORS.map((c) => {
              const on = c.key === color;
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-label={`${label(c.key)} background`}
                  aria-pressed={on}
                  onClick={() => setColorKey(c.key)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border-[3px] p-0 transition-colors",
                    on ? "border-night-900" : "border-transparent",
                  )}
                >
                  <span aria-hidden className="size-[30px] rounded-full" style={{ background: c.hex }} />
                </button>
              );
            })}
          </div>
        </div>

        {result?.serverError ? (
          <p role="alert" className="text-[14px] text-risk-600">
            {result.serverError}
          </p>
        ) : null}
      </div>

      <div className="flex-none border-t border-ink-100 bg-white px-5 pt-3 pb-5">
        <button
          type="button"
          disabled={status === "executing"}
          onClick={() => execute({ avatarAnimal: animal, avatarColor: color })}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand"
        >
          {status === "executing" ? "Saving…" : "Save avatar"}
        </button>
      </div>
    </div>
  );
}
