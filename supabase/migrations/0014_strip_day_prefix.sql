-- ─────────────────────────────────────────────────────────────────────────────
-- 0014 — the day number belongs to nodes.position, not to nodes.title.
--
-- Every surface renders the number from `position` and then prints the
-- stored title after it, so a title that also begins "Day 3 — " comes out
-- as "Day 3 · Day 3 — Reading a dataset before you touch it". It is on the
-- roadmap day rows, the node H1, both prev/next links and the OG image.
--
-- 91 of 180 nodes carry the prefix today, all from the data-analyst import,
-- all with an em-dash. The character class covers the middot and hyphen too
-- so a spec written either way is cleaned by the same statement.
--
-- The UI is not changed by this: it already renders the prefix from
-- position. Only the stored string loses its copy.
--
-- Re-runnable: after the first pass nothing matches, and the WHERE keeps it
-- from touching rows it does not need to.
-- ─────────────────────────────────────────────────────────────────────────────

update public.nodes
set title = regexp_replace(title, '^Day\s+\d+\s*[—·-]\s*', '')
where title ~ '^Day\s+\d+\s*[—·-]\s*';

-- The prefix must not come back. A node title is a name, and the sequence
-- lives in `position` — a title that restates it will always double on
-- render. Enforced here so an import cannot reintroduce it, which is
-- exactly how it arrived.
do $$ begin
  alter table public.nodes
    add constraint nodes_title_carries_no_day_number
    check (title !~ '^Day\s+\d+\s*[—·-]\s*');
exception when duplicate_object then null; end $$;

comment on column public.nodes.title is
  'The day''s name, without any "Day N" prefix — the number is nodes.position and every surface renders it from there. A CHECK enforces this, because a restated number doubles on every render.';
