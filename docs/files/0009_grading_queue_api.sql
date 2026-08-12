-- 0009_grading_queue_api.sql
-- The service-role surface the grade-submission edge function calls, plus
-- column-level hardening on the answer key reference.
--
-- Runs LAST on purpose: the column grants below must come after every
-- default privilege has been applied to assignments.

-- ---------------------------------------------------------------------------
-- Queue wrappers. pgmq lives in its own schema, which PostgREST does not
-- expose; these definer functions are the only door, and only the service
-- role holds the handle. read-with-visibility-timeout + archive-on-success
-- gives at-least-once delivery: a crashed grader re-delivers rather than
-- losing a submission.
-- ---------------------------------------------------------------------------
create or replace function grading_queue_read(p_batch integer default 5)
returns table (msg_id bigint, submission_id uuid)
language sql
security definer set search_path = public, pgmq as $$
  select m.msg_id, (m.message->>'submission_id')::uuid
  from pgmq.read('grading', 60, p_batch) m
$$;

create or replace function grading_queue_archive(p_msg_id bigint)
returns boolean
language sql
security definer set search_path = public, pgmq as $$
  select pgmq.archive('grading', p_msg_id)
$$;

revoke all on function grading_queue_read(integer) from public, anon, authenticated;
revoke all on function grading_queue_archive(bigint) from public, anon, authenticated;
grant execute on function grading_queue_read(integer) to service_role;
grant execute on function grading_queue_archive(bigint) to service_role;

comment on function grading_queue_read is
  'Service role only. The edge function''s read on the grading queue, with a 60s visibility timeout so a crashed run re-delivers.';

-- ---------------------------------------------------------------------------
-- answer_key_ref: column-level lockout.
--
-- RLS already returns zero assignments rows to clients (no select policy),
-- and assignments_public omits the column. This adds the third, deepest
-- lock: even if someone later adds a select policy to assignments — the
-- exact mistake the table comment warns about — the column itself stays
-- unreadable, because the table-wide SELECT grant is replaced by a grant
-- that names every column except the key reference. A future policy widens
-- rows; it can no longer widen this column.
-- ---------------------------------------------------------------------------
revoke select on assignments from anon, authenticated;
grant select (id, unit_id, rubric_id, kind, prompt, points, reads_prior)
  on assignments to anon, authenticated;

comment on column assignments.answer_key_ref is
  'Readable by the service role only — enforced by column grants, not just by RLS and the view projection. Three locks, one secret.';
