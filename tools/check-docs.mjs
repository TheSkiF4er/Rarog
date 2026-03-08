import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docs = [
  "README.md",
  "CONTRIBUTING.md",
  "RELEASE.md",
  "docs-site/getting-started.md",
  "docs-site/javascript.md"
];

const fileRefs = new Set();

for (const rel of docs) {
  const abs = path.join(root, rel);
  const text = fs.readFileSync(abs, "utf8");

  const markdownLinks = [...text.matchAll(/\]\((\.\/?[^)]+|\.\.\/?[^)]+)\)/g)].map(m => m[1]);
  const codeRefs = [...text.matchAll(/`((?:README|CONTRIBUTING|RELEASE|LICENSE|CHANGELOG|docs-site|packages|plugins|tools|design|tests|rarog\.[^`\s]+)[^`]*)`/g)].map(m => m[1]);

  for (const ref of [...markdownLinks, ...codeRefs]) {
    const clean = ref.replace(/^\.\//, "").replace(/#.*$/, "");
    if (!clean || clean.startsWith("http")) continue;
    if (clean.includes("*")) continue;
    if (clean.endsWith("/")) continue;
    fileRefs.add(clean);
  }
}

const missing = [];
for (const rel of fileRefs) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) missing.push(rel);
}

if (missing.length) {
  console.error("Documentation check failed.\n");
  for (const item of missing) console.error(`- missing path reference: ${item}`);
  process.exit(1);
}

console.log(`Documentation check passed for ${docs.length} files.`);
