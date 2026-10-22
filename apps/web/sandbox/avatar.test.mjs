/**
 * Phase 4 Part B (V2Avatar/AvatarKit) — source-text assertions, same
 * convention as the other sandbox suites (no Supabase project in CI).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, "..", "src", p), "utf8");

const kit = read("components/avatar/avatar-kit.tsx");
const picker = read("components/avatar/avatar-picker.tsx");
const identityMark = read("components/avatar/identity-mark.tsx");
const sidebar = read("components/shell/desktop-sidebar.tsx");
const profileHeader = read("components/profile/profile-header.tsx");
const accountActions = read("actions/account.ts");

test("16 animals and 8 colours, exactly as AvatarKit.dc.html/V2Avatar.dc.html draw them", () => {
  for (const name of [
    "bear", "lion", "elephant", "hippo", "koala", "panda", "monkey", "pig",
    "penguin", "rabbit", "fox", "sheep", "tiger", "cat", "owl", "frog",
  ]) {
    assert.match(kit, new RegExp(`${name}: \`<`), `${name}'s body should be defined`);
  }
  for (const hex of ["#43B4C8", "#FFB627", "#7CCB8F", "#F4795B", "#F29AB8", "#A99AE0", "#8EC5F0", "#F2D9A6"]) {
    assert.equal(picker.includes(hex), false, "colours come from @jintu/contracts, not re-typed in the picker");
  }
});

test("the default is fox on teal, same as V2Avatar's own renderVals()", () => {
  assert.match(kit, /DEFAULT_ANIMAL, DEFAULT_COLOR, colorHex \} from "@jintu\/contracts"/);
});

test("Surprise me only changes local state — it does not call setAvatar", () => {
  const fn = picker.slice(picker.indexOf("const surprise ="), picker.indexOf("return ("));
  assert.match(fn, /setAnimalKey\(/);
  assert.match(fn, /setColorKey\(/);
  assert.doesNotMatch(fn, /execute\(/);
});

test("Save is the only path to setAvatar, and it sends both fields", () => {
  assert.match(picker, /onClick=\{\(\) => execute\(\{ avatarAnimal: animal, avatarColor: color \}\)\}/);
});

test("every animal and colour option is a real <button>, keyboard-reachable", () => {
  const animalGrid = picker.slice(picker.indexOf('aria-label="Animal"'), picker.indexOf('aria-label="Background colour"'));
  const colorGrid = picker.slice(picker.indexOf('aria-label="Background colour"'));
  for (const grid of [animalGrid, colorGrid]) {
    assert.match(grid, /<button/);
    assert.match(grid, /aria-pressed=\{on\}/);
  }
});

test("the avatar replaces the monogram at both named sites (sidebar, profile header), not alongside it", () => {
  assert.match(sidebar, /<IdentityMark avatarAnimal=\{user\.avatarAnimal\} avatarColor=\{user\.avatarColor\} size=\{40\} \/>/);
  assert.doesNotMatch(sidebar, /\{user\.initials\}\s*<\/div>/);
  assert.match(profileHeader, /<IdentityMark avatarAnimal=\{avatarAnimal\} avatarColor=\{avatarColor\} size=\{64\} \/>/);
});

test("IdentityMark always resolves to a real animal/colour — never a blank circle", () => {
  assert.match(identityMark, /DEFAULT_ANIMAL/);
  assert.match(identityMark, /DEFAULT_COLOR/);
});

test("setAvatar validates against the shared avatarInput schema", () => {
  const fn = accountActions.slice(accountActions.indexOf("export const setAvatar"));
  assert.match(fn, /\.inputSchema\(avatarInput\)/);
});
