-- Rep checks catch up with checker registry v2.
--
-- 20260812060000 extended the RUBRIC trigger's checker whitelist to the
-- engine's fifteen names — and missed this one: daily_reps has its own
-- deliberately-duplicated copy in validate_rep_checks(), still at eleven.
-- Found by the authoring kit's dogfooding, where a rep declaring
-- contains_pattern was refused by a database that half-knew about it.
-- Body verbatim from 20260811020000; only the names list changes.
--
-- (Reps stay free by the CHECK on daily_reps.verification — this list
-- naming rubric_score does not let a rep spend money.)

create or replace function public.validate_rep_checks()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  c text;
begin
  foreach c in array new.checks loop
    if split_part(c, ':', 1) not in
      ('sql_diff', 'numeric_cells', 'formula_present', 'consistent_with',
       'code_test_suite', 'answer_key_match', 'non_empty', 'duration_between',
       'has_sections', 'url_reachable', 'media_has_audio', 'contains_join',
       'contains_pattern', 'row_count_ceiling', 'rubric_score')
    then
      raise exception 'daily rep: no checker named "%" exists', split_part(c, ':', 1);
    end if;
  end loop;
  return new;
end;
$$;
