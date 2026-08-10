/**
 * Tests the avatar initials.
 *
 *   node apps/web/sandbox/initials.test.mjs
 *
 * Duplicated from src/lib/session.ts for the same reason retry.test.mjs
 * duplicates its subject: the source is TypeScript inside the Next app and
 * this runner is plain node. Same rule applies — the copy below must stay
 * identical to the source, or this file is testing fiction.
 *
 * Worth pinning because the obvious implementation is wrong for the people
 * who will use this. "First initial plus last initial" assumes two names, and
 * mononymous names are common in India — a student called Nandini with no
 * surname would get a blank circle, which is a small, personal, entirely
 * avoidable insult sitting in the header of every page she loads.
 */

function initialsFor(viewer) {
  const name = viewer.fullName?.trim();
  if (name) {
    const words = name.split(/\s+/).filter(Boolean);
    const letters = [words[0], words.length > 1 ? words[words.length - 1] : undefined]
      .filter(Boolean)
      .map((w) => [...w][0])
      .join("");
    if (letters) return letters.toUpperCase();
  }

  const local = viewer.email?.split("@")[0]?.trim();
  if (local) return [...local][0].toUpperCase();

  return null;
}

let passed = 0;
const failures = [];
const check = (actual, expected, label) => {
  const ok = actual === expected;
  if (ok) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL  ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
};

const from = (fullName, email = null) => initialsFor({ fullName, email });

console.log("── names ───────────────────────────────────────────────────");
check(from("Priya Sharma"), "PS", "two names give both initials");
check(from("Nandini"), "N", "one name gives one letter, not a blank");
check(from("Ravi Kumar Reddy"), "RR", "three names use the first and the last, not the middle");
check(from("  Aarav   Mehta  "), "AM", "extra whitespace does not become an initial");
check(from("aarav mehta"), "AM", "lowercase input is upper-cased");
check(from("जतिन शर्मा"), "जश", "Devanagari names work — no assumption of Latin script");
check(from("𝒜nita Rao"), "𝒜R", "an astral first character is not sliced in half");
check(from("O'Brien Fernandes"), "OF", "punctuation inside a name is not treated as a word break");

console.log("\n── fallbacks ───────────────────────────────────────────────");
check(from(null, "priya@example.com"), "P", "no name falls back to the email");
check(from("", "priya@example.com"), "P", "an empty name falls back too");
check(from("   ", "priya@example.com"), "P", "a whitespace-only name is not a name");
check(from(null, null), null, "nothing at all returns null, so the component draws a glyph");
check(from("", ""), null, "two empty strings are still nothing");

console.log("\n── what it must never do ───────────────────────────────────");
// The phone number is never an input to this function. A header is a
// shoulder-surfable surface and a contact number does not belong on one.
check(
  initialsFor({ fullName: null, email: null, phone: "9876543210" }),
  null,
  "a phone number on the object is ignored, not used as a fallback",
);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
