/**
 * Checks that every guard in scripts/ is actually reachable and actually runs.
 *
 *   node scripts/assert-guards-wired.mjs
 *
 * This exists because the failure has now happened three times, always the
 * same way: two branches both add a line to package.json and .github/ci.yml,
 * the merge resolves the conflict by taking one side, and a guard silently
 * stops running. Nothing goes red. The file is still in the repo, still
 * reviewed, still apparently protecting something.
 *
 * That is how the schema-simulation guard came to be sitting on main, unused,
 * while the trigger bug it was written to catch shipped anyway.
 *
 * Convention:
 *   scripts/assert-*.mjs    a guard — needs a package.json script AND a CI step
 *   scripts/simulate-*.mjs  a guard — same
 *   scripts/*.mjs           a utility — needs a package.json script only
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPTS_DIR = path.join(ROOT, "scripts");
const SELF = "assert-guards-wired.mjs";

const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
const npmScripts = pkg.scripts ?? {};
const ci = readFileSync(path.join(ROOT, ".github", "workflows", "ci.yml"), "utf8");

const isGuard = (f) => f.startsWith("assert-") || f.startsWith("simulate-");
const files = readdirSync(SCRIPTS_DIR).filter((f) => f.endsWith(".mjs") && f !== SELF);

const problems = [];

for (const file of files) {
  // Which npm script runs this file?
  const entry = Object.entries(npmScripts).find(([, cmd]) => cmd.includes(`scripts/${file}`));

  if (!entry) {
    problems.push(
      `scripts/${file} has no package.json script — nothing can run it, so it does nothing`,
    );
    continue;
  }

  const [name] = entry;
  if (!isGuard(file)) continue;

  // A guard must also be invoked by CI. Match `pnpm <name>` as a whole word so
  // `pnpm db:lint` does not satisfy a requirement for `pnpm db:lints`.
  const invoked = new RegExp(`pnpm ${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "m");
  if (!invoked.test(ci)) {
    problems.push(
      `scripts/${file} is wired to \`pnpm ${name}\` but no CI step runs it — ` +
        `it will pass locally and protect nothing on a pull request`,
    );
  }
}

// The reverse direction: a CI step referencing a script that no longer exists
// fails the pipeline confusingly rather than clearly.
for (const m of ci.matchAll(/run: pnpm ([a-z][a-z0-9:_-]*)/g)) {
  const name = m[1];
  if (name === "install" || name === "supabase") continue;
  if (!(name in npmScripts)) {
    problems.push(`CI runs \`pnpm ${name}\` but package.json has no such script`);
  }
}

console.log(`Checked ${files.length} script(s) in scripts/.`);

if (problems.length) {
  console.error(`\n${problems.length} unwired guard(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    "\nA guard that does not run is worse than no guard: it looks like coverage.\n" +
      "If a merge dropped the line, put it back. If the guard is genuinely\n" +
      "retired, delete the file too.",
  );
  process.exit(1);
}

console.log("Every guard has a script, and every guard runs in CI.");
