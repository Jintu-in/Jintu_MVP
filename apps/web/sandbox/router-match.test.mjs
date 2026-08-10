/**
 * Tests the homepage router's matcher.
 *
 *   node apps/web/sandbox/router-match.test.mjs
 *
 * Duplicated from components/track-router.tsx for the same reason the other
 * suites here duplicate their subject: the source is TypeScript inside the
 * Next app and this runner is plain node. Same rule — the copy below must stay
 * identical to the source, or this file is testing fiction.
 *
 * Worth pinning because this function decides which of two very different
 * pages somebody sees. Too eager and a person asking for something we have
 * never built is shown a sprint that does not answer them; too strict and
 * somebody typing the name of a course we do have is told nobody has built it.
 * The second is the worse failure: it turns a customer into a request.
 */

function match(typed, tracks) {
  const words = typed
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((w) => w.length > 2);

  if (!words.length) return null;

  let best = null;

  for (const track of tracks) {
    const haystack = `${track.title} ${track.slug}`.toLowerCase();
    const score = words.filter((w) => haystack.includes(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { track, score };
  }

  return best?.track ?? null;
}

const TRACKS = [
  { slug: "data-analyst-fresher", title: "Data Analyst — first job" },
  { slug: "backend-node-fresher", title: "Backend Engineer — Node.js" },
  { slug: "android-kotlin-fresher", title: "Android Engineer — Kotlin" },
  { slug: "ux-designer-fresher", title: "UX Designer — first job" },
];

let passed = 0;
const failures = [];
const check = (actual, expected, label) => {
  const got = actual?.slug ?? null;
  if (got === expected) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL  ${label} — expected ${expected}, got ${got}`);
  }
};

console.log("── finds what exists ───────────────────────────────────────");
check(match("data analyst", TRACKS), "data-analyst-fresher", "the exact name");
check(match("Data Analyst", TRACKS), "data-analyst-fresher", "case does not matter");
check(match("  data analyst  ", TRACKS), "data-analyst-fresher", "nor does surrounding space");
check(match("data", TRACKS), "data-analyst-fresher", "one distinctive word is enough");
check(
  match("i want to be a data analyst at a startup", TRACKS),
  "data-analyst-fresher",
  "a whole sentence still lands on the right track",
);
check(match("kotlin", TRACKS), "android-kotlin-fresher", "a word from the slug, not the title");
check(match("node.js", TRACKS), "backend-node-fresher", "punctuation inside a term is split, not fatal");

console.log("\n── scores rather than takes the first hit ──────────────────");
// "designer" alone hits UX. "backend engineer" hits Backend on two words and
// Android on one, so the ranking has to prefer two.
check(match("backend engineer", TRACKS), "backend-node-fresher", "two words beat one");
check(match("designer", TRACKS), "ux-designer-fresher", "an unambiguous word wins outright");

console.log("\n── refuses to guess ────────────────────────────────────────");
check(match("", TRACKS), null, "nothing typed matches nothing");
check(match("   ", TRACKS), null, "whitespace is not a query");
check(match("an", TRACKS), null, "a two-letter word is ignored, not matched everywhere");
check(match("a to be at", TRACKS), null, "a sentence of only short words matches nothing");
check(
  match("battery pack engineering", TRACKS),
  null,
  "a subject nobody has built returns nothing, so the page can say so",
);
check(match("data analyst", []), null, "an empty catalogue matches nothing rather than throwing");

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
