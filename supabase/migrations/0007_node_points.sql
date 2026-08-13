-- Nodes carry their point value.
--
-- The 91-day Data Analyst plan prices every day: 25–35 for a weekday, 40
-- for a build day, 15 for a Sunday review. The award itself stays
-- server-side (point_events has no client write path and that does not
-- change here) — this column is the PRICE TAG the page shows and the
-- retention-phase award RPC reads, so the number a learner saw and the
-- number they earn can never be two different numbers maintained twice.
--
-- Additive and independent of 0006 (auth): the two can merge in either
-- order.

alter table public.nodes
  add column points int not null default 25
  constraint nodes_points_range check (points between 5 and 100);

comment on column public.nodes.points is
  'What finishing this node is worth. Display + input to the server-side award; never awarded client-side. Module/week/streak bonuses are rules in the award RPC, not columns.';
