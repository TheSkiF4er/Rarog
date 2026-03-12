import fs from 'fs';
import path from 'path';

const root = process.cwd();
const checks = [];

function addPackage(rel) {
  const pkgPath = path.join(root, rel);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  checks.push({ rel, pkg });
}

addPackage('package.json');
addPackage('packages/js/package.json');
addPackage('packages/react/package.json');
addPackage('packages/vue/package.json');

const issues = [];
for (const { rel, pkg } of checks) {
  const base = path.dirname(path.join(root, rel));
  if (!pkg.exports) {
    issues.push(`${rel}: missing exports map`);
    continue;
  }
  for (const [key, target] of Object.entries(pkg.exports)) {
    const candidates = typeof target === 'string'
      ? [target]
      : Object.values(target).filter((value) => typeof value === 'string');
    const missing = candidates.filter((candidate) => !fs.existsSync(path.resolve(base, candidate)));
    if (missing.length) issues.push(`${rel}: export ${key} points to missing file(s): ${missing.join(', ')}`);
  }
}
if (issues.length) {
  console.error('[rarog] export surface validation failed');
  issues.forEach((issue) => console.error(`  - ${issue}`));
  process.exit(1);
}
console.log(`[rarog] export surface: validated ${checks.length} package manifests`);
