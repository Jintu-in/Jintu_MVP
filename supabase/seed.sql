-- Development seed. Deliberately thin: real roadmap content arrives through
-- reviewed imports (licence checked, links validated), never through a seed
-- file. Nothing here carries a third-party URL, so nothing here can go stale
-- or point at content we have not verified.

insert into public.colleges (name, city, state, tier) values
  ('Gauhati University', 'Guwahati', 'Assam', 'tier2'),
  ('Cotton University', 'Guwahati', 'Assam', 'tier2');

-- One draft roadmap skeleton so local dev has a shape to render. Draft means
-- invisible to every client — publishing requires reviewed, validated links.
with r as (
  insert into public.roadmaps (slug, title, summary, subject_tags, difficulty, estimated_weeks, estimated_hours)
  values (
    'data-analyst',
    'Data analyst',
    'SQL, spreadsheets, dashboards and the judgement to use them — sequenced from zero to portfolio.',
    array['data', 'sql', 'analytics'],
    'beginner', 24, 300
  )
  returning id
), m as (
  insert into public.modules (roadmap_id, position, title, week_range, objective, est_hours)
  select id, 1, 'Foundations — spreadsheets and data thinking', 'Weeks 1–4',
         'Read a messy table and say something true about it.', 40
  from r
  returning id
)
insert into public.nodes (module_id, position, title, summary, est_minutes, difficulty)
select id, 1, 'What a data analyst actually does',
       'The day-to-day of the job, before any tooling.', 30, 'intro'
from m;
