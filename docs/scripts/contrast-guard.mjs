#!/usr/bin/env node
/**
 * Jintu contrast guard.
 *
 * Fails the build if a decorative-only colour is used as a TEXT colour.
 * Fill utilities (bg-, border-, ring-, divide-, outline-, fill=, stroke on
 * non-text SVG) remain allowed — these tokens are legitimate as fills.
 *
 * Usage:  node scripts/contrast-guard.mjs [dir ...]
 * Default dirs: app components
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

/** hex -> { name, ratio, replacement } */
const BANNED_AS_TEXT = {
  '#43b4c8': { name: 'brand-500',  ratio: '2.44:1', use: 'brand-700 (#17758A) for text' },
  '#8a8a85': { name: 'fill-quiet', ratio: '3.47:1', use: 'ink-muted (#75746F) for text' },
  '#1d9e75': { name: 'done',       ratio: '3.39:1', use: 'done-ink (#12606F) for text' },
  '#ba7517': { name: 'warn',       ratio: '3.72:1', use: 'warn-ink (#8A5410) for text' },
  '#d85a30': { name: 'danger',     ratio: '3.87:1', use: 'danger-ink (#B8441F) for text' },
};

const TOKEN_BY_HEX = {
  '#43b4c8': 'brand-500',
  '#8a8a85': 'fill-quiet',
  '#1d9e75': 'done',
  '#ba7517': 'warn',
  '#d85a30': 'danger',
};

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.svelte', '.vue']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage']);

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (EXTS.has(extname(entry))) out.push(full);
  }
  return out;
}

/**
 * Patterns that mean "this colour paints text".
 * Each returns the offending snippet when matched.
 */
function textColourViolations(line) {
  const hits = [];

  // 1. CSS `color:` (but not background-color, border-color, caret-color …)
  //    Negative lookbehind on a hyphen keeps -color properties out.
  for (const m of line.matchAll(/(?<![a-z-])color\s*:\s*([^;"'}]+)/gi)) {
    const value = m[1];
    for (const hex of Object.keys(BANNED_AS_TEXT)) {
      if (value.toLowerCase().includes(hex)) hits.push({ hex, snippet: m[0].trim() });
    }
    for (const [hex, token] of Object.entries(TOKEN_BY_HEX)) {
      if (new RegExp(`var\\(\\s*--color-${token}\\s*\\)`).test(value)) {
        hits.push({ hex, snippet: m[0].trim() });
      }
    }
  }

  // 2. Tailwind text utilities: text-<token>, and arbitrary text-[#hex]
  for (const [hex, token] of Object.entries(TOKEN_BY_HEX)) {
    const util = new RegExp(`\\btext-${token}\\b(?:/\\d+)?`, 'g');
    for (const m of line.matchAll(util)) hits.push({ hex, snippet: m[0] });
  }
  for (const m of line.matchAll(/\btext-\[\s*(#[0-9a-f]{6})\s*\]/gi)) {
    const hex = m[1].toLowerCase();
    if (BANNED_AS_TEXT[hex]) hits.push({ hex, snippet: m[0] });
  }

  // 3. Tailwind utilities that colour glyph-bearing SVG text, plus
  //    placeholder/caret/decoration text colours.
  const textLike = ['placeholder', 'caret', 'decoration', 'accent'];
  for (const prefix of textLike) {
    for (const [hex, token] of Object.entries(TOKEN_BY_HEX)) {
      const util = new RegExp(`\\b${prefix}-${token}\\b(?:/\\d+)?`, 'g');
      for (const m of line.matchAll(util)) hits.push({ hex, snippet: m[0] });
    }
    for (const m of line.matchAll(new RegExp(`\\b${prefix}-\\[\\s*(#[0-9a-f]{6})\\s*\\]`, 'gi'))) {
      const hex = m[1].toLowerCase();
      if (BANNED_AS_TEXT[hex]) hits.push({ hex, snippet: m[0] });
    }
  }

  // 4. SVG <text> painted via fill=, and fill=/stroke= on a <text> element
  for (const m of line.matchAll(/<text\b[^>]*\b(?:fill|stroke)\s*=\s*"([^"]+)"/gi)) {
    const hex = m[1].toLowerCase();
    if (BANNED_AS_TEXT[hex]) hits.push({ hex, snippet: m[0].slice(0, 80) });
  }

  return hits;
}

const dirs = process.argv.slice(2);
const roots = dirs.length ? dirs : ['app', 'components'];
const files = roots.flatMap((r) => walk(r));

const violations = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const hit of textColourViolations(line)) {
      violations.push({ file, line: i + 1, ...hit, ...BANNED_AS_TEXT[hit.hex] });
    }
  });
}

if (!files.length) {
  console.log(`contrast-guard: no source files found under ${roots.join(', ')}`);
  process.exit(0);
}

if (!violations.length) {
  console.log(`contrast-guard: ${files.length} file(s) scanned, 0 violations.`);
  process.exit(0);
}

console.error(`\ncontrast-guard: ${violations.length} decorative colour(s) used as text\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}`);
  console.error(`    ${v.snippet}`);
  console.error(`    ${v.hex} (${v.name}) is ${v.ratio} on white — use ${v.use}\n`);
}
console.error('WCAG AA needs 4.5:1 for normal text, 3:1 only at 24px+ (18.66px at 500).');
console.error('Fill utilities (bg-, border-, ring-, divide-) are allowed for these tokens.\n');
process.exit(1);
