import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function readJson(relPath) {
  return JSON.parse(await readFile(path.join(root, relPath), "utf8"));
}

async function exists(relPath) {
  try {
    await access(path.join(root, relPath));
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(dirRel) {
  const dir = path.join(root, dirRel);
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(dirRel, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(rel));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(rel);
    }
  }
  return files;
}

const docsDir = await exists("docs") ? "docs" : "docs-site";
const pkg = await readJson("package.json");
const scripts = new Set(Object.keys(pkg.scripts || {}));
const markdownFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "RELEASE.md",
  ...await collectMarkdownFiles(docsDir)
];

const scriptPattern = /npm run ([a-zA-Z0-9:_-]+)/g;

if (docsDir === "docs" && !await exists("docs/.vitepress/config.ts")) {
  console.error("Missing VitePress config at docs/.vitepress/config.ts");
  process.exit(1);
}
const allowedExternalScriptsByFile = new Map([
  [`${docsDir}/guide-laravel.md`, new Set(["rarog:build"])],
  [`${docsDir}/guide-nextjs.md`, new Set(["rarog:build"])],
  [`${docsDir}/guide-react.md`, new Set(["dev"])],
  [`${docsDir}/integration-guides.md`, new Set(["build:app"])],
  [`${docsDir}/playground.md`, new Set(["playground"])]
]);
const missing = [];
for (const relPath of markdownFiles) {
  const content = await readFile(path.join(root, relPath), "utf8");
  for (const match of content.matchAll(scriptPattern)) {
    const scriptName = match[1];
    const allowedExternalScripts = allowedExternalScriptsByFile.get(relPath) || new Set();
    if (!scripts.has(scriptName) && !allowedExternalScripts.has(scriptName)) {
      missing.push(`${relPath}: npm run ${scriptName}`);
    }
  }
}

if (missing.length > 0) {
  console.error("Found documentation references to missing npm scripts:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Documentation script references are in sync across ${markdownFiles.length} markdown files from ${docsDir}/.`);
