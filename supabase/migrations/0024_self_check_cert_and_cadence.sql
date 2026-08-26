-- ─────────────────────────────────────────────────────────────────────────────
-- 0024 — three facts a roadmap needs to state and could not.
--
-- 1. WHICH RESOURCES CHECK THE LEARNER'S ANSWER
--
-- Bandit will not let you reach level 11 without solving level 10. pgexercises
-- marks your SQL. Rosalind rejects a wrong answer. Those are worth more than
-- any reading, they cost us nothing to maintain, and nothing in the schema
-- distinguished them from a blog post. A roadmap with no self-checker anywhere
-- is a roadmap where a learner can be confidently wrong for eleven weeks.
--
-- 2. WHETHER THE CERTIFICATION COSTS MONEY
--
-- has_free_cert (0017) collapsed two different situations. HubSpot and Google
-- Skillshop issue genuinely free certificates. AWS, Microsoft, Salesforce, Meta
-- and AAPC give the LEARNING away and charge for the exam — Microsoft is $99 to
-- $165, AAPC's CPC is several hundred dollars. Telling a reader a roadmap has a
-- free certification when the exam costs $165 is the kind of small lie that
-- makes everything else on the page suspect.
--
-- has_free_cert stays and becomes derived, because the catalogue facet reads it.
--
-- 3. HOW FAST THE SUBJECT ROTS
--
-- Cloud consoles, ad UIs and anything with an LLM in it are stale in a quarter.
-- Statistics and algorithms are good for years. One weekly link crawl treats
-- them identically, which is both too much for one and not enough for the other.
--
-- Re-runnable.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. self-checking resources
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.resources
  add column if not exists self_check boolean not null default false;

comment on column public.resources.self_check is
  'The resource verifies the learner''s answer itself — Bandit, pgexercises, Rosalind, Exercism. Practice that cannot be faked, maintained by somebody else. Set at import time; never inferred.';

create index if not exists resources_self_check_idx
  on public.resources (self_check) where self_check;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. what the certification actually costs
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.roadmaps
  add column if not exists cert text not null default 'none';

do $$ begin
  alter table public.roadmaps
    add constraint roadmaps_cert_is_known
    check (cert in (
      'none',       -- no certification worth naming for this subject
      'free',       -- learning AND exam free: HubSpot, Google Skillshop, Amazon Ads
      'paid_exam'   -- learning free, exam costs money: AWS, Microsoft, AAPC
    ));
exception when duplicate_object then null; end $$;

comment on column public.roadmaps.cert is
  'none / free / paid_exam. "free" means the EXAM is free too. Anything where the learning is free and the exam is not is paid_exam, and the roadmap must say the price on its first screen.';

-- Existing rows: Amazon Ads is the only one, and its four certifications are
-- genuinely free through the learning console.
update public.roadmaps set cert = 'free' where slug = 'amazon-ads';

-- has_free_cert becomes derived. It was 0017's hand-set boolean and the
-- catalogue facet still reads it, so it has to keep existing and stop being
-- something anybody edits.
create or replace function public.recompute_has_free_cert()
  returns integer
  language plpgsql
  security definer
  set search_path = ''
as $fn$
declare touched integer;
begin
  update public.roadmaps r
  set has_free_cert = (r.cert = 'free')
  where r.has_free_cert is distinct from (r.cert = 'free');
  get diagnostics touched = row_count;
  return touched;
end;
$fn$;

comment on function public.recompute_has_free_cert() is
  'Derives roadmaps.has_free_cert from cert. Only cert = free counts — a paid exam is not a free certification.';

revoke execute on function public.recompute_has_free_cert() from public, anon, authenticated;

comment on column public.roadmaps.has_free_cert is
  'DERIVED from cert by recompute_has_free_cert(). True only where the EXAM is free. Do not set by hand.';

select public.recompute_has_free_cert();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. how fast the subject rots
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.roadmaps
  add column if not exists review_cadence text not null default 'annual';

do $$ begin
  alter table public.roadmaps
    add constraint roadmaps_review_cadence_is_known
    check (review_cadence in ('quarterly', 'semiannual', 'annual'));
exception when duplicate_object then null; end $$;

comment on column public.roadmaps.review_cadence is
  'quarterly for anything tied to a vendor console, an ad UI or a model; semiannual for platform policy; annual for theory. Drives which roadmaps the link crawl re-checks first, not whether it checks them.';

-- Amazon Ads is a vendor console and an ad UI at once — the fastest-rotting
-- combination in the catalogue. Git tooling is mid-rotation with the 3.0
-- default changes landing, so semiannual rather than annual.
update public.roadmaps set review_cadence = 'quarterly'  where slug = 'amazon-ads';
update public.roadmaps set review_cadence = 'semiannual' where slug in ('git-and-github', 'excel-at-work', 'data-analyst');
update public.roadmaps set review_cadence = 'annual'     where slug in ('linux-command-line', 'thinking-under-uncertainty', 'java-spring-boot');

-- The crawl's worklist: oldest check first within the tightest cadence.
create index if not exists roadmaps_review_cadence_idx on public.roadmaps (review_cadence);
