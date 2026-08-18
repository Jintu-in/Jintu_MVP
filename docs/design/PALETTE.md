# Jintu palette

Every colour in the product. Ratios are measured against `#FFFFFF`.
WCAG AA needs 4.5:1 for normal text, 3:1 for text at 24px+ (18.66px at weight 500)
and for UI components and graphical objects.

## Text

| Hex | Name | On white | Use |
| --- | --- | --- | --- |
| `#0B0B0B` | ink | 19.3:1 | primary text, headlines, body copy |
| `#5F5E5A` | ink-secondary | 6.49:1 | secondary prose, captions, table cells |
| `#75746F` | ink-muted | 4.68:1 | ALL muted text — labels, meta lines, mono lines, timestamps, month labels, legend labels, placeholders |
| `#17505C` | on-tint | 8.98:1 | text sitting on an `#EFFAFC` callout or summary card |
| `#12606F` | teal-dark | 7.17:1 | button hover fill, and success stated as text ("opened", "watched", "done") |
| `#17758A` | teal-interactive | 4.85:1 | ALL buttons, links, active states, icons, teal text, editorial notes |
| `#B8441F` | destructive-text | 5.71:1 | destructive labels — e.g. the delete button |
| `#BA7517` | warning | 4.52:1 | warning callout label and rule |

## Surfaces and structure

| Hex | Name | Use |
| --- | --- | --- |
| `#FFFFFF` | surface | cards, sheets, the reading column |
| `#FAFAF8` | page | page background, code blocks, note callouts, skeleton placeholders |
| `#EFFAFC` | tint | accent callouts, gotcha fills, summary cards, editorial-note panels, monogram tiles |
| `#E8E8E5` | hairline | every 1px border and divider, empty-square borders |
| `#CFEDF4` | selection | `::selection` background, live text-selection highlight |

## Signal fills

| Hex | Name | On white | Use |
| --- | --- | --- | --- |
| `#1D9E75` | done | 3.03:1 | done/success as a FILL only — tick circles, progress bars, contribution squares, share-card squares. The white check on this green is a graphical object, where 3:1 is the correct threshold. For success as TEXT use `#12606F`. |
| `#D85A30` | destructive | 3.72:1 | destructive as a BORDER only — missed-day squares, delete-button hover border. For destructive TEXT use `#B8441F`. |

## DECORATIVE ONLY — NEVER TEXT

| Hex | Name | On white | Rule |
| --- | --- | --- | --- |
| `#43B4C8` | brand teal | **2.44:1** | Logo, large decorative fills, big background blocks. **Never** text, buttons, links or icons on a light surface. Currently used in exactly one place: the 8px bar on OG card 2. |
| `#8A8A85` | grey | **3.47:1** | Fills and borders that carry no text. **Never** a `color:` value at any size. Replaced as muted text by `#75746F` in August 2026. |

## Not product

`#F1F0EC` is the canvas surround behind the design-doc frames. It is not a
product surface and must not appear inside a screen.

## Type

Inter for prose. JetBrains Mono for anything measured — points, minutes,
megabytes, day numbers, streaks, percentages, code. Weights 400 and 500 only.
Sentence case everywhere. Lesson body 16px / 1.75 / 66ch measure; UI chrome may
drop to 13–14px.

## Shape

8px radius on buttons and inputs, 12px on cards. 1px hairlines. No shadows, no
gradients. Touch targets 48px minimum — visible chrome may be smaller than the
tap area (the code-block copy button is a 32px box inside a 48px target).
