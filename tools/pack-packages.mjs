import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, ".artifacts");
const packages = [
  { label: "rarog", dir: "." },
  { label: "@rarog/js", dir: "packages/js" },
  { label: "@rarog/react", dir: "packages/react" },
  { label: "@rarog/vue", dir: "packages/vue" }
];

fs.mkdirSync(outDir, { recursive: true });
for (const pkg of packages) {
  console.log(`Packing ${pkg.label}...`);
  const args = pkg.dir === "." ? ["pack", "--ignore-scripts", "--pack-destination", outDir] : ["pack", path.join(root, pkg.dir), "--ignore-scripts", "--pack-destination", outDir];
  execFileSync("npm", args, { cwd: root, stdio: "inherit" });
}
console.log(`Packed publishable packages into ${outDir}`);
