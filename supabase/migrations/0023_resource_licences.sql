-- ─────────────────────────────────────────────────────────────────────────────
-- 0023 — every link says what it is licensed under.
--
-- "Free to read" and "free to reuse" are different questions and the schema
-- could not tell them apart. Pro Git, The Linux Command Line, Seeing Theory
-- and pgexercises are all free and all carry a NonCommercial clause; Wikipedia
-- and the tldr pages are free AND reusable with attribution. Nothing in the
-- database distinguished those two groups, so the distinction lived only in a
-- free-text note on the roadmap, one level too high to act on.
--
-- Today it changes nothing operationally: rule 1 makes this product link-only,
-- so every resource is handled identically. It matters the first time somebody
-- writes an inline summary of a source — a feature somebody will want — and at
-- that moment the difference between cc-by-sa and cc-by-nc-sa is the
-- difference between attribution and a licence breach.
--
-- may_reuse is GENERATED, not stored separately. Two columns that must agree
-- eventually disagree; this one cannot.
--
-- The default is 'unknown' rather than 'proprietary' so a row nobody has
-- classified is visibly unclassified. The importer refuses to emit one — see
-- scripts/lib/licenses.mjs, where an unlisted host fails the import and forces
-- the licence question at the moment somebody is already looking at the page.
--
-- Re-runnable.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.resources
  add column if not exists license text not null default 'unknown';

do $$ begin
  alter table public.resources
    add constraint resources_license_is_known
    check (license in (
      'public-domain',  -- US federal works: CDC, CMS, NIH, NIST
      'cc0',
      'cc-by',
      'cc-by-sa',
      'cc-by-nc',
      'cc-by-nc-sa',
      'cc-by-nd',
      'cc-by-nc-nd',
      'permissive',     -- MIT, BSD, Apache, PostgreSQL and friends
      'proprietary',    -- all rights reserved: vendor docs, most publishers
      'unknown'
    ));
exception when duplicate_object then null; end $$;

comment on column public.resources.license is
  'What the PUBLISHER licenses this page under. Governs whether we may quote or adapt it, never whether we may link to it — we may always link. Set from scripts/lib/licenses.mjs at import time.';

-- The one question the pipeline asks. Generated so it cannot drift from the
-- licence it is derived from; keep the list in step with REUSABLE in
-- scripts/lib/licenses.mjs.
do $$ begin
  alter table public.resources
    add column may_reuse boolean
    generated always as (
      license in ('public-domain', 'cc0', 'cc-by', 'cc-by-sa', 'permissive')
    ) stored;
exception when duplicate_column then null; end $$;

comment on column public.resources.may_reuse is
  'DERIVED from license. True where commercial reuse with attribution is permitted. Anything false may be linked and never quoted, summarised or re-hosted.';

-- The bank's only query: everything reusable, or everything not yet classified.
create index if not exists resources_license_idx on public.resources (license);

-- No grant change. license and may_reuse are readable wherever the resource
-- is, which is any published roadmap — a reader is entitled to know what the
-- thing they are being sent to is licensed under.
