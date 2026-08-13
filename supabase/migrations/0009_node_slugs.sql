-- Node slugs: a URL a person can forward.
--
-- /learn/data-analyst/45fba0ae-... is unshareable, and a node link is the
-- most forwardable thing the product has — "look at Day 47, cohort
-- retention" is a WhatsApp message. Slugs derive from titles, which carry
-- their day numbers ("day-47-cohort-retention-end-to-end"), so collisions
-- within a roadmap do not occur in practice; the constraint pins uniqueness
-- within a module, and the reader resolves within the roadmap.
--
-- Re-runnable, like every paste since FIX-2.

alter table public.nodes add column if not exists slug text;

update public.nodes n set slug = regexp_replace(
  regexp_replace(lower(n.title), '[^a-z0-9]+', '-', 'g'),
  '(^-|-$)', '', 'g'
)
where n.slug is null;

-- Writers that predate slugs (the seed, guard fixtures, any hand insert)
-- get one derived from the title at insert time. NOT NULL then holds
-- without every caller having to know the derivation rule.
create or replace function public.nodes_slug_default()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  if new.slug is null then
    new.slug := regexp_replace(
      regexp_replace(lower(new.title), '[^a-z0-9]+', '-', 'g'),
      '(^-|-$)', '', 'g');
  end if;
  return new;
end;
$$;

drop trigger if exists nodes_slug_default on public.nodes;
create trigger nodes_slug_default
  before insert on public.nodes
  for each row execute function public.nodes_slug_default();

alter table public.nodes alter column slug set not null;

do $$ begin
  alter table public.nodes add constraint nodes_slug_unique unique (module_id, slug);
exception when duplicate_table or duplicate_object then null;
end $$;

create index if not exists nodes_slug_idx on public.nodes (slug);

comment on column public.nodes.slug is
  'URL segment, derived from the title (day number included). The reader resolves roadmap+slug; the id stays the stable key for progress rows.';
