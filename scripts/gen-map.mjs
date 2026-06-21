/**
 * Generates a dotted world-map SVG (continent-shaped dots + location pins)
 * for the GlobalReach homepage section. Run once when the design changes:
 *   node scripts/gen-map.mjs
 * Output: public/world-map.svg
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import DottedMap from "dotted-map";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const map = new DottedMap({ height: 54, grid: "diagonal" });

// Highlighted hub — Dubai
map.addPin({ lat: 25.2048, lng: 55.2708, svgOptions: { color: "#3D8BFF", radius: 0.65 } });

// Major served markets
const PINS = [
  [51.5074, -0.1278], // London
  [40.7128, -74.006], // New York
  [19.076, 72.8777], // Mumbai
  [1.3521, 103.8198], // Singapore
  [-33.8688, 151.2093], // Sydney
  [43.6532, -79.3832], // Toronto
  [35.6762, 139.6503], // Tokyo
  [48.8566, 2.3522], // Paris
];
for (const [lat, lng] of PINS) {
  map.addPin({ lat, lng, svgOptions: { color: "#2F7BFF", radius: 0.5 } });
}

const svg = map.getSVG({
  radius: 0.22,
  color: "#1C4A87", // base dots — subtle on the navy section
  shape: "circle",
  backgroundColor: "transparent",
});

const out = path.join(__dirname, "..", "public", "world-map.svg");
fs.writeFileSync(out, svg);
console.log(`✓ Wrote ${out} (${(svg.length / 1024).toFixed(1)} KB)`);
