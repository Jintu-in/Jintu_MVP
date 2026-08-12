-- Checker registry v2 — packages/grading/README.md.
--
-- The engine spec adds four checkers (numeric_cells, formula_present,
-- consistent_with, contains_pattern) and implements media_has_audio against
-- adapter-produced probe facts. The rubric trigger's whitelist is the same
-- list duplicated on purpose (it cannot drift without a reviewed migration —
-- this file IS that review), so it extends here and nowhere else. The body
-- below is 20260811010000's verbatim, with exactly two changes: the names
-- list, and split_part so a stored checker may carry args ("non_empty:25")
-- the way daily_reps checks already do.
--
-- contains_join stays: published DA v2 reps reference it and published
-- content is frozen. New authoring uses contains_pattern.

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

    -- The registry names, duplicated from packages/grading/src/registry.ts
    -- on purpose: this copy cannot drift without a reviewed migration.
    if c ? 'checker' and jsonb_typeof(c->'checker') <> 'null' and split_part(c->>'checker', ':', 1) not in
      ('sql_diff', 'numeric_cells', 'formula_present', 'consistent_with',
       'code_test_suite', 'answer_key_match', 'non_empty', 'duration_between',
       'has_sections', 'url_reachable', 'media_has_audio', 'contains_join',
       'contains_pattern', 'row_count_ceiling', 'rubric_score')
    then
      raise exception 'rubric %: no checker named "%" exists', new.name, c->>'checker';
    end if;
  end loop;

  return new;
end;
$$;
