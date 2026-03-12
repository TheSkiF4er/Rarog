import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';

const root = process.cwd();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rarog-starter-'));
const result = spawnSync(process.execPath, [path.join(root, 'packages/cli/bin/rarog.js'), 'init'], { cwd: tmp, encoding: 'utf8' });
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status || 1);
}
const required = ['rarog.config.js', 'rarog.build.json', 'src/index.html'];
const missing = required.filter((rel) => !fs.existsSync(path.join(tmp, rel)));
if (missing.length) {
  console.error(`[rarog] starter install: missing ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`[rarog] starter install: verified ${required.length} files in temp project`);
