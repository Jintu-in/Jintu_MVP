/**
 * Enforces the Law 2 embed rules in web source.
 * ARCHITECTURE.md §7, docs/LEGAL.md §1.
 *
 *   node scripts/assert-embeds.mjs [dir ...]
 *
 * Losing YouTube embed rights would remove the curriculum, so the rule is
 * worth a guard rather than a review comment. What it catches:
 *
 *   - youtube.com/embed instead of youtube-nocookie.com/embed — the cookie
 *     host sets tracking cookies for a visitor who has consented to nothing
 *   - any attempt to fetch the media itself rather than embed the player
 *   - the transcript/caption endpoints, which is what "just grab the text"
 *     looks like in code
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", "dist", "coverage"]);
const DEFAULT_TARGETS = ["apps/web/src", "packages", "supabase/functions"];

const RULES = [
  {
    re: /https?:\/\/(?:www\.)?youtube\.com\/embed/i,
    message:
      "embed via https://www.youtube-nocookie.com/embed/ — youtube.com sets tracking cookies before any consent",
  },
  {
    re: /\/api\/timedtext|youtube[\w.-]*\/captions|get_video_info|youtube-transcript|ytdl|yt-dlp|pytube/i,
    message:
      "this fetches captions or media rather than embedding the player — Law 2 forbids storing or transforming third-party content",
  },
  {
    re: /googlevideo\.com/i,
    message: "direct media host — the video must play in YouTube's own player",
  },
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(path.extname(entry))) out.push(full);
  }
  return out;
}

const targets = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_TARGETS;
const files = targets.flatMap((t) => walk(path.resolve(ROOT, t)));
const violations = [];

for (const file of files) {
  // This script names the forbidden patterns in order to forbid them.
  if (path.basename(file) === "assert-embeds.mjs") continue;

  const text = readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  for (const { re, message } of RULES) {
    const m = re.exec(text);
    if (m)
      violations.push({
        file: rel,
        line: text.slice(0, m.index).split("\n").length,
        message,
      });
  }
}

console.log(`Scanned ${files.length} file(s) in: ${targets.join(", ")}`);

if (violations.length) {
  console.error(`\n${violations.length} embed violation(s):\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.message}`);
  console.error("\nSee docs/LEGAL.md §1.");
  process.exit(1);
}

console.log("YouTube is embedded only via the official nocookie player.");
