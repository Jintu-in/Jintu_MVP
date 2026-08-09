-- Storage for the two assignment kinds that are not text: `file` (week 3's
-- cleaned dataset) and `recording` (week 6's case walkthrough).
--
-- The bucket and its policies land here; the upload UI does not. The dashboard
-- still tells students both kinds are "not open yet", and that stays true
-- until the submission form can write a file and put its path in the payload.
-- Shipping the storage rules first is deliberate — an upload control wired to
-- a bucket whose policies were written in the same rush is how a private
-- bucket ends up public.
--
-- Private bucket, never public. A submission is a student's own work, visible
-- to them, to whoever grades it, and later to the two peers assigned to review
-- it. A public bucket would put every dataset a student uploads on a guessable
-- URL, and `public` on a Supabase bucket means exactly that: no auth, no RLS,
-- readable by anyone who can construct the path.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submissions',
  'submissions',
  false,
  -- 25 MB. Generous for a CSV or a PDF, tight for video — which is the
  -- intended pressure. A six-minute screen recording at a sane bitrate fits;
  -- an uncompressed export does not, and the student is on mobile data.
  26214400,
  array[
    'text/csv',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/mp4'
  ]
)
on conflict (id) do nothing;

-- Path convention: `<user_id>/<assignment_id>/<filename>`.
--
-- The leading folder is the owner's uid, which is what makes these policies
-- expressible at all: storage.objects has no foreign key to enrollments, so
-- ownership has to be carried in the key. Application code must never build a
-- path any other way — a file written outside the uploader's own folder is
-- unreachable by every policy below, including the uploader's own read.

create policy "students upload into their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    -- Enrolment is the gate. Without it any signed-in account — and signing
    -- up costs one SMS — is 25 MB of free storage per request.
    and exists (
      select 1
      from public.enrollments
      where user_id = (select auth.uid())
        and status = 'active'
    )
  );

create policy "students read their own submission files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Deliberately absent:
--
--   * No update or delete policy. `submissions` already carries a unique
--     constraint on (enrollment_id, assignment_id) and the submission form
--     tells students they cannot change a submission once peers are reviewing
--     it. A student who could overwrite the object after review would make the
--     grade refer to a file that no longer exists.
--
--   * No reviewer read policy. Peer review allocation does not exist yet —
--     `peer_reviews` rows are written by hand today — so a policy granting
--     reviewers access would be granting it against a table nothing populates.
--     It arrives with the allocation logic, where it can be tested against a
--     real assignment rather than a hypothetical one.
--
--   * No service-role policy. The service role bypasses RLS by design; adding
--     a policy for it would imply the opposite to whoever reads this next.
