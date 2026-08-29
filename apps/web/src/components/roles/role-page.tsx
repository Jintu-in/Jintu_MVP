import Link from "next/link";
import type { Route } from "next";
import type { Comparison, Role } from "@/content/roles";

/**
 * A role page: what the job is, what it is not, and where to start.
 *
 * The section order is the order a stranger asks the questions in — what is
 * it, what would my week look like, is it the thing I am confusing it with,
 * what do I need, how do people get in, what happens next, what is hard —
 * and it ends in the catalogue, because everything on this site does.
 *
 * "What is hard" is deliberately near the end and deliberately blunt. A
 * careers page that only sells is the genre; the sentence about who should
 * not do this job is the reason to trust the rest of the page.
 */

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink-100 pt-8">
      <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
        {kicker}
      </div>
      <h2 className="t-sub mt-3 text-ink-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="flex max-w-[62ch] list-none flex-col gap-3 p-0">
    {items.map((t) => (
      <li key={t} className="flex gap-3.5">
        <span aria-hidden className="mt-[13px] h-px w-4 flex-none bg-ink-200" />
        <span className="text-[15px] leading-[1.7] text-pretty text-ink-900">{t}</span>
      </li>
    ))}
  </ul>
);

export function RolePage({ role, comparisons }: { role: Role; comparisons: Comparison[] }) {
  return (
    <main className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
        Role
      </div>
      <h1 className="t-page mt-3 text-ink-900">{role.title}</h1>
      {role.aliases?.length ? (
        // The names job adverts actually use. The person searching almost
        // never types the canonical title, so these belong on the page, not
        // only in metadata.
        <p className="mt-2.5 font-mono text-[12px] leading-[1.6] text-ink-500">
          Also advertised as: {role.aliases.join(" · ")}
        </p>
      ) : null}
      <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.65] text-pretty text-ink-600">
        {role.standfirst}
      </p>
      <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.6] text-pretty text-ink-500">
        {role.entry}
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <Section kicker="The work" title="What they actually do">
          <div className="flex max-w-[62ch] flex-col gap-4">
            {role.whatTheyDo.map((p) => (
              <p key={p} className="text-[15px] leading-[1.7] text-pretty text-ink-900">
                {p}
              </p>
            ))}
          </div>
        </Section>

        <Section kicker="The week" title="A typical week">
          <Bullets items={role.typicalWeek} />
        </Section>

        <Section kicker="The confusion" title="What it is not">
          <ul className="flex max-w-[62ch] list-none flex-col gap-4 p-0">
            {role.whatItIsNot.map((n) => (
              <li key={n.line}>
                <p className="text-[15px] leading-[1.7] text-pretty text-ink-900">{n.line}</p>
                {n.compare ? (
                  <Link
                    href={`/roles/compare/${n.compare}` as Route}
                    className="mt-1.5 inline-block text-[14px] font-medium text-brand-700 hover:text-brand-800"
                  >
                    Compare them side by side →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>

        <Section kicker="The org" title="Who they work with">
          <ul className="flex max-w-[62ch] list-none flex-col gap-3 p-0">
            {role.worksWith.map((w) => (
              <li key={w.who} className="text-[15px] leading-[1.7] text-pretty text-ink-900">
                <span className="font-medium">{w.who}</span>
                <span className="text-ink-600"> — {w.on}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section kicker="The skills" title="What actually matters">
          <div className="flex flex-col gap-7">
            <div>
              <h3 className="text-[15px] font-medium text-ink-900">Must have</h3>
              <div className="mt-3">
                <Bullets items={role.skills.must} />
              </div>
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-ink-900">Helps</h3>
              <div className="mt-3">
                <Bullets items={role.skills.helps} />
              </div>
            </div>
            <div>
              {/* The section nobody else writes, and the reason to read this
                  page instead of a job advert. */}
              <h3 className="text-[15px] font-medium text-ink-900">
                Asked for more than it is needed
              </h3>
              <div className="mt-3">
                <Bullets items={role.skills.overrated} />
              </div>
            </div>
          </div>
        </Section>

        <Section kicker="The way in" title="How people actually get in">
          <Bullets items={role.howPeopleGetIn} />
        </Section>

        <Section kicker="The ladder" title="Levels, and what changes">
          <ul className="flex max-w-[62ch] list-none flex-col gap-4 p-0">
            {role.levels.map((l) => (
              <li key={l.name} className="border-l-2 border-ink-100 pl-4">
                <div className="text-[15px] font-medium text-ink-900">{l.name}</div>
                <p className="mt-1 text-[14.5px] leading-[1.65] text-pretty text-ink-600">
                  {l.whatChanges}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section kicker="Honestly" title="What is hard about it">
          <p className="max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-900">
            {role.whatIsHard}
          </p>
        </Section>

        {comparisons.length ? (
          <Section kicker="Compare" title="Told apart from the roles it is confused with">
            <ul className="flex list-none flex-col gap-2.5 p-0">
              {comparisons.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/roles/compare/${c.slug}` as Route}
                    className="text-[15px] leading-[1.6] font-medium text-brand-700 hover:text-brand-800"
                  >
                    {c.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Everything ends in the catalogue, or says plainly that it cannot. */}
        <section className="rounded-card border border-ink-100 bg-white p-6 sm:p-8">
          <div className="font-mono text-[11px] leading-none tracking-[.1em] text-ink-500 uppercase">
            Where to start
          </div>
          {role.startHere.kind === "roadmaps" ? (
            <>
              <h2 className="t-sub mt-3 text-ink-900">Start here on Jintu</h2>
              <ul className="mt-5 flex list-none flex-col gap-4 p-0">
                {role.startHere.picks.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/learn/${p.slug}` as Route}
                      className="text-[16px] leading-[1.4] font-medium text-brand-700 hover:text-brand-800"
                    >
                      {p.slug.replace(/-/g, " ")} →
                    </Link>
                    <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.65] text-pretty text-ink-600">
                      {p.note}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 className="t-sub mt-3 text-ink-900">We have not built this one yet</h2>
              <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-900">
                {role.startHere.note}
              </p>
              <ul className="mt-5 flex list-none flex-col gap-3 p-0">
                {role.startHere.readInstead.map((r) => (
                  <li key={r.url}>
                    <Link
                      href={r.url as Route}
                      className="text-[15px] leading-[1.6] font-medium text-brand-700 hover:text-brand-800"
                    >
                      {r.label} →
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={"/learn" as Route}
                className="mt-6 inline-flex h-12 items-center rounded-lg border border-ink-200 px-5 text-[15px] font-medium text-ink-900 hover:border-brand-700"
              >
                Ask us to build it
              </Link>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
