import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { safeNextPath } from "@jintu/contracts";
import { JoinForm } from "@/components/join-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // typedRoutes cannot verify a route computed at runtime, so the cast is
  // unavoidable. It is sound because safeNextPath has already rejected
  // anything that is not a same-origin absolute path — see its tests.
  const target = safeNextPath(next) as Route;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(target);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <JoinForm next={target} />
      <p className="mt-6 text-center text-sm text-ink-500">
        <Link href="/" className="hover:text-brand-800">
          Back to Jintu
        </Link>
      </p>
    </main>
  );
}
