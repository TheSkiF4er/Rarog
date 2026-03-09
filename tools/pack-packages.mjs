import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, ".artifacts");
const packages = ["js", "react", "vue"];

fs.mkdirSync(outDir, { recursive: true });

for (const pkg of packages) {
  const pkgDir = path.join(root, "packages", pkg);
  console.log(`Packing @rarog/${pkg}...`);
  execFileSync("npm", ["pack", pkgDir, "--pack-destination", outDir], {
    cwd: root,
    stdio: "inherit"
  });
}

console.log(`Packed publishable packages into ${outDir}`);
