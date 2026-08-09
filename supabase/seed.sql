-- Local development seed. Applied by `supabase db reset`.
-- Never run against production: these are illustrative rows, not curriculum.
--
-- Note the ORDER. The path is created as a draft, filled in, and published
-- last. That is not stylistic — the immutability triggers reject inserts into
-- a published path, so seeding in any other order fails loudly. If you are
-- writing a script that adds content to a live path, this is the shape it has
-- to take too: new draft version, fill, publish.

begin;

insert into public.tracks (id, slug, title, summary, is_published) values
  (
    '11111111-1111-4111-8111-111111111111',
    'data-analyst-fresher',
    'Data Analyst — first job',
    'Six weeks of real analyst work: SQL against messy data, one findings memo, one dashboard, and a recorded walkthrough.',
    true
  );

insert into public.paths (id, track_id, version, status) values
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    1,
    'draft'
  );

insert into public.modules (id, path_id, week_no, title, objective) values
  ('33333333-3333-4333-8333-000000000001', '22222222-2222-4222-8222-222222222222', 1,
   'SQL that answers a question',
   'Write joins and aggregates against a real schema without reaching for a tutorial.'),
  ('33333333-3333-4333-8333-000000000002', '22222222-2222-4222-8222-222222222222', 2,
   'Window functions and cohorts',
   'Compute retention and running totals in SQL rather than exporting to a spreadsheet.'),
  ('33333333-3333-4333-8333-000000000003', '22222222-2222-4222-8222-222222222222', 3,
   'Cleaning data you did not create',
   'Find and document what is wrong with a dataset before analysing it.'),
  ('33333333-3333-4333-8333-000000000004', '22222222-2222-4222-8222-222222222222', 4,
   'An analysis that answers something',
   'Turn a vague business question into a defensible finding with stated caveats.'),
  ('33333333-3333-4333-8333-000000000005', '22222222-2222-4222-8222-222222222222', 5,
   'A dashboard someone else can read',
   'Build a dashboard that survives being handed to a stranger with no explanation.'),
  ('33333333-3333-4333-8333-000000000006', '22222222-2222-4222-8222-222222222222', 6,
   'Explaining your work out loud',
   'Walk through a finding in five minutes and answer the obvious follow-up.');

-- Law 2: URL and metadata only. `title` is our own label for the link. There
-- is nowhere here to put what the video says, and that is the point.
insert into public.resources
  (module_id, kind, provider, external_url, youtube_video_id, title, duration_sec, position)
values
  ('33333333-3333-4333-8333-000000000001', 'docs', 'web',
   'https://www.postgresql.org/docs/current/tutorial-join.html',
   null, 'PostgreSQL manual — joins', null, 0),
  ('33333333-3333-4333-8333-000000000001', 'dataset', 'web',
   'https://github.com/devrimgunduz/pagila',
   null, 'Pagila sample database', null, 1),
  ('33333333-3333-4333-8333-000000000002', 'docs', 'web',
   'https://www.postgresql.org/docs/current/tutorial-window.html',
   null, 'PostgreSQL manual — window functions', null, 0),
  ('33333333-3333-4333-8333-000000000003', 'article', 'web',
   'https://vita.had.co.nz/papers/tidy-data.pdf',
   null, 'Tidy Data (Wickham)', null, 0);

insert into public.rubrics (id, name, criteria, max_score) values
  (
    '44444444-4444-4444-8444-000000000001',
    'sql-correctness-v1',
    '[
      {"key": "returns_expected_rows", "label": "Returns the expected result set", "weight": 3},
      {"key": "no_cartesian", "label": "No accidental cross join", "weight": 1},
      {"key": "readable", "label": "Aliases and formatting a reviewer can follow", "weight": 1}
    ]'::jsonb,
    5
  ),
  (
    '44444444-4444-4444-8444-000000000002',
    'written-finding-v1',
    '[
      {"key": "answers_question", "label": "Answers the question actually asked", "weight": 3},
      {"key": "states_caveats", "label": "States what would change the conclusion", "weight": 2},
      {"key": "evidence", "label": "Every number is traceable to a query", "weight": 2}
    ]'::jsonb,
    7
  );

insert into public.assignments (id, module_id, kind, spec, rubric_id, weight) values
  ('55555555-5555-4555-8555-100000000001',
   '33333333-3333-4333-8333-000000000001', 'sql',
   '{"prompt": "Return the three customers with the highest lifetime rental revenue, highest first, as name and revenue."}'::jsonb,
   '44444444-4444-4444-8444-000000000001', 1),
  ('55555555-5555-4555-8555-100000000002',
   '33333333-3333-4333-8333-000000000004', 'artifact_link',
   '{"prompt": "One page: what you found, how confident you are, and what would change your mind."}'::jsonb,
   '44444444-4444-4444-8444-000000000002', 2);

-- The answer key. Separate table because `assignments` above is anon-readable
-- and this is the answer — see the comment on the table in
-- 20260809050000_weekly_loop.sql.
--
-- Dollar-quoted so the fixture can contain apostrophes without every string in
-- it being doubled. `reference_sql` is not decoration: the migration simulator
-- runs it against `setup` and fails if the result is not `expected`, which is
-- the only thing standing between a mistyped reference answer and a cohort of
-- correct submissions all marked wrong.
insert into public.assignment_answer_keys (assignment_id, setup, reference_sql, expected, order_matters)
values (
  '55555555-5555-4555-8555-100000000001',
  $setup$
    create table customers (id int primary key, name text, city text);
    create table rentals (id int primary key, customer_id int references customers (id), amount numeric);
    insert into customers values (1,'Asha','Chennai'),(2,'Ravi','Pune'),(3,'Meera','Kochi'),(4,'Dev','Indore');
    insert into rentals values (1,1,120.00),(2,1,80.00),(3,2,300.00),(4,3,50.00),(5,3,25.50),(6,4,410.00),(7,2,15.00);
  $setup$,
  $ref$
    select c.name, sum(r.amount) as revenue
    from customers c
    join rentals r on r.customer_id = c.id
    group by c.name
    order by revenue desc
    limit 3
  $ref$,
  $json$
  {
    "columns": ["name", "revenue"],
    "rows": [
      { "name": "Dev",  "revenue": 410 },
      { "name": "Ravi", "revenue": 315 },
      { "name": "Asha", "revenue": 200 }
    ]
  }
  $json$::jsonb,
  true
);

-- Publish last. Everything above is now frozen.
update public.paths
  set status = 'published', published_at = now()
  where id = '22222222-2222-4222-8222-222222222222';

commit;

-- ─────────────────────────────────────────────────────────────────────────────
-- Demo profile — LOCAL AND DEMO ONLY
-- ─────────────────────────────────────────────────────────────────────────────
-- Deliberately fictional and deliberately outcome-free. docs/LEGAL.md §3.1
-- allows publishing only `document_verified` outcomes with written consent on
-- file, so a seeded "got an offer at X" row would be a fabricated record that
-- looks exactly like a real one. There are no outcomes rows here, and there
-- must not be. Readiness scores are computed data about work, not a claim
-- about a person's employment.

begin;

insert into auth.users (id, phone)
  values ('99999999-9999-4999-8999-000000000001', '+919000000001')
  on conflict do nothing;

insert into public.profiles (id, phone, full_name, is_adult_confirmed)
  values ('99999999-9999-4999-8999-000000000001', '+919000000001', 'Demo Student', true)
  on conflict do nothing;

insert into public.cohorts (id, path_id, mode, starts_on, ends_on, capacity, status)
  values ('aaaaaaaa-aaaa-4aaa-8aaa-000000000001',
          '22222222-2222-4222-8222-222222222222',
          'public', date '2026-09-01', date '2026-10-13', 20, 'open')
  on conflict do nothing;

insert into public.enrollments (id, cohort_id, user_id, status, completed_at)
  values ('bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
          'aaaaaaaa-aaaa-4aaa-8aaa-000000000001',
          '99999999-9999-4999-8999-000000000001',
          'completed', now())
  on conflict do nothing;

insert into public.readiness_scores (enrollment_id, overall, breakdown)
  values ('bbbbbbbb-bbbb-4bbb-8bbb-000000000001', 78, '{
    "sql": 84,
    "data_cleaning": 71,
    "analysis": 80,
    "communication": 74,
    "peer_review_participation": 100
  }'::jsonb)
  on conflict do nothing;

insert into public.public_profiles (slug, enrollment_id, visibility, published_at, headline)
  values ('demo-student',
          'bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
          'public', now(),
          'Finished the six-week data analyst sprint. Six artifacts, all graded against published rubrics.')
  on conflict do nothing;

commit;
