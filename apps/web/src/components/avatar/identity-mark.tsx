import {
  AvatarGlyph,
  DEFAULT_ANIMAL,
  DEFAULT_COLOR,
  isAnimalKey,
  isColorKey,
} from "@/components/avatar/avatar-kit";
import { cn } from "@/lib/utils";

/**
 * The two places the "AV" monogram used to be — the desktop sidebar's
 * account chip and the profile header — per the user's answer to
 * CHANGES.md item 5: the avatar replaces it everywhere, not alongside it.
 *
 * No monogram fallback: every account has a usable default (fox/teal, same
 * as the picker's own default) the moment it exists, so there is no
 * "not chosen yet" state worth drawing differently — just the default
 * animal until someone picks another one.
 */
export function IdentityMark({
  avatarAnimal,
  avatarColor,
  size,
  className,
}: {
  avatarAnimal?: string | null;
  avatarColor?: string | null;
  size: number;
  className?: string;
}) {
  const animal = avatarAnimal && isAnimalKey(avatarAnimal) ? avatarAnimal : DEFAULT_ANIMAL;
  const color = avatarColor && isColorKey(avatarColor) ? avatarColor : DEFAULT_COLOR;

  return <AvatarGlyph animal={animal} color={color} size={size} className={cn("flex-none rounded-full", className)} />;
}
