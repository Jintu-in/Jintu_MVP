-- 9999_tests.sql — guard-bite and RLS isolation tests for the v3 schema.
--
-- Run via: node docs/files/run-audit.mjs --tests
--
-- Every guard test asserts the FAILURE, not the success path: the bad write
-- is attempted, and the test raises 'TEST FAILED' if the database let it
-- through. A guard that never fires is not a guard.
--
-- Blocks are separated by ==== lines; the runner executes each in its own
-- implicit transaction and reports per block.

-- TEST: fixture builds (learners, TPO, tracks, rubrics, keys, reviews)
insert into auth.users (id) values
  ('a0000000-0000-4000-8000-000000000001'),
  ('a0000000-0000-4000-8000-000000000002'),
  ('a0000000-0000-4000-8000-000000000003'),
  ('a0000000-0000-4000-8000-000000000004');

insert into colleges (id, name) values ('c0000000-0000-4000-8000-000000000001', 'Test College');

insert into profiles (id, email, handle, full_name, college_id, is_adult_confirmed) values
  ('a0000000-0000-4000-8000-000000000001', 'learner@test.in',  'learner-one',  'Learner One', 'c0000000-0000-4000-8000-000000000001', true),
  ('a0000000-0000-4000-8000-000000000002', 'reviewer@test.in', 'reviewer-two', 'Reviewer Two', null, true),
  ('a0000000-0000-4000-8000-000000000003', 'tpo@test.in',      'tpo-three',    'TPO Three',   null, true);

insert into staff (user_id, college_id, role) values
  ('a0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001', 'tpo');

-- T1: the publishable track — 60% machine points, key present.
insert into tracks (id, slug, title, tier, competency, published_at) values
  ('b0000000-0000-4000-8000-000000000001', 'test-track', 'Test Track', 'draft', 'data', now());
insert into units (id, track_id, unit_no, title, objective) values
  ('b1000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 1, 'Unit one', 'Do the thing');
insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000001', 'r1-balanced', 10);
insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
  ('b2000000-0000-4000-8000-000000000001', 1, 'query runs',   6, 'executable', 'sql_diff'),
  ('b2000000-0000-4000-8000-000000000001', 2, 'peers judge',  4, 'peer',       null);
insert into answer_keys (ref, payload) values ('keys/test/u1.json', '{"expected": []}');
insert into assignments (id, unit_id, rubric_id, kind, prompt, points, answer_key_ref) values
  ('b3000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000001',
   'b2000000-0000-4000-8000-000000000001', 'sql_file', 'Write the query.', 10, 'keys/test/u1.json');

-- T2: stays draft forever — the draft-points guard's target.
insert into tracks (id, slug, title, tier, competency, published_at) values
  ('b0000000-0000-4000-8000-000000000002', 'draft-track', 'Draft Track', 'draft', 'data', null);
insert into units (id, track_id, unit_no, title, objective) values
  ('b1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 1, 'Draft unit', 'Unwritten');
insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000002', 'r2-peer', 10);
insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
  ('b2000000-0000-4000-8000-000000000002', 1, 'peers judge', 10, 'peer', null);
insert into assignments (id, unit_id, rubric_id, kind, prompt, points) values
  ('b3000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000002',
   'b2000000-0000-4000-8000-000000000002', 'text', 'Draft prompt.', 10);

-- Enrollments and submissions.
insert into enrollments (id, user_id, track_id) values
  ('e0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001'),
  ('e0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001'),
  ('e0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002');
insert into submissions (id, enrollment_id, assignment_id, attempt) values
  ('f0000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000001', 1),
  ('f0000000-0000-4000-8000-000000000002', 'e0000000-0000-4000-8000-000000000003', 'b3000000-0000-4000-8000-000000000002', 1),
  ('f0000000-0000-4000-8000-000000000003', 'e0000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000001', 2);

-- Reviewer Two is assigned Learner One's first submission.
insert into peer_reviews (submission_id, reviewer_id) values
  ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002');

-- Consent: Learner One publishes a profile; Reviewer Two does not.
insert into consents (user_id, purpose, notice_version) values
  ('a0000000-0000-4000-8000-000000000001', 'public_profile', 'v1');

-- ================================================================
-- TEST: guard — a profile with is_adult_confirmed = false is refused
do $$ begin
  insert into profiles (id, email, handle, is_adult_confirmed) values
    ('a0000000-0000-4000-8000-000000000004', 'minor@test.in', 'minor-user', false);
  raise exception 'TEST FAILED: under-18 profile was accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — reserved handles admin and api are refused
do $$ begin
  insert into profiles (id, email, handle, is_adult_confirmed) values
    ('a0000000-0000-4000-8000-000000000004', 'x@test.in', 'admin', true);
  raise exception 'TEST FAILED: handle admin was accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;
do $$ begin
  insert into profiles (id, email, handle, is_adult_confirmed) values
    ('a0000000-0000-4000-8000-000000000004', 'x@test.in', 'api', true);
  raise exception 'TEST FAILED: handle api was accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — a phone number not in E.164 is refused
do $$ begin
  insert into profiles (id, email, handle, is_adult_confirmed, phone_e164) values
    ('a0000000-0000-4000-8000-000000000004', 'x@test.in', 'phone-user', true, '98765 43210');
  raise exception 'TEST FAILED: non-E.164 phone was accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — verified under 50% machine points is refused, naming 38.5
do $$ begin
  insert into tracks (id, slug, title, tier, competency) values
    ('b0000000-0000-4000-8000-000000000003', 'trap-track', 'Trap', 'draft', 'data');
  insert into units (id, track_id, unit_no, title, objective) values
    ('b1000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', 1, 'U', 'O');
  insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000003', 'r3-trap', 13);
  insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
    ('b2000000-0000-4000-8000-000000000003', 1, 's1', 1, 'structural', 'non_empty'),
    ('b2000000-0000-4000-8000-000000000003', 2, 's2', 1, 'structural', 'non_empty'),
    ('b2000000-0000-4000-8000-000000000003', 3, 's3', 1, 'structural', 'non_empty'),
    ('b2000000-0000-4000-8000-000000000003', 4, 's4', 1, 'structural', 'non_empty'),
    ('b2000000-0000-4000-8000-000000000003', 5, 's5', 1, 'structural', 'non_empty'),
    ('b2000000-0000-4000-8000-000000000003', 6, 'essay', 8, 'rubric_ai', 'rubric_score');
  insert into assignments (id, unit_id, rubric_id, kind, prompt, points) values
    ('b3000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000003',
     'b2000000-0000-4000-8000-000000000003', 'text', 'P', 13);

  update tracks set tier = 'verified' where id = 'b0000000-0000-4000-8000-000000000003';
  raise exception 'TEST FAILED: 38.5%% machine track reached verified';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
  if sqlerrm not like '%38.5%' then
    raise exception 'TEST FAILED: refusal does not name the percentage (got: %)', sqlerrm;
  end if;
end $$;

-- ================================================================
-- TEST: guard — verified with an unknown checker name is refused
do $$ begin
  insert into tracks (id, slug, title, tier, competency) values
    ('b0000000-0000-4000-8000-000000000004', 'ghost-track', 'Ghost', 'draft', 'data');
  insert into units (id, track_id, unit_no, title, objective) values
    ('b1000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000004', 1, 'U', 'O');
  insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000004', 'r4-ghost', 10);
  insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
    ('b2000000-0000-4000-8000-000000000004', 1, 'vibes', 10, 'executable', 'astrology');
  insert into assignments (id, unit_id, rubric_id, kind, prompt, points) values
    ('b3000000-0000-4000-8000-000000000004', 'b1000000-0000-4000-8000-000000000004',
     'b2000000-0000-4000-8000-000000000004', 'text', 'P', 10);

  update tracks set tier = 'verified' where id = 'b0000000-0000-4000-8000-000000000004';
  raise exception 'TEST FAILED: unknown checker reached verified';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — verified with a detectable criterion but no key row is refused
do $$ begin
  insert into tracks (id, slug, title, tier, competency) values
    ('b0000000-0000-4000-8000-000000000005', 'keyless-track', 'Keyless', 'draft', 'data');
  insert into units (id, track_id, unit_no, title, objective) values
    ('b1000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000005', 1, 'U', 'O');
  insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000005', 'r5-keyless', 10);
  insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
    ('b2000000-0000-4000-8000-000000000005', 1, 'defects found', 10, 'detectable', 'answer_key_match');
  insert into assignments (id, unit_id, rubric_id, kind, prompt, points) values
    ('b3000000-0000-4000-8000-000000000005', 'b1000000-0000-4000-8000-000000000005',
     'b2000000-0000-4000-8000-000000000005', 'audit_log', 'P', 10);

  update tracks set tier = 'verified' where id = 'b0000000-0000-4000-8000-000000000005';
  raise exception 'TEST FAILED: detectable-without-key reached verified';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — community containing a rubric_ai criterion is refused
do $$ begin
  insert into tracks (id, slug, title, tier, competency) values
    ('b0000000-0000-4000-8000-000000000006', 'paid-community', 'Paid Community', 'draft', 'data');
  insert into units (id, track_id, unit_no, title, objective) values
    ('b1000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000006', 1, 'U', 'O');
  insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000006', 'r6-paid', 10);
  insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
    ('b2000000-0000-4000-8000-000000000006', 1, 'essay', 8, 'rubric_ai', 'rubric_score'),
    ('b2000000-0000-4000-8000-000000000006', 2, 'has words', 2, 'structural', 'non_empty');
  insert into assignments (id, unit_id, rubric_id, kind, prompt, points) values
    ('b3000000-0000-4000-8000-000000000006', 'b1000000-0000-4000-8000-000000000006',
     'b2000000-0000-4000-8000-000000000006', 'text', 'P', 10);

  update tracks set tier = 'community' where id = 'b0000000-0000-4000-8000-000000000006';
  raise exception 'TEST FAILED: rubric_ai criterion reached community tier';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: the balanced 60% track DOES reach verified (the success path, once)
update tracks set tier = 'verified' where id = 'b0000000-0000-4000-8000-000000000001';

-- ================================================================
-- TEST: guard — artifact points on a draft-tier track are refused
do $$ begin
  insert into point_events (user_id, ledger, source_type, source_id, points, verification) values
    ('a0000000-0000-4000-8000-000000000001', 'proof', 'artifact',
     'f0000000-0000-4000-8000-000000000002', 10, 'executable');
  raise exception 'TEST FAILED: draft track minted points';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — the 31st consistency point in one day is refused
do $$ begin
  insert into point_events (user_id, ledger, source_type, source_id, points, verification) values
    ('a0000000-0000-4000-8000-000000000001', 'consistency', 'refresh', gen_random_uuid(), 10, 'structural'),
    ('a0000000-0000-4000-8000-000000000001', 'consistency', 'refresh', gen_random_uuid(), 10, 'structural'),
    ('a0000000-0000-4000-8000-000000000001', 'consistency', 'refresh', gen_random_uuid(), 10, 'structural');
  -- 30 today. One more must fail.
  insert into point_events (user_id, ledger, source_type, source_id, points, verification) values
    ('a0000000-0000-4000-8000-000000000001', 'consistency', 'refresh', gen_random_uuid(), 1, 'structural');
  raise exception 'TEST FAILED: a 31st consistency point was accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — proof points with source_type=rep are refused
do $$ begin
  insert into point_events (user_id, ledger, source_type, source_id, points, verification) values
    ('a0000000-0000-4000-8000-000000000001', 'proof', 'rep', gen_random_uuid(), 5, 'structural');
  raise exception 'TEST FAILED: proof points from a rep were accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — rep points dated differently from the rep submission are refused
do $$
declare rep_row uuid; rsub uuid;
begin
  insert into reps (id, unit_id, rep_no, prompt, check_by, checker) values
    (gen_random_uuid(), 'b1000000-0000-4000-8000-000000000001', 1, 'Daily thing', 'structural', 'non_empty')
  returning id into rep_row;
  insert into rep_submissions (id, enrollment_id, rep_id) values
    (gen_random_uuid(), 'e0000000-0000-4000-8000-000000000001', rep_row)
  returning id into rsub;

  insert into point_events (user_id, ledger, source_type, source_id, points, verification, awarded_on) values
    ('a0000000-0000-4000-8000-000000000001', 'consistency', 'rep', rsub, 5, 'structural', current_date - 1);
  raise exception 'TEST FAILED: back-dated rep points were accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — a learner reviewing their own submission is refused
do $$ begin
  insert into peer_reviews (submission_id, reviewer_id) values
    ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001');
  raise exception 'TEST FAILED: self-review was accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: guard — rubric weights not summing to the total are refused
do $$ begin
  insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000007', 'r7-unbalanced', 10);
  insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
    ('b2000000-0000-4000-8000-000000000007', 1, 'only four of ten', 4, 'structural', 'non_empty');
  set constraints all immediate;
  raise exception 'TEST FAILED: weights 4 of total 10 were accepted';
exception when others then
  if sqlerrm like 'TEST FAILED%' then raise; end if;
end $$;

-- ================================================================
-- TEST: suspect (f) — deleting a whole rubric (cascade) does not raise
insert into rubrics (id, slug, total) values ('b2000000-0000-4000-8000-000000000008', 'r8-cascade', 10);
insert into rubric_criteria (rubric_id, position, name, weight, check_by, checker) values
  ('b2000000-0000-4000-8000-000000000008', 1, 'a', 6, 'structural', 'non_empty'),
  ('b2000000-0000-4000-8000-000000000008', 2, 'b', 4, 'peer', null);
delete from rubrics where id = 'b2000000-0000-4000-8000-000000000008';
set constraints all immediate;

-- ================================================================
-- TEST: readiness counts each proof point once despite multiple gradings
do $$
declare pts numeric;
begin
  insert into gradings (submission_id, rubric_id, score, max_score, evidenced_score) values
    ('f0000000-0000-4000-8000-000000000001', 'b2000000-0000-4000-8000-000000000001', 6, 10, 6),
    ('f0000000-0000-4000-8000-000000000001', 'b2000000-0000-4000-8000-000000000001', 7, 10, 7);
  insert into point_events (user_id, ledger, source_type, source_id, points, verification) values
    ('a0000000-0000-4000-8000-000000000001', 'proof', 'artifact',
     'f0000000-0000-4000-8000-000000000001', 6, 'executable');

  select proof_points into pts from readiness
  where user_id = 'a0000000-0000-4000-8000-000000000001'
    and track_slug = 'test-track';
  if pts <> 6 then
    raise exception 'TEST FAILED: readiness reports % proof points for 6 awarded (fan-out)', pts;
  end if;
end $$;

-- ================================================================
-- TEST: submissions_latest returns the highest attempt, one row per assignment
do $$
declare n int; latest smallint;
begin
  select count(*), max(attempt) into n, latest
  from submissions_latest
  where enrollment_id = 'e0000000-0000-4000-8000-000000000001'
    and assignment_id = 'b3000000-0000-4000-8000-000000000001';
  if n <> 1 or latest <> 2 then
    raise exception 'TEST FAILED: latest view returned % rows, attempt %', n, latest;
  end if;
end $$;

-- ================================================================
-- TEST: suspect (g) — ai_usage accrues into global, user AND track guards
do $$
declare g int; u int; t int;
begin
  insert into budget_guards (scope, scope_id, ceiling_paise) values
    ('global', 'all', 100000),
    ('user',  'a0000000-0000-4000-8000-000000000001', 10000),
    ('track', 'b0000000-0000-4000-8000-000000000001', 20000);
  insert into ai_usage (user_id, submission_id, function_name, model, cost_paise) values
    ('a0000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001',
     'rubric_score', 'test-model', 400);

  select spent_paise into g from budget_guards where scope = 'global';
  select spent_paise into u from budget_guards where scope = 'user';
  select spent_paise into t from budget_guards where scope = 'track';
  if g <> 400 or u <> 400 or t <> 400 then
    raise exception 'TEST FAILED: accrual global=% user=% track=%', g, u, t;
  end if;
end $$;

-- ================================================================
-- TEST: nudges without consent are skipped, not sent
do $$
declare st text;
begin
  insert into notifications (user_id, channel, template) values
    ('a0000000-0000-4000-8000-000000000002', 'push', 'nudge-streak')
  returning status into st;
  if st <> 'skipped' then
    raise exception 'TEST FAILED: nudge without consent has status %', st;
  end if;
end $$;

-- ================================================================
-- TEST: RLS — an authenticated user reads ZERO answer_keys rows
begin;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"a0000000-0000-4000-8000-000000000001","role":"authenticated"}';
do $$
declare n int;
begin
  select count(*) into n from answer_keys;
  if n <> 0 then raise exception 'TEST FAILED: authenticated read % answer_keys rows', n; end if;
end $$;
rollback;

-- ================================================================
-- TEST: RLS — a user cannot read another user's submissions
begin;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"a0000000-0000-4000-8000-000000000002","role":"authenticated"}';
do $$
declare n int;
begin
  -- f...3 is Learner One's second attempt; Reviewer Two has no review on it.
  select count(*) into n from submissions where id = 'f0000000-0000-4000-8000-000000000003';
  if n <> 0 then raise exception 'TEST FAILED: a stranger read someone else''s submission'; end if;
end $$;
rollback;

-- ================================================================
-- TEST: RLS — an assigned reviewer CAN read the submission under review
begin;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"a0000000-0000-4000-8000-000000000002","role":"authenticated"}';
do $$
declare n int;
begin
  select count(*) into n from submissions where id = 'f0000000-0000-4000-8000-000000000001';
  if n <> 1 then raise exception 'TEST FAILED: assigned reviewer cannot read the submission (%)', n; end if;
end $$;
rollback;

-- ================================================================
-- TEST: RLS — that reviewer has NO join path to the author's identity
begin;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"a0000000-0000-4000-8000-000000000002","role":"authenticated"}';
do $$
declare n int;
begin
  select count(*) into n from enrollments where id = 'e0000000-0000-4000-8000-000000000001';
  if n <> 0 then raise exception 'TEST FAILED: reviewer can read the author''s enrollment'; end if;
  select count(*) into n from profiles where id = 'a0000000-0000-4000-8000-000000000001';
  if n <> 0 then raise exception 'TEST FAILED: reviewer can read the author''s profile'; end if;
end $$;
rollback;

-- ================================================================
-- TEST: RLS — a TPO reads their own college's learners…
begin;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"a0000000-0000-4000-8000-000000000003","role":"authenticated"}';
do $$
declare n int;
begin
  select count(*) into n from profiles where id = 'a0000000-0000-4000-8000-000000000001';
  if n <> 1 then raise exception 'TEST FAILED: TPO cannot read their college''s learner (%)', n; end if;
end $$;
rollback;

-- ================================================================
-- TEST: RLS — …and nothing at all after their staff row is revoked
update staff set revoked_at = now()
where user_id = 'a0000000-0000-4000-8000-000000000003';
begin;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"a0000000-0000-4000-8000-000000000003","role":"authenticated"}';
do $$
declare n int;
begin
  select count(*) into n from profiles where id = 'a0000000-0000-4000-8000-000000000001';
  if n <> 0 then raise exception 'TEST FAILED: revoked TPO still reads learners'; end if;
end $$;
rollback;

-- ================================================================
-- TEST: assignments_public — anon sees published work, no key column, no drafts
begin;
set local role anon;
do $$
declare n int;
begin
  select count(*) into n from assignments_public where id = 'b3000000-0000-4000-8000-000000000001';
  if n <> 1 then raise exception 'TEST FAILED: anon cannot read a published assignment (%)', n; end if;
  select count(*) into n from assignments_public where id = 'b3000000-0000-4000-8000-000000000002';
  if n <> 0 then raise exception 'TEST FAILED: an unpublished track''s assignment leaked'; end if;
end $$;
rollback;
do $$
declare n int;
begin
  select count(*) into n from information_schema.columns
  where table_name = 'assignments_public' and column_name = 'answer_key_ref';
  if n <> 0 then raise exception 'TEST FAILED: answer_key_ref is exposed on the public view'; end if;
end $$;

-- ================================================================
-- TEST: suspect (e) — public_profiles shows consented users only
begin;
set local role anon;
do $$
declare n int;
begin
  select count(*) into n from public_profiles where handle = 'learner-one';
  if n < 1 then raise exception 'TEST FAILED: consented profile is not public'; end if;
  select count(*) into n from public_profiles where handle = 'reviewer-two';
  if n <> 0 then raise exception 'TEST FAILED: profile visible WITHOUT public_profile consent'; end if;
end $$;
rollback;
