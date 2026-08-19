# Why Jintu is slow, and what to do about it

Measured 2026-08-19 against `jintu-mvp.vercel.app`, not guessed. Every
number below is reproducible with the command beside it.

## What the clock actually says

| Route | Cold TTFB | Warm TTFB | HTML |
|---|---|---|---|
| `/` | 2.65 s | 0.57–0.61 s | 25 KB |
| `/learn` | — | 1.06 s | 24 KB |
| `/learn/data-analyst` | — | 1.22 s | **80 KB** |
| `/learn/<roadmap>/<day>` | 2.39 s | 1.16 s | 13 KB |
| `/api/health` (one query, no UI) | 3.13 s | **0.98 s** | tiny |

```
curl -s -o /dev/null -w "%{time_starttransfer}\n" https://jintu-mvp.vercel.app/
```

**`/api/health` is the diagnostic.** It renders nothing. It runs a single
Supabase query and returns. It takes **~1 second warm**. Whatever is slow
is not React, not the design system, and not the size of the pages.

## The cause, in order of how much time it costs

### 1 · The server runs 12,000 km from the database

```
X-Vercel-Id: bom1::iad1::…
```

`bom1` is where the request arrives (Mumbai). **`iad1` is where the
function executes — Washington DC.** The Supabase project sits behind
Cloudflare and answers a trivial query in ~150 ms from a laptop in India;
the same class of query from the function costs ~1 s.

That gap is a round trip across the Atlantic and back, paid **per query**.
The marketing layout alone makes two before it renders anything.

No amount of query tuning fixes this. It is one setting.

**Confirm first:** the Supabase project's region (Dashboard → Settings →
General). If it is `ap-south-1`, pin the functions to `bom1`. If it is
`us-east-1`, the database is the thing in the wrong place, and moving the
functions would be the wrong fix — the product is India-first, so the data
should be too.

Expected: `/api/health` from ~1 s to ~150 ms. Everything else inherits it.

### 2 · Nothing is cached, because nothing is static

**20 files declare `force-dynamic`**, including both route-group layouts.
That makes every public page dynamic:

- `/`, `/pricing`, `/privacy`, `/terms`, `/refunds`, `/contact`
- `/learn`, `/learn/[slug]`, `/learn/[slug]/[node]`

Those pages are identical for every visitor. They are the SEO surface and
the first thing a shared link opens. Today each one boots a function and
queries a database in another continent.

The reason is a single line in `(marketing)/layout.tsx`: it reads the
viewer to draw the avatar and the streak chip. One personalised chip is
making the entire public site uncacheable.

**Fix:** take the viewer read out of the layout. Either a client island
that fetches the chip after paint, or Partial Prerendering with the chip
as the dynamic hole. Then the public pages become static/ISR with
`revalidate`, served from the CDN edge.

Expected: public TTFB from ~1 s to ~50 ms, and the database stops being
touched at all for logged-out traffic — which is most traffic.

### 3 · One node page fetches the entire roadmap

`getRoadmap(slug)` returns the whole tree — every module, all 91 nodes,
their topics, checks and resources:

```
whole tree:  55,427 bytes
one node:    ~2,000 bytes
```

It is called by the node page (needs one node), by both OG image
generators (need a title), and once **per enrolled roadmap** by the
dashboard. The node page throws away 96% of what it fetched.

**Fix:** a narrow `getNode(slug, nodeSlug)` that selects one node with its
own children, plus a `getRoadmapShell(slug)` for titles and counts. Keep
the full tree only on `/learn/[slug]`, which genuinely renders all of it.

### 4 · The roadmap page ships 80 KB of HTML

All 91 days are rendered into the markup as collapsed `<details>`, though
only one module is open. On a mid-range Android over metered data — the
stated target — that is the largest document the product serves.

**Fix:** render the open module's days; load the rest when a module is
expanded. The page already knows which module holds the next day.

### 5 · Cold starts near 2 seconds

Partly item 1, partly bundle size. Worth re-measuring **after** items 1
and 2, because static pages never cold-start at all and the remaining
dynamic surface is small.

## Order of work

| # | Change | Effort | Expected |
|---|---|---|---|
| 1 | Confirm DB region; pin functions to match | ~1 line | −800 ms on every query |
| 2 | Viewer chip out of the layout; public pages static/ISR | ~half a day | public TTFB → ~50 ms |
| 3 | `getNode` / `getRoadmapShell` instead of the whole tree | ~half a day | −50 KB and one query per reader hit |
| 4 | Roadmap page renders the open module only | ~half a day | −60 KB HTML |
| 5 | Re-measure; decide whether bundle work is still needed | — | — |

Items 1 and 2 are most of the win and neither touches a component.

## Guardrail

Once 1 and 2 land, add a budget check to CI: fail if warm TTFB on `/` or
`/learn` exceeds an agreed ceiling. Performance regressions are invisible
in review and obvious in production; the only way they stay fixed is if
something fails when they come back.
