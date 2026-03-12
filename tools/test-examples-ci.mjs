import fs from 'fs';
import path from 'path';

const root = process.cwd();
const examples = [
  'examples/playground/index.html',
  'examples/ui-kits/white-label-demo/index.html'
];
const errors = [];
for (const rel of examples) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push(`${rel}: missing`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('<!DOCTYPE html') && !source.includes('<!doctype html')) {
    errors.push(`${rel}: not a standalone html entry`);
  }
  if (!source.includes('rarog') && !source.includes('Rarog')) {
    errors.push(`${rel}: missing Rarog marker text`);
  }
}
if (errors.length) {
  console.error('[rarog] examples ci failed');
  errors.forEach((issue) => console.error(`  - ${issue}`));
  process.exit(1);
}
console.log(`[rarog] examples ci: ${examples.length} example entries validated`);
