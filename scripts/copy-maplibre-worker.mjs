import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs");
const targetDir = join(root, "public/maplibre");
const target = join(targetDir, "maplibre-gl-worker.mjs");

if (!existsSync(source)) {
  console.warn("[copy-maplibre-worker] maplibre-gl non installato, salto la copia.");
  process.exit(0);
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
console.log("[copy-maplibre-worker] worker copiato in public/maplibre/");
