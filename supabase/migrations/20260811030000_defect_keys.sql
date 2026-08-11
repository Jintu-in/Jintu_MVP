-- ─────────────────────────────────────────────────────────────────────────────
-- Defect keys — the detectable archetype's answer
--
-- TRACK_MODEL.md Part 8, phase 2: "detectable checker + answer-key storage —
-- unlocks the strongest weeks in every track." A detectable artifact hands
-- the student a dataset with known problems planted in it and asks what is
-- wrong. The student reports defect codes; answer_key_match (in the checker
-- registry) marks the report against this table. Deterministic, ₹0, and it
-- generalises: a broken ad-campaign export marks exactly like a dirty CSV.
--
-- The key is generated OUTSIDE this repo, on purpose. The repo may be public,
-- and anything derivable from it — a committed key, a committed seed, even a
-- deterministic generator with a fixed default — publishes the answers.
-- scripts/defect-dataset.mjs takes the seed as an argument; ops keeps the
-- seed, rotates it every cohort, and pastes the emitted SQL here. Part 10's
-- warning is the operating assumption: any key older than three cohorts is
-- public.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.assignment_defect_keys (
  assignment_id uuid primary key references public.assignments (id) on delete cascade,

  -- [{ slug, description, rows_affected }] — what is actually wrong with the
  -- dataset, by code. The slugs are the marking key; the descriptions are for
  -- the human writing feedback, not for students.
  planted       jsonb not null,

  -- Codes offered to the student that are NOT in the data. Distractors are
  -- what turn "tick every box" from a winning strategy into a losing one:
  -- answer_key_match counts fabrications, and a report that names ghosts
  -- reads exactly like an auditor who invents findings.
  distractors   text[] not null default '{}',

  -- How many planted defects a passing report must find.
  min_hits      int not null check (min_hits > 0),

  -- Which rotation this key belongs to — a label like 'cohort-1', never the
  -- seed itself. Exists so ops can tell at a glance whether a cohort is
  -- marking against a stale key.
  seed_label    text not null,

  created_at    timestamptz not null default now(),

  constraint defect_keys_planted_shape
    check (jsonb_typeof(planted) = 'array' and jsonb_array_length(planted) > 0)
);

comment on table public.assignment_defect_keys is
  'The planted-defect answer for a detectable artifact. service-role only: this table is the answer, and `assignments` next to it is public. Same rule, same reason, as assignment_answer_keys.';

alter table public.assignment_defect_keys enable row level security;

-- Same freeze as the SQL answer keys, via the same function: once the parent
-- path publishes, the key is part of what a cohort is being graded against.
-- Rotation for the NEXT cohort is a new path version, not an edit.
create trigger defect_keys_frozen_when_published
  before insert or update or delete on public.assignment_defect_keys
  for each row execute function public.reject_published_answer_key_change();

-- Shape rules a paste cannot be trusted to keep by hand.
create or replace function public.validate_defect_key()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  d jsonb;
  slugs text[] := '{}';
begin
  for d in select * from jsonb_array_elements(new.planted) loop
    if coalesce(btrim(d->>'slug'), '') = '' or coalesce(btrim(d->>'description'), '') = '' then
      raise exception 'defect key: every planted defect needs a slug and a description';
    end if;
    if coalesce((d->>'rows_affected')::int, 0) <= 0 then
      raise exception 'defect key: "%" claims to affect no rows — a defect that touches nothing is not in the data', d->>'slug';
    end if;
    slugs := slugs || (d->>'slug');
  end loop;

  if new.min_hits > jsonb_array_length(new.planted) then
    raise exception 'defect key: min_hits % exceeds the % planted defects — nobody could pass',
      new.min_hits, jsonb_array_length(new.planted);
  end if;

  -- A code that is both planted and a distractor marks the same answer right
  -- and wrong at once.
  if exists (select 1 from unnest(new.distractors) x where x = any (slugs)) then
    raise exception 'defect key: a code cannot be both planted and a distractor';
  end if;

  return new;
end;
$$;

create trigger defect_keys_valid
  before insert or update on public.assignment_defect_keys
  for each row execute function public.validate_defect_key();
