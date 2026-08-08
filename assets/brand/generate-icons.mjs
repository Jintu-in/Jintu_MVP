/**
 * Regenerates the favicon and PWA icon set from the brand source image.
 * Run it whenever jintu-logo-source.jpeg changes — do not hand-edit the
 * generated PNGs, they will be overwritten.
 *
 *   pnpm icons
 *
 * sharp costs nothing here: Next already declares it as an optional
 * dependency at the same version for image optimisation, so pnpm resolves
 * both to one copy in the store.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SRC = path.join(HERE, "jintu-logo-source.jpeg");
const WEB = path.join(ROOT, "apps/web");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const BG_THRESHOLD = 238; // JPEG noise keeps the "white" ground off 255

// 1 ── decode to raw RGBA
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
console.log(`source ${W}x${H}`);

// 2 ── flood-fill the ground from the borders. Keying every near-white pixel
//      would punch holes through the eyes and the book's centre gutter, which
//      are also white but enclosed by the mark.
const isPale = (i) =>
  data[i] > BG_THRESHOLD && data[i + 1] > BG_THRESHOLD && data[i + 2] > BG_THRESHOLD;
const ground = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) {
  stack.push(x, (H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  stack.push(y * W, y * W + W - 1);
}
while (stack.length) {
  const p = stack.pop();
  if (ground[p] || !isPale(p * 4)) continue;
  ground[p] = 1;
  const x = p % W;
  const y = (p / W) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < W - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - W);
  if (y < H - 1) stack.push(p + W);
}

// 3 ── punch the ground transparent and measure what is left
let minX = W, minY = H, maxX = -1, maxY = -1;
for (let p = 0; p < W * H; p++) {
  if (ground[p]) {
    data[p * 4 + 3] = 0;
    continue;
  }
  const x = p % W;
  const y = (p / W) | 0;
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}
const markW = maxX - minX + 1;
const markH = maxY - minY + 1;
const groundPct = ((ground.reduce((a, b) => a + b, 0) / (W * H)) * 100).toFixed(1);
console.log(`ground removed: ${groundPct}%`);
console.log(`mark bbox: ${markW}x${markH} at (${minX},${minY})`);

// 4 ── crop to the mark, then pad to a square canvas so nothing distorts
const side = Math.max(markW, markH);
const square = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: markW, height: markH })
  .extend({
    top: Math.floor((side - markH) / 2),
    bottom: Math.ceil((side - markH) / 2),
    left: Math.floor((side - markW) / 2),
    right: Math.ceil((side - markW) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();
console.log(`squared to ${side}x${side}`);

/** Render the mark at `inset` of a `size` canvas. Opaque white unless asked. */
async function emit(file, size, inset, opaque) {
  const inner = Math.round(size * inset);
  const pad = Math.round((size - inner) / 2);
  const mark = await sharp(square)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await mkdir(path.dirname(file), { recursive: true });
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: opaque ? WHITE : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mark, top: pad, left: pad }])
    // Flat two-colour art — a palette PNG is a fraction of the size of
    // truecolour at no visible cost, and these ship to phones on mobile data.
    .png({ compressionLevel: 9, palette: true, colors: 128, effort: 10 })
    .toFile(file);
  console.log(`  ${path.relative(WEB, file).replace(/\\/g, "/")}  ${size}px  inset ${inset}`);
}

console.log("\nwriting:");
// Favicon + PWA icons sit on an opaque white plate matching the manifest's
// background_color: the mark's outlines are near-black and would vanish
// against dark browser chrome or a dark launcher.
await emit(`${WEB}/src/app/icon.png`, 256, 0.92, true);
await emit(`${WEB}/src/app/apple-icon.png`, 180, 0.84, true);
await emit(`${WEB}/public/icons/192.png`, 192, 0.92, true);
await emit(`${WEB}/public/icons/512.png`, 512, 0.92, true);
// Maskable: launchers crop to a circle of ~80% diameter, so the mark has to
// clear that safe zone or Android will shave the book and the sparkles off.
await emit(`${WEB}/public/icons/maskable-512.png`, 512, 0.62, true);
// In-page logo keeps its alpha so it can sit on any surface.
await emit(`${WEB}/public/logo.png`, 512, 1.0, false);
