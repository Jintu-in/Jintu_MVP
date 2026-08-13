-- A defect key may ARRIVE after publish; it may never CHANGE after publish.
--
-- The original freeze blocked insert, update and delete alike, which
-- deadlocks the only workable ops order: the curriculum paste publishes the
-- path (creating the assignment rows), and only then can the ops-held key
-- bind to them — the key SQL selects the highest published version's
-- artifact, which does not exist until publish. Blocking the INSERT meant
-- no published path could ever gain a key at all.
--
-- Adding a key changes nothing a learner was shown or graded against: it
-- ENABLES machine grading for submissions from that moment on; earlier
-- submissions keep whatever grading they had. Changing or removing a key
-- mid-flight is still what the freeze exists to stop, and still frozen.

drop trigger if exists defect_keys_frozen_when_published on public.assignment_defect_keys;

create trigger defect_keys_frozen_when_published
  before update or delete on public.assignment_defect_keys
  for each row execute function public.reject_published_answer_key_change();

comment on trigger defect_keys_frozen_when_published on public.assignment_defect_keys is
  'Update/delete only: a key may arrive after publish (it only enables grading), but once present it is part of what the cohort is graded against and never changes. Rotation is a new path version.';
