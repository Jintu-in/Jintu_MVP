import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { COMPARISONS, ROLES, populatedDomains, rolesInDomain } from "@/content/roles";

/**
 * The domain-first entry point.
 *
 * The catalogue asks "which of eight roadmaps do you want", which assumes
 * the visitor already knows the vocabulary. Most do not: they know they want
 * a job and cannot yet name it. This page asks the question that comes
 * first — what do you want to DO — and routes domain → role → roadmap.
 *
 * The comparisons sit above the domains deliberately. They are what people
 * actually search for, and somebody who lands here from "data analyst vs
 * business analyst" should see that answered before a grid of everything.
 */
export const metadata: Metadata = {
  title: "Roles",
  description:
    "What each job actually is, what it is not, and which roadmap gets you there. Written plainly, with no salary guesses.",
  alternates: { canonical: "/roles" },
};

export default function RolesIndex() {
  const domains = populatedDomains();
  const routed = ROLES.filter((r) => r.startHere.kind === "roadmaps").length;

  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
        Roles
      </div>
      <h1 className="t-page mt-3 text-ink-900">What job is this, and is it me?</h1>
      <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.65] text-pretty text-ink-600">
        Picking a roadmap assumes you already know what the jobs are. Most people do not — the
        titles overlap, the adverts contradict each other, and the ones that sound similar are
        often completely different work. These pages say what each role actually is, what it is
        not, and what is hard about it.
      </p>
      {/* Said plainly rather than implied: some of these have no roadmap, and
          a page that hid that would be the kind of thing this site exists not
          to be. */}
      <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.6] text-pretty text-ink-500">
        {ROLES.length} roles, {routed} of which end in a roadmap we have built. The rest say so
        and point at what to read instead.
      </p>

      <section className="mt-12">
        <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
          Told apart
        </div>
        <h2 className="t-sub mt-3 text-ink-900">The ones people cannot distinguish</h2>
        <ul className="mt-5 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/roles/compare/${c.slug}` as Route}
                className="jcard-hover block rounded-card border border-ink-100 bg-white p-4 hover:border-brand-700"
              >
                <div className="text-[15px] leading-[1.4] font-medium text-ink-900">{c.title}</div>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-pretty text-ink-600">
                  {c.standfirst}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {domains.map((d) => (
        <section key={d.key} className="mt-12 border-t border-ink-100 pt-8">
          <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
            {d.blurb}
          </div>
          <h2 className="t-sub mt-3 text-ink-900">{d.label}</h2>
          <ul className="mt-5 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {rolesInDomain(d.key).map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/roles/${r.slug}` as Route}
                  className="jcard-hover block rounded-card border border-ink-100 bg-white p-4 hover:border-brand-700"
                >
                  <div className="text-[16px] leading-[1.35] font-medium text-ink-900">
                    {r.title}
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-pretty text-ink-600">
                    {r.standfirst}
                  </p>
                  <div className="mt-2.5 font-mono text-[11.5px] leading-none text-ink-500">
                    {r.startHere.kind === "roadmaps"
                      ? `${r.startHere.picks.length} roadmap${r.startHere.picks.length > 1 ? "s" : ""}`
                      : "no roadmap yet"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-12 rounded-card border border-ink-100 bg-white p-6 sm:p-8">
        <h2 className="t-sub text-ink-900">Know what you want already?</h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          Skip all of this and go straight to the material.
        </p>
        <Link
          href={"/learn" as Route}
          className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-700 px-5 text-[15px] font-medium text-white hover:bg-brand-800"
        >
          Browse the roadmaps
        </Link>
      </section>
    </main>
  );
}
