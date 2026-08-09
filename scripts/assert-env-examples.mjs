/**
 * Fails the build if a committed .env.example contains a real credential.
 *
 *   node scripts/assert-env-examples.mjs [file ...]
 *
 * Why this exists: the natural way to configure a project is to open the file
 * that lists every variable and start typing values into it. That file is
 * .env.example, and it is tracked. The mistake takes ten seconds, produces no
 * error, and the credential is in git history from the next commit onward.
 *
 * A Supabase anon key is public by design and leaking one is not a breach on
 * its own — RLS is what protects the data. But the same reflex puts a
 * service_role key, a Razorpay secret, or an LLM API key in the same file,
 * and those are not public. This guard does not distinguish, deliberately.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", "dist", "coverage", ".git"]);

/**
 * Names that must always be blank in a template.
 *
 * Deliberately not "*_URL": a URL is not a secret, and NEXT_PUBLIC_SITE_URL
 * has a legitimate default. The one URL that must stay blank is called out
 * below, because it names your project and the failure mode that prompted
 * this guard was someone pasting a bare project ref into it.
 */
const SECRET_NAME = /(KEY|SECRET|TOKEN|DSN|PASSWORD|CREDENTIAL)$/;
const MUST_BE_BLANK = new Set(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_DB_URL", "DATABASE_URL"]);

/** Value shapes that are credentials whatever the variable is called. */
const CREDENTIAL_SHAPES = [
  { re: /^eyJ[\w-]+\.[\w-]+\./, what: "a JWT" },
  { re: /^sb_(secret|publishable)_/, what: "a Supabase API key" },
  { re: /^(sk|pk|rzp)_[A-Za-z0-9_]{8,}/, what: "an API key" },
  { re: /^phc_[A-Za-z0-9]{16,}/, what: "a PostHog key" },
  { re: /^https:\/\/[a-z]{16,}\.supabase\.co/, what: "a real Supabase project URL" },
  { re: /^[A-Za-z0-9+/]{40,}={0,2}$/, what: "a long opaque secret" },
];

function findEnvExamples(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) findEnvExamples(full, out);
    else if (entry === ".env.example" || entry.endsWith(".env.example")) out.push(full);
  }
  return out;
}

const files =
  process.argv.length > 2
    ? process.argv.slice(2).map((f) => path.resolve(ROOT, f))
    : findEnvExamples(ROOT);

const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const eq = trimmed.indexOf("=");
      if (eq === -1) return;

      const name = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (value === "") return;

      const shape = CREDENTIAL_SHAPES.find((s) => s.re.test(value));
      if (shape) {
        violations.push({ file: rel, line: i + 1, name, why: `looks like ${shape.what}` });
        return;
      }
      if (SECRET_NAME.test(name) || MUST_BE_BLANK.has(name)) {
        violations.push({
          file: rel,
          line: i + 1,
          name,
          why: "must be left blank in a template",
        });
      }
    });
}

console.log(`Checked ${files.length} env template(s).`);

if (violations.length) {
  console.error(`\n${violations.length} filled-in value(s) in a committed template:\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.name} ${v.why}`);
  console.error(
    "\nPut real values in apps/web/.env.local (gitignored), not in the template.\n" +
      "If one of these was already committed and pushed, rotate it — git history\n" +
      "is not a place secrets can be deleted from.",
  );
  process.exit(1);
}

console.log("All env templates are still templates.");
