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
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) redirect("/account");

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <Steps current={3} label="Your profile" />

      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900">
        Two things before we start
      </h1>
      <p className="mt-2 text-pretty text-ink-600">
        One is required by law. The rest are yours to choose, and you can change
        them whenever you like.
      </p>

      <div className="mt-8">
        <OnboardingForm />
      </div>
    </main>
  );
}
