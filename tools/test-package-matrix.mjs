import fs from 'fs';
import path from 'path';

const root = process.cwd();
const packages = [
  { name: 'root', file: 'package.json' },
  { name: '@rarog/js', file: 'packages/js/package.json' },
  { name: '@rarog/react', file: 'packages/react/package.json' },
  { name: '@rarog/vue', file: 'packages/vue/package.json' },
  { name: '@rarog/presets', file: 'packages/presets/package.json' }
];

const versions = new Set();
const issues = [];
for (const item of packages) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, item.file), 'utf8'));
  if (!pkg.version) issues.push(`${item.name}: missing version`);
  else versions.add(pkg.version);
  if (item.name !== 'root' && (!pkg.files || !pkg.files.length)) issues.push(`${item.name}: missing files whitelist`);
  if (item.name !== '@rarog/presets' && !pkg.exports) issues.push(`${item.name}: missing exports`);
}
if (versions.size !== 1) issues.push(`package matrix: version skew detected (${Array.from(versions).join(', ')})`);
if (issues.length) {
  console.error('[rarog] package matrix failed');
  issues.forEach((issue) => console.error(`  - ${issue}`));
  process.exit(1);
}
console.log(`[rarog] package matrix: ${packages.length} packages validated`);
