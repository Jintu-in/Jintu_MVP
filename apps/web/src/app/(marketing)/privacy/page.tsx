import type { Metadata } from "next";
import { NOTICE_VERSION } from "@jintu/contracts";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "What Jintu collects, why, how long we keep it, and how to get it deleted.",
};

/**
 * Standalone privacy notice — deliberately its own page and not a section of
 * the Terms, per docs/LEGAL.md §2.3.
 *
 * The version string below is the same constant written to
 * waitlist_signups.notice_version, so every consent row can be traced to the
 * exact text the person read. If you change anything material on this page,
 * bump NOTICE_VERSION in @jintu/contracts. Do not edit a published version
 * in place.
 */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-medium text-ink-900">Privacy notice</h1>
      <p className="mt-2 text-sm text-ink-500">
        Version {NOTICE_VERSION}. This is the notice in force for consents
        recorded under that version.
      </p>

      <div className="mt-10 space-y-8 text-pretty text-ink-700">
        <Section title="Who we are">
          <p>
            Jintu is a free, self-paced learning platform with verified points. We are the data
            fiduciary for the information described here. To reach us about
            anything on this page, write to{" "}
            <a className="underline" href="mailto:privacy@jintu.in">
              privacy@jintu.in
            </a>
            .
          </p>
        </Section>

        <Section title="You must be 18 or older">
          <p>
            Jintu is not open to anyone under 18, and we do not knowingly
            collect information about children. Our product scores how ready
            you are for a role, which is a form of profiling, and we are not
            permitted to do that to a minor. If you tell us you are under 18,
            we will not sign you up.
          </p>
        </Section>

        <Section title="What we collect, and why">
          <dl className="space-y-4">
            <Item term="Your email address">
              To sign you in. We send a six-digit code to that address, and
              holding it is how we know it is you. You can add a password
              afterwards if you prefer one; the code always works.
            </Item>
            <Item term="Your mobile number">
              To reach you about your track: a submission you have
              missed, a peer review waiting on you. It is not how you sign in.
              Reminders on WhatsApp specifically are a separate choice below,
              and declining them changes nothing about your place.
            </Item>
            <Item term="Your name and college (optional)">
              To address you properly and to group you with the right batch.
              You can leave both blank.
            </Item>
            <Item term="Your submissions and the work you produce">
              To grade it, to route it for peer review, and to build your
              readiness profile. Peer reviewers see the work; they do not see
              who wrote it.
            </Item>
            <Item term="Your readiness scores">
              This is the product. It is profiling, which is why the 18+ rule
              exists.
            </Item>
          </dl>
        </Section>

        <Section title="What you choose separately">
          <p>
            Each of these is a separate tick box. None of them is pre-ticked,
            and declining any of them does not affect the service you get.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium">WhatsApp reminders</strong> —
              deadlines, missed submissions, peer reviews waiting on you.
            </li>
            <li>
              <strong className="font-medium">Product analytics</strong> — how
              people move through the app, so we can fix what is confusing.
            </li>
            <li>
              <strong className="font-medium">A public profile</strong> —
              publishing your proof-of-readiness page at a shareable link.
              Off unless you turn it on.
            </li>
          </ul>
        </Section>

        <Section title="What we never do">
          <ul className="list-disc space-y-2 pl-5">
            <li>Sell your data, or share it with advertisers.</li>
            <li>
              Publish an outcome — an interview, an offer — without documentary
              evidence and your written permission, separately given.
            </li>
            <li>
              Show your identity to a peer reviewer alongside your work.
            </li>
            <li>Give your contact details to a college without telling you.</li>
          </ul>
        </Section>

        <Section title="Where it is stored">
          <p>
            In a database hosted in Mumbai. Some of the services we rely on to
            send messages, watch for errors, and grade written work operate
            outside India; we send them only what they need to do that job.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Waitlist entries from the earlier cohort model: until you ask us to
            remove you. Your track record and the work you submitted: while your account exists, and afterwards only where we
            are required to keep it — for example, records that substantiate a
            claim we have made publicly with your consent.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask us for a copy of what we hold, ask us to correct it,
            ask us to delete it, and withdraw any consent you gave. Withdrawing
            is as easy as giving — one message to the address above, or the
            controls in your account. Withdrawal does not undo what was already
            done while the consent was live.
          </p>
          <p className="mt-3">
            If we get something wrong and you are not satisfied with our
            answer, you can complain to the Data Protection Board of India.
          </p>
        </Section>

        <Section title="Changes to this notice">
          <p>
            When this notice changes materially we publish it under a new
            version number rather than editing this one, so it is always
            possible to see which text you agreed to.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-medium text-ink-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Item({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-medium text-ink-900">{term}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
