import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const assetsDir = path.join(rootDir, "packages", "assets");

const targetApps = [
  path.join(rootDir, "apps", "web", "public"),
  path.join(rootDir, "apps", "admin", "public"),
  path.join(rootDir, "apps", "app", "public"),
  path.join(rootDir, "apps", "kiosk", "public"),
];

const filesToSync = [
  "favicon.png",
  "uniteIcon.png",
  "uniteIcon1.png",
  "uniteIcon2.png",
];

for (const targetPublic of targetApps) {
  if (!fs.existsSync(targetPublic)) {
    fs.mkdirSync(targetPublic, { recursive: true });
  }

  for (const fileName of filesToSync) {
    const srcFile = path.join(assetsDir, fileName);
    const destFile = path.join(targetPublic, fileName);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

console.log("Successfully synced assets from packages/assets to all app public directories.");
