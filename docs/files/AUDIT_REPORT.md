# v3 schema audit — 0001 through 0008

**Method.** Docker is not available on this machine, so `supabase db reset`
could not run. The runner (`run-audit.mjs`) applies the files to PGlite — a
real Postgres — with a faithful Supabase shim: `auth.uid()` reads
`request.jwt.claims` exactly as GoTrue's does, anon/authenticated/service_role
roles exist with Supabase-style broad grants (RLS is the gate), citext is the
real contrib extension. Only pg_cron/pgmq/pg_net are mocked (server daemons a
WASM Postgres cannot host), with their real signatures so call-shape errors
would still surface. pgcrypto's `create extension` line is skipped by the
runner only — `gen_random_uuid()` is core since PG13 and the line is harmless
on Supabase.

**Result.** All eight files apply cleanly from scratch. 28 assertions pass:
the 13 required guard-bites (failure path asserted, not success), 7 RLS
isolation tests under `set local role` + JWT claims, and 8 more covering the
suspects and regressions found on the way. `schema_health` reports zero on
all five checks.

Every error below was confirmed by running, not by reading. Baseline commit
holds the files exactly as delivered; every change is a reviewable diff on
top of it.

---

## Section 1 — errors found and fixed, in the order Postgres raised them

1. **0001: `is_college_staff()` — `relation "staff" does not exist`.**
   First statement to fail. SQL-language function bodies are validated at
   creation (`check_function_bodies` defaults on) and `staff` arrives in
   0002. Moved the function to 0002, directly after the table.

2. **0006: `notifications_daily_dedupe` — `functions in index expression
   must be marked IMMUTABLE`.** `created_at::date` reads the session
   timezone. Fixed with `(created_at at time zone 'Asia/Kolkata')::date` —
   immutable (constant zone), and IST is also the honest "once a day"
   boundary for Indian learners; a UTC day flips at 5:30am their time.

3. **0008: `assert_verified_tier_is_verifiable` — `too many parameters
   specified for RAISE`.** The 50%-rule message had one `%` placeholder and
   a literal `%%` but two arguments. Fixed to `%%%` (placeholder + literal
   percent), which is also what makes the error *name the percentage* as
   step 3 requires — the test asserts the message contains `38.5`.

4. **0004: `submissions` ↔ `peer_reviews` — `infinite recursion detected in
   policy`.** Found only at SELECT time as `authenticated` — the migrations
   apply fine, and service-role testing would never have seen it. The
   reviewer policy on `submissions` queried `peer_reviews`, whose author
   policy queries `submissions` back. Fixed by moving the reviewer check
   into a `security definer` predicate (`is_assigned_reviewer`), which reads
   `peer_reviews` without invoking its policies. Semantics unchanged; the
   reviewer-can-read and stranger-cannot-read tests prove both directions.

5. **0008: `readiness` double-counts proof points.** Not a creation error —
   caught by a written test. The view joined `gradings` and used no column
   of it: a pure row multiplier, so a submission with two grading rows
   (re-grade, appeal) doubled its points. Join removed; test asserts 6
   awarded points read back as 6 with two grading rows present.

## Section 2 — suspects, by letter

- **(a) CONFIRMED.** Exactly as predicted; error #1 above. Moved to 0002.
- **(b) CONFIRMED.** Exactly as predicted; error #2 above. Fixed with an
  immutable IST expression rather than a generated column (no new columns
  in an audit).
- **(c) CONFIRMED — the index was a no-op.** A unique index on
  `(enrollment_id, assignment_id, attempt desc)` enforces the same
  uniqueness as the existing constraint; DESC changes scan order, not
  uniqueness. Replaced with a `submissions_latest` VIEW using
  `DISTINCT ON … ORDER BY attempt DESC`, which genuinely answers "latest
  attempt". Test asserts one row, attempt = 2, when attempts 1 and 2 exist.
- **(d) CONFIRMED, half-fixed, half-moved.** `pgmq.create('grading')` and
  `pgmq.send(queue, jsonb)` are the correct current pgmq API; kept, and the
  enqueue trigger fires in tests (mocked queue receives the message).
  `cron.schedule(name, schedule, command)` is the correct pg_cron API — but
  the two jobs read `current_setting('app.functions_url')` and
  `('app.service_key')`, which nothing sets: both jobs would fail silently
  at execution, forever. Worse, the obvious fix — `ALTER DATABASE … SET
  app.service_key` — would expose the service key to **every** SQL client,
  because `current_setting()` is callable by any role. Scheduling is moved
  out of the migration into a documented one-per-environment ops step using
  Vault (`vault.decrypted_secrets`); the exact statements are in 0006's
  comments. Whether pg_cron/pgmq/pg_net are *enabled on this project* can
  only be confirmed in the dashboard — flagged in section 3.
- **(e) CONFIRMED for `assignments_public`; CLEARED for `public_profiles`.**
  `assignments_public` with `security_invoker = true` over a table with no
  client select policy returns **zero rows to every client** — the public
  curriculum read was broken outright. Fixed to a definer view (invoker =
  false), and because a definer view bypasses table RLS it now scopes
  itself to published tracks, matching the units/resources policies —
  otherwise it would have leaked unpublished assignments. Tests assert:
  anon reads the published assignment, cannot see the unpublished one, and
  the `answer_key_ref` column does not exist on the view.
  `public_profiles` with `security_invoker = false` is correct — the view
  must bypass profile RLS to serve strangers, and the `has_consent(...)`
  filter gates it. The required test passes: a user with `public_profile`
  consent is visible to anon; a user without it returns zero rows.
- **(f) CLEARED, by test.** Cascade-deleting a whole rubric does not raise:
  at constraint-check time the rubric row is gone, so the trigger's
  `total is not null` arm is false and it returns without raising. Test
  creates a balanced rubric, deletes it, forces `set constraints all
  immediate` — no error. Deleting a single criterion from a balanced rubric
  still raises, as it must.
- **(g) CONFIRMED — implemented.** `accrue_spend()` now accrues into
  `track`-scoped guards via the submission → enrollment → track path (the
  only route an `ai_usage` row knows). Test: one 400-paise insert lands in
  global, user AND track guards.
- **(h) CONFIRMED — deleted.** `current_profile_id()` had zero callers;
  every policy inlines `(select auth.uid())`. Removed, with a comment
  explaining why an unused auth wrapper is worse than none.

## Section 3 — things you should decide (nothing here was changed)

1. **Rep-date guard has a bypass.** `assert_rep_date_matches()` only fires
   when the `source_id` exists in `rep_submissions` (`if sub_date is not
   null`). A consistency insert with `source_type='rep'` and a fabricated
   `source_id` skips date validation entirely (the daily cap still applies).
   Only the service role can insert points, so this is a robustness gap,
   not an open exploit — but if you want rule 4 airtight, the guard should
   *reject* rep points whose source row does not exist, rather than skip.
   That is a guard-strengthening change, so per your constraints I stopped
   and am telling you instead of making it.
2. **`review_debt()` counts withdrawn and draft-track submissions.** Two
   reviews are owed per first-attempt submission regardless of status or
   tier. A learner who withdraws a submission still owes its reviews; a
   draft-track submission (which can never earn points) also generates
   debt. Possibly intended (feed the queue), possibly not.
3. **`topic_demand` joins `tracks.slug = normalized_key`.** Works only when
   track slugs are chosen to match normalised topic keys. That is a naming
   convention, not a constraint — one renamed slug and the "existing track"
   column quietly goes null. Consider a `tracks.normalized_key` column
   later (out of scope for an audit).
4. **Extension availability needs the dashboard.** pg_cron, pgmq and pg_net
   all exist on Supabase but must be enabled per-project before 0001 runs
   (Database → Extensions). This cannot be verified from here.
5. **`budget_ok()` returns true for unbudgeted scopes.** "Unbudgeted is
   unrestricted" is the opposite fail-open stance from the app's existing
   `ai_spend_reserve` (unconfigured = zero). Deliberate difference or
   drift? If the global row is ever deleted, spending becomes unlimited.
6. **`peer_reviews_author_reads` exposes `reviewer_id` values.** The author
   cannot join the uuid to a profile (no readable path — tested), but the
   raw uuid is visible and is correlatable across their own reviews ("the
   same person reviewed both my artifacts"). If that matters, the author
   read should go through a view that drops `reviewer_id`.

## Deliverables

- `0001`–`0008` — apply cleanly from scratch (baseline commit holds the
  pristine originals; every fix is a diff on top)
- `9999_tests.sql` — 28 assertions: the 13 required guard-bites, 7 RLS
  isolation tests, 8 suspect/regression tests
- `run-audit.mjs` — the runner; `node docs/files/run-audit.mjs --tests`
- `schema_health`: tables without RLS **0** · verified tracks below 50%
  deterministic **0** · resources marked dead **0** · submissions stuck
  needing humans **0** · suspected reciprocal review pairs **0**
