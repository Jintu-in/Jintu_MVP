/**
 * Data analyst — the 91-day roadmap (owner curriculum, 2026-08-13).
 *
 * 20 modules · 91 days · ~340 hours. Six days on, one day off: day 7 of
 * each week is review only, because spaced review is what stops week 3
 * evaporating by week 9. Every day is finishable on a bad evening — a day
 * you cannot finish breaks the streak, and a broken streak is how people
 * quit.
 *
 * Day → node, one to one; day numbers live in node titles; module
 * membership follows the owner's module table (which places each weekly
 * review day in the module whose day-range covers it).
 *
 * Points: each node carries its day price (25–35 weekdays, 40 build days,
 * 15 Sunday reviews). Module/week/streak bonuses are award-RPC rules, not
 * spec data. Points track momentum, not mastery — they exist so a Tuesday
 * evening feels like it counted.
 *
 * Sourcing: every URL in these files resolved at authoring time and is
 * re-verified by `--check` before any paste can publish. Videos named by
 * channel in the owner's plan ship as channel links with a search note —
 * a specific video id appears only where oEmbed confirmed the title.
 */
import m01to04 from "./data-analyst/modules-01-04.mjs";
import m05to09 from "./data-analyst/modules-05-09.mjs";
import m10to11 from "./data-analyst/modules-10-11.mjs";
import m12to16 from "./data-analyst/modules-12-16.mjs";
import m17to20 from "./data-analyst/modules-17-20.mjs";

const modules = [...m01to04, ...m05to09, ...m10to11, ...m12to16, ...m17to20].map(
  (m) => ({
    // Module hours derive from the day estimates rather than being typed
    // twice and drifting.
    estHours: Math.max(1, Math.round(m.nodes.reduce((a, n) => a + n.estMinutes, 0) / 60)),
    ...m,
  }),
);

export default {
  slug: "data-analyst",
  title: "Data analyst",
  summary:
    "Ninety-one days from zero to a portfolio: spreadsheets, SQL, Python, statistics, dashboards — sequenced day by day from the best free material on the internet.",
  subjectTags: ["data", "sql", "python", "statistics", "analytics", "spreadsheets"],
  difficulty: "beginner",
  estimatedWeeks: 13,
  estimatedHours: 340,
  licenseNote: null, // hand-curated link by link; nothing imported wholesale
  modules,
};
