import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function readJson(relPath) {
  return JSON.parse(await readFile(path.join(root, relPath), 'utf8'));
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

const pkg = await readJson('package.json');
const scripts = new Set(Object.keys(pkg.scripts || {}));
const markdownFiles = [
  'README.md',
  'CONTRIBUTING.md',
  'RELEASE.md',
  ...await collectMarkdownFiles('docs-site')
];

const scriptPattern = /npm run ([a-zA-Z0-9:_-]+)/g;
const missing = [];
for (const relPath of markdownFiles) {
  const content = await readFile(path.join(root, relPath), 'utf8');
  for (const match of content.matchAll(scriptPattern)) {
    const scriptName = match[1];
    if (!scripts.has(scriptName)) {
      missing.push(`${relPath}: npm run ${scriptName}`);
    }
  }
}

if (missing.length > 0) {
  console.error('Found documentation references to missing npm scripts:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Documentation script references are in sync across ${markdownFiles.length} markdown files.`);
