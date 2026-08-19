# Node reader — every state, and how to force it

Written because "every state reachable in dev" is only a real claim if
somebody else can reach them. Each state below has a recipe that needs no
special build and no seeded fixture beyond what is described.

All of these live at `/learn/<roadmap>/<day>` unless stated otherwise.

## The six reading states

| State | How to force it |
|---|---|
| **Signed out** | Open any day in a private window. Full content renders; the action reads "Sign in to mark this day done"; section ticks still work and persist in `localStorage`. |
| **In progress** | Sign in and tick two or three sections. The header count, the rail ticks and the "N of M done" footer all move together. |
| **Done** | Press "Mark day N done". The button is replaced in place by the done card — no modal, no confetti — carrying the streak, the points and the next day as "Up next". |
| **Resuming** | Pass a `resumePoint` to `LessonRoute` (the seam is wired; the server does not populate it until per-section progress is stored server-side — see "Known gaps"). The strip is inline and dismissible. |
| **Dead resource** | Set a resource's `health` to `'broken'`: `update resources set health = 'broken' where id = '<id>';` The row keeps its place, struck through, with the warn line and a Report link. |
| **Last day of a module** | Open the final day of any module. *Not yet built — see "Known gaps".* |

## Empty, loading and error

| State | How to force it |
|---|---|
| **Loading** | Throttle to "Slow 3G" in devtools and navigate to a day. `loading.tsx` renders a skeleton shaped like the page — never a spinner. |
| **Node not found** | `/learn/data-analyst/not-a-real-day` → "That day does not exist." |
| **Roadmap not found** | `/learn/kubernetes` → "We have not written that one yet.", the list of what exists, and one input. Submitting writes a row: `select * from topic_requests order by created_at desc limit 1;` |
| **Route error** | Throw inside the page component, or take Supabase offline (unset `NEXT_PUBLIC_SUPABASE_URL`) and reload. `error.tsx` offers Try again. |
| **Mark-done failed** | Devtools → Network → **Offline**, then press "Mark day N done". The button returns to normal and an inline `text-warn-700` line appears beneath: "That did not save. Your place is kept — try again." with **Retry** beside it. Go back online and press Retry — it repeats the original attempt and succeeds. Nothing disappears on its own. |
| **Session expired mid-page** | Delete the auth cookies in devtools, then press mark-done. The failure line appears; the day stays fully readable. |
| **Offline** | Devtools → Network → **Offline** and reload. *Partly built — see "Known gaps".* |

## Known gaps, stated rather than implied

- **Resuming** — the strip and its props exist and render, but nothing
  populates `resumePoint` yet. Per-section ticks live in `localStorage`
  (there is no `block_progress` table), so the server cannot know which
  section someone stopped at. When that table lands, the seam is one prop.
- **Last day of a module** — the done card names the next *day*. Turning
  it into "Module 01 done · 3 of 3 days" plus the next module needs the
  module boundary passed down, which is a data change to the page.
- **Offline list** — `OfflineNotice` exists as a component with the
  design's copy, but nothing records "days you have opened" yet. That
  needs a small `localStorage` ring buffer written on each node view.

Each of these is a seam already in place rather than a rewrite.
