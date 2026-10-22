-- ─────────────────────────────────────────────────────────────────────────────
-- 0027 — the grant 0026 forgot.
--
-- 0001's own comment on this exact pattern: "a table with no grant stays
-- unreachable even if a careless policy is added later — the grant and the
-- policy have to agree before a row moves." consent_events (0026) got the
-- RLS policies but not the table-level grant, so every real insert/select
-- against it from the authenticated role fails with "permission denied for
-- table consent_events" (42501) — caught by a new baseline:verify check
-- written straight after 0026 shipped, before any app code went live against
-- it. Purely additive; nothing to backfill.
-- ─────────────────────────────────────────────────────────────────────────────

grant select, insert on public.consent_events to authenticated;
