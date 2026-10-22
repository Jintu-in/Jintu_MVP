import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AvatarPicker } from "@/components/avatar/avatar-picker";
import { DEFAULT_ANIMAL, DEFAULT_COLOR, isAnimalKey, isColorKey } from "@/components/avatar/avatar-kit";
import { getAccount } from "@/lib/account";

export const metadata: Metadata = {
  title: "Your avatar",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ProfileAvatarPage() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/profile/avatar");

  const name = account.displayName ?? account.fullName ?? "Your account";
  const animal = account.avatarAnimal && isAnimalKey(account.avatarAnimal) ? account.avatarAnimal : DEFAULT_ANIMAL;
  const color = account.avatarColor && isColorKey(account.avatarColor) ? account.avatarColor : DEFAULT_COLOR;

  return <AvatarPicker name={name} initialAnimal={animal} initialColor={color} />;
}
