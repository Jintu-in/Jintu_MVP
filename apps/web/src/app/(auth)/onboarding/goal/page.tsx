import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoalForm } from "@/components/onboarding/goal-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "What do you want to become?",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OnboardingGoalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/onboarding/goal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, need")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");
  if (profile.goal && profile.need) redirect("/profile");

  return <GoalForm />;
}
