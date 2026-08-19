# Jintu — audit brief

Paste this as the first message of a fresh Claude conversation, then attach the
files listed at the bottom. Ask for a per-rule pass/fail with file and element
named for every failure.

## What the product is

Jintu (jintu.in) is a free learning platform. Global product, launching in
India first. It turns scattered free material on the internet into deep,
day-by-day roadmaps: ~13 weeks, ~20 modules, ~91 days. Each day is an original
lesson page of 12–18 content blocks — brief, concept explanations written by
us, our own diagrams, worked examples, comparison tables, gotchas, self-check
questions, curated links with editorial notes, summary. Someone can learn the
concept without leaving the page; links are for depth.

Positioning: the scattered ChatGPT/Gemini learning habit, done properly and
kept — a real sequence, links a person actually opened, a record of what they
got through.

Users: any age, anywhere. Mostly mid-range Android phones, frequently on
metered data. Sessions 2–10 minutes. Second-language English readers — plain
words beat clever ones.

Tone: serious, calm, plain, generous. Closer to Stripe docs or Linear than to
Duolingo.

## Rules to audit against

### Colour (not negotiable)
| Token | Use |
| --- | --- |
| `#43B4C8` | brand teal — logo, decorative fills, large background blocks ONLY. 2.44:1 on white, FAILS WCAG AA. Never text, buttons, links or icons on a light surface. |
| `#17758A` | the interactive teal — ALL buttons, links, active states, teal text |
| `#EFFAFC` | brand tint, accent callouts |
| `#0B0B0B` | primary text |
| `#5F5E5A` | secondary text (6.49:1) |
| `#75746F` | muted text (4.68:1) — use for ALL muted text at any size |
| `#8A8A85` | 3.47:1, FAILS AA for normal text. Decorative fills and borders only, never a `color:` value |
| `#E8E8E5` | hairlines |
| `#FFFFFF` | surface |
| `#FAFAF8` | page |
| `#1D9E75` | done / success — as a FILL (white check on green circle is a graphical object, 3:1 threshold) |
| `#12606F` | success as TEXT (7.17:1) — mono "opened", "watched", "done" labels |
| `#BA7517` | warning |
| `#D85A30` | destructive as a BORDER |
| `#B8441F` | destructive as TEXT — e.g. the delete button label |

Contrast rationale: the original brief specified `#8A8A85` for muted text without
measuring it. It fails AA below 24px (18.66px at weight 500), which covered every
label, meta line, caption and mono line in the product. `#75746F` replaced it as a
straight substitution in August 2026 with no change to size, weight, spacing or
layout. Success and destructive colours split the same way: the app-legible fill
value and the AA-passing text value are different tokens, and both are listed above.

### Typography
- Inter for prose. JetBrains Mono for anything measured — points, minutes,
  megabytes, day numbers, streaks, percentages, code. Mono means "counted".
- Weights 400 and 500 only. Never 700.
- Sentence case everywhere.
- Lesson body 16px, line-height 1.75, measure 66 characters. UI chrome may
  drop to 13–14px.

### Shape
- 8px radius on buttons and inputs, 12px on cards. 1px hairlines.
- NO shadows. NO gradients. Flat.
- Touch targets 48px minimum.

### Mobile first
- Designed at 360px, then 1024px. 360px is a real device, not an edge case.

### Hard rules
- No invented social proof: no star ratings, no enrolment counts, no
  testimonials, no "10,000 learners". There are no users yet.
- Real numbers only: 91 days, 20 modules, ~340 hours, 60 min, ~98 MB.
- Never "guaranteed", "job assured", or any employment promise.
- Every reused third-party text block shows an attribution line and its
  licence, designed as a first-class element, not fine print.
- One primary action per screen.
- No mascots, cartoons, confetti, illustrated people, stock photography, emoji.
- Points and streaks are for consistency and for showing to people — not a
  credential.

## Decisions already made, deliberately

Flag these only if you disagree on the merits; they are not oversights.

1. **Tick target** — 20px circle inside a 48px tap area that bleeds into the
   card's right padding, so the text column keeps its 66ch measure.
2. **Done state** — body drops to `#8A8A85`; nothing collapses or hides. Two
   elements are exempt and keep full contrast: the quote's attribution line and
   the resource's editorial note. Both are evidence.
3. **Streak strip and contribution grid** are each ONE element with
   `role="img"` and a summary label; squares are `aria-hidden`. A user must not
   tab through 14 (or 371) squares.
4. **Broken streak** reads "Streak restarted", never a zero, and names the
   break → protects the total → offers the next step, in that order.
5. **Brand new streak** renders no number at all, never "0 day streak".
6. **Bandwidth chips** ("Everything / Reads only / Videos only") change a mono
   line below them to a real consequence in MB — a data filter, not a learning
   style.
7. **Videos** always state their weight before load ("Load player · ~98 MB"),
   never after.
8. **No node diagram or mind map** anywhere. Linear and collapsible only — a
   91-node graph is unusable on a phone.
9. **Word-form quantities stay in Inter** ("three rows", "a million"); only
   numerals and measurements go mono.
10. **Continue is the only teal-bordered element** on the dashboard, and the
    only filled button, so it is found before anything is read.
11. **Every empty state names the next action** and gives a real number, never
    just "nothing here".
12. **No modals anywhere** — resume, end-of-day and selection are strips or
    cards inside the reading column.

## Known open questions

- The collapsed roadmap cards all read "0 of n days", which is honest but makes
  the list look untouched. An em-dash for never-started modules may sit better.
- On desktop, Roadmaps sits in the left column under Review rather than on the
  right as originally specced, to stop the left column ending in white space.
- The flame glyph on the streak card is the one purely decorative icon in the
  system; the mono number carries the meaning without it.
- Resource type icons (doc / video tiles) could be mono "doc" / "video" labels.

## Files

| File | What it is |
| --- | --- |
| `Lesson blocks.dc.html` | content block library, each block default + marked-done |
| `Lesson body day 45.dc.html` | the shared lesson body (imported by the frame below) |
| `Day 45 lesson.dc.html` | full lesson page, 360 + 1024 |
| `Roadmap body.dc.html` | shared roadmap body |
| `Roadmap page.dc.html` | roadmap page, 360 + 1024 |
| `Streak states.dc.html` | four streak states incl. broken and brand new |
| `Dashboard.dc.html` | signed-in dashboard, 360 returning + 360 first week + 1024 |
| `Profile body.dc.html` | shared profile body |
| `Public profile.dc.html` | /u/handle, 360 + 1024 |
| `Share cards.dc.html` | 1200×630 streak + milestone, with thumbnail previews |
| `OG cards.dc.html` | four 1200×630 open-graph images |
| `Lesson states.dc.html` | scroll progress, resume, selection, note, loading, offline, dead link, end of day |

`support.js` is runtime plumbing — not a design file, exclude it from the audit.
