-- ─────────────────────────────────────────────────────────────────────────────
-- Rubric criteria carry their verification
--
-- TRACK_MODEL.md Part 12, item 5 — the one with a deadline on it: a rubric
-- cited by graded work is frozen by convention, so the shape has to be right
-- before the first cohort ever submits.
--
-- Each criterion may now say how it is judged:
--
--   check    the archetype (executable / detectable / structural / rubric_ai /
--            peer / mentor_sample)
--   checker  the registry function that produces the judgement, for the
--            machine archetypes
--
-- No column changes — criteria is already jsonb. What this migration adds is
-- the thing jsonb never gives you for free: a trigger that refuses a rubric
-- whose criteria are malformed, name a checker that does not exist, or carry
-- a weight of zero. A bad rubric caught at insert is a sentence in a
-- migration log; the same rubric caught at grading time is a student with a
-- wrong score.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.validate_rubric_criteria()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  c jsonb;
begin
  if jsonb_typeof(new.criteria) <> 'array' or jsonb_array_length(new.criteria) = 0 then
    raise exception 'rubric %: criteria must be a non-empty array', new.name;
  end if;

  for c in select * from jsonb_array_elements(new.criteria) loop
    if coalesce(btrim(c->>'key'), '') = '' or coalesce(btrim(c->>'label'), '') = '' then
      raise exception 'rubric %: every criterion needs a key and a label', new.name;
    end if;

    if coalesce((c->>'weight')::numeric, 0) <= 0 then
      raise exception 'rubric %: criterion "%" needs a weight above zero — a zero-weight criterion is a promise that counts for nothing', new.name, c->>'key';
    end if;

    if c ? 'check' and c->>'check' not in
      ('executable', 'detectable', 'structural', 'rubric_ai', 'peer', 'mentor_sample')
    then
      raise exception 'rubric %: "%" is not a verification archetype', new.name, c->>'check';
    end if;

    -- The eleven names, duplicated from packages/grading/src/registry.ts on
    -- purpose: the project rules fix this list forever ("if a new subject
    -- seems to need a twelfth, it needs a better artifact"), so the copy
    -- cannot drift without someone first breaking that rule in code review.
    if c ? 'checker' and jsonb_typeof(c->'checker') <> 'null' and c->>'checker' not in
      ('sql_diff', 'code_test_suite', 'answer_key_match', 'non_empty',
       'duration_between', 'has_sections', 'url_reachable', 'media_has_audio',
       'contains_join', 'row_count_ceiling', 'rubric_score')
    then
      raise exception 'rubric %: no checker named "%" exists', new.name, c->>'checker';
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists rubrics_criteria_valid on public.rubrics;
create trigger rubrics_criteria_valid
  before insert or update on public.rubrics
  for each row execute function public.validate_rubric_criteria();
