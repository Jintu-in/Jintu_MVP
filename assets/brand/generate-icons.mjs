/**
 * Regenerates the favicon and PWA icon set from the brand source SVGs.
 * Run it whenever assets/brand/logo/*.svg changes — do not hand-edit the
 * generated PNGs or favicon.ico, they will be overwritten.
 *
 *   pnpm icons
 *
 * assets/brand/logo/ is this repo's own permanent copy of the final mark
 * (design pack update 3 §D, originally design/jintu-design/logo/) — kept
 * here rather than read from the design pack folder directly, since that
 * folder is reference material for one pass and can be wholesale replaced
 * by a future one; this pipeline needs a source that doesn't move.
 *
 * Supersedes jintu-logo-source.jpeg's flood-fill pipeline (that file is
 * left in place as history, not read any more): the new source is already
 * a clean vector with its own rounded-square plate and no background to
 * key out, so this script is just "render the SVG at each size" plus one
 * mark-only extraction for the maskable variant.
 *
 * sharp costs nothing here: Next already declares it as an optional
 * dependency at the same version for image optimisation, so pnpm resolves
 * both to one copy in the store.
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const WEB = path.join(ROOT, "apps/web");
const TEAL = { r: 0x0a, g: 0x3b, b: 0x46, alpha: 1 }; // #0A3B46 — night-900

const iconSvg = await readFile(path.join(HERE, "logo/jintu-icon.svg"), "utf8");
const wordmarkTealSvg = await readFile(path.join(HERE, "logo/jintu-wordmark-teal.svg"), "utf8");
// The same mark, without its own rounded-square plate: a maskable icon and
// the in-page alpha logo both need to supply their own background (an OS
// shape mask, or "any surface") rather than carry the baked-in rx="26"
// corners, which would show as a second, wrongly-shaped tile nested inside
// whatever actually crops it.
const markOnlySvg = iconSvg.replace(/<rect[^>]*\/>/, "");

/** Render the full icon tile (its own teal plate included) at `size`. */
async function emitTile(file, size) {
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(iconSvg))
    .resize(size, size)
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(file);
  console.log(`  ${path.relative(WEB, file).replace(/\\/g, "/")}  ${size}px`);
}

/** Render just the mark (no plate) inset within a `size` canvas, on a
 *  plain teal background with no corner rounding of its own — the maskable
 *  spec's safe zone, left for the OS to shape. Teal-only, not alpha: the
 *  mark's letter is white, which disappears against anything light, so it
 *  only ever gets used backed by its own plate or this fixed teal fill. */
async function emitMark(file, size, inset) {
  const inner = Math.round(size * inset);
  const pad = Math.round((size - inner) / 2);
  const mark = await sharp(Buffer.from(markOnlySvg))
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await mkdir(path.dirname(file), { recursive: true });
  await sharp({ create: { width: size, height: size, channels: 4, background: TEAL } })
    .composite([{ input: mark, top: pad, left: pad }])
    .png({ compressionLevel: 9, effort: 10, palette: true, colors: 128 })
    .toFile(file);
  console.log(`  ${path.relative(WEB, file).replace(/\\/g, "/")}  ${size}px  inset ${inset}`);
}

console.log("writing:");
await emitTile(`${WEB}/src/app/icon.png`, 256);
await emitTile(`${WEB}/src/app/apple-icon.png`, 180);
await emitTile(`${WEB}/public/icons/192.png`, 192);
await emitTile(`${WEB}/public/icons/512.png`, 512);
// Maskable: launchers crop to a circle of ~80% diameter, so the mark has to
// clear that safe zone or Android will shave the flame and the j's hook off.
await emitMark(`${WEB}/public/icons/maskable-512.png`, 512, 0.62);
// No public/logo.png from this pass: the old script's alpha-background
// "sits on any surface" version doesn't work with a white letter (it
// disappears against anything light), and nothing in the app actually
// references that file — CHANGES.md's D section asks for the favicon set
// and nothing beyond it, so a flawed asset nobody uses isn't reintroduced.

/**
 * favicon.ico, because browsers request /favicon.ico regardless of what
 * <link rel="icon"> says — src/app/icon.png alone leaves a 404 in the network
 * tab of every page load, and some crawlers and feed readers only look there.
 *
 * ICO is a container: a 6-byte directory, one 16-byte entry per image, then
 * the payloads. Since Vista those payloads may be PNG rather than BMP, which
 * is why this can wrap sharp's output directly instead of encoding BMP.
 */
async function emitIco(file, sizes) {
  const images = [];
  for (const size of sizes) {
    images.push(
      await sharp(Buffer.from(iconSvg))
        .resize(size, size)
        // Truecolour RGBA, NOT palette. ICO decoders — Turbopack's included —
        // reject indexed-colour PNG payloads outright ("The PNG is not in RGBA
        // format"). At 16-48px the palette saving is a few hundred bytes and
        // not worth an unloadable icon.
        .ensureAlpha()
        .png({ compressionLevel: 9, effort: 10, palette: false })
        .toBuffer(),
    );
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map((png, i) => {
    const size = sizes[i];
    const e = Buffer.alloc(16);
    // 0 means 256 in this field; none of our sizes hit that, but be explicit.
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size, 0 for PNG payloads
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });

  await mkdir(path.dirname(file), { recursive: true });
  const out = Buffer.concat([header, ...entries, ...images]);
  await writeFile(file, out);
  console.log(
    `  ${path.relative(WEB, file).replace(/\\/g, "/")}  ${sizes.join("+")}px  ${out.length}B`,
  );
}

await emitIco(`${WEB}/src/app/favicon.ico`, [16, 32, 48]);

/**
 * opengraph-image.tsx's wordmark, as a base64 PNG constant rather than the
 * inline SVG every other caller uses: Satori (next/og's renderer) does not
 * handle this SVG's nested `scale(1 -1)` group and large negative-coordinate
 * paths correctly — it renders the five letters collapsed into one
 * illegible blob instead of "jintu" (confirmed against sharp's own render
 * of the identical file, which is correct — see this function's own
 * comment for the byte-for-byte source). A rasterized `<img>` is the
 * reliable path through Satori's limited SVG support; a generated
 * TypeScript module, not a loose PNG file, so opengraph-image.tsx needs no
 * filesystem read of its own and nothing can drift between the two.
 */
async function emitWordmarkDataUri() {
  const png = await sharp(Buffer.from(wordmarkTealSvg))
    .resize({ height: 160 }) // 2.5x the 64px intrinsic size, for a crisp 1200x630 card
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  const meta = await sharp(png).metadata();
  const file = path.join(WEB, "src/lib/brand-assets.generated.ts");
  await writeFile(
    file,
    `// Generated by assets/brand/generate-icons.mjs (\`pnpm icons\`) — do not hand-edit.\n` +
      `export const WORDMARK_TEAL_PNG = "data:image/png;base64,${png.toString("base64")}";\n` +
      `export const WORDMARK_TEAL_WIDTH = ${meta.width};\n` +
      `export const WORDMARK_TEAL_HEIGHT = ${meta.height};\n`,
  );
  console.log(`  ${path.relative(WEB, file).replace(/\\/g, "/")}  ${meta.width}x${meta.height}  ${png.length}B`);
}

await emitWordmarkDataUri();
