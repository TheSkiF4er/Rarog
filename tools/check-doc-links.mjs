import fs from 'fs';
import path from 'path';

const root = process.cwd();
const docsDir = path.join(root, 'docs');
const markdownFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.md')) markdownFiles.push(full);
  }
}

walk(docsDir);
const errors = [];
for (const file of markdownFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const matches = [...source.matchAll(/\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g)];
  for (const match of matches) {
    const href = match[1].split('#')[0];
    if (!href || href.startsWith('/')) continue;
    const target = path.resolve(path.dirname(file), href);
    if (!fs.existsSync(target)) {
      errors.push(`${path.relative(root, file)} -> ${href}`);
    }
  }
}

if (errors.length) {
  console.error('[rarog] docs links: broken links found');
  errors.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`[rarog] docs links: checked ${markdownFiles.length} markdown files, no broken local links`);
