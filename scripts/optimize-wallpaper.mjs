/**
 * Build master wallpaper for production (run via npm run optimize:wallpaper or prebuild).
 * Source: src/assets/12-Dark.jpg — do not import JPG in app code; use 12-Dark.webp only.
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "src/assets/12-Dark.jpg");
const output = path.join(root, "src/assets/12-Dark.webp");

const MAX_WIDTH = 2560;
const WEBP_QUALITY = 94;

const meta = await sharp(input).metadata();
const width =
  meta.width && meta.width > MAX_WIDTH ? MAX_WIDTH : meta.width ?? MAX_WIDTH;

await sharp(input)
  .resize(width, null, { withoutEnlargement: true })
  .webp({ quality: WEBP_QUALITY, effort: 6 })
  .toFile(output);

const [inStat, outStat] = await Promise.all([stat(input), stat(output)]);
console.log(
  `Wallpaper: ${(inStat.size / 1024 / 1024).toFixed(2)} MB JPG → ${(outStat.size / 1024 / 1024).toFixed(2)} MB WebP (${width}px, q${WEBP_QUALITY})`
);
console.log("App imports: src/assets/12-Dark.webp");
