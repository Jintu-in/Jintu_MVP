import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NeedForm } from "@/components/onboarding/need-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "What do you need most right now?",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OnboardingNeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/onboarding/need");

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, need")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");
  if (!profile.goal) redirect("/onboarding/goal");
  if (profile.need) redirect("/profile");

  return <NeedForm />;
}
