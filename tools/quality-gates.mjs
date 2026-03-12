import { spawnSync } from 'child_process';

const gates = [
  ['build', ['run', 'build:all']],
  ['test:ci', ['run', 'test:ci']],
  ['test:starters-install', ['run', 'test:starters-install']],
  ['test:package-matrix', ['run', 'test:package-matrix']],
  ['test:examples-ci', ['run', 'test:examples-ci']],
  ['docs:links', ['run', 'docs:links']],
  ['test:exports', ['run', 'test:exports']]
];

for (const [name, args] of gates) {
  const result = spawnSync('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    console.error(`[rarog] quality gates failed at ${name}`);
    process.exit(result.status || 1);
  }
}

console.log('[rarog] quality gates: all release checks passed');
