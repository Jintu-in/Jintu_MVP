-- ─────────────────────────────────────────────────────────────────────────────
-- 0021 — Java & Spring Boot requires Git & GitHub.
--
-- The edge is already in docs/roadmaps/java-spring-boot.mjs, so a fresh import
-- of that roadmap would create it. But re-pasting IMPORT-java-spring-boot.sql
-- deletes and reinserts the whole roadmap, and that cascades away every
-- node_progress row anybody has against it. One edge is not worth somebody's
-- fourteen weeks.
--
-- So the edge lands as a migration instead: additive, re-runnable, and it
-- touches nothing else.
--
-- Silently does nothing if either roadmap is missing, which is the right
-- behaviour — paste order should not be load-bearing, and re-running this
-- after Git arrives fixes it.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.roadmap_prerequisites (roadmap_id, requires_id, position, note)
select a.id, b.id, 0, 'Day one clones a repository and never explains how.'
from public.roadmaps a, public.roadmaps b
where a.slug = 'java-spring-boot'
  and b.slug = 'git-and-github'
on conflict (roadmap_id, requires_id) do update
  set position = excluded.position, note = excluded.note;

-- has_prereqs is derived, so it has to be told the edge exists.
select public.recompute_has_prereqs();

-- Belt and braces: every import already ends with these, but running them
-- once more after the last paste costs nothing and guarantees the catalogue
-- agrees with the days underneath it.
select public.recompute_estimated_hours();
select public.recompute_media_mix();
