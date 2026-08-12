# SQL runner adapter — design for sign-off. NOT IMPLEMENTED.

The adapter that populates `submission.facts.sqlResults[queryId]` by running
untrusted learner SQL, so `sql_diff` can stay pure. This is a security job:
nothing below gets built until this document is signed off.

## Placement

A separate edge function, `run-sql`, invoked by `grade-submission` (or ahead
of it in the queue pipeline) — never directly by browsers. It connects to a
**dedicated scratch database**, not the production database: the learner's
SQL and Jintu's data never share a Postgres instance. Supabase's free tier
gives us a second project for exactly this; the scratch project holds only
public practice datasets, so its blast radius on total compromise is "the
learner saw the dataset they were already given".

## The six defenses, layered

1. **Read-only role, structurally.**
   A `runner` role with: `NOSUPERUSER NOCREATEDB NOCREATEROLE NOLOGIN`-parent
   plus a login child per environment; `default_transaction_read_only = on`
   at role level; `REVOKE ALL ON SCHEMA public` then `GRANT USAGE` +
   `GRANT SELECT` on exactly the dataset tables; **no grants anywhere else,
   including pg_catalog write paths**; `REVOKE TEMP ON DATABASE` (temp
   tables are writes). Read-only transactions refuse INSERT/UPDATE/DELETE/
   DDL at the executor level even if a grant slipped through.

2. **statement_timeout.**
   `SET statement_timeout = '3s'` per session, set by the runner before the
   learner's SQL, plus `idle_in_transaction_session_timeout = '5s'`. Three
   seconds grades every honest teaching query; a cartesian bomb dies quietly.
   The connection itself carries `options=-c statement_timeout=3000` so a
   learner's `RESET statement_timeout` is refused (read-only transactions
   cannot ALTER their own role settings; SET is session-local but our wrapper
   re-asserts before each run).

3. **Per-user rate limit.**
   Enforced in OUR database, not the scratch one: `runner_calls (user_id,
   called_at)` with a definer function `runner_allow(user_id)` returning
   false past **10 runs per minute / 200 per day**. The edge function checks
   before connecting. Learner-visible failure is "try again in a minute",
   never a stack trace.

4. **Pristine dataset per run — by isolation, not restoration.**
   Restoring per run is expensive and racy. Instead: datasets are read-only
   to the runner role (defense 1), so they cannot drift; each run gets its
   own connection with `BEGIN READ ONLY; ... ROLLBACK;` — even a discovered
   write hole rolls back. Dataset refresh is an ops script re-running the
   seed, versioned alongside the answer keys (a key is only valid against
   its dataset version; `answer_keys.rotation` already models this).

5. **Row-count ceiling before results return.**
   The runner wraps every learner query: `SELECT * FROM (<learner_sql>) q
   LIMIT 5001` — never the raw query. 5001 rows returned means "over the
   5000 ceiling": the result is discarded and the fact records
   `{ exceededCeiling: true, limit: 5000 }`, which `row_count_ceiling` and
   `sql_diff` already know how to refuse legibly. The ceiling protects the
   edge function's memory, the wire, and the database, in that order.
   Column ceiling too: > 64 columns is refused the same way.

6. **Cross-schema reads.**
   `search_path = practice` (the dataset schema), `REVOKE USAGE ON SCHEMA
   public, pg_catalog…` — cannot revoke pg_catalog usage entirely (Postgres
   always permits catalog reads), so the stance is: the scratch database
   CONTAINS no secrets — no keys, no learner data, no credentials — making
   catalog reads harmless by construction rather than by prohibition. A
   learner who reads `pg_tables` learns the names of practice tables they
   were already given. `information_schema` likewise. Attempting to read a
   schema that does not exist fails with the ordinary Postgres error, which
   is passed through — it is a teaching moment, not a leak.

## What the adapter writes

```
facts.sqlResults[queryId] = {
  columns: string[],           // names, in order
  rows: unknown[][],           // max 5000
  rowCount: number,
  truncated: boolean,
  exceededCeiling?: true,
  error?: { code: string, message: string }   // sanitised: no host, no role names
}
```

Errors are facts, not failures: a syntax error in learner SQL is a
legitimate grading outcome (`sql_diff` refuses with the message), never a
`pendingHuman`.

## What can still go wrong, named

- **DoS via many small queries** — rate limit is per user; a botnet of free
  accounts is bounded by signup friction and the global connection cap
  (pool size 4; queue waits, never fans out).
- **Catalog-based fingerprinting** — accepted; scratch DB holds nothing
  secret.
- **A future dataset accidentally containing an answer key** — process
  rule: keys never ship to the scratch project; the dataset seed script is
  reviewed against `answer_keys.ref` names in CI (greppable, cheap).
- **Timing side-channels on planted defects** — theoretical; the defect
  counts are already discoverable by honest querying, which is the point of
  the exercise.

## Sign-off checklist (decide these, then implementation starts)

1. Scratch project: second Supabase project, or a second DATABASE in the
   existing project? (Recommended: second project. Hard blast-radius wall.)
2. Ceilings: 3s / 5000 rows / 64 cols / 10 per min — confirm or adjust.
3. Dataset versioning: is `answer_keys.rotation` the version pin, or do
   datasets get their own table?
4. Who may invoke `run-sql`: only `grade-submission`, or also an interactive
   "try your query" UI later? (The limits above assume grading-only; an
   interactive runner needs its own, tighter budget.)

**Stopping here per instruction. No runner code exists in this change.**
