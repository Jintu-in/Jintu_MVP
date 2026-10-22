import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { Steps } from "@/components/steps";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Finish setting up",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/onboarding");

  // Already onboarded — the profile row is the marker, because Law 3 means a
  // profile cannot exist without the 18+ confirmation having been given.
  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, need")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) {
    // goal/need (Phase 4 Part A, migration 0028) are a short first-run flow
    // of their own, after consent and before anywhere real — resume there if
    // it was never finished, same as this page's own next-step link.
    redirect(profile.goal && profile.need ? "/profile" : "/onboarding/goal");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-10 sm:py-14">
      <Steps current={3} label="Your profile" />

      <h1 className="t-page mt-6 text-ink-900">One last step</h1>
      <p className="mt-2 text-[16px] leading-[1.5] text-pretty text-ink-600">
        Two things we need, three you can choose.
      </p>

      <div className="mt-8">
        <OnboardingForm />
      </div>
    </main>
  );
}
